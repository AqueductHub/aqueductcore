"""Utility functions for mapping ORMs to Pydantic models and vice versa."""

from datetime import datetime, timezone
from re import compile as recompile
from typing import Tuple, List, Union
from uuid import UUID, uuid4

from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import (
    ExperimentCreate,
    ExperimentRead,
    TagCreate,
    TagRead,
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


def arr_humanize(arr: List[Union[str, int]]) -> str:
    """Convert list of strings to a single string separated by commas"""
    arr = [str(value) for value in arr]
    if len(arr) == 1:
        return arr[0]

    if len(arr) == 2:
        return arr[-2] + " and " + arr[-1]

    if len(arr) > 2:
        return ", ".join(arr[:-2]) + ", " + arr[-2] + " and " + arr[-1]

    return ""
