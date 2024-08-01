"""GraphQL Query Controller."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Optional, cast
from uuid import UUID

import strawberry
from strawberry.types import Info

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.routers.graphql.inputs import ExperimentIdentifierInput
from aqueductcore.backend.routers.graphql.resolvers.experiment_resolver import (
    get_current_user_info,
    get_experiment,
    get_expriments,
)
from aqueductcore.backend.routers.graphql.resolvers.tags_resolver import get_tags
from aqueductcore.backend.routers.graphql.types import (
    ExperimentData,
    Experiments,
    ExtensionInfo,
    Tags,
    TaskInfo,
    TaskStatus,
    UserInfo,
)
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor


def _timedelta_to_string(duration: timedelta) -> str:
    if duration < timedelta(0.0):
        return "<unknown>"

    if duration < timedelta(seconds=60):
        seconds = int(duration.total_seconds())
        result = f"{seconds} second"
        if seconds != 1:
            result += "s"
        return result

    if duration < timedelta(minutes=60):
        minutes = duration.seconds // 60
        result = f"{minutes} minute"
        if minutes != 1:
            result += "s"
        return result

    if duration < timedelta(hours=24):
        hours = duration.seconds // 3600
        result = f"{hours} hour"
        if hours != 1:
            result += "s"
        return result

    result = f"{duration.days} day"
    if duration.days != 1:
        result += "s"
    return result


@strawberry.input
class ExperimentFiltersInput:
    """Filters to be applied for experiments"""

    title: Optional[str] = strawberry.field(
        default=None, description="Search string for experiment title and EID."
    )
    tags: Optional[List[str]] = strawberry.field(
        default=None, description="List of tags to filter."
    )
    should_include_tags: Optional[List[str]] = strawberry.field(
        default=None, description="List of tags that should be present."
    )
    start_date: Optional[datetime] = strawberry.field(
        default=None, description="Filter experiments created after this date."
    )
    end_date: Optional[datetime] = strawberry.field(
        default=None, description="Filter experiments created after this date."
    )


@strawberry.input
class TagsFilters:
    """Filters to be applied for experiments"""

    include_dangling: Optional[bool] = strawberry.field(
        default=None, description="Include tags with no experiments linked."
    )


@strawberry.type
class Query:
    """GraphQL query controller."""

    @strawberry.field
    async def get_current_user_info(self, info: Info) -> UserInfo:
        """Resolver for getting the currently logged in user info."""
        context = cast(ServerContext, info.context)

        return get_current_user_info(context=context)

    @strawberry.field
    async def experiments(
        self, info: Info, offset: int, limit: int, filters: Optional[ExperimentFiltersInput] = None
    ) -> Experiments:
        """Resolver for the experiments."""
        context = cast(ServerContext, info.context)
        experiments = await get_expriments(
            context=context, offset=offset, limit=limit, filters=filters
        )
        return experiments

    @strawberry.field
    async def experiment(
        self, info: Info, experiment_identifier: ExperimentIdentifierInput
    ) -> Optional[ExperimentData]:
        """Resolver for a single experiment."""
        context = cast(ServerContext, info.context)
        experiment = await get_experiment(
            context=context, experiment_identifier=experiment_identifier
        )
        return experiment

    @strawberry.field
    async def tags(
        self,
        info: Info,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        filters: Optional[TagsFilters] = None,
    ) -> Tags:
        """Resolver for the tags."""
        context = cast(ServerContext, info.context)
        tags = await get_tags(context=context, limit=limit, offset=offset, filters=filters)
        return tags

    @strawberry.field
    async def extensions(self) -> List[ExtensionInfo]:
        """List of extensions available now"""
        return list(map(ExtensionInfo.from_extension, ExtensionsExecutor.list_extensions()))

    @strawberry.field
    async def task_status(
        self,
        info: Info,
        task_id: UUID,
    ) -> Optional[TaskInfo]:
        """ Returns information about the task
        with a given identifier. If id is unknown,
        returns None.
        """
        ids = []
        for i in range(35):
            uuid = UUID(f"{{12345678-{i:04}-5678-1234-567812345678}}")
            ids.append(uuid)
        if task_id in ids:
            position = ids.index(task_id)
            vals = list(TaskStatus._value2member_map_)
            return TaskInfo(
                task_id=task_id,
                eid=f"20240801-{position}",
                author="Tom",
                extension_name="Mock extension name",
                action_name="Mock action name",
                receive_time=datetime.now(),
                started_time=datetime(2023, 12, 1 + position % 30, 23, 59, position, 999),
                task_runtime=_timedelta_to_string(
                    datetime.now() - datetime(2023, 12, 1 + position % 30, 23, 59, 59, 999)
                ),
                ended_time=None,
                task_state=TaskStatus(vals[position % len(vals)]),
                stdout_text=None,
                stderr_text=None,
                result_code=None,
            )
        else:
            return None

    @strawberry.field
    async def task_runs(
        self,
        info: Info,
        author_name: Optional[str] = None,
        extension_name: Optional[str] = None,
        experiment_id: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> List[TaskInfo]:
        """ Returns information about all tasks.
        """
        result = []
        vals = list(TaskStatus._value2member_map_)

        for i in range(35):
            uuid = UUID(f"{{12345678-{i:04}-5678-1234-567812345678}}")
            task = TaskInfo(
                task_id=uuid,
                eid=f"20240801-{i // 4}",
                author=f"Tom-{i % 3}",
                extension_name=f"Mock extension name {i // 10}",
                action_name=f"Mock action name - {i % 7}",
                receive_time=datetime.now(),
                started_time=datetime(2023, 12, 1 + i % 30, 23, 59, i, 999),
                task_runtime=_timedelta_to_string(
                    datetime.now() - datetime(2023, 12, 1 + i % 30, 23, 59, 59, 999)
                ),
                ended_time=None,
                task_state=TaskStatus(vals[i % len(vals)]),
                stdout_text=None,
                stderr_text=None,
                result_code=None,
            )
            result.append(task)

        if author_name is not None:
            result = [t for t in result if t.author == author_name]

        if experiment_id is not None:
            result = [t for t in result if t.eid == experiment_id]

        if extension_name is not None:
            result = [t for t in result if t.extension_name == extension_name]

        if offset is not None:
            result = result[offset:]
        if limit is not None:
            result = result[:limit]
        return result
