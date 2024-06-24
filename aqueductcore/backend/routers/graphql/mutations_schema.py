"""GraohQL Mutations Controller."""

import datetime
from typing import List, cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.inputs import (
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
from aqueductcore.backend.routers.graphql.types import (
    ExperimentData,
    ExtensionExecutionResult,
)
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor


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
        self,
        info: Info,
        extension: str,
        action: str,
        params: List[List[str]],
    ) -> ExtensionExecutionResult:
        """The endpoint accepts extension execution requests.

        Args:
            info: context, which includes database connection.
            extension: extension name.
            action: action name.
            params:
                list of pairs: [[key1, value1], [key2, value2], ...].

        Returns:
            ExtensionExecutionResult: result of OS process execution.
        """
        dict_params = dict(params)
        context = cast(ServerContext, info.context)
        extension_object = ExtensionsExecutor.get_extension(extension)
        action_object = extension_object.get_action(action)
        exp_parameter = action_object.get_default_experiment_parameter()
        if exp_parameter is None:
            raise AQDValidationError(f"Action {extension}:{action} has no experiment parameters")
        eid = dict_params[exp_parameter.name]

        now = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        log_filename = f"{extension}-{action}-{now}.log"

        result = action_object.execute(extension_object, dict_params, timeout=600)

        await ExtensionsExecutor.save_log_to_experiment(
            context=context,
            eid=eid,
            log_filename=log_filename,
            result=result,
        )
        return ExtensionExecutionResult(
            return_code=result.return_code,
            stdout=result.stdout,
            stderr=result.stderr,
            log_experiment=eid,
            log_file=log_filename,
        )
