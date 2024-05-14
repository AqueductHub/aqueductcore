"""GraohQL Mutations Controller."""

from typing import List, cast
from uuid import UUID

import datetime
import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
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
from aqueductcore.backend.services.plugin_executor import PluginExecutor
from aqueductcore.backend.routers.graphql.types import ExperimentData, PluginExecutionResult
from aqueductcore.backend.errors import AQDValidationError

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
        self, info: Info, experiment_id: UUID, experiment_update_input: ExperimentUpdateInput
    ) -> ExperimentData:
        """Mutation to update experiment title and description"""

        context = cast(ServerContext, info.context)
        experiment = await update_experiment(
            context=context,
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
    async def execute_plugin(
            self,
            info: Info,
            plugin: str,
            function: str,
            params: List[List[str]],
    ) -> PluginExecutionResult:
        """The endpoint accepts plugin execution requests.

        Args:
            info (Info): context, which includes database connection.
            plugin (str): plugin name.
            function (str): function name.
            params (List[List[str]]):
                list of pairs: [[key1, value1], [key2, value2], ...].

        Returns:
            PluginExecutionResult: result of OS process execution.
        """
        dict_params = dict(params)
        context = cast(ServerContext, info.context)
        plugin_object = PluginExecutor.get_plugin(plugin)
        function_object = plugin_object.get_function(function)
        exp_parameter = function_object.get_default_experiment_parameter()
        if exp_parameter is None:
            raise AQDValidationError(f"Function {plugin}/{function} has no experiment parameters")
        exp_id = dict_params[exp_parameter.name]

        now = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        log_filename = f"{plugin}-{function}-{now}.log"

        result = function_object.execute(plugin_object, dict_params, timeout=600)

        await PluginExecutor.save_log_to_experiment(
            context=context,
            experiment_id=exp_id,
            log_filename=log_filename,
            result=result,
        )
        return PluginExecutionResult(
            return_code=result.return_code,
            stdout=result.stdout,
            stderr=result.stderr,
            log_experiment=exp_id,
            log_file=log_filename,
        )
