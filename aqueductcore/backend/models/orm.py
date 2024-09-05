"""Database models."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Text, Uuid, func
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(AsyncAttrs, DeclarativeBase):
    """Base class for SQLAlchemy ORMs"""


experiment_tag_association = Table(
    "experiment_tag",
    Base.metadata,
    Column("experiment_uuid", Uuid, ForeignKey("experiment.uuid"), nullable=False),
    Column("tag_key", String, ForeignKey("tag.key"), nullable=False),
)


class User(Base):
    """Model for User"""

    __tablename__ = "user"

    uuid = mapped_column(Uuid, primary_key=True)
    username: Mapped[str] = mapped_column(Text)
    experiments: Mapped[List[Experiment]] = relationship()


class Task(Base):
    """Task details"""

    __tablename__ = "task"
    task_id = mapped_column(String, primary_key=True)
    extension_name: Mapped[str]
    action_name: Mapped[str]
    parameters: Mapped[Optional[str]]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()  # pylint: disable=not-callable
    )
    created_by: Mapped[Uuid] = mapped_column(ForeignKey("user.uuid"), nullable=False)
    experiment_id = mapped_column(Uuid, ForeignKey("experiment.uuid"))
    experiment: Mapped[Experiment] = relationship(back_populates="tasks")


class Experiment(Base):
    """Experiment details"""

    __tablename__ = "experiment"

    uuid = mapped_column(Uuid, primary_key=True)
    title: Mapped[str]
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_by: Mapped[Uuid] = mapped_column(ForeignKey("user.uuid"), nullable=False)
    created_by_user: Mapped[User] = relationship(back_populates="experiments")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()  # pylint: disable=not-callable
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()  # pylint: disable=not-callable
    )
    eid: Mapped[str] = mapped_column(unique=True)

    tags: Mapped[List[Tag]] = relationship(
        secondary=experiment_tag_association, back_populates="experiments"
    )

    tasks: Mapped[List[Task]] = relationship(back_populates="experiment")

    def __repr__(self):
        return f"<Experiment {self.title}>"


class Tag(Base):
    """Model for defining tags"""

    __tablename__ = "tag"

    key: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()

    experiments: Mapped[List[Experiment]] = relationship(
        secondary=experiment_tag_association, back_populates="tags"
    )
