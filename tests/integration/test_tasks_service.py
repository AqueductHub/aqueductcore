from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timedelta
from typing import List, Set
from uuid import UUID

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from aqueductcore.backend.context import UserInfo, UserScope
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.models.task import TaskCreate
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor
from aqueductcore.backend.services.task_executor import get_all_tasks
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
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
    ],
)
async def test_get_all_tasks_no_filters(
    my_db_session,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    tasks = await get_all_tasks(user_info=user_info, db_session=my_db_session)

    assert len(tasks) == 80


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
    ],
)
async def test_get_all_tasks_experiment_filter(
    my_db_session,
    experiments_data,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    tasks = await get_all_tasks(
        user_info=user_info,
        db_session=my_db_session,
        experiment_uuid=experiments_data[0].uuid,
    )

    assert len(tasks) == 2


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
    ],
)
async def test_get_all_tasks_extension_filter(
    my_db_session,
    experiments_data,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    tasks = await get_all_tasks(
        user_info=user_info, db_session=my_db_session, extension_name="dummy extension two"
    )

    assert len(tasks) == 40
    assert all(task.extension_name == "dummy extension two" for task in tasks)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
    ],
)
async def test_get_all_tasks_action_filter(
    my_db_session,
    experiments_data,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    tasks = await get_all_tasks(
        user_info=user_info, db_session=my_db_session, action_name="dummy action two"
    )

    assert len(tasks) == 40
    assert all(task.action_name == "dummy action two" for task in tasks)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
    ],
)
async def test_get_all_tasks_username_filter(
    my_db_session,
    experiments_data,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    tasks = await get_all_tasks(user_info=user_info, db_session=my_db_session, username="admin")

    assert len(tasks) == 28
    assert all(task.created_by_username == "admin" for task in tasks)
