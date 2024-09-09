"""Celery task execution."""

import os
import subprocess
from asyncio import sleep
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Tuple
from uuid import UUID

from celery import Celery
from celery.backends.base import TaskRevokedError
from celery.result import AsyncResult
from pydantic import ConfigDict, validate_call
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from aqueductcore.backend.context import UserInfo
from aqueductcore.backend.errors import AQDDBTaskNonExisting, AQDPermission
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.task import TaskProcessExecutionResult, TaskRead
from aqueductcore.backend.services.utils import task_orm_to_model
from aqueductcore.backend.settings import settings

WAITING_TIME = 2

celery_app = Celery(
    "tasks",
    broker=settings.celery_message_queue,
    backend=settings.celery_backend,
    result_persistent=True,
    result_extended=True,
    track_started=True,
    task_track_started=True,
)


celery_app.conf.update(result_extended=True)


@celery_app.task(bind=True)
def run_executable(
    self,  # pylint: disable=unused-argument
    extension_directory_name: str,
    shell_script: str,
    **kwargs,
) -> Tuple[int, str, str]:
    """This code executes in a celery worker.
    This call is implemented as blocking, but the aqueduct
    application sends the task, and receives the ID.
    Args:
        self: used to change state of the task from inside the task.
        extension_directory_name (str):
            relative name of the folder where the extension lives.
        shell_script (str):
            code to execute. Use relative file names here.

    Returns:
        Tuple[int, str, str]: result code, std out, std error.
    """
    extensions_dir = os.environ.get("EXTENSIONS_DIR_PATH", "")
    if not extensions_dir:
        raise FileNotFoundError("EXTENSIONS_DIR_PATH environment variable should be set.")
    workdir = Path(extensions_dir) / extension_directory_name

    myenv = os.environ.copy()
    myenv.update(kwargs)

    # TODO: add mechanism to update statuses
    # from inside the process. E.g. with a file
    # extension/.status
    with subprocess.Popen(
        shell_script,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=myenv,
        cwd=workdir,
    ) as proc:
        out, err = proc.communicate(timeout=None)
        code = proc.returncode
    return (
        code,
        out.decode("utf-8"),
        err.decode("utf-8"),
    )


