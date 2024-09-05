"""Server context management module."""

from enum import Enum
from typing import AsyncGenerator, Optional, Set
from uuid import UUID

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import BaseContext
from typing_extensions import Annotated

from aqueductcore.backend.session import get_session
from aqueductcore.backend.settings import settings


class UserScope(str, Enum):
    """Experiment scopes enumerator."""

    EXPERIMENT_VIEW_OWN = "experiment::view::own"
    EXPERIMENT_VIEW_ALL = "experiment::view::all"
    EXPERIMENT_EDIT_OWN = "experiment::edit::own"
    EXPERIMENT_EDIT_ALL = "experiment::edit::all"
    EXPERIMENT_DELETE_OWN = "experiment::delete::own"
    EXPERIMENT_DELETE_ALL = "experiment::delete::all"
    EXPERIMENT_CREATE_OWN = "experiment::create::own"

    JOB_VIEW_OWN = "job::view::own"
    JOB_VIEW_ALL = "job::view::all"
    JOB_CREATE = "job::create"
    JOB_CANCEL_OWN = "job::cancel::own"
    JOB_CANCEL_ALL = "job::cancel::all"


class UserInfo(BaseModel):
    """User information and security scopes (permissions)."""

    uuid: UUID
    username: str
    scopes: Set[UserScope]
    token: Optional[str] = None

    def can_view_any_experiment(self) -> bool:
        """ Has permission to view any experiment."""
        return UserScope.EXPERIMENT_VIEW_ALL in self.scopes

    def can_view_own_experiment(self) -> bool:
        """ Has permission to view own experiment."""
        return UserScope.EXPERIMENT_DELETE_OWN in self.scopes

    def can_view_experiment_owned_by(self, owner: UUID) -> bool:
        """ Has permission to view an experiment owned by some user."""
        return (
            self.can_view_any_experiment()
            or (self.can_view_own_experiment() and owner == self.uuid)
        )

    def can_delete_any_experiment(self) -> bool:
        """ Has permission to delete any experiment."""
        return UserScope.EXPERIMENT_DELETE_ALL in self.scopes

    def can_delete_own_experiment(self) -> bool:
        """ Has permission to delete own experiment."""
        return UserScope.EXPERIMENT_DELETE_OWN in self.scopes

    def can_delete_experiment_owned_by(self, owner: UUID) -> bool:
        """ Has permission to delete an experiment, owned by some user."""
        return (
            self.can_delete_any_experiment()
            or (self.can_delete_own_experiment() and owner == self.uuid)
        )

    def can_edit_any_experiment(self) -> bool:
        """ Has a permission to edit any experiment."""
        return UserScope.EXPERIMENT_EDIT_ALL in self.scopes

    def can_edit_own_experiment(self) -> bool:
        """ Has a permission to edit own experiment."""
        return UserScope.EXPERIMENT_EDIT_OWN in self.scopes

    def can_edit_experiment_owned_by(self, owner: UUID) -> bool:
        """ Has a permission to edit an experiment, owned by some user."""
        return (
            self.can_edit_any_experiment()
            or (self.can_edit_own_experiment() and owner == self.uuid)
        )

    def can_create_experiment(self) -> bool:
        """ Has a permission to create an experiment."""
        return UserScope.EXPERIMENT_CREATE_OWN in self.scopes

    def can_view_any_task(self) -> bool:
        """ Has a permission to see a task."""
        return UserScope.JOB_VIEW_ALL in self.scopes

    def can_view_own_task(self) -> bool:
        """ Has a permission to see own task."""
        return UserScope.JOB_VIEW_OWN in self.scopes

    def can_view_task_owned_by(self, owner: UUID) -> bool:
        """ Has a permission to see a task, owned by some user."""
        return (
            self.can_view_any_task()
            or (self.can_view_own_task() and owner == self.uuid)
        )

    def can_cancel_any_task(self) -> bool:
        """ Has a permission to cancel any task."""
        return UserScope.JOB_CANCEL_ALL in self.scopes

    def can_cancel_own_task(self) -> bool:
        """ Has a permission to cancel own task."""
        return UserScope.JOB_CANCEL_OWN in self.scopes

    def can_cancel_task_owned_by(self, owner: str) -> bool:
        """ Has a permission to cancel a task, owned by some user."""
        return (
            self.can_cancel_any_task()
            or (self.can_cancel_own_task() and owner == self.username)
        )

    def can_create_task(self) -> bool:
        """ Has a permission to start jobs."""
        return UserScope.JOB_CREATE in self.scopes


class ServerContext(BaseContext):
    """Server context class."""

    def __init__(self, db_session: AsyncSession, user_info: UserInfo):
        super().__init__()
        self.db_session = db_session
        self.user_info = user_info


async def get_current_user() -> UserInfo:
    """Get the current user based on the provided authentication token."""
    token_data = UserInfo(
        scopes=set(UserScope), uuid=UUID(int=0), username=settings.default_username
    )

    return token_data


async def context_dependency(
    user_info: Annotated[UserInfo, Depends(get_current_user)]
) -> AsyncGenerator[ServerContext, None]:
    """Asynchronous dependency generator for server context."""
    async with get_session() as db_session:
        yield ServerContext(db_session=db_session, user_info=user_info)
