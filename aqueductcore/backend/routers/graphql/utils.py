"""Utility functions for mapping Pydantic models to Graph nodes and vice versa."""

import json
from uuid import UUID

import aqueductcore.backend.routers.graphql.types as node
from aqueductcore.backend.models.experiment import ExperimentRead
from aqueductcore.backend.models.task import TaskRead


def task_model_to_node(value: TaskRead, experiment: node.ExperimentData) -> node.TaskData:
    """Convert ORM Experiment to Pydantic Experiment."""

    kv_params = []
    if value.parameters is not None:
        kv_params = [
            node.KeyValuePair(key=item.key, value=item.value)
            for item in json.loads(value.parameters).items()
        ]

    task = node.TaskData(
        task_id=UUID(value.task_id),
        experiment=experiment,
        extension_name=value.extension_name,
        action_name=value.action_name,
        task_status=node.TaskStatus(value.status),
        received_at=value.received_at,
        ended_at=value.ended_at,
        parameters=kv_params,
        std_err=value.std_err,
        std_out=value.std_out,
        result_code=value.result_code,
    )

    return task


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
