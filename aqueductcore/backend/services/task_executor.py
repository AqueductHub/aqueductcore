import os
import subprocess
import time

from pathlib import Path
from typing import Tuple
from celery import Celery
from celery.result import AsyncResult


app = Celery('tasks', broker='pyamqp://guest@rabbit-with-celery-container//', backend='rpc://')

@app.task(bind=True)
<<<<<<< HEAD
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

    self.update_state(state='CUSTOM_RIVERLANE_STATE_1', meta={'done': 0, 'total': 1})
=======
def run_executable(self, extension_folder_name, shell_script, **kwargs):
    extensions_dir = os.environ.get("EXTENSIONS_DIR", "")
    if not extensions_dir:
        raise FileNotFoundError("EXTENSIONS_DIR environment variable should be set.")
    workdir = Path(extensions_dir) / extension_folder_name

    myenv = os.environ.copy()
    myenv.update(kwargs)
    print("ARGS: ", myenv)
    time.sleep(2)
    self.update_state(state='CUSTOM_RIVERLANE_STATE_1', meta={'done': 0, 'total': 1})
    time.sleep(2)
>>>>>>> 10417b5 (adding task execution feature)
    with subprocess.Popen(
            shell_script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=myenv,
            cwd=workdir,
        ) as proc:
<<<<<<< HEAD
            out, err = proc.communicate(timeout=None)
            code = proc.returncode
    self.update_state(state='CUSTOM_RIVERLANE_STATE_2', meta={'done': 1, 'total': 1})
    return code, out.decode("utf-8"), err.decode("utf-8")


# https://medium.com/@kasperjuunge/how-to-use-celery-c34310e6bcba
# https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.delay
def execute_blocking(
    extension_directory_name: str,
    shell_script: str,
    **kwargs
) -> Tuple[int, str, str, str]:
    job = run_executable.delay(
        extension_directory_name=extension_directory_name,
        shell_script=shell_script,
        **kwargs
    )
    while not job.ready():
        time.sleep(2)
    return job.result + [job.id]
        

def execute_non_blocking(
    extension_directory_name: str,
    shell_script: str,
    **kwargs
) -> AsyncResult:
    job = run_executable.delay(
        extension_directory_name=extension_directory_name,
        shell_script=shell_script,
        **kwargs
    )
    return job
=======
            out, err = proc.communicate(timeout=60)
            code = proc.returncode
    self.update_state(state='CUSTOM_RIVERLANE_STATE_2', meta={'done': 1, 'total': 1})
    time.sleep(2)
    return code, out, err
>>>>>>> 10417b5 (adding task execution feature)
