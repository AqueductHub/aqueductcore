"""Utility functions for mapping ORMs to Pydantic models and vice versa."""

from datetime import datetime, timezone
from os.path import normpath
from re import compile as recompile
from typing import Tuple
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
        alias=value.alias,
        id=value.id,
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
        id=value.id,
        title=value.title,
        description=value.description,
        alias=value.alias,
    )
    experiment.tags.extend([tag_model_to_orm(item) for item in value.tags])

    return experiment


def tag_model_to_orm(value: TagCreate) -> orm.Tag:
    """Convert Pydantic Tag to ORM Tag."""
    tag = orm.Tag(name=value.name, key=value.key)

    return tag


def generate_experiment_id_and_alias(experiment_index: int) -> Tuple[UUID, str]:
    """Generate uuid and alias for experiment"""
    current_date = datetime.today().strftime("%Y%m%d")
    experiment_id = uuid4()
    alias = f"{current_date}-{experiment_index}"

    return experiment_id, alias


def is_tag_valid(tag: str) -> bool:
    """Validate if tag consists of alphanumeric characters, underscores and hyphens only"""
    pattern = r"^[a-zA-Z0-9\-_:\/]+$"

    regex = recompile(pattern)

    return bool(regex.match(tag))


def is_file_path_valid(file_path: str) -> bool:
    """Validate if the file path is safe and valid"""
    if not file_path:
        return False

    if "\\" in file_path or ".." in file_path:
        return False

    try:
        _ = normpath(file_path)
    except (ValueError, OSError):
        return False

    return True
