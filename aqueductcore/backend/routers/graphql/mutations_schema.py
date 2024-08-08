"""GraohQL Mutations Controller."""

from typing import List, cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentCreateInput,
    ExperimentIdentifierInput,
    ExperimentRemoveInput,
    ExperimentTagInput,
    ExperimentTagsInput,
    ExperimentUpdateInput,
    IDType,
)
from aqueductcore.backend.routers.graphql.types import (
    TaskStatus,
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
    ExtensionInfo,
    KeyValuePair,
    TaskInfo,
)
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor
from aqueductcore.backend.routers.graphql.resolvers.experiment_resolver import (
    get_experiment,
)

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
    ) -> TaskInfo:
        """The endpoint accepts extension execution requests.

        Args:
            info: context, which includes database connection.
            extension: extension name.
            action: action name.
            params:
                list of pairs: [[key1, value1], [key2, value2], ...].

        Returns:
            TaskInfo: result of putting job into a queue.
        """
        dict_params = dict(params)
        context = cast(ServerContext, info.context)
        extension_object = ExtensionsExecutor.get_extension(extension)
        extension_object.aqueduct_api_token = context.user_info.token

        action_object = extension_object.get_action(action)
        exp_parameter = action_object.get_default_experiment_parameter()
        if exp_parameter is None:
            raise AQDValidationError(f"Action {extension}:{action} has no experiment parameters")
        eid = dict_params[exp_parameter.name]
        result = ExtensionsExecutor.execute(extension, action, dict_params)

        ### data population after submission
        experiment = await get_experiment(
            context,
            ExperimentIdentifierInput(
                type=IDType.EID,
                value=eid
            )
        )
        extension_info = ExtensionInfo.from_extension(extension_object)
        action_info = None
        for act_info in extension_info.actions:
            if act_info.name == action:
                action_info = act_info
                break

        parameters = []
        if action_info is not None:
            parameters = [
                KeyValuePair(
                    key=parameter,
                    value=dict_params.get(parameter.name, None)
                )
                for parameter
                in action_info.parameters
            ]

        return TaskInfo(
            task_id=result.task_id,
            experiment=experiment,
            username=context.user_info.username,
            extension_name=extension,
            action_name=action,
            parameters=parameters,
            task_status=TaskStatus(result.status),

            receive_time=result.receive_time,
            started_time=None,
            task_runtime=0.0,
            ended_time=result.ended_time,

            std_err=result.std_err,
            std_out=result.std_out,
            result_code=result.result_code,

            # TODO: remove after frontend change, obsolete field
            return_code=0,
        )

    @strawberry.mutation
    async def cancel_task(
        self,
        info: Info,
        task_id: UUID,
    ) -> TaskInfo:
        raise NotImplementedError()
