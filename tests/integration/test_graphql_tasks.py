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

single_task_query = """
query MyQuery($taskId: UUID!) {
  task(taskId: $taskId) {
    actionName
    endedAt
    extensionName
    parameters {
      key {
        dataType
        defaultValue
        description
        displayName
        name
        options
      }
      value
    }
    experiment {
        uuid
    }
    receivedAt
    resultCode
    stdErr
    stdOut
    taskId
    taskStatus
    createdBy
  }
}
"""

all_tasks_query = """
{
  tasks (limit: 100, offset: 0) {
    tasksData {
      actionName
      endedAt
      taskStatus
      taskId
      stdOut
      stdErr
      resultCode
      receivedAt
      createdBy
      parameters {
        value
        key {
          dataType
          defaultValue
          description
          displayName
          name
          options
        }
      }
      extensionName
      experiment {
        uuid
      }
    }
  }
}
"""

all_tasks_query_filter_by_action_name = """
query MyQuery($actionName: String!) {
  tasks(limit: 100, offset: 0, filters: {actionName: $actionName}) {
    tasksData {
      taskStatus
      taskId
      stdOut
      stdErr
      resultCode
      receivedAt
      createdBy
      parameters {
        key {
          options
          name
          displayName
          description
          defaultValue
          dataType
        }
        value
      }
      extensionName
      experiment {
        uuid
      }
      actionName
      endedAt
    }
  }
}
"""


all_tasks_query_filter_by_extension_name = """
query MyQuery($extensionName: String!) {
  tasks(limit: 100, offset: 0, filters: {extensionName: $extensionName}) {
    tasksData {
      taskStatus
      taskId
      stdOut
      stdErr
      resultCode
      receivedAt
      parameters {
        key {
          options
          name
          displayName
          description
          defaultValue
          dataType
        }
        value
      }
      extensionName
      experiment {
        uuid
      }
      actionName
      endedAt
    }
  }
}
"""

all_tasks_query_filter_by_username = """
query MyQuery( $username: String!) {
  tasks(limit: 100, offset: 0, filters: {username: $username}) {
    tasksData {
      taskStatus
      taskId
      stdOut
      stdErr
      resultCode
      receivedAt
      createdBy
      parameters {
        key {
          options
          name
          displayName
          description
          defaultValue
          dataType
        }
        value
      }
      extensionName
      experiment {
        uuid
      }
      actionName
      endedAt
    }
  }
}
"""

all_tasks_query_filter_by_experiment_uuid = """
query MyQuery($type: IDType = UUID, $value: String!) {
  tasks(limit: 100, offset: 0, filters: {experiment: {type: $type, value: $value}}) {
    tasksData {
      taskStatus
      taskId
      stdOut
      stdErr
      resultCode
      receivedAt
      parameters {
        key {
          options
          name
          displayName
          description
          defaultValue
          dataType
        }
        value
      }
      extensionName
      experiment {
        uuid
      }
      actionName
      endedAt
    }
  }
}
"""


all_extensions_query = """
query MyQuery {
  extensions {
    name
    description
    authors
    actions {
      parameters {
        options
        name
        displayName
        description
        dataType
        defaultValue
      }
      name
      description
      experimentVariableName
    }
  }
}
"""

execute_extension_mutation = """
mutation MyMutation($action: String!, $experimentUuid: UUID!, $extension: String!, $params: [[String!]!]!) {
  executeExtension(
    executeExtensionInput: {experimentUuid: $experimentUuid, extension: $extension, action: $action, params: $params}
  ) {
    actionName
    endedAt
    experiment {
      uuid
    }
    extensionName
    parameters {
      value
      key {
        options
        name
        displayName
        description
        defaultValue
        dataType
      }
    }
    receivedAt
    resultCode
    stdErr
    stdOut
    taskId
    taskStatus
    createdBy
  }
}
"""

cancel_task_mutation = """
mutation MyMutation($taskId: UUID!) {
  cancelTask(cancelTaskInput: {taskId: $taskId}) {
    actionName
    endedAt
    receivedAt
    resultCode
    stdErr
    stdOut
    taskId
    taskStatus
    createdBy
    parameters {
      value
      key {
        options
        name
        displayName
        description
        defaultValue
        dataType
      }
    }
    extensionName
    experiment {
      uuid
    }
  }
}
"""


