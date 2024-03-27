"""Pydantic schemas to be used in crud operations"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class AQDModel(BaseModel, extra="forbid"):
    """Base model for all pydantic models."""


class TagBase(AQDModel):
    """Base model for Tag"""

    key: str
    name: str


class TagCreate(TagBase):
    """Model for creating a tag"""


class TagRead(TagBase):
    """Model for creating a tag"""


class ExperimentBase(AQDModel):
    """Base model for Experiment"""

    id: UUID
    title: str
    description: Optional[str] = None


class ExperimentCreate(ExperimentBase):
    """Model fields to create an experiment"""

    alias: str
    tags: List[TagCreate]


class ExperimentRead(ExperimentBase):
    """Model fields to read an experiment"""

    id: UUID
    alias: str
    created_at: datetime
    created_by: str
    updated_at: datetime
    tags: List[TagRead]


class ExperimentUpdate(ExperimentBase):
    """Model fields to update an experiment"""


class UserBase(AQDModel):
    """Base model for User"""

    user_id: UUID
    username: str
