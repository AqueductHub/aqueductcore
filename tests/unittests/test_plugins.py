import pytest
from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginFunction, 
    PluginParameter,
    SupportedTypes,
)
from aqueductcore.backend.services.plugin_executor import PluginExecutor


class TestPluginModel:    
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
                                data_type=SupportedTypes.TEXTAREA,
                                default_value="1",
                            )
                        ],
                    ),
                ],
            ),
        ],
    )
    def test_plugin_validation_ok(self, plugin):
        plugin.validate_object()

    def test_plugin_exposes_default_experiment(self):
        plugin = PluginExecutor.get_plugin("Dummy plugin")
        echo = plugin.get_function("echo")
        param = echo.get_default_experiment_parameter()
        assert param.name == "var4" and param.data_type == SupportedTypes.EXPERIMENT

    def test_plugin_execute(self):
        plugin = PluginExecutor.get_plugin("Dummy plugin")
        echo = plugin.get_function("echo")
        result = echo.execute(
            plugin=plugin,
            params={"var1": "text", "var2": 1, "var3": 2.2,
                    "var4": "20240229-5689864ffd94",
                    "var5": "text\narea", "var6": 0, "var7": "string2"},
        )
        assert result.return_code == 0
