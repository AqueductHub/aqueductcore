# pylint: skip-file

import os
import random
import tarfile
from datetime import datetime
from io import BytesIO
from tempfile import TemporaryDirectory
from typing import Dict, List
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

import aqueductcore
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.settings import settings
from aqueductcore.cli.exporter import Exporter
from aqueductcore.cli.importer import Importer
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment, Tag, User


def test_check_version_compatible():

    max_rand = 100
    assert (
        Importer.check_version_compatible(
            f"1.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
            f"2.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
        )
        == False
    )
    assert (
        Importer.check_version_compatible(
            f"1.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
            f"1.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
        )
        == True
    )
    for _ in range(1000):
        major1 = random.randrange(0, 5)
        major2 = random.randrange(0, 5)
        res = Importer.check_version_compatible(
            f"{major1}.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
            f"{major2}.{random.randrange(0,max_rand)}.{random.randrange(0,max_rand)}",
        )
        assert res == (True if major1 == major2 else False)


def test_import_experiments_metadata(db_session: Session, experiments_data: List[ExperimentCreate]):

    expected_metadata = AqueductData(
        version=aqueductcore.__version__, variant=AqueductVariant.CORE, users=[]
    )
    for _ in range(10):  ## TODO
        metauser = User(uuid=uuid4(), username=settings.default_username, experiments=[])

        for experiment in experiments_data:
            metauser.experiments.append(
                Experiment(
                    uuid=uuid4(),
                    title=experiment.title,
                    eid=str(uuid4()),
                    description=experiment.description,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                    tags=[Tag(key=item.key, name=item.name) for item in experiment.tags],
                )
            )
        expected_metadata.users.append(metauser)

    Importer.import_experiments_metadata(db_session=db_session, metadata=expected_metadata)

    db_session.commit()  # needed to replicate autocommit feature session.

    users_statement = select(orm.User)
    db_users = db_session.execute(users_statement).scalars().all()

    assert len(db_users) == len(expected_metadata.users)
    for exp_user in expected_metadata.users:
        user_res = [item for item in db_users if item.id == exp_user.uuid]
        assert len(user_res) == 1
        db_user = user_res[0]
        assert db_user.username == exp_user.username
        for exp_exp in exp_user.experiments:
            exp_res = [item for item in db_user.experiments if item.id == exp_exp.uuid]
            assert len(exp_res) == 1
            db_experiment = exp_res[0]
            assert db_experiment.alias == exp_exp.eid
            assert db_experiment.created_at == exp_exp.created_at
            assert db_experiment.updated_at == exp_exp.updated_at
            assert db_experiment.title == exp_exp.title
            assert db_experiment.description == exp_exp.description
            assert {tag.key: tag.name for tag in db_experiment.tags} == {
                tag.key: tag.name for tag in exp_exp.tags
            }  # this assertion should be ok for pre-existing tags with different case.


def test_import_artifact():

    with TemporaryDirectory() as tmprootdir:
        with TemporaryDirectory() as tmpdirname:
            test_tarfile = BytesIO()
            test_files = {}
            with tarfile.open(mode="w:gz", fileobj=test_tarfile) as tar:
                total_size = 0
                for _ in range(10):
                    eid = uuid4()
                    experiment_dir = os.path.join(tmpdirname, f"{eid}")
                    experiment_dir_in_tar = os.path.join(
                        Exporter.EXPERIMENTS_BASE_DIR_NAME, f"{eid}"
                    )
                    os.mkdir(experiment_dir)
                    for file_idx in range(10):
                        test_file_size = 100
                        test_file_name = f"test_file_{file_idx}"
                        test_file_path = os.path.join(experiment_dir, test_file_name)
                        test_data = bytes(bytearray(os.urandom(test_file_size)))
                        test_files[
                            os.path.join(
                                tmprootdir,
                                f"{eid}",
                                test_file_name,
                            )
                        ] = test_data
                        with open(test_file_path, mode="wb") as file_writer:
                            file_writer.write(test_data)
                        total_size += test_file_size
                    tar.add(
                        name=experiment_dir,
                        arcname=experiment_dir_in_tar,
                    )

            test_tarfile.seek(0)

            with tarfile.open(fileobj=test_tarfile, mode="r:gz") as tar:
                Importer.import_experiment_files(tar=tar, experiments_root=tmprootdir)

                for filename, content in test_files.items():
                    with open(filename, mode="rb") as file_reader:
                        assert file_reader.read() == content
