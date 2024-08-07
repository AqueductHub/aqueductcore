# pylint: skip-file
# mypy: ignore-errors
from typing import List
from uuid import UUID, uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry import Schema

from aqueductcore.backend.context import ServerContext, UserInfo, UserScope
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.routers.graphql.mutations_schema import Mutation
from aqueductcore.backend.routers.graphql.query_schema import Query
from aqueductcore.backend.services.utils import experiment_model_to_orm
from aqueductcore.backend.settings import settings
from tests.unittests.initial_data import experiment_data


execute_extension = """
  mutation ExecuteExtension {
        executeExtension(
            extension: "Dummy extension"
            action: "echo"
            params: [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", "PLACEHOLDER"],
                ["var5", "some\\nmultiline"],
                ["var6", "TRUE"],
                ["var7", "string4"],
            ]
    ) {
        resultCode,
        stderrText, stdoutText,
        taskId, taskState
    }
  }
"""


@pytest.mark.asyncio
async def test_execute_extension_stdout_ok(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    # fixture is here to ensure that files are cleaned after execution
    temp_experiment_files,
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    exp_eid = experiment_data[0].eid
    query = execute_extension.replace("PLACEHOLDER", exp_eid)

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query,
        context_value=context,
    )
    assert resp.errors is None
    res = resp.data["executeExtension"]
    assert UUID(res["taskId"])


@pytest.mark.asyncio
async def test_execute_extension_stderr_ok(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    # fixture is here to ensure that files are cleaned after execution
    temp_experiment_files,
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    exp_eid = experiment_data[0].eid
    query = execute_extension.replace("PLACEHOLDER", exp_eid)
    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query.replace("echo", "echo_stderr"),
        context_value=context,
    )
    assert resp.errors is None
    res = resp.data["executeExtension"]
    assert UUID(res["taskId"])