import pytest
import time

from aqueductcore.backend.services.task_executor import (
    execute_task,
    revoke_task,
)


class TestTaskExecutor:

    @pytest.mark.asyncio
    async def test_run_executable_blocking_success(self):
        # run in a folder of extension,
        # but another command
        result = await execute_task(
            extension_directory_name="sh-example",
            shell_script="ls",
            execute_blocking=True,
        )

        assert result.status == "SUCCESS"
        assert result.result_code == 0

    @pytest.mark.asyncio
    async def test_run_executable_blocking_raises_unknown_folder(self):
        result = await execute_task(
            extension_directory_name="no-idea-what-is-this-folder",
            shell_script="ls",
            execute_blocking=True,
        )
        assert result.status == "FAILURE"
        assert "No such file or directory" in (result.std_err or "")

    @pytest.mark.asyncio
    async def test_run_executable_non_blocking_success(self):
        # run in a folder of extension,
        # but another command
        result = await execute_task(
            extension_directory_name="sh-example",
            shell_script="sleep 5; ls",
            execute_blocking=False,
        )
        assert result.task_id
        assert result.status in ("PENDING", "STARTED")

    @pytest.mark.asyncio
    async def test_run_executable_non_blocking_and_cancel(self):
        # run in a folder of extension,
        # but another command
        result = await execute_task(
            extension_directory_name="sh-example",
            shell_script="sleep 10; ls",
            execute_blocking=False,
        )
        assert result.task_id
        assert result.status in ("PENDING", "STARTED")
        # let it start
        time.sleep(2)

        result2 = await revoke_task(task_id=str(result.task_id), terminate=True)

        # TODO: if we don't wait, most probably this status
        # will be "PENDING", so after a cycle of waiting this will update
        # to "REVOKED"
        # assert result2.status == "REVOKED"
