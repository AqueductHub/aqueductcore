"""Database models."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, ForeignKey, String, Table, Text, Uuid, func
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


user_experiment_association = Table(
    "user_experiment",
    Base.metadata,
    Column("experiment_id", Uuid, ForeignKey("experiment.id"), nullable=False),
    Column("user_id", Uuid, ForeignKey("user.id"), nullable=False),
)


class Experiment(Base):
    """Experiment details"""

    __tablename__ = "experiment"

    id = mapped_column(Uuid, primary_key=True)
    title: Mapped[str]
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now()  # pylint: disable=not-callable
    )
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now()  # pylint: disable=not-callable
    )
    alias: Mapped[str] = mapped_column(unique=True)

    tags: Mapped[List[Tag]] = relationship(
        secondary=experiment_tag_association, back_populates="experiments"
    )
    user: Mapped[User] = relationship(
        secondary=user_experiment_association, back_populates="experiments"
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


class User(SQLAlchemyBaseUserTable, Base):
    """Model for defining User attributes"""

    id = mapped_column(Uuid, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)

    experiments: Mapped[List[Experiment]] = relationship(
        secondary=user_experiment_association, back_populates="user"
    )
