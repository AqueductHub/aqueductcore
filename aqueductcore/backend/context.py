"""Server context management module."""

from enum import Enum
from typing import AsyncGenerator, List
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext
from typing_extensions import Annotated

from aqueductcore.backend.session import get_session

get_bearer_token = HTTPBearer(auto_error=False)


class ExperimentScope(str, Enum):
    """Experiment scopes enumerator."""

    VIEW_OWN = "experiment::view::own"
    VIEW_ALL = "experiment::view::all"
    EDIT_OWN = "experiment::edit::own"
    EDIT_ALL = "experiment::edit::all"
    DELETE_OWN = "experiment::delete::own"
    DELETE_ALL = "experiment::delete::all"
    CREATE_OWN = "experiment::create::own"


class UserInfo(BaseModel):
    """User information and security scopes (permissions)."""

    user_id: UUID
    scopes: List[str] = []


class ServerContext(BaseContext):
    """Server context class."""

    def __init__(self, db_session: AsyncSession, user_info: UserInfo):
        super().__init__()
        self.db_session = db_session
        self.user_info = user_info


async def get_current_user(
    token: Annotated[HTTPAuthorizationCredentials, Depends(get_bearer_token)],
) -> UserInfo:
    """Get the current user based on the provided authentication token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.get_unverified_claims(token.credentials)
        user_id: str = str(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = UserInfo(scopes=token_scopes, user_id=UUID(user_id))
    except JWTError as exc:
        raise credentials_exception from exc

    return token_data


async def context_dependency(
    user_info: Annotated[UserInfo, Depends(get_current_user)]
) -> AsyncGenerator[ServerContext, None]:
    """Asynchronous dependency generator for server context."""
    async with get_session() as db_session:
        yield ServerContext(db_session=db_session, user_info=user_info)
