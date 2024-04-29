"""GraohQL Mutations Controller."""

from typing import List, cast
from uuid import UUID

import os
import datetime
import pathvalidate
import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.routers.graphql.inputs import (
    ExperimentCreateInput,
    ExperimentRemoveInput,
    ExperimentTagInput,
    ExperimentUpdateInput,
)
from aqueductcore.backend.routers.graphql.mutations.experiment_mutations import (
    add_tag_to_experiment,
    create_experiment,
    remove_experiment,
    remove_tag_from_experiment,
    update_experiment,
)
from aqueductcore.backend.services.experiment import (
    build_experiment_dir_absolute_path,
    get_experiment_by_alias,
)
from aqueductcore.backend.routers.graphql.types import ExperimentData, PluginExecutionResult
from aqueductcore.backend.plugins.plugin_executor import PluginExecutor
from aqueductcore.backend.settings import settings

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
        result = PluginExecutor.execute(plugin, function, dict_params)
        exp_id = PluginExecutor.get_default_experiment_id(plugin, function, dict_params)
        experiment = await get_experiment_by_alias(
            user_info=context.user_info,
            db_session=context.db_session,
            alias=exp_id
        )
        now = datetime.datetime.now(tz=datetime.timezone.utc).strftime("%Y%m%d-%H%M%S")
        file_name = f"{now}-{plugin}-{function}.log"
        pathvalidate.validate_filename(file_name)
        experiment_dir = build_experiment_dir_absolute_path(
            str(settings.experiments_dir_path), experiment.id
        )
        # create experiment directory if it is its first file
        if not os.path.exists(experiment_dir):
            os.makedirs(experiment_dir)
        destination = os.path.join(experiment_dir, file_name)

        with open(destination, "w", encoding="utf-8") as dest:
            dest.write("result code:\n%d\n======\n" % result.return_code)
            dest.write("stdout:\n%s\n======\n" % result.stdout)
            dest.write("stderr:\n%s\n======\n" % result.stderr)

        return PluginExecutionResult(
            return_code=result.return_code,
            stdout=result.stdout,
            stderr=result.stderr,
            log_exeperiment=exp_id,
            log_file=file_name,
        )
