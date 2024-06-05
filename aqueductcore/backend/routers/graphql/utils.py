"""Utility functions for mapping Pydantic models to Graph nodes and vice versa."""

import aqueductcore.backend.routers.graphql.types as node
from aqueductcore.backend.models.experiment import ExperimentRead


def experiment_model_to_node(value: ExperimentRead) -> node.ExperimentData:
    """Convert ORM Experiment to Pydantic Experiment."""
    experiment = node.ExperimentData(
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