@pytest.mark.asyncio
async def test_execute_extension(
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

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        execute_extension_mutation,
        variable_values={
            "extension": "Dummy extension",
            "action": "echo",
            "experimentUuid": str(db_experiments[0].uuid),
            "params": [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", experiments_data[0].eid],
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
    assert res["taskStatus"] in ("SUCCESS", "STARTED", "PENDING")


@pytest.mark.asyncio
async def test_cancel_task(
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

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=db_user.uuid, username=db_user.username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query=execute_extension_mutation,
        variable_values={
            "extension": "Dummy extension",
            "action": "echo",
            "experimentUuid": str(db_experiments[0].uuid),
            "params": [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", experiments_data[0].eid],
                ["var5", "some\\nmultiline"],
                ["var6", "TRUE"],
                ["var7", "string4"],
            ],
        },
        context_value=context,
    )
    taskId = UUID(resp.data["executeExtension"]["taskId"])
    assert isinstance(taskId, UUID)
    resp = await schema.execute(
        query=cancel_task_mutation,
        variable_values={"taskId": str(taskId)},
        context_value=context,
    )

    res = resp.data["cancelTask"]
    assert UUID(res["taskId"])

    # TODO: if we don't wait, most probably this status
    # will be "PENDING", so after a cycle of waiting this will update
    # to "REVOKED"
    # assert res["taskStatus"] == "REVOKED"


@pytest.mark.asyncio
async def test_query_all_tasks(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
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

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=db_user.uuid, username=db_user.username, scopes=set(UserScope)),
    )

    # run tasks
    task_ids = []
    for idx in range(10):
        resp = await schema.execute(
            query=execute_extension_mutation,
            variable_values={
                "extension": "Dummy extension",
                "action": "echo",
                "experimentUuid": str(db_experiments[idx].uuid),
                "params": [
                    ["var1", "abc"],
                    ["var2", "111"],
                    ["var3", "1.33e+03"],
                    ["var4", experiments_data[idx].eid],
                    ["var5", "some\\nmultiline"],
                    ["var6", "TRUE"],
                    ["var7", "string4"],
                ],
            },
            context_value=context,
        )
        taskId = UUID(resp.data["executeExtension"]["taskId"])
        task_ids.append(taskId)

    resp = await schema.execute(all_tasks_query, context_value=context)

    assert resp.errors is None
    resp_task_ids = [UUID(task["taskId"]) for task in resp.data["tasks"]["tasksData"]]
    assert set(resp_task_ids) == set(task_ids)


@pytest.mark.asyncio
async def test_query_all_tasks_filter_by_action_name(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
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

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=db_user.uuid, username=db_user.username, scopes=set(UserScope)),
    )

    # run tasks
    task_ids = []
    for idx in range(10):
        resp = await schema.execute(
            query=execute_extension_mutation,
            variable_values={
                "extension": "Dummy extension",
                "action": "echo",
                "experimentUuid": str(db_experiments[idx].uuid),
                "params": [
                    ["var1", "abc"],
                    ["var2", "111"],
                    ["var3", "1.33e+03"],
                    ["var4", experiments_data[idx].eid],
                    ["var5", "some\\nmultiline"],
                    ["var6", "TRUE"],
                    ["var7", "string4"],
                ],
            },
            context_value=context,
        )
        taskId = UUID(resp.data["executeExtension"]["taskId"])
        task_ids.append(taskId)

    resp = await schema.execute(
        all_tasks_query_filter_by_action_name,
        context_value=context,
        variable_values={"actionName": "echo"},
    )

    assert resp.errors is None
    resp_task_ids = [UUID(task["taskId"]) for task in resp.data["tasks"]["tasksData"]]
    assert set(resp_task_ids) == set(task_ids)
    users = [task["createdBy"] for task in resp.data["tasks"]["tasksData"]]
    assert set(users) == {db_user.username}


@pytest.mark.asyncio
async def test_query_all_tasks_filter_by_extension_name(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
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

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=db_user.uuid, username=db_user.username, scopes=set(UserScope)),
    )

    # run tasks
    task_ids = []
    for idx in range(10):
        resp = await schema.execute(
            query=execute_extension_mutation,
            variable_values={
                "extension": "Dummy extension",
                "action": "echo",
                "experimentUuid": str(db_experiments[idx].uuid),
                "params": [
                    ["var1", "abc"],
                    ["var2", "111"],
                    ["var3", "1.33e+03"],
                    ["var4", experiments_data[idx].eid],
                    ["var5", "some\\nmultiline"],
                    ["var6", "TRUE"],
                    ["var7", "string4"],
                ],
            },
            context_value=context,
        )
        taskId = UUID(resp.data["executeExtension"]["taskId"])
        task_ids.append(taskId)

    resp = await schema.execute(
        all_tasks_query_filter_by_extension_name,
        context_value=context,
        variable_values={"extensionName": "Dummy extension"},
    )

    assert resp.errors is None
    resp_task_ids = [UUID(task["taskId"]) for task in resp.data["tasks"]["tasksData"]]
    assert set(resp_task_ids) == set(task_ids)


@pytest.mark.asyncio
async def test_query_all_tasks_filter_by_username(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):

    db_user0 = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_user1 = orm.User(uuid=UUID(int=1), username="user")
    db_user2 = orm.User(uuid=UUID(int=2), username="stranger")
    db_session.add(db_user0)
    db_session.add(db_user1)
    db_session.add(db_user2)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user0
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    # run tasks
    task_ids = []
    for idx in range(10):
        context = ServerContext(
            db_session=db_session,
            user_info=UserInfo(
                uuid=db_user0.uuid, username=db_user0.username, scopes=set(UserScope)
            ),
        )
        if idx > 7:
            context = ServerContext(
                db_session=db_session,
                user_info=UserInfo(
                    uuid=db_user1.uuid, username=db_user1.username, scopes=set(UserScope)
                ),
            )
        resp = await schema.execute(
            query=execute_extension_mutation,
            variable_values={
                "extension": "Dummy extension",
                "action": "echo",
                "experimentUuid": str(db_experiments[idx].uuid),
                "params": [
                    ["var1", "abc"],
                    ["var2", "111"],
                    ["var3", "1.33e+03"],
                    ["var4", experiments_data[idx].eid],
                    ["var5", "some\\nmultiline"],
                    ["var6", "TRUE"],
                    ["var7", "string4"],
                ],
            },
            context_value=context,
        )
        taskId = UUID(resp.data["executeExtension"]["taskId"])
        if idx <= 7:
            task_ids.append(taskId)

    resp = await schema.execute(
        all_tasks_query_filter_by_username,
        context_value=context,
        variable_values={"username": settings.default_username},
    )

    assert resp.errors is None
    resp_task_ids = [UUID(task["taskId"]) for task in resp.data["tasks"]["tasksData"]]
    assert set(resp_task_ids) == set(task_ids)
