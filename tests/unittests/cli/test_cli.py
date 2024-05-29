import filecmp
import os
import tarfile
import tempfile
from typing import List
from unittest.mock import patch

from sqlalchemy.orm import Session
from typer.testing import CliRunner

from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.settings import settings
from aqueductcore.cli import app, main
from aqueductcore.cli.exporter import Exporter
from tests.unittests.cli.conftest import sync_engine as test_sync_engine
from tests.unittests.cli.conftest import temp_experiments

runner = CliRunner()


def test_cli_export_without_experiment_files(
    db_session: Session,
    experiments_data: List[ExperimentCreate],
):
    main.sync_engine = test_sync_engine

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


def test_cli_export_with_experiment_files_default_export_file(
    db_session: Session,
    experiments_data: List[ExperimentCreate],
):
    main.sync_engine = test_sync_engine

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


class dircmp(filecmp.dircmp):
    """
    Compare the content of dir1 and dir2. In contrast with filecmp.dircmp, this
    subclass compares the content of files with the same path.
    """

    def phase3(self):
        """
        Find out differences between common files.
        Ensure we are using content comparison with shallow=False.
        """
        fcomp = filecmp.cmpfiles(self.left, self.right, self.common_files, shallow=False)
        self.same_files, self.diff_files, self.funny_files = fcomp


def is_same(dir1, dir2):
    """
    Compare two directory trees content.
    Return False if they differ, True is they are the same.
    """
    compared = dircmp(dir1, dir2)
    if compared.left_only or compared.right_only or compared.diff_files or compared.funny_files:
        return False
    for subdir in compared.common_dirs:
        if not is_same(os.path.join(dir1, subdir), os.path.join(dir2, subdir)):
            return False
    return True


@patch("aqueductcore.cli.main.sync_engine")
def test_cli_import_from_archive(
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

            with tempfile.TemporaryDirectory() as import_tmpdirname:
                settings.experiments_dir_path = import_tmpdirname
                result = runner.invoke(app, ["import", tmp_archive.name])
                assert result.exit_code == 0

                assert is_same(import_tmpdirname, tmpdirname)
