"""Inputs to be used for mutations"""

from enum import Enum
from typing import List, Optional
from uuid import UUID

import strawberry


@strawberry.enum
class IDType(Enum):
    """Experiment identification type."""

    UUID = "UUID"
    EID = "EID"


@strawberry.input
class ExperimentIdentifierInput:
    """Input type to identify experiment."""

    type: IDType
    value: str


@strawberry.input
class ExperimentUpdateInput:
    """Input type to update experiment details"""

    title: Optional[str] = None
    description: Optional[str] = None


@strawberry.input
class ExperimentTagInput:
    """Input type to add or remove tag from experiment"""

    uuid: UUID
    tag: str


@strawberry.input
class ExperimentTagsInput:
    """Input type to add or remove tags from experiment"""

    uuid: UUID
    tags: List[str]


@strawberry.input
class ExperimentCreateInput:
    """Input type to create experiemnt"""

    title: str
    description: str
    tags: List[str]


@strawberry.input
class ExperimentRemoveInput:
    """Input type to remove experiment"""

    uuid: UUID


@strawberry.input
class TasksFilterInput:
    """Filter for tasks list"""

    username: Optional[str] = None
    extension_name: Optional[str] = None
    action_name: Optional[str] = None
    experiment: Optional[ExperimentIdentifierInput] = None
    limit: Optional[int] = None
    offset: Optional[int] = None


@strawberry.input
class ExecuteExtensionInput:
    """Input for executing extension"""

    experiment_uuid: UUID
    extension: str
    action: str
    params: List[List[str]]


@strawberry.input
class CancelTaskInput:
    """Input for cancelling a task"""

    experiment_uuid: UUID
    task_id: UUID
