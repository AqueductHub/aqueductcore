# pylint: skip-file

import os
import tarfile
from io import BytesIO
from tempfile import TemporaryDirectory
from typing import List

from sqlalchemy.orm import Session

from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.cli.exporter import Exporter
from tests.unittests.cli.conftest import temp_experiments


def test_export_experiments_metadata(db_session: Session, experiments_data: List[ExperimentCreate]):

    with temp_experiments(db_session=db_session, experiments_data=experiments_data) as mock_data:
        expected_metadata, _, _ = mock_data
        metadata = Exporter.export_experiments_metadata(db_session=db_session)

        assert expected_metadata == metadata


def test_get_dir_size():

    with TemporaryDirectory() as tmpdirname:
        total_size = 0
        for dir_idx in range(10):
            experiment_dir = os.path.join(tmpdirname, f"test_dir_{dir_idx}")
            os.mkdir(experiment_dir)
            for file_idx in range(10):
                test_file_size = 100
                test_file_name = f"test_file_{file_idx}"
                test_file_path = os.path.join(experiment_dir, test_file_name)
                test_data = bytes(bytearray(os.urandom(test_file_size)))
                with open(test_file_path, mode="wb") as file_writer:
                    file_writer.write(test_data)
                total_size += test_file_size

        assert Exporter.get_dir_size(tmpdirname) == total_size


def test_export_artifact(db_session: Session, experiments_data: List[ExperimentCreate]):

    with temp_experiments(db_session=db_session, experiments_data=experiments_data) as mock_data:
        expected_metadata, tar_files_expected, tmpdirname = mock_data
        export_tarfile = BytesIO()
        with tarfile.open(mode="w:gz", fileobj=export_tarfile) as tar:
            Exporter.export_archive(
                metadata_bytes=expected_metadata.model_dump_json(indent=2).encode(encoding="utf-8"),
                tar=tar,
                experiments_root=tmpdirname,
            )

        export_tarfile.seek(0)
        with tarfile.open(fileobj=export_tarfile, mode="r:gz") as tar:
            for member in tar:
                if member.isfile():
                    assert member.name in list(tar_files_expected.keys())
                    file = tar.extractfile(member)
                    assert file is not None
                    assert file.read() == tar_files_expected[member.name]
