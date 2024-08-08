"""Celery task execution."""

import os
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple
from uuid import UUID

from celery import Celery
from celery.result import AsyncResult
from pydantic import BaseModel

from aqueductcore.backend.settings import settings

WAITING_TIME = 2

celery_app = Celery(
    "tasks",
    broker=settings.celery_message_queue,
    backend=settings.celery_backend,
)


class TaskProcessExecutionResult(BaseModel):
    """Result of process execution."""

    result_code: Optional[int]
    std_err: Optional[str]
    std_out: Optional[str]
    task_id: UUID
    status: str
    receive_time: datetime
    ended_time: Optional[datetime]


@celery_app.task(bind=True)
def run_executable(
    self,   # pylint: disable=unused-argument
    extension_directory_name: str,
    shell_script: str,
    **kwargs
) -> Tuple[int, str, str]:
    """ This code executes in a celery worker.
    This call is implemented as blocking, but the aqueduct
    application sends the task, and receives the ID.
    Args:
        self: used to change state of the task from inside the task.
        extension_directory_name (str):
            relative name of the folder where the extension lives.
        shell_script (str):
            code to execute. Use relative file names here.
    
    Returns:
        Tuple[int, str, str]: result code, std out, std error.
    """
    extensions_dir = os.environ.get("EXTENSIONS_DIR_PATH", "")
    if not extensions_dir:
        raise FileNotFoundError("EXTENSIONS_DIR_PATH environment variable should be set.")
    workdir = Path(extensions_dir) / extension_directory_name

    myenv = os.environ.copy()
    myenv.update(kwargs)

    # TODO: add mechanism to update statuses
    # from inside the process. E.g. with a file
    # extension/.status
    with subprocess.Popen(
        shell_script,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=myenv,
        cwd=workdir,
    ) as proc:
        out, err = proc.communicate(timeout=None)
        code = proc.returncode
    return (
        code,
        out.decode("utf-8"),
        err.decode("utf-8"),
    )


def update_task_info(task_id: str, wait=True) -> TaskProcessExecutionResult:
    """Updates information about a task. Waits until ready if asked."""
    task = AsyncResult(task_id)
    ended_time = None
    if wait:
        if not task.ready():
            time.sleep(WAITING_TIME)
        ended_time = datetime.now()

    result = TaskProcessExecutionResult(
        result_code=None,
        std_err=None,
        std_out=None,
        task_id=UUID(task.id),
        status=task.status,
        # TODO update using database
        receive_time=datetime.now(),
        ended_time=ended_time,
    )
    if task.result is not None:
        code, out, err = task.result
        result.result_code = code
        result.std_out = out
        result.std_err = err
    return result


def execute_task(
    extension_directory_name: str,
    shell_script: str,
    execute_blocking: bool = False,
    **kwargs
) -> TaskProcessExecutionResult:
    """Execute a task and wait until finished"""

    receive_time = datetime.now()
    # retry and expiration control policies may be added here according to:
    # https://docs.celeryq.dev/en/stable/userguide/calling.html#message-sending-retry
    task = run_executable.apply_async(
        (extension_directory_name, shell_script),
        kwargs=kwargs,
    )
    result = update_task_info(task_id=task.id, wait=execute_blocking)
    result.receive_time = receive_time
    return result
