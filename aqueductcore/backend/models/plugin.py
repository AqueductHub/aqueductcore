"""Classes to parse plugin declarations, and execute them.
"""

from __future__ import annotations

from enum import Enum
import os
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Set

import yaml
from pydantic import BaseModel

from aqueductcore.backend.errors import AQDFilesPathError, AQDValidationError

MANIFEST_FILE = "manifest.yml"


class SupportedTypes(Enum):
    """This enum contains allowed data types, which may be passed from
    the GraphQL endpoint or specified in the manifest file."""

    INT = "int"
    STR = "str"
    TEXTAREA = "textarea"
    FLOAT = "float"
    EXPERIMENT = "experiment"
    FILE = "file"
    BOOL = "bool"
    SELECT = "select"

    @staticmethod
    def values() -> Set[str]:
        """String values of the enum members."""
        return set(map(str, SupportedTypes._value2member_map_))


class PluginExecutionResult(BaseModel):
    """OS process execution result"""

    return_code: int
    stdout: str
    stderr: str


class PluginParameter(yaml.YAMLObject):
    """Typed and named parameter of the plugin function"""

    yaml_tag = "!parameter"
    yaml_loader = yaml.UnsafeLoader

    def __init__(
            self,
            name: str,
            data_type: str,
            display_name: str = "",
            description: str = "",
            default_value: str = "",
            options: Optional[List[str]] = None,
    ):
        self.name = str(name)
        self.display_name = str(display_name)
        self.description = str(description)
        self.data_type = str(data_type)
        self.default_value = str(default_value)
        self.options = list(map(str, options or []))

    def __str__(self):
        return f"{self.display_name} ({self.name}: {self.data_type})"

    def __repr__(self):
        return f"<{str(self)}>"

    # pylint: disable=too-many-return-statements,too-many-branches
    def validate(self):
        """Validate variable and its default value."""
        if not self.name:
            raise AQDValidationError("Parameter should have a name.")
        if not self.description:
            raise AQDValidationError("Parameter should have a description.")
        if self.data_type not in SupportedTypes.values():
            raise AQDValidationError(
                f"Type should be one of {SupportedTypes.values()}"
                f"but was {self.data_type}"
        )
        if self.default_value:
            self.default_value = self.validate_value(self.default_value)

    def validate_value(self, value: str) -> str:
        """Validate value and return a normalised version, if possible."""
        if self.data_type == SupportedTypes.INT.value:
            try:
                int(value)
                return value
            except Exception as exc:
                raise AQDValidationError(f"{value} is not decimal.") from exc

        if self.data_type == SupportedTypes.FLOAT.value:
            try:
                float(value)
                return value
            except Exception as exc:
                raise AQDValidationError(f"{value} is not a floating point number.") from exc

        if self.data_type == SupportedTypes.EXPERIMENT.value:
            try:
                prefix, postfix = value.split("-")
                if not prefix.isdecimal() or not postfix.isalnum():
                    raise AQDValidationError("Experiment alias has wrong format.")
                return value
            except Exception as exc:
                raise AQDValidationError(f"{value} is not a valid experiment alias.") from exc

        if self.data_type == SupportedTypes.BOOL.value:
            if value == "":
                return value
            if value in ("0", "false", "False", "FALSE"):
                return "0"
            if value in ("1", "true", "True", "TRUE"):
                return "1"
            raise AQDValidationError(f"{value} is not bool.")

        if self.data_type == SupportedTypes.SELECT.value:
            if value in self.options:
                return value
            raise AQDValidationError(f"{value} is not in {self.options}.")

        # for files, strings and textareas
        return value


