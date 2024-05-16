"""Database engine module for database interaction from business logic layer."""

from __future__ import annotations

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from aqueductcore.backend.settings import settings

sync_engine = create_engine(
    f"postgresql+psycopg2://{settings.postgres_username}:"
    f"{settings.postgres_password}@{settings.postgres_host}:"
    f"{settings.postgres_port}/{settings.postgres_db}"
)

sync_session = sessionmaker(bind=sync_engine, expire_on_commit=False)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Returns database session for SQLAlchemy ORM."""
    with sync_session() as session:
        try:
            yield session
        finally:
            session.close()
