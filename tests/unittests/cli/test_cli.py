import os
import tarfile
import tempfile
from typing import List
from unittest.mock import patch

from sqlalchemy.orm import Session
from typer.testing import CliRunner

from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.settings import settings
from aqueductcore.cli import app
from aqueductcore.cli.exporter import Exporter
from tests.unittests.cli.conftest import sync_engine as test_sync_engine
from tests.unittests.cli.conftest import temp_experiments

runner = CliRunner()


@patch("aqueductcore.cli.main.sync_engine")
def test_cli_export_without_experiment_files(
    sync_engine,
    db_session: Session,
    experiments_data: List[ExperimentCreate],
):
    sync_engine = test_sync_engine

    with tempfile.NamedTemporaryFile(suffix=".tar.gz") as tmp_archive:
        with temp_experiments(
            db_session=db_session, experiments_data=experiments_data
        ) as mock_data:
            expected_metadata, tar_files_expected, tmpdirname = mock_data

            settings.experiments_dir_path = tmpdirname
            result = runner.invoke(app, ["export", tmp_archive.name])
            assert result.exit_code == 0

            with tarfile.open(name=tmp_archive.name, mode="r:gz") as tar:
                assert len(list(tar)) == 1
                member = list(tar)[0]
                file = tar.extractfile(member)
                assert member.name == Exporter.METADATA_FILENAME
                assert file is not None
                assert file.read() == tar_files_expected[member.name]


@patch("aqueductcore.cli.main.sync_engine")
def test_cli_export_with_experiment_files_default_export_file(
    sync_engine,
    db_session: Session,
    experiments_data: List[ExperimentCreate],
):
    sync_engine = test_sync_engine

    with tempfile.NamedTemporaryFile(suffix=".tar.gz") as tmp_archive:
        with temp_experiments(
            db_session=db_session, experiments_data=experiments_data
        ) as mock_data:
            expected_metadata, tar_files_expected, tmpdirname = mock_data

            settings.experiments_dir_path = tmpdirname
            result = runner.invoke(app, ["export", tmp_archive.name, "-e"])
            assert result.exit_code == 0

            with tarfile.open(name=tmp_archive.name, mode="r:gz") as tar:
                for member in tar:
                    if member.isfile():
                        assert member.name in list(tar_files_expected.keys())
                        file = tar.extractfile(member)
                        assert file is not None
                        assert file.read() == tar_files_expected[member.name]
