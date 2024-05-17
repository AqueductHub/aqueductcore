# pylint: skip-file

import os
import tarfile
from datetime import datetime, timezone
from io import BytesIO
from tempfile import TemporaryDirectory
from typing import List
from uuid import UUID, uuid4

from sqlalchemy.orm import Session

import aqueductcore
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate, TagCreate
from aqueductcore.backend.services.utils import experiment_model_to_orm
from aqueductcore.backend.settings import settings
from aqueductcore.cli.export import Exporter
from aqueductcore.cli.models import AqueductVariant

user_id = uuid4()
experiment_data = [
    ExperimentCreate(
        id=UUID("b7038e5a-c93d-4cac-8d3d-b5a95ead0963"),
        title="Entangling Possibilities: Quantum Computing Explorations",
        description="Description for entangling possibilities: quantum computing explorations experiment",
        tags=[
            TagCreate(key="tag1", name="Tag1"),
            TagCreate(key="tag2", name="Tag2"),
            TagCreate(key="tag3", name="Tag3"),
        ],
        alias=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-1",
    ),
    ExperimentCreate(
        id=UUID("94d7d1a5-0840-481c-8f46-d9873f5fafa4"),
        title="Shifting Realities: Quantum Computing Challenges",
        description="Description for shifting realities: quantum computing challenges experiment",
        tags=[],
        alias=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-2",
    ),
    ExperimentCreate(
        id=UUID("852b81bb-ced4-4c8d-8176-9c7184206638"),
        title="Beyond Bits: Quantum Computing Frontier",
        description="Description for beyond bits: quantum computing frontier experiment",
        tags=[],
        alias=f"{datetime.now(timezone.utc).strftime('%Y%m%d')}-3",
    ),
]


def test_export_experiments_metadata(db_session: Session, experiments_data: List[ExperimentCreate]):
    """Test get_all_experiments operation"""
    db_user = orm.User(id=user_id, username=settings.default_username)
    db_session.add(db_user)

    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_session.add(db_experiment)

    db_session.commit()

    metadata = Exporter.export_experiments_metadata(db_session=db_session)

    assert metadata.version == aqueductcore.__version__
    assert metadata.variant == AqueductVariant.CORE.value
    assert len(metadata.users) == 1
    assert metadata.users[0].uuid == user_id
    assert metadata.users[0].username == settings.default_username

    # TODO: Add assertions for data equality.


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

        assert Exporter._get_dir_size(tmpdirname) == total_size


def test_export_artifact():

    with TemporaryDirectory() as tmpdirname:
        total_size = 0
        test_files = {}
        for dir_idx in range(10):
            experiment_dir = os.path.join(tmpdirname, f"test_dir_{dir_idx}")
            experiment_dir_in_tar = os.path.join(
                tmpdirname, Exporter.EXPERIMENTS_BASE_DIR_NAME, f"test_dir_{dir_idx}"
            )
            os.mkdir(experiment_dir)
            for file_idx in range(10):
                test_file_size = 100
                test_file_name = f"test_file_{file_idx}"
                test_file_path = os.path.join(experiment_dir, test_file_name)
                test_data = bytes(bytearray(os.urandom(test_file_size)))
                test_files[os.path.join(experiment_dir_in_tar, test_file_name)] = test_data
                with open(test_file_path, mode="wb") as file_writer:
                    file_writer.write(test_data)
                total_size += test_file_size

        export_tarfile = BytesIO()
        metadata_filename = "metadata.json"
        test_files[os.path.join(tmpdirname, metadata_filename)] = "test".encode()
        Exporter.export_artifact(
            metadata="test".encode(),
            output_fileobj=export_tarfile,
            metadata_filename=metadata_filename,
            experiments_root=tmpdirname,
        )

        export_tarfile.seek(0)
        with tarfile.open(fileobj=export_tarfile, mode="r:gz") as tar:
            for member in tar:
                if member.isfile():
                    assert os.path.join(tmpdirname, member.name) in list(test_files.keys())
                    file = tar.extractfile(member)
                    assert file is not None
                    assert file.read() == test_files[os.path.join(tmpdirname, member.name)]
