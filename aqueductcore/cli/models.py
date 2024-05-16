"""Data model for importing and exporting Aqueduct porting data."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class Tag(BaseModel):
    """Tag data model."""

    key: str
    name: str


class Experiment(BaseModel):
    """Experiment data model."""

    eid: str
    title: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: List[Tag]


class User(BaseModel):
    """User data model."""

    uid: UUID
    username: str
    experiments: List[Experiment]


class AqueductVariant(str, Enum):
    """Aqueduct variants enumerator."""

    CORE = "core"
    PRO = "pro"


class AqueductData(BaseModel):
    version: str
    variant: AqueductVariant
    users: List[User]
