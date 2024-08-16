import shutil
from typing import List
from uuid import UUID, uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.context import UserInfo, UserScope
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.services.extensions_executor import (
    PYTHON_BINARY,
    VENV_FOLDER,
    ExtensionsExecutor,
)
from aqueductcore.backend.services.task_executor import _update_task_info
from aqueductcore.backend.services.utils import experiment_model_to_orm
from aqueductcore.backend.settings import settings


@pytest.mark.asyncio
async def test_extension_echo(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments: List[orm.Experiment] = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    result = await ExtensionsExecutor.execute(
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
        db_session=db_session,
        experiment_uuid=db_experiments[0].uuid,
        extension="Dummy extension",
        action="echo",
        params={
            "var1": "text",
            "var2": "1",
            "var3": "2.2",
            "var4": "20240229-5689864ffd94",
            "var5": "text\narea",
            "var6": "0",
            "var7": "string2",
        },
    )
    task_info = await _update_task_info(str(result.task_id), wait=True)
    assert task_info.status == "SUCCESS"
    assert task_info.result_code == 0
    assert (
        task_info.std_out
        == """var1=text
var2=1
var3=2.2
var4=20240229-5689864ffd94
var5=text
area
var6=0
var7=string2
dummykey=dummyvalue
"""
    )
    assert task_info.std_err == ""


@pytest.mark.asyncio
async def test_extension_venv_is_created_execute(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments: List[orm.Experiment] = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    extension = ExtensionsExecutor.get_extension("Wolfram alpha solution extension")
    venv = extension.folder / VENV_FOLDER
    # make sure there is no venv
    shutil.rmtree(venv, ignore_errors=True)
    # it will fail, but after the venv creation
    try:
        await ExtensionsExecutor.execute(
            user_info=UserInfo(
                uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)
            ),
            db_session=db_session,
            experiment_uuid=db_experiments[0].uuid,
            extension="Wolfram alpha solution extension",
            action="solve as text",
            params={},
        )
    except:
        pass
    # venv is created
    assert venv.exists()
    # python is there
    assert (venv / PYTHON_BINARY).exists()
    # pip is there
    assert (venv / "bin/pip").exists()
    # assert requests are installed
    assert list(venv.glob("lib*/python*/site-packages/requests"))
    # assert requests are installed
    assert list(venv.glob("lib*/python*/site-packages/pyaqueduct"))
