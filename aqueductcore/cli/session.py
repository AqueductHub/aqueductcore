"""Database engine module for database session management."""

from __future__ import annotations

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import Engine
from sqlalchemy.orm import Session, sessionmaker


@contextmanager
def get_session(db_engine: Engine) -> Generator[Session, None, None]:
    """Returns database session for SQLAlchemy ORM."""
    sync_session = sessionmaker(bind=db_engine, expire_on_commit=False)

    with sync_session.begin() as session:  # pylint: disable=no-member
        yield session
