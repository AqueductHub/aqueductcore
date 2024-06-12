import pytest
from aqueductcore.backend.models.extensions import (
    Extension,
    ExtensionAction, 
    ExtensionParameter,
    SupportedTypes,
)
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor


class TestExtensionModel:    
    @pytest.mark.parametrize(
        "extension",
        [
            Extension(
                name="name",
                description="long descr",
                authors="a@a.org",
                actions=[],
                aqueduct_url="",
            ),
            Extension(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                actions=[
                    ExtensionAction(
                        name="func1", description="descr", script="", parameters=[]
                    ),
                ],
            ),
            Extension(
                name="name",
                description="long descr",
                authors="a@a.org",
                aqueduct_url="",
                actions=[
                    ExtensionAction(
                        name="func1",
                        description="descr",
                        script="",
                        parameters=[
                            ExtensionParameter(
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
    def test_extension_validation_ok(self, extension):
        extension.validate_object()

    def test_extension_exposes_default_experiment(self):
        extension = ExtensionsExecutor.get_extension("Dummy extension")
        echo = extension.get_action("echo")
        param = echo.get_default_experiment_parameter()
        assert param.name == "var4" and param.data_type == SupportedTypes.EXPERIMENT

    def test_extension_execute(self):
        extension = ExtensionsExecutor.get_extension("Dummy extension")
        echo = extension.get_action("echo")
        result = echo.execute(
            extension=extension,
            params={"var1": "text", "var2": 1, "var3": 2.2,
                    "var4": "20240229-5689864ffd94",
                    "var5": "text\narea", "var6": 0, "var7": "string2"},
        )
        assert result.return_code == 0
