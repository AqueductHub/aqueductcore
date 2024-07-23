import os
import subprocess
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@localhost//', backend='rpc://')

@app.task(bind=True)
def run_executable(self, shell_script, **kwargs):
    myenv = os.environ.copy()
    myenv.update(kwargs)
    print("ARGS: ", myenv)
    self.update_state(state='CUSTOM_RIVERLANE_STATE_1', meta={'done': 0, 'total': 1})
    with subprocess.Popen(
            shell_script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=myenv,
        ) as proc:
            out, err = proc.communicate(timeout=60)
            code = proc.returncode
    self.update_state(state='CUSTOM_RIVERLANE_STATE_2', meta={'done': 1, 'total': 1})
    return code, out, err