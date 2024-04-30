"""The module contains business-logic level code for plugin access and execution.
Plugins are stored on a file system. They are declared using `manifest.yml` files.
Depending on execution context, plugins may be implement in any language if they
can read environment variables and print to stdout.
"""

import logging
from pathlib import Path
from typing import List

from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginExecutionResult,
)
from aqueductcore.backend.settings import settings


class PluginExecutor:
    """Class to access plugins."""

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
                    plugin.validate()
                    result.append(plugin)
                except AQDValidationError as err:
                    logging.error(err)
                    # TODO: raise again here?
        return result

    @classmethod
    def get_plugin(cls, plugin: str) -> Plugin:
        """Returns plugin instance given its name.
        
        Args:
            plugin: plugin name.

        Returns:
            Plugin instance. 
        """
        plugins = [p for p in cls.list_plugins() if p.name == plugin]
        if len(plugins) != 1:
            raise AQDValidationError(f"There should be exactly 1 plugin with name {plugin}")
        return plugins[0]

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
        plugin_object = cls.get_plugin(plugin)
        function_object = plugin_object.get_function(function)
        return function_object.execute(plugin=plugin_object, params=params)
