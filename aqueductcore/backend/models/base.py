"""Pydantic schemas to be used in crud operations"""

from pydantic import BaseModel


class AQDModel(BaseModel, extra="forbid"):
    """Base model for all pydantic models."""
