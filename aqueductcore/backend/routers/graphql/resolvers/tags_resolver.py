"""GraphQL Query Controller."""

from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.types import Tags
from aqueductcore.backend.services.experiment import get_all_tags
from aqueductcore.backend.services.validators import MAX_TAGS_PER_REQUEST

if TYPE_CHECKING:
    from aqueductcore.backend.routers.graphql.query_schema import TagsFilters


async def get_tags(
    context: ServerContext,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    filters: Optional[TagsFilters] = None,
) -> Tags:
    """Tags resolver."""

    if limit and limit > MAX_TAGS_PER_REQUEST:
        raise AQDValidationError(f"Maximum allowed limit for tags is {MAX_TAGS_PER_REQUEST}")

    include_dangling = False
    if filters:
        if filters.include_dangling:
            include_dangling = filters.include_dangling

    tags = [
        item.name
        for item in await get_all_tags(
            user_info=context.user_info,
            db_session=context.db_session,
            include_dangling=include_dangling,
        )
    ]
    tags_count = len(tags)

    if offset and limit:
        tags = tags[offset : offset + limit]
    elif offset and not limit:
        tags = tags[offset:]
    elif not offset and limit:
        tags = tags[:limit]

    return Tags(tags_data=tags, total_tags_count=tags_count)
