import shutil

import pytest
from pydantic import ValidationError

from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginFunction,
    PluginParameter,
    SupportedTypes,
)
from aqueductcore.backend.services.plugin_executor import (
    PYTHON_BINARY,
    VENV_FOLDER,
    PluginExecutor,
)


class TestPluginExecutor:

    def test_list_plugins_ok(self):
        plugins = PluginExecutor.list_plugins()
        assert len(plugins) == 2
        var1 = plugins[0].functions[0].parameters[0]
        var2 = plugins[0].functions[0].parameters[1]
        var6 = plugins[0].functions[0].parameters[5]

        assert var1.default_value == "1" and var1.name == "var1"
        assert var2.display_name == "some display name"
        assert var6.default_value == "1" and var6.name == "var6"

    @pytest.mark.parametrize(
        "value",
        [
            {
                "var1": "text",
                "var2": "1212312323",
                "var3": "1",
                "var4": "20240229-5689864ffd94",
                "var5": "text\narea",
                "var6": "False",
                "var7": "string1",
            },
            {
                "var1": "no text",
                "var2": "0",
                "var3": "1.0",
                "var4": "20240229-5689864ffd94",
                "var5": "text\narea",
                "var6": "1",
                "var7": "string2",
            },
            {
                "var1": "text",
                "var2": "-1",
                "var3": "-1.4e-04",
                "var4": "20240229-5689864ffd94",
                "var5": "",
                "var6": "True",
                "var7": "string4",
            },
        ],
    )
    def test_validate_values_ok(self, value):
        plugins = PluginExecutor.list_plugins()
        if plugins[0].name == "Dummy plugin":
            plugin = plugins[0]
        else:
            plugin = plugins[1]
        func = plugin.functions[0]
        func.validate_values(value)

    @pytest.mark.parametrize(
        "value",
        [
            # var2 not int
            {
                "var1": "text",
                "var2": "2.2",
                "var3": "1",
                "var4": "20240229-5689864ffd94",
                "var5": "",
                "var6": "0",
            },
            # var3 non float
            {
                "var1": "text",
                "var2": "2",
                "var3": "abc",
                "var4": "20240229-5689864ffd94",
                "var5": "",
                "var6": "0",
            },
            # var4 non alias
            {
                "var1": "text",
                "var2": "2",
                "var3": "3",
                "var4": "±20240229-5689864ffd94",
                "var5": "",
                "var6": "0",
            },
            # not enough params
            {"var1": "text", "var2": "2", "var3": "3"},
            # too many params
            {
                "var1": "text",
                "var2": "2",
                "var3": "3",
                "var4": "20240229-5689864ffd94",
                "var5": "",
                "var6": "false",
                "var7": "oops",
            },
            # var6 is not bool
            {
                "var1": "text",
                "var2": "2",
                "var3": "3",
                "var4": "20240229-5689864ffd94",
                "var5": "",
                "var6": "not quite sure",
            },
        ],
    )
    def test_validate_values_raises(self, value):
        plugins = PluginExecutor.list_plugins()
        if plugins[0].name == "Dummy plugin":
            plugin = plugins[0]
        else:
            plugin = plugins[1]
        with pytest.raises(AQDValidationError):
            plugin.functions[0].validate_values(value)

    @pytest.mark.parametrize(
        "plugin",
        [
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                functions=[],
                params={},
                aqueduct_url="",
            ),
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                functions=[
                    PluginFunction(name="func1", description="descr", script="", parameters=[]),
                ],
                params={},
            ),
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                functions=[
                    PluginFunction(
                        name="func1",
                        description="descr",
                        script="",
                        parameters=[
                            PluginParameter(
                                name="var1",
                                description="descr",
                                data_type=SupportedTypes.TEXTAREA,
                            )
                        ],
                    ),
                ],
                params={},
            ),
        ],
    )
    def test_plugin_validation_ok(self, plugin):
        plugin.validate_object()

    def test_plugin_echo(self):
        plugin = PluginExecutor.get_plugin("Dummy plugin")
        result = PluginExecutor.execute(
            plugin="Dummy plugin",
            function="echo",
            params={
                "var1": "text",
                "var2": 1,
                "var3": 2.2,
                "var4": "20240229-5689864ffd94",
                "var5": "text\narea",
                "var6": 0,
                "var7": "string2",
            },
        )
        assert result.return_code == 0

    @pytest.mark.skip
    def test_plugin_wolfram_alpha(self):
        result = PluginExecutor.execute(
            "Wolfram alpha solution plugin",
            "solve as text",
            {
                "equation": "x^2 + 7 = 0",
                "experiment": "20240229-5689864ffd94",
                "result_file": "wolfram_solution.txt",
            },
        )
        assert result.stderr == ""
        assert result.return_code == 0
        assert result.stdout == "x = -i sqrt(7)\nx = i sqrt(7)\n"

    def test_plugin_venv_is_created_execute(self):
        plugin = PluginExecutor.get_plugin("Wolfram alpha solution plugin")
        venv = plugin.folder / VENV_FOLDER
        # make sure there is no venv
        shutil.rmtree(venv, ignore_errors=True)
        # it will fail, but after the venv creation
        try:
            PluginExecutor.execute("Wolfram alpha solution plugin", "solve as text", {})
        except:
            pass
        # venv is created
        assert venv.exists()
        # python is there
        assert (venv / PYTHON_BINARY).exists()
        # pip is there
        assert (venv / "bin/pip").exists()
        # assert requests are installed
        assert list(venv.glob("lib*/python*/site-packages/requests"))
        # assert requests are installed
        assert list(venv.glob("lib*/python*/site-packages/pyaqueduct"))
