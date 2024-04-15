import logging
from pathlib import Path
from typing import List

from aqueductcore.backend.models.plugin import (Plugin, PluginFunction,
                                                PluginParameter, PluginExecutionResult)
from aqueductcore.backend.settings import settings

SUPPORTED_TYPES = ("str", "multiline," "float", "experiment", "file")


class PluginExecutor:
    @classmethod
    def _validate_parameter(cls, param: PluginParameter):
        assert param.name, "Parameter should have a name"
        assert param.description, "Parameter should have a description"
        assert (
            param.type in SUPPORTED_TYPES
        ), f"Type should be one of {SUPPORTED_TYPES}, but was {param.type}"

    @classmethod
    def _validate_function(cls, func: PluginFunction):
        assert func.name, "Function should have a name"
        assert (
            len(func.description) > 10
        ), "Function should have a meaningful description"
        for param in func.parameters:
            cls._validate_parameter(param)

    @classmethod
    def _validate_plugin(cls, plugin: Plugin):
        assert plugin.name, "Plugin should have a name"
        assert (
            len(plugin.description) > 10
        ), "Plugin should have a meaningful description"
        for func in plugin.functions:
            cls._validate_function(func)

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
    def execute(cls, plugin, function, params) -> PluginExecutionResult:
        plugins = [p for p in cls.list_plugins() if p.name == plugin]
        assert len(plugins) == 1, f"There should be exactly 1 plugin with name {plugin}"
        functions = [f for f in plugins[0].functions if f.name == function]
        assert len(functions) == 1, f"There should be exactly 1 function with name {function}"
        return functions[0].execute(
            plugin=plugins[0],
            params=params
        )
