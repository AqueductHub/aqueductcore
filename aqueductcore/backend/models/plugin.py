"""Classes to parse plugin declarations, and execute them.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List
import os
import subprocess

import yaml

MANIFEST_FILE = "manifest.yml"


@dataclass
class PluginExecutionResult:
    """OS process execution result"""

    return_code: int
    stdout: str
    stderr: str


class PluginParameter(yaml.YAMLObject):
    """Typed and named parameter of the plugin function"""

    yaml_tag = "!parameter"
    yaml_loader = yaml.SafeLoader

    def __init__(self, name: str, description: str, data_type: str):
        self.name = name
        self.description = description
        self.data_type = data_type


class PluginFunction(yaml.YAMLObject):
    """Each plugin may have multiple functions. This class represents
    one function which may be executed."""

    yaml_tag = "!function"
    yaml_loader = yaml.SafeLoader

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
        my_env["aqueduct_key"] = plugin.aqueduct_key

        proc = subprocess.Popen(
            self.script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=my_env,
            cwd=Path(plugin.manifest_file).parent
        )
        out, err = proc.communicate(timeout=timeout)
        code = proc.returncode
        return PluginExecutionResult(code, out.decode(), err.decode())


class Plugin(yaml.YAMLObject):
    """Class representing a plugin"""

    yaml_tag = "!plugin"
    yaml_loader = yaml.SafeLoader

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
        self.manifest_file = ""
        self.aqueduct_key = ""

    @classmethod
    def from_folder(cls, path: Path) -> Plugin:
        """Given a folder, parses a plugin definition"""
        assert path.exists(), f"Folder {path} does not exist"
        assert not path.is_file(), f"{path} should be a folder, not a file"

        manifest = path / MANIFEST_FILE
        assert manifest.exists() and manifest.is_file(), f"File {manifest} should exist"

        with open(manifest, "r") as manifest_stream:
            # load of the first document in the yaml file.
            # if there are more documents, they will be ignored
            plugin = yaml.load(manifest_stream, Loader=yaml.loader.SafeLoader)
            plugin.manifest_file = str(manifest.absolute())

            # TODO: somehow pass it here
            plugin.aqueduct_key = ""

            return plugin
