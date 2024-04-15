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

    return_code: int
    stdout: str
    stderr: str


class PluginParameter(yaml.YAMLObject):
    yaml_tag = "!parameter"
    yaml_loader = yaml.SafeLoader

    def __init__(self, name: str, description: str, type: str):
        self.name = name
        self.description = description
        self.type = type


class PluginFunction(yaml.YAMLObject):
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

    def execute(self, plugin: Plugin, params: dict):
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
        out, err = proc.communicate(timeout=60)
        code = proc.returncode
        return PluginExecutionResult(code, out.decode(), err.decode())


class Plugin(yaml.YAMLObject):
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
        assert path.exists(), f"Folder {path} does not exist"
        assert not path.is_file(), f"{path} should be a folder, not a file"

        manifest = path / MANIFEST_FILE
        assert manifest.exists() and manifest.is_file(), f"File {manifest} should exist"

        with open(manifest, "r") as mf:
            # load of the first document in the yaml file.
            # if there are more documents, they will be ignored
            plugin = yaml.load(mf, Loader=yaml.loader.SafeLoader)
            plugin.manifest_file = str(manifest.absolute())

            # TODO: somehow pass it here
            plugin.aqueduct_key = ""

            return plugin
