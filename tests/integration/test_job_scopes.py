from __future__ import annotations

from copy import deepcopy
from typing import List, Set
from uuid import UUID

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from aqueductcore.backend.context import UserInfo, UserScope
from aqueductcore.backend.errors import AQDDBTaskNonExisting, AQDPermission
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.models.task import TaskCreate
from aqueductcore.backend.services.task_executor import (
    get_all_tasks,
    get_task_by_uuid,
    revoke_task,
)
from aqueductcore.backend.services.utils import (
    experiment_model_to_orm,
    task_model_to_orm,
)
from tests.conftest import Scopes

SQLITE_CONNECTION_STRING = "sqlite+aiosqlite:///:memory:"
jobs_async_engine = create_async_engine(SQLITE_CONNECTION_STRING)
jobs_async_session = async_sessionmaker(
    bind=jobs_async_engine,
    expire_on_commit=False,
)


@pytest_asyncio.fixture
async def my_db_session(
    experiments_data: List[ExperimentCreate],
    tasks_data: List[TaskCreate],
    users_data: List[orm.User],
):
    """Session for SQLAlchemy."""

    async with jobs_async_session() as session:
        async with jobs_async_engine.begin() as conn:
            await conn.run_sync(orm.Base.metadata.create_all)
            await fill_db_session(
                session,
                deepcopy(experiments_data),
                deepcopy(tasks_data),
                deepcopy(users_data),
            )

        yield session

    async with jobs_async_engine.begin() as conn:
        await conn.run_sync(orm.Base.metadata.drop_all)

    await jobs_async_engine.dispose()


async def fill_db_session(
    session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    tasks_data: List[TaskCreate],
    users_data: List[orm.User],
):
    """Fixture to connect with DB."""
    for user in users_data:
        session.add(user)

    for i, experiment in enumerate(experiments_data):
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by = users_data[i % len(users_data)].uuid
        db_experiment.created_by_user = users_data[i % len(users_data)]
        session.add(db_experiment)

    for i, task in enumerate(tasks_data):
        db_task = task_model_to_orm(task)
        session.add(db_task)
    return session


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number,count",
    [
        # see everything
        (Scopes.admin_scope(), 0, 80),
        (Scopes.manager_scope(), 1, 80),
        # see everything inside its experiment
        (Scopes.mighty_user_scope(), 2, 26),
        # see only self-created self-started
        (Scopes.user_scope(), 2, 13),
        # should also make you blind
        (Scopes.blind_experiments_scope(), 2, 0),
    ],
)
async def test_user_can_see_allowed_tasks(
    my_db_session,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
    count: int,
):
    tasks = await get_all_tasks(
        user_info=UserInfo(
            uuid=users_data[user_number].uuid,
            username=users_data[user_number].username,
            scopes=scope,
        ),
        db_session=my_db_session,
    )
    assert len(tasks) == count


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number,count",
    [
        (Scopes.blind_jobs_scope(), 2, 0),
    ],
)
async def test_user_cannot_see_disallowed_tasks(
    my_db_session,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
    count: int,
):
    with pytest.raises(AQDPermission):
        await get_all_tasks(
            user_info=UserInfo(
                uuid=users_data[user_number].uuid,
                username=users_data[user_number].username,
                scopes=scope,
            ),
            db_session=my_db_session,
        )


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number,can_see",
    [
        # see everything
        (Scopes.admin_scope(), 0, True),
        (Scopes.manager_scope(), 1, True),
        # see everything inside its experiment
        (Scopes.mighty_user_scope(), 2, False),
        # see only self-created self-started
        (Scopes.user_scope(), 2, False),
        # TODO: not having access to experiment::own
        # should also make you blind
        (Scopes.blind_experiments_scope(), 2, False),
    ],
)
async def test_user_can_see_a_task(
    my_db_session,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
    can_see: bool,
):
    task_id = UUID(int=1001)
    if can_see:
        task = await get_task_by_uuid(
            task_id=task_id,
            user_info=UserInfo(
                uuid=users_data[user_number].uuid,
                username=users_data[user_number].username,
                scopes=scope,
            ),
            db_session=my_db_session,
        )
        assert task.uuid == str(task_id)
    else:
        with pytest.raises(AQDPermission):
            await get_task_by_uuid(
                task_id=task_id,
                user_info=UserInfo(
                    uuid=users_data[user_number].uuid,
                    username=users_data[user_number].username,
                    scopes=scope,
                ),
                db_session=my_db_session,
            )


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number,task_number,result",
    [
        # can cancel everything
        (Scopes.admin_scope(), 0, 0, True),
        (Scopes.admin_scope(), 0, 1, True),
        (Scopes.admin_scope(), 0, 2, True),
        # can cancel own
        (Scopes.manager_scope(), 1, 0, False),
        (Scopes.manager_scope(), 1, 1, True),
        # can cancel own
        (Scopes.user_scope(), 2, 2, True),
        (Scopes.user_scope(), 2, 3, False),
    ],
)
async def test_user_can_cancel_tasks(
    my_db_session,
    users_data: List[orm.User],
    tasks_data: List[TaskCreate],
    scope: Set[UserScope],
    user_number: int,
    task_number: int,
    result: bool,
):
    if result == False:
        with pytest.raises((AQDPermission, AQDDBTaskNonExisting)):
            await revoke_task(
                user_info=UserInfo(
                    uuid=users_data[user_number].uuid,
                    username=users_data[user_number].username,
                    scopes=scope,
                ),
                db_session=my_db_session,
                task_id=tasks_data[task_number].uuid,
                terminate=False,
            )
    else:
        task = await revoke_task(
            user_info=UserInfo(
                uuid=users_data[user_number].uuid,
                username=users_data[user_number].username,
                scopes=scope,
            ),
            db_session=my_db_session,
            task_id=tasks_data[task_number].uuid,
            terminate=False,
        )
        assert task.uuid == tasks_data[task_number].uuid
