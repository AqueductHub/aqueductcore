# pylint: skip-file
"""Common test fixtures"""


from contextlib import contextmanager
from typing import Generator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from aqueductcore.backend.models import orm

sync_engine = create_engine("sqlite:///:memory:")

sync_session = sessionmaker(bind=sync_engine, expire_on_commit=False)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Returns database session for SQLAlchemy ORM."""
    with sync_session() as session:
        try:
            yield session
        finally:
            session.close()


@pytest.fixture
def db_session():
    """Session for SQLAlchemy."""
    with sync_session() as session:
        orm.Base.metadata.create_all(sync_engine)

        yield session

        orm.Base.metadata.drop_all(sync_engine)

    sync_engine.dispose()
