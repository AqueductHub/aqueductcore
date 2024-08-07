import shutil

import pytest
from aqueductcore.backend.services.extensions_executor import (
    ExtensionsExecutor, VENV_FOLDER, PYTHON_BINARY)


class TestExtensionExecutor:

    def test_extension_echo(self):
        result = ExtensionsExecutor.execute(
            extension="Dummy extension",
            action="echo",
            params={"var1": "text", "var2": 1, "var3": 2.2, "var4": "20240229-5689864ffd94",
             "var5": "text\narea", "var6": 0, "var7": "string2"},
        )
        assert result.result_code == 0

    @pytest.mark.skip
    def test_extension_wolfram_alpha(self):
        result = ExtensionsExecutor.execute(
            "Wolfram alpha solution extension",
            "solve as text",
            {
                "equation": "x^2 + 7 = 0",
                "experiment": "20240229-5689864ffd94",
                "result_file": "wolfram_solution.txt",
            },
        )
        assert result.std_err == ""
        assert result.result_code == 0
        assert result.std_out == "x = -i sqrt(7)\nx = i sqrt(7)\n"

    def test_extension_venv_is_created_execute(self):
        extension = ExtensionsExecutor.get_extension("Wolfram alpha solution extension")
        venv = extension.folder / VENV_FOLDER
        # make sure there is no venv
        shutil.rmtree(venv, ignore_errors=True)
        # it will fail, but after the venv creation
        try:
            ExtensionsExecutor.execute(
                "Wolfram alpha solution extension",
                "solve as text",
                {}
            )
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
