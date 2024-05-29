# pylint: skip-file
"""Common test fixtures"""


import os
from contextlib import contextmanager
from datetime import datetime
from tempfile import TemporaryDirectory
from typing import Dict, Generator, List, Tuple
from uuid import uuid4

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

import aqueductcore
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.settings import settings
from aqueductcore.cli.exporter import Exporter
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment, Tag, User

sync_engine = create_engine("sqlite:///:memory:")

sync_session = sessionmaker(bind=sync_engine, expire_on_commit=False, autoflush=False)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Returns database session for SQLAlchemy ORM."""
    with sync_session() as session:
        try:
            yield session
        finally:
            session.close()


@pytest.fixture
def db_session():
    """Session for SQLAlchemy."""
    with sync_session() as session:
        orm.Base.metadata.create_all(sync_engine)

        yield session

        orm.Base.metadata.drop_all(sync_engine)


@contextmanager
def temp_experiments(
    db_session: Session, experiments_data: List[ExperimentCreate]
) -> Generator[Tuple[AqueductData, Dict, str], None, None]:
    expected_metadata = AqueductData(
        version=aqueductcore.__version__, variant=AqueductVariant.CORE, users=[]
    )

    with TemporaryDirectory() as tmpdirname:
        total_size = 0
        tar_files_expected = {}

        for _ in range(1):
            metauser = User(uuid=uuid4(), username=settings.default_username, experiments=[])
            db_user = orm.User(id=metauser.uuid, username=metauser.username)
            for experiment in experiments_data:
                new_experiment = Experiment(
                    uuid=uuid4(),
                    title=experiment.title,
                    eid=str(uuid4()),
                    description=experiment.description,
                    created_at=datetime.now().replace(microsecond=0),
                    updated_at=datetime.now().replace(microsecond=0),
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

                # create experiment files
                experiment_dir = os.path.join(tmpdirname, f"{str(new_experiment.uuid)}")
                experiment_dir_in_tar = os.path.join(
                    Exporter.EXPERIMENTS_BASE_DIR_NAME, f"{str(new_experiment.uuid)}"
                )
                os.mkdir(experiment_dir)
                for file_idx in range(1):
                    test_file_size = 100
                    test_file_name = f"test_file_{file_idx}"
                    test_file_path = os.path.join(experiment_dir, test_file_name)
                    test_data = bytes(bytearray(os.urandom(test_file_size)))
                    tar_files_expected[os.path.join(experiment_dir_in_tar, test_file_name)] = (
                        test_data
                    )
                    with open(test_file_path, mode="wb") as file_writer:
                        file_writer.write(test_data)
                    total_size += test_file_size
            db_session.add(db_user)
            db_session.commit()
            expected_metadata.users.append(metauser)
        tar_files_expected[Exporter.METADATA_FILENAME] = expected_metadata.model_dump_json(
            indent=2
        ).encode(encoding="utf-8")

        yield (expected_metadata, tar_files_expected, tmpdirname)
