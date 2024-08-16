"""Task pydantic schemas to be used in crud operations"""

from datetime import datetime
from typing import Dict, Optional
from uuid import UUID

from aqueductcore.backend.models.base import AQDModel


class TaskProcessExecutionResult(AQDModel):
    """Result of process execution."""

    result_code: Optional[int] = None
    std_err: Optional[str] = None
    std_out: Optional[str] = None
    task_id: UUID
    status: str
    ended_at: Optional[datetime] = None
    kwargs: Optional[Dict] = None


class TaskBase(AQDModel):
    """Base model for a task."""

    task_id: str
    experiment_uuid: UUID
    extension_name: str
    action_name: str
    parameters: Optional[Dict] = None
    result_code: Optional[int] = None
    std_err: Optional[str] = None
    std_out: Optional[str] = None
    status: str
    received_at: datetime
    ended_at: Optional[datetime] = None


class TaskCreate(TaskBase):
    """Model for creating a task."""


class TaskRead(TaskBase):
    """Model for reading a task."""
