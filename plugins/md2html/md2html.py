import markdown
import os
from tempfile import TemporaryDirectory
from pathlib import Path

from pyaqueduct import API
from pyaqueduct.experiment import Experiment



if __name__ == "__main__":
    # this is passed by default to any plugin
    aqueduct_key = os.environ.get("aqueduct_key")
    aqueduct_url = os.environ.get("aqueduct_url")

    # probably this is ok to have it as an input
    # but in current design proposal we expect to have
    # 1 experiment always
    experiment_id = os.environ.get("experiment")

    api = API(url=aqueduct_url, timeout=10)
    with TemporaryDirectory() as tmpdir:
        e = api.get_experiment(experiment_id)
        file = os.environ.get("input")
        resultfile = os.environ.get("output")
        e.download_file(file_name=file, destination_dir=tmpdir)

        with open(Path(tmpdir) / file, "r") as source:
            with open(Path(tmpdir) / resultfile, "w") as destination:
                html = markdown.markdown(source.read())
                destination.write(html)
        e.upload_file(Path(tmpdir) / resultfile)
        print(f"Successfully uploaded {Path(tmpdir) / resultfile} to {experiment_id}")
