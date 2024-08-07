"""Celery task execution."""

from dataclasses import dataclass
import os
import subprocess
import time

from pathlib import Path
from typing import  Optional, Tuple
from celery import Celery
from uuid import UUID

from aqueductcore.backend.settings import settings


WAITING_TIME = 2

celery_app = Celery(
    "tasks",
    broker=settings.celery_message_queue,
    backend=settings.celery_backend,
)


@dataclass
class TaskProcessExecutionResult:
    """Result of process execution."""

    result_code: Optional[int]
    std_err: Optional[str]
    std_out: Optional[str]
    task_id: UUID
    status: Optional[str]


@celery_app.task(bind=True)
def run_executable(
    self,
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
    extensions_dir = os.environ.get("EXTENSIONS_DIR", "")
    if not extensions_dir:
        raise FileNotFoundError("EXTENSIONS_DIR environment variable should be set.")
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
        err.decode("utf-8"),
        out.decode("utf-8"),
    )


def execute_task(
    extension_directory_name: str,
    shell_script: str,
    execute_blocking: bool = False,
    **kwargs
) -> TaskProcessExecutionResult:
    """Execute a task and wait until finished"""
    task = run_executable.delay(
        extension_directory_name=extension_directory_name,
        shell_script=shell_script,
        **kwargs
    )
    while execute_blocking and not task.ready():
        time.sleep(WAITING_TIME)
    result = TaskProcessExecutionResult(
        result_code=None,
        std_err=None,
        std_out=None,
        task_id=UUID(task.id),
        status=task.status,
    )
    if task.result is not None:
        code, out, err = task.result  
        result.result_code = code
        result.std_out = out
        result.std_err = err
    return result
