"""GraphQL Query Controller."""

from __future__ import annotations

from datetime import date
from typing import List, Optional, cast

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
    Tags,
    UserInfo,
)


@strawberry.input
class ExperimentFiltersInput:
    """Filters to be applied for experiments"""

    title: Optional[str] = strawberry.field(
        default=None, description="Search string for experiment title and alias."
    )
    tags: Optional[List[str]] = strawberry.field(
        default=None, description="List of tags to filter."
    )
    should_include_tags: Optional[List[str]] = strawberry.field(
        default=None, description="List of tags that should be present."
    )
    start_date: Optional[date] = strawberry.field(
        default=None, description="Filter experiments created after this date."
    )
    end_date: Optional[date] = strawberry.field(
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
