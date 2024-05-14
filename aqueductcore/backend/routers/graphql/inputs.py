"""Inputs to be used for mutations"""

from enum import Enum
from typing import List, Optional
from uuid import UUID

import strawberry


@strawberry.enum
class IDType(Enum):
    """Experiment identification type."""

    UUID = "UUID"
    ALIAS = "ALIAS"


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

    experiment_id: UUID
    tag: str


@strawberry.input
class ExperimentCreateInput:
    """Input type to create experiemnt"""

    title: str
    description: str
    tags: List[str]


@strawberry.input
class ExperimentRemoveInput:
    """Input type to remove experiment"""

    experiment_id: UUID
