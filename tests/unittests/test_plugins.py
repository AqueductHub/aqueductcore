import pytest
from aqueductcore.backend.models.plugin import (
    Plugin,
    PluginFunction, 
    PluginParameter,
    SupportedTypes,
)
from aqueductcore.backend.plugins import PluginExecutor
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
                                data_type=SupportedTypes.TEXTAREA.value,
                                default_value="1",
                            )
                        ],
                    ),
                ],
            ),
        ],
    )
    def test_plugin_validation_ok(self, plugin):
        plugin.validate()

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
                                name="var1",
                                description="descr",
                                data_type="something",
                                default_value="some",
                            )
                        ],
                    ),
                ],
            ),
        ],
    )
    def test_plugin_validation_raises(self, plugin):
        with pytest.raises(AQDValidationError):
            plugin.validate()

    def test_plugin_exposes_default_experiment(self):
        plugin = PluginExecutor.get_plugin("Dummy plugin")
        echo = plugin.get_function("echo")
        param = echo.get_default_experiment_parameter()
        assert param.name == "var4" and param.data_type == SupportedTypes.EXPERIMENT.value