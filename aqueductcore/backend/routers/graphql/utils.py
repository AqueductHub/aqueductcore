"""Utility functions for mapping Pydantic models to Graph nodes and vice versa."""

import aqueductcore.backend.routers.graphql.types as node
from aqueductcore.backend.models.experiment import ExperimentRead


def experiment_model_to_node(value: ExperimentRead) -> node.ExperimentData:
    """Convert ORM Experiment to Pydantic Experiment."""
    experiment = node.ExperimentData(
        id=value.id,
        title=value.title,
        description=value.description,
        alias=value.alias,
        created_at=value.created_at,
        updated_at=value.updated_at,
        tags=[item.name for item in value.tags],
    )

    return experiment
