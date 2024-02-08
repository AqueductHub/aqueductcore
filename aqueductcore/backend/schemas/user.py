"""Database model for User."""

from __future__ import annotations

from uuid import UUID

from fastapi_users import schemas


class UserRead(schemas.BaseUser[UUID]):
    """User data model."""


class UserCreate(schemas.BaseUserCreate):
    """User create data model."""


class UserUpdate(schemas.BaseUserUpdate):
    """User update data model."""