async def _update_task_info(task_id: str, wait=True) -> TaskProcessExecutionResult:
    """Updates information about a task. Waits until ready if asked."""
    task = AsyncResult(task_id)
    if wait:
        while not task.ready():
            await sleep(WAITING_TIME)

    task_info = TaskProcessExecutionResult(
        task_id=UUID(task.id),
        status=task.status,
    )
    # property should be accessed once to have conistent results
    # as it might change during the process.
    task_result = task.result

    if task_result is not None:
        known_errors = (FileNotFoundError, TaskRevokedError)
        if isinstance(task_result, known_errors):
            err = str(task_result)
            task_info.std_err = err
        elif task.ready():
            code, out, err = task_result
            task_info.result_code = code
            task_info.std_out = out
            task_info.std_err = err
        task_info.ended_at = task.date_done
        task_info.kwargs = task.kwargs

    return task_info


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def _execute_task(
    extension_directory_name: str,
    shell_script: str,
    execute_blocking: bool = False,
    **kwargs,
) -> TaskProcessExecutionResult:
    """Execute a task and wait until finished"""

    # retry and expiration control policies may be added here according to:
    # https://docs.celeryq.dev/en/stable/userguide/calling.html#message-sending-retry
    task = run_executable.apply_async(
        (extension_directory_name, shell_script),
        kwargs=kwargs,
    )

    result = await _update_task_info(task_id=task.id, wait=execute_blocking)

    return result


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def revoke_task(
    user_info: UserInfo, db_session: AsyncSession, task_id: str, terminate: bool
) -> TaskRead:
    """Cancel the task and update the status."""

    statement = (
        select(orm.Task)
        .join(orm.Experiment)
        .where(orm.Task.experiment_id == orm.Experiment.uuid)
        .filter(orm.Task.task_id == task_id)
    )

    # TODO: this is not specified in ERD
    # but it implies, as user cannot launch a task
    # without edit permission.
    if not user_info.can_edit_any_experiment():
        statement = statement.filter(orm.Experiment.created_by == user_info.uuid)
    result = await db_session.execute(statement)

    db_task = result.scalars().first()
    if db_task is None:
        raise AQDDBTaskNonExisting(
            "DB query failed as task does not exist, or user has no access to cancel it."
        )
    created_by_user_id = UUID(str(db_task.created_by))
    if not user_info.can_view_experiment_owned_by(created_by_user_id):
        raise AQDPermission("User has no permission access experiment associated with the tasks.")
    if not user_info.can_cancel_task_owned_by(created_by_user_id):
        raise AQDPermission("User has no permission to cancel tasks.")

    # note: SIGINT does not lead to task abort. If you send
    # KeyboardInterupt (SIGINT), it will not stop, and the
    # exception does not propagate.
    AsyncResult(db_task.task_id).revoke(terminate=terminate, signal="SIGTERM")

    task_info = await _update_task_info(task_id=db_task.task_id, wait=False)

    return await task_orm_to_model(
        value=db_task, task_info=task_info, experiment_uuid=db_task.experiment_id
    )


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_task_by_uuid(
    user_info: UserInfo, db_session: AsyncSession, task_id: UUID
) -> TaskRead:
    """Cancel the task and update the status."""
    statement = (
        select(orm.Task)
        .options(joinedload(orm.Task.experiment))
        .where(orm.Task.task_id == str(task_id))
    )

    # experiment should be visible
    if not user_info.can_view_any_experiment():
        statement = statement.filter(orm.Task.experiment.created_by == user_info.uuid)

    # if only own tasks visible
    if not user_info.can_view_any_task():
        statement = statement.filter(orm.Task.created_by == user_info.uuid)

    # cannot view any tasks
    if not user_info.can_view_task_owned_by(user_info.uuid):
        raise AQDPermission("User has no permission to view tasks")
    # TODO: no check for no scopes at all

    result = await db_session.execute(statement)

    db_task = result.scalars().first()
    if db_task is None:
        raise AQDDBTaskNonExisting(
            "DB query failed due to non-existing task with the specified task id."
        )

    task_info = await _update_task_info(task_id=db_task.task_id, wait=False)

    return await task_orm_to_model(
        value=db_task, task_info=task_info, experiment_uuid=db_task.experiment.uuid
    )


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_all_tasks(  # pylint: disable=too-many-arguments
    user_info: UserInfo,
    db_session: AsyncSession,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    extension_name: Optional[str] = None,
    action_name: Optional[str] = None,
    experiment_uuid: Optional[UUID] = None,
    order_by_creation_date: bool = True,
) -> List[TaskRead]:
    """Get list of all tasks."""
    statement = select(orm.Task).options(joinedload(orm.Task.experiment))

    if not user_info.can_view_any_experiment():
        statement = statement.join(orm.Experiment).filter(
            orm.Experiment.created_by == user_info.uuid
        )
    if not user_info.can_view_any_task():
        statement = statement.filter(orm.Task.created_by == user_info.uuid)

    # cannot view any tasks
    if not user_info.can_view_task_owned_by(user_info.uuid):
        # raise AQDPermission("User has no permission to view tasks")
        return []

    if experiment_uuid is not None:
        statement = statement.join(orm.Experiment).filter(orm.Experiment.uuid == experiment_uuid)

    if action_name is not None:
        statement = statement.filter(orm.Task.action_name == action_name)

    if extension_name is not None:
        statement = statement.filter(orm.Task.extension_name == extension_name)

    utc_start_date = start_date.astimezone(timezone.utc) if start_date else None
    utc_end_date = end_date.astimezone(timezone.utc) if end_date else None
    if utc_start_date is not None and utc_end_date is not None:
        statement = statement.filter(orm.Task.created_at.between(utc_start_date, utc_end_date))
    elif start_date is not None:
        statement = statement.filter(orm.Task.created_at >= utc_start_date)
    elif end_date is not None:
        statement = statement.filter(orm.Task.created_at <= utc_end_date)

    if order_by_creation_date:
        statement = statement.order_by(orm.Task.created_at.desc())

    result = await db_session.execute(statement)

    tasks_list = []

    for item in result.unique().scalars().all():
        task_info = await _update_task_info(task_id=item.task_id, wait=False)

        tasks_list.append(
            await task_orm_to_model(
                value=item, task_info=task_info, experiment_uuid=item.experiment.uuid
            )
        )
    return tasks_list
