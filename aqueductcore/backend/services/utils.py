"""Utility functions for mapping ORMs to Pydantic models and vice versa."""

from datetime import datetime, timezone
from mimetypes import guess_type
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


def generate_content_type(file_name: str) -> str:
    """Generate mime type of a file based on it's name"""
    file_extention = file_name.split(".")[-1]

    # Override automatic content type generation for specific extentions
    match file_extention:
        case "md":
            return "text/x-markdown"
        case "stim":
            return "text/plain"
        case _:
            guessed_type, _ = guess_type(file_name)
            return guessed_type or "application/octet-stream"
