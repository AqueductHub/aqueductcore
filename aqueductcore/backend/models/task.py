"""Task pydantic schemas to be used in crud operations"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import Field

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


class SupportedTypes(str, Enum):
    """This enum contains allowed data types, which may be passed from
    the GraphQL endpoint or specified in the manifest file."""

    INT = "int"
    STR = "str"
    TEXTAREA = "textarea"
    FLOAT = "float"
    EXPERIMENT = "experiment"
    FILE = "file"
    BOOL = "bool"
    SELECT = "select"


class ExtensionParameterBase(AQDModel):
    """Typed and named parameter of the extension action"""

    name: str = Field(min_length=1)
    display_name: Optional[str] = None
    description: str = Field(min_length=1)
    data_type: SupportedTypes
    default_value: Optional[Any] = None
    options: Optional[List[str]] = None


class TaskParam(AQDModel):
    """Task parameter."""

    value: str
    metadata: ExtensionParameterBase


class TaskParamList(AQDModel):
    """Task parameters."""

    params: List[TaskParam]


class TaskBase(AQDModel):
    """Base model for a task."""

    task_id: str
    experiment_uuid: UUID
    extension_name: str
    action_name: str
    parameters: Optional[TaskParamList] = None
    result_code: Optional[int] = None
    std_err: Optional[str] = None
    std_out: Optional[str] = None
    status: str
    received_at: datetime
    ended_at: Optional[datetime] = None
    created_by: UUID
    created_at: datetime


class TaskCreate(TaskBase):
    """Model for creating a task."""


class TaskRead(TaskBase):
    """Model for reading a task."""
