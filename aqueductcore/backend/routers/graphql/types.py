"""GraphQL Node Types."""

from __future__ import annotations

import json
from datetime import datetime
from enum import Enum
from typing import List, Optional, cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.models.experiment import ExperimentRead
from aqueductcore.backend.models.extensions import Extension
from aqueductcore.backend.models.task import TaskRead
from aqueductcore.backend.services.experiment import (
    get_experiment_by_uuid,
    get_experiment_files,
)
from aqueductcore.backend.services.task_executor import get_all_tasks
from aqueductcore.backend.settings import settings


async def resolve_files(info: Info, root: ExperimentData) -> List[ExperimentFile]:
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


async def resovle_tasks(info: Info, root: ExperimentData) -> List[TaskData]:
    """Resolve experiment's tasks."""
    context = cast(ServerContext, info.context)
    tasks = await get_all_tasks(
        user_info=context.user_info, db_session=context.db_session, experiment_uuid=root.uuid
    )
    task_nodes = [task_model_to_node(value=item) for item in tasks]

    return task_nodes


async def resolve_experiment(info: Info, root: TaskData) -> ExperimentData:
    """Resolve experiment's tasks."""
    context = cast(ServerContext, info.context)
    experiment = await get_experiment_by_uuid(
        user_info=context.user_info,
        db_session=context.db_session,
        experiment_uuid=root._experiment_uuid,
    )

    return experiment_model_to_node(experiment)


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
        description="List of files in an experiment.", resolver=resolve_files
    )
    tasks: List[TaskData] = strawberry.field(
        description="List of tasks for this experiment.", resolver=resovle_tasks
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
class ExtensionParameterType:
    """A single parameter of the extension interface"""

    name: str
    display_name: Optional[str]
    description: Optional[str]
    data_type: str
    default_value: Optional[str]
    options: Optional[List[str]]


@strawberry.type
class ExtensionActionInfo:
    """Represents a action of the extension. One extension
    may have multiple actions."""

    name: str
    description: Optional[str]
    parameters: List[ExtensionParameterType]
    experiment_variable_name: Optional[str]


@strawberry.type
class ExtensionInfo:
    """Extension information passed to the frontend"""

    name: str
    description: Optional[str]
    authors: str = strawberry.field(description="Extension authors' emails")
    actions: List[ExtensionActionInfo]

    @staticmethod
    def from_extension(extension: Extension):
        """Generates a extension information object for a extension model."""

        actions = []
        for action in extension.actions:
            parameters = []
            for parameter in action.parameters:
                parameters.append(
                    ExtensionParameterType(
                        name=parameter.name,
                        display_name=parameter.display_name,
                        description=parameter.description,
                        data_type=parameter.data_type,
                        default_value=parameter.default_value,
                        options=parameter.options,
                    )
                )
            var = action.get_default_experiment_parameter()
            varname = None
            if var is not None:
                varname = var.name
            actions.append(
                ExtensionActionInfo(
                    name=action.name,
                    description=action.description,
                    parameters=parameters,
                    experiment_variable_name=varname,
                )
            )
        return ExtensionInfo(
            name=extension.name,
            description=extension.description,
            authors=extension.authors,
            actions=actions,
        )


@strawberry.enum
class TaskStatus(Enum):
    """Statuses of task execution"""

    FAILURE = "FAILURE"
    PENDING = "PENDING"
    RECEIVED = "RECEIVED"
    REVOKED = "REVOKED"
    STARTED = "STARTED"
    SUCCESS = "SUCCESS"


@strawberry.type
class KeyValuePair:
    """Parameter key and value"""

    key: ExtensionParameterType
    value: Optional[str]


@strawberry.type
class TaskData:
    """Full information about the scheduled task."""

    task_id: UUID = strawberry.field(description="Unique identifier of the task.")
    experiment: ExperimentData = strawberry.field(
        description="Experiment the task is associated with.", resolver=resolve_experiment
    )
    extension_name: str = strawberry.field(description="Name of the extension.")
    action_name: str = strawberry.field(description="Name of the extension action.")
    parameters: List[KeyValuePair] = strawberry.field(
        description="List of task parameters and their values."
    )
    received_at: datetime = strawberry.field(description="Time task was submitted.")
    ended_at: Optional[datetime] = strawberry.field(description="Time task was completed.")
    task_status: TaskStatus = strawberry.field(description="Status of the task execution.")
    std_out: Optional[str] = strawberry.field(description="Content of task stdout.")
    std_err: Optional[str] = strawberry.field(description="Content of task stderr.")
    result_code: Optional[int] = strawberry.field(description="Process result code.")

    _experiment_uuid: strawberry.Private[UUID]


@strawberry.type(description="Paginated list of tasks.")
class Tasks:
    """GraphQL node"""

    tasks_data: List[TaskData] = strawberry.field(description="The list of tasks in this page")
    total_tasks_count: int = strawberry.field(
        description="Total number of tasks in the filtered dataset"
    )


def task_model_to_node(value: TaskRead) -> TaskData:
    """Convert ORM Experiment to Pydantic Experiment."""

    kv_params = []
    if value.parameters is not None:
        kv_params = [
            KeyValuePair(key=item.key, value=item.value)
            for item in json.loads(value.parameters).items()
        ]

    task = TaskData(
        task_id=UUID(value.task_id),
        extension_name=value.extension_name,
        action_name=value.action_name,
        task_status=TaskStatus(value.status),
        received_at=value.received_at,
        ended_at=value.ended_at,
        parameters=kv_params,
        std_err=value.std_err,
        std_out=value.std_out,
        result_code=value.result_code,
        _experiment_uuid=value.experiment_uuid,
    )

    return task


def experiment_model_to_node(value: ExperimentRead) -> ExperimentData:
    """Convert ORM Experiment to Pydantic Experiment."""
    experiment = ExperimentData(
        uuid=value.uuid,
        title=value.title,
        description=value.description,
        eid=value.eid,
        created_at=value.created_at,
        created_by=value.created_by,
        updated_at=value.updated_at,
        tags=[item.name for item in value.tags],
    )

    return experiment


def experiments_node(
    experiments_data: List[ExperimentData], total_experiments_count: int
) -> Experiments:
    """Convert ORM Experiment to Pydantic Experiment."""
    experiment = Experiments(
        experiments_data=experiments_data, total_experiments_count=total_experiments_count
    )

    return experiment
