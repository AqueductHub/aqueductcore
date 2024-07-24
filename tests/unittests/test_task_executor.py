from time import sleep
from pathlib import Path

from aqueductcore.backend.services.task_executor import run_executable
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor

def test_simple_task():
    extensions = ExtensionsExecutor.list_extensions()
    extension_folder_name = Path(extensions[0]._folder or ".").name
    job = run_executable.delay(
        extension_folder_name,
        "ls; echo $XX",
        XX="some value"
    )
    print("Job id:", job.id)
    while not job.ready():
        print(f"{job.status:25s} {job.id}")
        sleep(1)
    print(f"{job.status:25s} {job.id}")
    print(job.result[1])
    assert job.result[0] == 0