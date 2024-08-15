"""GraohQL Mutations Controller."""

from typing import cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.routers.graphql.inputs import (
    CancelTaskInput,
    ExecuteExtensionInput,
    ExperimentCreateInput,
    ExperimentRemoveInput,
    ExperimentTagInput,
    ExperimentTagsInput,
    ExperimentUpdateInput,
)
from aqueductcore.backend.routers.graphql.mutations.experiment_mutations import (
    add_tag_to_experiment,
    add_tags_to_experiment,
    create_experiment,
    remove_experiment,
    remove_tag_from_experiment,
    update_experiment,
)
from aqueductcore.backend.routers.graphql.mutations.task_mutations import (
    cancel_task,
    execute_extension,
)
from aqueductcore.backend.routers.graphql.types import ExperimentData, TaskData


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
            context=context, create_experiment_input=create_experiment_input
        )
        return experiment

    @strawberry.mutation
    async def update_experiment(
        self, info: Info, uuid: UUID, experiment_update_input: ExperimentUpdateInput
    ) -> ExperimentData:
        """Mutation to update experiment title and description"""

        context = cast(ServerContext, info.context)
        experiment = await update_experiment(
            context=context,
            experiment_uuid=uuid,
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
            context=context, experiment_tag_input=experiment_tag_input
        )
        return experiment

    @strawberry.mutation
    async def add_tags_to_experiment(
        self, info: Info, experiment_tags_input: ExperimentTagsInput
    ) -> ExperimentData:
        """Mutation to add tag to experiment"""

        context = cast(ServerContext, info.context)
        experiment = await add_tags_to_experiment(
            context=context, experiment_tags_input=experiment_tags_input
        )
        return experiment

    @strawberry.mutation
    async def remove_tag_from_experiment(
        self, info: Info, experiment_tag_input: ExperimentTagInput
    ) -> ExperimentData:
        """Mutation to remove tag from experiment"""
        context = cast(ServerContext, info.context)
        experiment = await remove_tag_from_experiment(
            context=context, experiment_tag_input=experiment_tag_input
        )
        return experiment

    @strawberry.mutation
    async def remove_experiment(
        self, info: Info, experiment_remove_input: ExperimentRemoveInput
    ) -> None:
        """Mutation to remove experiment"""
        context = cast(ServerContext, info.context)
        await remove_experiment(context=context, experiment_remove_input=experiment_remove_input)

    @strawberry.mutation
    async def execute_extension(
        self, info: Info, execute_extension_input: ExecuteExtensionInput
    ) -> TaskData:
        """The endpoint accepts extension execution requests."""
        return await execute_extension(
            context=cast(ServerContext, info.context),
            execute_extension_input=execute_extension_input,
        )

    @strawberry.mutation
    async def cancel_task(self, info: Info, cancel_task_input: CancelTaskInput) -> TaskData:
        """Send cancellation signal to a task and return task status."""
        return await cancel_task(cast(ServerContext, info.context), cancel_task_input)
