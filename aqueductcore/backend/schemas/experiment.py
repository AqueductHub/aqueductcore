"""Pydantic schemas to be used in crud operations"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class ECSModel(BaseModel, extra="forbid"):
    """Base model for all pydantic models."""


class UserBase(ECSModel):
    """Base model for user table"""

    id: UUID
    email: str
    first_name: str
    last_name: str


class UserCreate(UserBase):
    """Model for create User query"""

    hashed_password: str


class UserRead:
    """Model for reading User details"""

    id: str


class TagBase(ECSModel):
    """Base model for Tag"""

    key: str
    name: str


class TagCreate(TagBase):
    """Model for creating a tag"""


class TagRead(TagBase):
    """Model for creating a tag"""


class ExperimentBase(ECSModel):
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
    updated_at: datetime
    tags: List[TagRead]


class ExperimentUpdate(ExperimentBase):
    """Model fields to update an experiment"""
