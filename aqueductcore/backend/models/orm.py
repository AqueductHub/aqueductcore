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
    Column("experiment_id", Uuid, ForeignKey("experiment.id"), nullable=False),
    Column("tag_key", String, ForeignKey("tag.key"), nullable=False),
)


class User(Base):
    """Model for User"""

    __tablename__ = "user"

    id = mapped_column(Uuid, primary_key=True)
    username: Mapped[str] = mapped_column(Text)
    experiments: Mapped[List["Experiment"]] = relationship()


class Experiment(Base):
    """Experiment details"""

    __tablename__ = "experiment"

    id = mapped_column(Uuid, primary_key=True)
    title: Mapped[str]
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_by: Mapped[Uuid] = mapped_column(ForeignKey("user.id"), nullable=False)
    created_by_user: Mapped[User] = relationship(back_populates="experiments")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()  # pylint: disable=not-callable
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()  # pylint: disable=not-callable
    )
    alias: Mapped[str] = mapped_column(unique=True)

    tags: Mapped[List[Tag]] = relationship(
        secondary=experiment_tag_association, back_populates="experiments"
    )

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
