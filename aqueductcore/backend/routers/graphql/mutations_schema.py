"""GraohQL Mutations Controller."""

from typing import cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.server.context import ServerContext
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentCreateInput,
    ExperimentTagInput,
    ExperimentUpdateInput,
)
from aqueductcore.backend.routers.graphql.mutations.experiment_mutations import (
    add_tag_to_experiment,
    create_experiment,
    remove_tag_from_experiment,
    update_experiment,
)
from aqueductcore.backend.routers.graphql.types import ExperimentData


@strawberry.type
class Mutation:
    """GraphQL mutations controller."""

    @strawberry.mutation
    async def create_experiment(
        self, info: Info, create_experiment_input: ExperimentCreateInput
    ) -> ExperimentData:
        """Mutation to create experiment"""

        context = cast(ServerContext, info.context)
        experiment = await create_experiment(
            db_session=context.db_session, create_experiment_input=create_experiment_input
        )
        return experiment

    @strawberry.mutation
    async def update_experiment(
        self, info: Info, experiment_id: UUID, experiment_update_input: ExperimentUpdateInput
    ) -> ExperimentData:
        """Mutation to update experiment title and description"""

        context = cast(ServerContext, info.context)
        experiment = await update_experiment(
            db_session=context.db_session,
            experiment_id=experiment_id,
            experiment_update_input=experiment_update_input,
        )
        return experiment

    @strawberry.mutation
    async def add_tag_to_experiment(
        self, info: Info, experiment_tag_input: ExperimentTagInput
    ) -> ExperimentData:
        """Mutation to add tag to experiment"""

        context = cast(ServerContext, info.context)
        experiment = await add_tag_to_experiment(
            db_session=context.db_session, experiment_tag_input=experiment_tag_input
        )
        return experiment

    @strawberry.mutation
    async def remove_tag_from_experiment(
        self, info: Info, experiment_tag_input: ExperimentTagInput
    ) -> ExperimentData:
        """Mutation to remove tag from experiment"""
        context = cast(ServerContext, info.context)
        experiment = await remove_tag_from_experiment(
            db_session=context.db_session, experiment_tag_input=experiment_tag_input
        )
        return experiment
