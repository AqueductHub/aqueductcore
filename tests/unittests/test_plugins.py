import pytest
from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginFunction, 
    PluginParameter,
    SupportedTypes,
)
from aqueductcore.backend.services.plugin_executor import PluginExecutor
from aqueductcore.backend.errors import AQDValidationError


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
        assert param.name == "var4" and param.data_type == SupportedTypes.EXPERIMENT.value