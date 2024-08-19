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
  mutation ExecuteExtension($ext: String!, $act: String!, $params: [[String!]!]!) {
        executeExtension(
            extension: $ext
            action: $act
            params: $params
    ) {
        resultCode,
        stdErr, stdOut,
        taskId, taskStatus
    }
  }
"""


revoke_task = """
mutation CancelTask($taskId: UUID!) {
    cancelTask(
        taskId: $taskId
    ) {
        taskId,
        taskStatus
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
        variable_values={
            "ext": "Dummy extension",
            "act": "echo",
            "params": [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", exp_eid],
                ["var5", "some\\nmultiline"],
                ["var6", "TRUE"],
                ["var7", "string4"],
            ],
        },
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
        query=query,
        variable_values={
            "ext": "Dummy extension",
            "act": "echo_stderr",
            "params": [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", exp_eid],
                ["var5", "some\\nmultiline"],
                ["var6", "TRUE"],
                ["var7", "string4"],
            ],
        },
        context_value=context,
    )
    assert resp.errors is None
    res = resp.data["executeExtension"]
    assert UUID(res["taskId"])


@pytest.mark.asyncio
async def test_cancel_task_ok(
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
        query=query,
        variable_values={
            "ext": "Qiskit simulator",
            "act": "Plot measurement shot distribution",
            "params": [
                ["experiment", exp_eid],
                ["shots_file", "123.txt"],
                ["width", "1000"],
                ["height", "800"],
                ["image_file", "123.png"],
            ],
        },
        context_value=context,
    )
    taskId = UUID(resp.data["executeExtension"]["taskId"])
    assert isinstance(taskId, UUID)
    resp = await schema.execute(
        query=revoke_task,
        variable_values={"taskId": str(taskId)},
        context_value=context,
    )

    res = resp.data["cancelTask"]
    assert UUID(res["taskId"])

    # TODO: if we don't wait, most probably this status
    # will be "PENDING", so after a cycle of waiting this will update
    # to "REVOKED"
    # assert res["taskStatus"] == "REVOKED"
