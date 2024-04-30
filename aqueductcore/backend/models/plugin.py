"""Classes to parse plugin declarations, and execute them.
"""

from __future__ import annotations

from enum import Enum
import os
import subprocess
from pathlib import Path
from typing import List, Optional, Set

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
            description: str,
            data_type: str,
            default_value: str = "",
            options: Optional[List[str]] = None,
    ):
        self.name = str(name)
        self.description = str(description)
        self.data_type = str(data_type)
        self.default_value = str(default_value)
        self.options = list(map(str, options or []))

    def __str__(self):
        return f"{self.description} ({self.name}: {self.data_type})"

    def __repr__(self):
        return f"<{str(self)}>"

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

    def get_default_experiment_parameter(self) -> PluginParameter:
        """Return first experiment variable defined in manifest.

        Return:
            plugin parameter object.
        """
        for variable in self.parameters:
            if variable.data_type == SupportedTypes.EXPERIMENT.value:
                return variable
        raise AQDValidationError(f"Function {self.name} has no experiment parameters")


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
        self.manifest_file = None
        self.aqueduct_key = None

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
            plugin = yaml.load(manifest_stream, Loader=yaml.loader.UnsafeLoader)
            plugin.manifest_file = str(manifest.absolute())
            # TODO: somehow generate and pass it here
            plugin.aqueduct_key = ""
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
