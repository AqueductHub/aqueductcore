# pylint: skip-file

import os
import tarfile
from datetime import datetime
from io import BytesIO
from tempfile import TemporaryDirectory
from typing import List
from uuid import uuid4

from sqlalchemy.orm import Session

import aqueductcore
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.settings import settings
from aqueductcore.cli.exporter import Exporter
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment, Tag, User


def test_export_experiments_metadata(db_session: Session, experiments_data: List[ExperimentCreate]):

    expected_metadata = AqueductData(
        version=aqueductcore.__version__, variant=AqueductVariant.CORE, users=[]
    )
    for _ in range(10):  ## TODO
        metauser = User(uuid=uuid4(), username=settings.default_username, experiments=[])
        db_user = orm.User(id=metauser.uuid, username=metauser.username)
        for experiment in experiments_data:
            new_experiment = Experiment(
                uuid=uuid4(),
                title=experiment.title,
                eid=str(uuid4()),
                description=experiment.description,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                tags=[Tag(key=item.key, name=item.name) for item in experiment.tags],
            )
            metauser.experiments.append(new_experiment)
            db_experiment = orm.Experiment(
                id=new_experiment.uuid,
                title=new_experiment.title,
                description=new_experiment.description,
                alias=new_experiment.eid,
            )
            db_experiment.tags.extend(
                [orm.Tag(key=item.key, name=item.name) for item in new_experiment.tags]
            )
            db_user.experiments.append(db_experiment)

    db_session.commit()

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

        assert Exporter.get_size(tmpdirname) == total_size


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
        test_files[os.path.join(tmpdirname, Exporter.METADATA_FILENAME)] = "test".encode()
        with tarfile.open(mode="w:gz", fileobj=export_tarfile) as tar:
            Exporter.export_archive(
                metadata_bytes="test".encode(),
                tar=tar,
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
