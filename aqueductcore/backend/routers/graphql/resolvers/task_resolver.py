"""GraphQL Query Controller."""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentIdentifierInput,
    IDType,
    TasksFilterInput,
)
from aqueductcore.backend.routers.graphql.resolvers.experiment_resolver import (
    get_experiment,
)
from aqueductcore.backend.routers.graphql.types import TaskData, Tasks
from aqueductcore.backend.routers.graphql.utils import task_model_to_node
from aqueductcore.backend.services.task_executor import get_all_tasks, get_task_by_uuid
from aqueductcore.backend.services.validators import MAX_EXPERIMENTS_PER_REQUEST


async def get_tasks(
    context: ServerContext,
    offset: int,
    limit: int,
    filters: Optional[TasksFilterInput] = None,
) -> Tasks:
    """Resolve all tasks."""

    if limit > MAX_EXPERIMENTS_PER_REQUEST:
        raise AQDValidationError(
            f"Maximum allowed limit for experiments is {MAX_EXPERIMENTS_PER_REQUEST}"
        )

    tasks = await get_all_tasks(
        user_info=context.user_info,
        db_session=context.db_session,
        extension_name=filters.extension_name if filters else None,
        action_name=filters.action_name if filters else None,
        order_by_creation_date=True,
    )
    task_nodes = [
        task_model_to_node(
            value=item,
            experiment=await get_experiment(
                context,
                ExperimentIdentifierInput(type=IDType.UUID, value=str(item.experiment_uuid)),
            ),
        )
        for item in tasks
    ][offset : offset + limit]
    return Tasks(tasks_data=task_nodes, total_tasks_count=len(task_nodes))


async def get_task(context: ServerContext, task_id: UUID) -> Optional[TaskData]:
    """Resolve a single task."""

    task = await get_task_by_uuid(
        user_info=context.user_info,
        db_session=context.db_session,
        task_id=task_id,
    )

    experiment = await get_experiment(
        context,
        ExperimentIdentifierInput(type=IDType.UUID, value=str(task.experiment_uuid)),
    )

    return task_model_to_node(task, experiment)
