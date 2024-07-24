import os
import subprocess
import time

from pathlib import Path
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@rabbit-with-celery-container//', backend='rpc://')

@app.task(bind=True)
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
    with subprocess.Popen(
            shell_script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=myenv,
            cwd=workdir,
        ) as proc:
            out, err = proc.communicate(timeout=60)
            code = proc.returncode
    self.update_state(state='CUSTOM_RIVERLANE_STATE_2', meta={'done': 1, 'total': 1})
    time.sleep(2)
    return code, out, err
