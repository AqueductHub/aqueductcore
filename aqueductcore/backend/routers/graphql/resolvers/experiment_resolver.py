"""GraphQL Query Controller."""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentFiltersInput,
    ExperimentIdentifierInput,
    IDType,
)
from aqueductcore.backend.routers.graphql.types import (
    ExperimentData,
    Experiments,
    UserInfo,
    experiment_model_to_node,
    experiments_node,
)
from aqueductcore.backend.services.experiment import (
    get_all_experiments,
    get_experiment_by_eid,
    get_experiment_by_uuid,
)
from aqueductcore.backend.services.validators import MAX_EXPERIMENTS_PER_REQUEST


def get_current_user_info(
    context: ServerContext,
) -> UserInfo:
    """Resolve all experiments."""

    return UserInfo(
        username=context.user_info.username,
        scopes=[scope.value for scope in context.user_info.scopes],
    )


async def get_expriments(
    context: ServerContext,
    offset: int,
    limit: int,
    filters: Optional[ExperimentFiltersInput] = None,
) -> Experiments:
    """Resolve all experiments."""

    if limit > MAX_EXPERIMENTS_PER_REQUEST:
        raise AQDValidationError(
            f"Maximum allowed limit for experiments is {MAX_EXPERIMENTS_PER_REQUEST}"
        )

    experiments = await get_all_experiments(
        user_info=context.user_info,
        db_session=context.db_session,
        title_filter=filters.title if filters else None,
        tags=filters.tags if filters else None,
        should_include_tags=filters.should_include_tags if filters else None,
        start_date=filters.start_date if filters else None,
        end_date=filters.end_date if filters else None,
        order_by_creation_date=True,
    )
    experiment_nodes = [experiment_model_to_node(item) for item in experiments][
        offset : offset + limit
    ]
    return experiments_node(experiment_nodes, len(experiments))


async def get_experiment(
    context: ServerContext, experiment_identifier: ExperimentIdentifierInput
) -> ExperimentData:
    """Resolve a single experiment."""
    if experiment_identifier.type is IDType.UUID:
        experiment = await get_experiment_by_uuid(
            user_info=context.user_info,
            db_session=context.db_session,
            experiment_uuid=UUID(experiment_identifier.value),
        )
    else:
        experiment = await get_experiment_by_eid(
            user_info=context.user_info,
            db_session=context.db_session,
            eid=experiment_identifier.value,
        )

    return experiment_model_to_node(experiment)
