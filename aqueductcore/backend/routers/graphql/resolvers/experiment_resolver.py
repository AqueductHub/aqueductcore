"""GraphQL Query Controller."""

from __future__ import annotations

from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.errors import ECSValidationError
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentIdentifierInput,
    IDType,
)
from aqueductcore.backend.routers.graphql.types import ExperimentData, Experiments
from aqueductcore.backend.routers.graphql.utils import experiment_model_to_node
from aqueductcore.backend.services.experiment import (
    get_all_experiments,
    get_experiment_by_alias,
    get_experiment_by_uuid,
)
from aqueductcore.backend.services.validators import MAX_EXPERIMENTS_PER_REQUEST

if TYPE_CHECKING:
    from aqueductcore.backend.routers.graphql.query_schema import ExperimentFiltersInput


async def get_expriments(
    db_session: AsyncSession,
    offset: int,
    limit: int,
    filters: Optional[ExperimentFiltersInput] = None,
) -> Experiments:
    """Resolve all experiments."""

    if limit > MAX_EXPERIMENTS_PER_REQUEST:
        raise ECSValidationError(
            f"Maximum allowed limit for experiments is {MAX_EXPERIMENTS_PER_REQUEST}"
        )

    experiments = await get_all_experiments(
        db_session,
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
    return Experiments(experiments_data=experiment_nodes, total_experiments_count=len(experiments))


async def get_experiment(
    db_session: AsyncSession, experiment_identifier: ExperimentIdentifierInput
) -> ExperimentData:
    """Resolve a single experiment."""
    if experiment_identifier.type is IDType.UUID:
        experiment = await get_experiment_by_uuid(
            db_session, experiment_id=UUID(experiment_identifier.value)
        )
    else:
        experiment = await get_experiment_by_alias(db_session, alias=experiment_identifier.value)

    return experiment_model_to_node(experiment)
