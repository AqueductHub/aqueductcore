import pytest

from aqueductcore.backend.plugins import (
    Plugin,
    PluginExecutor,
    PluginFunction,
    PluginParameter,
    SupportedTypes,
)


class TestPluginExecutor:
    def test_list_plugins(self):
        plugins = PluginExecutor.list_plugins()
        assert len(plugins) == 2

    @pytest.mark.parametrize(
        "value",
        [
            {
                "var1": "text",
                "var2": "1212312323",
                "var3": "1",
                "var4": "20240229-5689864ffd94",
            },
            {
                "var1": "no text",
                "var2": "0",
                "var3": "1.0",
                "var4": "20240229-5689864ffd94",
            },
            {
                "var1": "text",
                "var2": "-1",
                "var3": "-1.4e-04",
                "var4": "20240229-5689864ffd94",
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
        PluginExecutor._validate_values(func, value)

    @pytest.mark.parametrize(
        "value",
        [
            # not int
            {
                "var1": "text",
                "var2": "2.2",
                "var3": "1",
                "var4": "20240229-5689864ffd94",
            },
            # non float
            {
                "var1": "text",
                "var2": "2",
                "var3": "abc",
                "var4": "20240229-5689864ffd94",
            },
            # non alias
            {
                "var1": "text",
                "var2": "2",
                "var3": "3",
                "var4": "±20240229-5689864ffd94",
            },
            # not enough params
            {"var1": "text", "var2": "2", "var3": "3"},
            # too many params
            {
                "var1": "text",
                "var2": "2",
                "var3": "3",
                "var4": "20240229-5689864ffd94",
                "var5": "oops",
            },
        ],
    )
    def test_validate_values_raises(self, value):
        plugins = PluginExecutor.list_plugins()
        if plugins[0].name == "Dummy plugin":
            plugin = plugins[0]
        else:
            plugin = plugins[1]
        func = plugin.functions[0]
        with pytest.raises((ValueError, AssertionError)):
            PluginExecutor._validate_values(func, value)

    @pytest.mark.parametrize(
        "plugin",
        [
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                functions=[],
                aqueduct_url="",
            ),
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                functions=[
                    PluginFunction(
                        name="func1", description="descr", script="", parameters=[]
                    ),
                ],
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
                                data_type=SupportedTypes.MULTILINE.value,
                            )
                        ],
                    ),
                ],
            ),
        ],
    )
    def test_plugin_validation_ok(self, plugin):
        PluginExecutor._validate_plugin(plugin)

    @pytest.mark.parametrize(
        "plugin",
        [
            # short description
            Plugin(
                name="name",
                description="sh",
                authors="a@a.org",
                functions=[],
                aqueduct_url="",
            ),
            # empty name
            Plugin(
                name="",
                description="long one",
                authors="a@a.org",
                functions=[],
                aqueduct_url="",
            ),
            # short function description
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                functions=[
                    PluginFunction(
                        name="func1", description="sh", script="", parameters=[]
                    ),
                ],
            ),
            # empty function name
            Plugin(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                functions=[
                    PluginFunction(name="", description="sh", script="", parameters=[]),
                ],
            ),
            # unsupported type
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
                                name="var1", description="descr", data_type="something"
                            )
                        ],
                    ),
                ],
            ),
        ],
    )
    def test_plugin_validation_raises(self, plugin):
        with pytest.raises(AssertionError):
            PluginExecutor._validate_plugin(plugin)