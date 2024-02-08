"""Server context management module."""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext

from aqueductcore.backend.server.session import get_session


class ServerContext(BaseContext):
    """Server context class."""

    def __init__(self, db_session: AsyncSession):
        super().__init__()
        self.db_session = db_session


async def context_dependency() -> AsyncGenerator[ServerContext, None]:
    """Asynchronous dependency generator for server context."""
    async with get_session() as db_session:
        yield ServerContext(db_session=db_session)