class PluginFunction(yaml.YAMLObject):
    """Each plugin may have multiple functions. This class represents
    one function which may be executed."""

    yaml_tag = "!function"
    yaml_loader = yaml.UnsafeLoader

    def __init__(
        self,
        name: str,
        description: str,
        script: str,
        parameters: List[PluginParameter],
    ):
        self.name = name
        self.description = description
        self.script = script
        self.parameters = parameters

    def execute(
            self,
            plugin: Plugin,
            params: dict,
            timeout: int=60) -> PluginExecutionResult:
        """Passes parameters to the function code and awaits
        execution results

        Args:
            plugin (Plugin): plugin instance to access settings.
            params (dict): dictionary of names params.
            timeout (int): time to wait until process finishes.

        Returns:
            PluginExecutionResult: OS process results.
        """
        my_env = os.environ.copy()
        self.validate_values(params)
        my_env.update(params)
        my_env["aqueduct_url"] = plugin.aqueduct_url
        if plugin.aqueduct_key is not None:
            my_env["aqueduct_key"] = plugin.aqueduct_key
        cwd = Path.home()
        if plugin.manifest_file:
            cwd = Path(plugin.manifest_file).parent
        with subprocess.Popen(
            self.script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=my_env,
            cwd=cwd,
        ) as proc:
            out, err = proc.communicate(timeout=timeout)
            code = proc.returncode
            return PluginExecutionResult(
                return_code=code,
                stdout=out.decode(),
                stderr=err.decode(),
            )

    def get_default_experiment_parameter(self) -> Optional[PluginParameter]:
        """Return first experiment variable defined in manifest.

        Return:
            plugin parameter object.
        """
        for variable in self.parameters:
            if variable.data_type == SupportedTypes.EXPERIMENT.value:
                return variable
        return None

    def validate(self):
        """Validate the instance of the function and its parameters."""
        if not self.name:
            raise AQDValidationError("Plugin function should have a name.")
        if len(self.description) < 5:
            raise AQDValidationError("Function should have a meaningful description")
        for param in self.parameters:
            param.validate()

    def validate_values(self, params: Dict[str, str]):
        """Check params dict to agree with data types definition for the function"""
        # do keys coincide?
        provided_keys = set(params)
        expected_keys = set(param.name for param in self.parameters)
        if expected_keys != provided_keys:
            raise AQDValidationError(
                "Parameters error: keys don't match expected set. "
                f"Missing keys: {expected_keys - provided_keys}; "
                f"Unexpected keys: {provided_keys - expected_keys}"
            )
        for arg in self.parameters:
            params[arg.name] = arg.validate_value(params[arg.name])


class Plugin(yaml.YAMLObject):
    """Class representing a plugin"""

    yaml_tag = "!plugin"
    yaml_loader = yaml.UnsafeLoader

    def __init__(
        self, name: str, description: str, authors: str, functions: List[PluginFunction],
        aqueduct_url: str,
    ):
        super().__init__()
        self.name = name
        self.description = description
        self.authors = authors
        self.functions = functions
        self.aqueduct_url = aqueduct_url
        self.manifest_file: Optional[str] = None
        self.aqueduct_key: Optional[str] = None

    @classmethod
    def from_folder(cls, path: Path) -> Plugin:
        """Given a folder, parses a plugin definition"""
        if not path.exists() or path.is_file():
            raise AQDFilesPathError(f"{path} should be an existing folder.")

        manifest = path / MANIFEST_FILE
        if not (manifest.exists() and manifest.is_file()):
            raise AQDFilesPathError(f"File {manifest} should exist.")

        with open(manifest, "r", encoding="utf-8") as manifest_stream:
            # load of the first document in the yaml file.
            # if there are more documents, they will be ignored
            plugin: Plugin = yaml.load(manifest_stream, Loader=yaml.loader.UnsafeLoader)
            plugin.manifest_file = str(manifest.absolute())
            # TODO: somehow generate and pass it here
            plugin.aqueduct_key = ""
            plugin.validate()
            return plugin

    def get_function(self, name: str) -> PluginFunction:
        """ Get plugin function by its name.

        Args:
            name: function name

        Returns:
            Plugin function object
        """
        functions = [f for f in self.functions if f.name == name]
        if len(functions) != 1:
            raise AQDValidationError(f"There should be exactly 1 function with name {name}")
        return functions[0]

    def validate(self):
        """Validate instance of the plugin and its functions."""
        if not self.name:
            raise AQDValidationError("Plugin should have a name.")
        if len(self.description) < 5:
            raise AQDValidationError("Plugin should have a meaningful description.")
        for func in self.functions:
            func.validate()
