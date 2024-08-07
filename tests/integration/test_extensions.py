from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor


class TestExtensionModel:    

    def test_extension_execute(self):
        extension = ExtensionsExecutor.get_extension("Dummy extension")
        echo = extension.get_action("echo")
        result = echo.execute(
            extension=extension,
            params={"var1": "text", "var2": 1, "var3": 2.2,
                    "var4": "20240229-5689864ffd94",
                    "var5": "text\narea", "var6": 0, "var7": "string2"},
        )
        assert result.result_code == 0
