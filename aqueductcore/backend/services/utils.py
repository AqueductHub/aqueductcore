"""Utility functions for mapping ORMs to Pydantic models and vice versa."""

from datetime import datetime, timezone
from re import compile as recompile
from typing import List, Optional, Tuple, Union
from uuid import UUID, uuid4

from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import (
    ExperimentCreate,
    ExperimentRead,
    TagCreate,
    TagRead,
)
from aqueductcore.backend.models.task import (
    TaskCreate,
    TaskParamList,
    TaskProcessExecutionResult,
    TaskRead,
)


async def task_orm_to_model(
    value: orm.Task,
    task_info: TaskProcessExecutionResult,
    experiment_uuid: UUID,
    username: Optional[str] = None,
) -> TaskRead:
    """Convert ORM Experiment to Pydantic Model"""
    if username is None:
        username = value.created_by_user.username

    task = TaskRead(
        uuid=value.uuid,
        experiment_uuid=experiment_uuid,
        extension_name=value.extension_name,
        action_name=value.action_name,
        received_at=value.created_at.replace(tzinfo=timezone.utc),
        ended_at=task_info.ended_at.replace(tzinfo=timezone.utc) if task_info.ended_at else None,
        std_err=task_info.std_err,
        std_out=task_info.std_out,
        status=task_info.status,
        parameters=(
            TaskParamList.model_validate_json(value.parameters) if value.parameters else None
        ),
        result_code=task_info.result_code,
        created_by=UUID(str(value.created_by)),
        created_by_username=username,
    )

    return task


def task_model_to_orm(
    value: TaskCreate,
) -> orm.Task:
    """Convert ORM Experiment to Pydantic Model"""
    return orm.Task(
        uuid=value.uuid,
        action_name=value.action_name,
        extension_name=value.extension_name,
        parameters=(value.parameters.model_dump_json() if value.parameters else None),
        created_by=value.created_by,
        experiment_id=value.experiment_uuid,
        created_at=value.received_at,
    )


async def experiment_orm_to_model(value: orm.Experiment) -> ExperimentRead:
    """Convert ORM Experiment to Pydantic Model"""
    experiment = ExperimentRead(
        created_at=value.created_at.replace(tzinfo=timezone.utc),
        updated_at=value.updated_at.replace(tzinfo=timezone.utc),
        created_by=value.created_by_user.username,
        description=value.description,
        eid=value.eid,
        uuid=value.uuid,
        title=value.title,
        tags=[tag_orm_to_model(tag) for tag in value.tags],
    )

    return experiment


def tag_orm_to_model(value: orm.Tag) -> TagRead:
    """Convert ORM Tag to Pydantic Tag."""
    tag = TagRead(name=value.name, key=value.key)

    return tag


def experiment_model_to_orm(value: ExperimentCreate) -> orm.Experiment:
    """Convert Pydantic Experiment to ORM Experiment."""
    experiment = orm.Experiment(
        uuid=value.uuid,
        title=value.title,
        description=value.description,
        eid=value.eid,
    )
    experiment.tags.extend([tag_model_to_orm(item) for item in value.tags])

    return experiment


def tag_model_to_orm(value: TagCreate) -> orm.Tag:
    """Convert Pydantic Tag to ORM Tag."""
    tag = orm.Tag(name=value.name, key=value.key)

    return tag


def generate_experiment_uuid_and_eid(experiment_index: int) -> Tuple[UUID, str]:
    """Generate uuid and eid for experiment"""
    current_date = datetime.today().strftime("%Y%m%d")
    uuid = uuid4()
    eid = f"{current_date}-{experiment_index}"

    return uuid, eid


def is_tag_valid(tag: str) -> bool:
    """Validate if tag consists of alphanumeric characters, underscores and hyphens only"""
    pattern = r"^[a-zA-Z0-9\-_:\/]+$"

    regex = recompile(pattern)

    return bool(regex.match(tag))


def format_list_human_readable(arr: List[Union[str, int]]) -> str:
    """Convert a list of strings or integers to a human-readable string."""
    str_arr = [str(value) for value in arr]

    if not str_arr:
        return ""

    if len(str_arr) == 1:
        return str_arr[0]

    if len(str_arr) == 2:
        return " and ".join(str_arr)

    return f"{', '.join(str_arr[:-1])} and {str_arr[-1]}"
