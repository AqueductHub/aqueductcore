from __future__ import annotations

from copy import deepcopy
from pathlib import Path
from typing import List, Set
from unittest import mock

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from aqueductcore.backend.context import UserInfo, UserScope
from aqueductcore.backend.errors import AQDPermission, AQDValidationError
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.models.task import SupportedTypes, TaskCreate
from aqueductcore.backend.services.extensions import (
    Extension,
    ExtensionAction,
    ExtensionParameter,
)
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor
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
    "scope,user_number,experiment_number",
    [
        (Scopes.admin_scope(), 0, 0),
        (Scopes.admin_scope(), 0, 1),
        (Scopes.admin_scope(), 0, 2),
        (Scopes.manager_scope(), 1, 1),
        (Scopes.user_scope(), 2, 2),
    ],
)
async def test_user_can_submit_a_job(
    my_db_session,
    experiments_data,
    users_data: List[orm.User],
    scope: Set[UserScope],
    user_number: int,
    experiment_number: int,
):
    user_info = UserInfo(
        uuid=users_data[user_number].uuid,
        username=users_data[user_number].username,
        scopes=scope,
    )

    with mock.patch.object(ExtensionsExecutor, "list_extensions") as mock_helper:
        mock_helper.return_value = [
            Extension(
                name="dummy extension",
                authors="",
                aqueduct_url="",
                actions=[
                    ExtensionAction(
                        name="dummy action",
                        script="",
                        parameters=[
                            ExtensionParameter(
                                name="experiment",
                                description="exp1",
                                data_type=SupportedTypes.EXPERIMENT,
                            )
                        ],
                    )
                ],
            )
        ]
        mock_helper.return_value[0]._folder = Path.home()

        # propagates to validation!
        with pytest.raises(AQDValidationError):
            job = await ExtensionsExecutor.execute(
                user_info=user_info,
                db_session=my_db_session,
                experiment_uuid=experiments_data[experiment_number].uuid,
                extension="dummy extension",
                action="dummy action",
                params={},
            )


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "scope,user_number",
    [
        (Scopes.manager_scope(), 1),
        (Scopes.mighty_user_scope(), 2),
        (Scopes.user_scope(), 2),
        (Scopes.blind_jobs_scope(), 2),
        (Scopes.blind_experiments_scope(), 2),
    ],
)
async def test_user_cannot_submit_a_job(
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

    with mock.patch.object(ExtensionsExecutor, "list_extensions") as mock_helper:
        mock_helper.return_value = [
            Extension(
                name="dummy extension",
                authors="",
                aqueduct_url="",
                actions=[
                    ExtensionAction(
                        name="dummy action",
                        script="",
                        parameters=[
                            ExtensionParameter(
                                name="experiment",
                                description="exp1",
                                data_type=SupportedTypes.EXPERIMENT,
                            )
                        ],
                    )
                ],
            )
        ]
        mock_helper.return_value[0]._folder = Path.home()

        # propagates to validation
        with pytest.raises(AQDPermission):
            job = await ExtensionsExecutor.execute(
                user_info=user_info,
                db_session=my_db_session,
                experiment_uuid=experiments_data[0].uuid,
                extension="dummy extension",
                action="dummy action",
                params={},
            )
