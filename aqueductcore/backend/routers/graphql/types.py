"""GraphQL Node Types."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.models.plugin import Plugin
from aqueductcore.backend.services.experiment import get_experiment_files
from aqueductcore.backend.settings import settings


async def get_files(info: Info, root: ExperimentData) -> List[ExperimentFile]:
    """Resolve experiment files."""
    experiment_uuid = root.uuid
    result: List[ExperimentFile] = []
    context = cast(ServerContext, info.context)
    files = await get_experiment_files(
        user_info=context.user_info,
        db_session=context.db_session,
        experiments_root_dir=str(settings.experiments_dir_path),
        experiment_uuid=experiment_uuid,
    )
    for name, modified_time in files:
        result.append(
            ExperimentFile(
                name=name,
                path=f"{settings.api_prefix}{settings.files_route_prefix}/{str(experiment_uuid)}",
                modified_at=modified_time,
            )
        )

    return result


@strawberry.type(description="Single file in an experiment")
class ExperimentFile:
    """GraphQL node."""

    name: str = strawberry.field(description="Full name of the file.")
    path: str = strawberry.field(description="Relative path of the file to the download route.")
    modified_at: datetime = strawberry.field(description="Last modified date of the file.")


@strawberry.type(description="Single experiment with its data.")
class ExperimentData:
    """GraphQL node."""

    uuid: UUID = strawberry.field(description="Unique identifier of the experiment.")
    title: str = strawberry.field(description="Title of the experiment.")
    eid: str = strawberry.field(description="EID of the experiment.")
    description: Optional[str] = strawberry.field(
        default=None, description="Description of the experiment."
    )
    created_at: datetime = strawberry.field(description="Creation date of the experiment.")
    created_by: str = strawberry.field(description="Creator of the experiment")
    updated_at: datetime = strawberry.field(description="Last update date of the experiment.")
    tags: List[str] = strawberry.field(description="Tags of the experiment.")
    files: List[ExperimentFile] = strawberry.field(
        description="List of files in an experiment.", resolver=get_files
    )


@strawberry.type(description="Paginated list of experiments")
class Experiments:
    """GraphQL node"""

    experiments_data: List[ExperimentData] = strawberry.field(
        description="The list of experiments in this page"
    )
    total_experiments_count: int = strawberry.field(
        description="Total number of experiments in the filtered dataset"
    )


@strawberry.type(description="Current user information")
class UserInfo:
    """GraphQL node"""

    username: str = strawberry.field(description="Username.")
    scopes: List[str] = strawberry.field(description="List of scopes available to the user.")


@strawberry.type(description="Paginated list of experiments")
class Tags:
    """GraphQL node"""

    tags_data: List[str] = strawberry.field(description="The list of tags.")
    total_tags_count: int = strawberry.field(description="Total number of tags.")


@strawberry.type
class PluginParameterType:
    """A single parameter of the plugin interface"""

    name: str
    display_name: Optional[str]
    description: Optional[str]
    data_type: str
    default_value: Optional[str]
    options: Optional[List[str]]


@strawberry.type
class PluginFunctionInfo:
    """Represents a function of the plugin. One plugin
    may have multiple functions."""

    name: str
    description: Optional[str]
    parameters: List[PluginParameterType]
    experiment_variable_name: Optional[str]


@strawberry.type
class PluginExecutionResult:
    """Result of OS process execution"""

    return_code: int
    stdout: str
    stderr: str
    log_experiment: str
    log_file: str


@strawberry.type
class PluginInfo:
    """Plugin information passed to the frontend"""

    name: str
    description: Optional[str]
    authors: str = strawberry.field(description="Plugin authors' emails")
    functions: List[PluginFunctionInfo]

    @staticmethod
    def from_plugin(plugin: Plugin):
        """Generates a plugin information object for a plugin model."""

        functions = []
        for function in plugin.functions:
            parameters = []
            for parameter in function.parameters:
                parameters.append(
                    PluginParameterType(
                        name=parameter.name,
                        display_name=parameter.display_name,
                        description=parameter.description,
                        data_type=parameter.data_type,
                        default_value=parameter.default_value,
                        options=parameter.options,
                    )
                )
            var = function.get_default_experiment_parameter()
            varname = None
            if var is not None:
                varname = var.name
            functions.append(
                PluginFunctionInfo(
                    name=function.name,
                    description=function.description,
                    parameters=parameters,
                    experiment_variable_name=varname,
                )
            )
        return PluginInfo(
            name=plugin.name,
            description=plugin.description,
            authors=plugin.authors,
            functions=functions,
        )
