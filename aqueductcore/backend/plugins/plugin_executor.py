"""The module contains business-logic level code for plugin access and execution.
Plugins are stored on a file system. They are declared using `manifest.yml` files.
Depending on execution context, plugins may be implement in any language if they
can read environment variables and print to stdout.
"""

import logging
from enum import Enum
from pathlib import Path
from typing import Dict, List, Set

from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginExecutionResult,
    PluginFunction,
    PluginParameter,
)
from aqueductcore.backend.settings import settings


class SupportedTypes(Enum):
    """This enum contains allowed data types, which may be passed from
    the GraphQL endpoint or specified in the manifest file."""
    INT = "int"
    STR = "str"
    MULTILINE = "multiline"
    FLOAT = "float"
    EXPERIMENT = "experiment"
    FILE = "file"

    @staticmethod
    def values() -> Set[str]:
        """String values of the enum members."""
        return set(map(str, SupportedTypes._value2member_map_))


class PluginExecutor:
    """Class to access plugins."""

    @classmethod
    def _validate_parameter(cls, param: PluginParameter):
        assert param.name, "Parameter should have a name"
        assert param.description, "Parameter should have a description"
        assert param.data_type in SupportedTypes.values(), (
            f"Type should be one of {SupportedTypes.values()}"
            f"but was {param.data_type}"
        )

    @classmethod
    def _validate_function(cls, func: PluginFunction):
        assert func.name, "Function should have a name"
        assert (
            len(func.description) > 4
        ), "Function should have a meaningful description"
        for param in func.parameters:
            cls._validate_parameter(param)

    @classmethod
    def _validate_plugin(cls, plugin: Plugin):
        assert plugin.name, "Plugin should have a name"
        assert (
            len(plugin.description) > 4
        ), "Plugin should have a meaningful description"
        for func in plugin.functions:
            cls._validate_function(func)

    @classmethod
    def _validate_values(cls, func: PluginFunction, params: Dict[str, str]):
        # do keys coincide?
        expected_keys = set(params)
        provided_keys = set(param.name for param in func.parameters)
        assert expected_keys == provided_keys, (
            "Parameters error: keys don't match expected set. "
            f"Missing keys: {expected_keys - provided_keys}; "
            f"Unexpected keys: {provided_keys - expected_keys}"
        )
        for arg in func.parameters:
            value = params[arg.name]
            if arg.data_type == SupportedTypes.INT.value:
                try:
                    int(value)
                except Exception as exc:
                    raise ValueError(f"{value} is not decimal.") from exc
            if arg.data_type == SupportedTypes.FLOAT.value:
                try:
                    float(value)
                except Exception as exc:
                    raise ValueError(f"{value} is not a floating point number.") from exc
            if arg.data_type == SupportedTypes.EXPERIMENT.value:
                try:
                    prefix, postfix = value.split("-")
                    assert prefix.isdecimal(), "Experiment alias has incompatible prefix"
                    assert postfix.isalnum(), "Experiment alias has incompatible postfix"
                except Exception as exc:
                    raise ValueError(f"{value} is not a valid experiment alias.") from exc
            if arg.data_type == SupportedTypes.FILE.value:
                pass

    # cache ttl can be managed
    # https://stackoverflow.com/questions/31771286/python-in-memory-cache-with-time-to-live
    @classmethod
    def list_plugins(cls) -> List[Plugin]:
        """List all valid plugins which are present in the folder"""
        result = []
        for directory in Path(settings.plugins_dir_path).iterdir():
            if directory.exists():
                try:
                    plugin = Plugin.from_folder(directory)
                    cls._validate_plugin(plugin)
                    result.append(plugin)
                except AssertionError as err:
                    logging.error(err)
                    # TODO: raise again here?
        return result

    @classmethod
    def execute(cls, plugin: str, function: str, params: dict) -> PluginExecutionResult:
        """For a given plugin name, function name, and a dictionary
        of parameters, runs the plugin and returns execution result

        Args:
            plugin (str): plugin name.
            function (str): function name inside plugin.
            params (dict): parameter of values to pass to a plugin.

        Returns:
            PluginExecutionResult: results of process execution
        """
        plugins = [p for p in cls.list_plugins() if p.name == plugin]
        assert len(plugins) == 1, f"There should be exactly 1 plugin with name {plugin}"
        functions = [f for f in plugins[0].functions if f.name == function]
        assert (
            len(functions) == 1
        ), f"There should be exactly 1 function with name {function}"

        cls._validate_values(func=functions[0], params=params)

        return functions[0].execute(plugin=plugins[0], params=params)
