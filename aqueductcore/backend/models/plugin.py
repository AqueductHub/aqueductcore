"""Classes to parse plugin declarations, and execute them.
"""

from __future__ import annotations

from enum import Enum
import os
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from pydantic import BaseModel

from aqueductcore.backend.errors import AQDFilesPathError, AQDValidationError

MANIFEST_FILE = "manifest.yml"


class SupportedTypes(str, Enum):
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


class PluginExecutionResult(BaseModel):
    """OS process execution result"""

    return_code: int
    stdout: str
    stderr: str


class PluginParameter(BaseModel):
    """Typed and named parameter of the plugin function"""

    name: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    data_type: SupportedTypes
    default_value: Optional[Any] = None
    options: Optional[List[str]] = None

    def __str__(self):
        return f"{self.display_name} ({self.name}: {self.data_type.name})"

    def __repr__(self):
        return f"<{str(self)}>"

    # pylint: disable=too-many-return-statements,too-many-branches
    def validate_object(self):
        """Validate variable and its default value."""
        if not self.name:
            raise AQDValidationError("Parameter should have a name.")
        if not self.description:
            raise AQDValidationError("Parameter should have a description.")
        if self.data_type not in SupportedTypes:
            raise AQDValidationError(
                f"Type should be one of {set(SupportedTypes)}"
                f"but was {self.data_type}"
        )
        if self.default_value:
            self.default_value = self.validate_value(self.default_value)

    def validate_value(self, value: str) -> str:
        """Validate value and return a normalised version, if possible."""
        str_value = str(value)

        if self.data_type == SupportedTypes.INT:
            try:
                int(str_value)
                return str_value
            except Exception as exc:
                raise AQDValidationError(f"{str_value} is not int") from exc

        if self.data_type == SupportedTypes.FLOAT:
            try:
                float(str_value)
                return str_value
            except Exception as exc:
                raise AQDValidationError(f"{str_value} is not float") from exc

        if self.data_type == SupportedTypes.BOOL:
            if str_value.lower() in ("true", "1"):
                return "1"
            if str_value.lower() in ("false", "0"):
                return "0"
            raise AQDValidationError(f"{value} is not a valid boo.")

        if self.data_type == SupportedTypes.EXPERIMENT:
            try:
                prefix, postfix = value.split("-")
                if not prefix.isdecimal() or not postfix.isalnum():
                    raise AQDValidationError("Experiment alias has wrong format.")
                return value
            except Exception as exc:
                raise AQDValidationError(f"{value} is not a valid experiment alias.") from exc

        if self.data_type == SupportedTypes.SELECT:
            if self.options is not None:
                if value in self.options:
                    return str(value)
            raise AQDValidationError(f"{value} is not in {self.options}.")

        # for files, strings and textareas
        return str(value)


class PluginFunction(BaseModel):
    """Each plugin may have multiple functions. This class represents
    one function which may be executed."""

    name: str
    description: Optional[str] = None
    display_name: Optional[str] = None
    script: str
    parameters: List[PluginParameter]

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
        my_env.update({key: str(val) for key, val in (plugin.params or {}).items()})
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
            if variable.data_type == SupportedTypes.EXPERIMENT:
                return variable
        return None

    def validate_object(self):
        """Validate the instance of the function and its parameters."""
        if not self.name:
            raise AQDValidationError("Plugin function should have a name.")
        for param in self.parameters:
            param.validate_object()

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


# pylint: disable=too-many-instance-attributes,too-many-arguments
class Plugin(BaseModel):
    """Class representing a plugin"""

    name: str
    description: Optional[str] = None
    display_name: Optional[str] = None
    authors: str
    functions: List[PluginFunction]
    aqueduct_url: str
    manifest_file: Optional[str] = None
    aqueduct_key: Optional[str] = None
    params: Optional[Dict[str, Any]] = None

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
            plugin_as_dict = yaml.safe_load(manifest_stream)
            plugin = Plugin(**plugin_as_dict)
            plugin.manifest_file = str(manifest.absolute())
            # TODO: somehow generate and pass it here
            plugin.aqueduct_key = ""
            plugin.validate_object()
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

    def validate_object(self):
        """Validate instance of the plugin and its functions."""
        if not self.name:
            raise AQDValidationError("Plugin should have a name.")
        for func in self.functions:
            func.validate_object()
