import shutil

from aqueductcore.backend.services.extensions_executor import (
    ExtensionsExecutor, VENV_FOLDER, PYTHON_BINARY)

from aqueductcore.backend.services.task_executor import (
    update_task_info,
)


class TestExtensionExecutor:

    def test_extension_echo(self):
        result = ExtensionsExecutor.execute(
            extension="Dummy extension",
            action="echo",
            params={"var1": "text", "var2": 1, "var3": 2.2, "var4": "20240229-5689864ffd94",
             "var5": "text\narea", "var6": 0, "var7": "string2"},
        )
        result = update_task_info(str(result.task_id), wait=True)
        assert result.status == "SUCCESS"
        assert result.result_code == 0
        assert result.std_out == """var1=text
var2=1
var3=2.2
var4=20240229-5689864ffd94
var5=text
area
var6=0
var7=string2
dummykey=dummyvalue
"""
        assert result.std_err == ""

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
