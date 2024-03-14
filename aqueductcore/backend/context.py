"""Server context management module."""

from enum import Enum
from typing import AsyncGenerator, Set
from uuid import UUID

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext
from typing_extensions import Annotated

from aqueductcore.backend.session import get_session


class UserScope(str, Enum):
    """Experiment scopes enumerator."""

    EXPERIMENT_VIEW_OWN = "experiment::view::own"
    EXPERIMENT_VIEW_ALL = "experiment::view::all"
    EXPERIMENT_EDIT_OWN = "experiment::edit::own"
    EXPERIMENT_EDIT_ALL = "experiment::edit::all"
    EXPERIMENT_DELETE_OWN = "experiment::delete::own"
    EXPERIMENT_DELETE_ALL = "experiment::delete::all"
    EXPERIMENT_CREATE_OWN = "experiment::create::own"


class UserInfo(BaseModel):
    """User information and security scopes (permissions)."""

    user_id: UUID
    scopes: Set[UserScope]


class ServerContext(BaseContext):
    """Server context class."""

    def __init__(self, db_session: AsyncSession, user_info: UserInfo):
        super().__init__()
        self.db_session = db_session
        self.user_info = user_info


async def get_current_user() -> UserInfo:
    """Get the current user based on the provided authentication token."""
    token_data = UserInfo(scopes=set(UserScope), user_id=UUID(int=0))

    return token_data


async def context_dependency(
    user_info: Annotated[UserInfo, Depends(get_current_user)]
) -> AsyncGenerator[ServerContext, None]:
    """Asynchronous dependency generator for server context."""
    async with get_session() as db_session:
        yield ServerContext(db_session=db_session, user_info=user_info)
