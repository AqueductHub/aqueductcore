"""Database engine module for database interaction from business logic layer."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from aqueductcore.backend.settings import settings

async_engine = create_async_engine(
    f"postgresql+asyncpg://{settings.postgres_username}:"
    f"{settings.postgres_password}@{settings.postgres_host}:"
    f"{settings.postgres_port}/{settings.postgres_db}"
)

async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Returns an async database session for SQLAlchemy ORM."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
