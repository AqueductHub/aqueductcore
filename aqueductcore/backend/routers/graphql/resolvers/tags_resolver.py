"""GraphQL Query Controller."""

from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.routers.graphql.types import Tags
from aqueductcore.backend.server.errors import ECSValidationError
from aqueductcore.backend.services.constants import MAX_TAGS_PER_REQUEST
from aqueductcore.backend.services.experiment import get_all_tags
if TYPE_CHECKING:
    from aqueductcore.backend.routers.graphql.query_schema import TagsFilters


async def get_tags(
    db_session: AsyncSession,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    filters: Optional[TagsFilters] = None,
) -> Tags:
    """Tags resolver."""

    if limit and limit > MAX_TAGS_PER_REQUEST:
        raise ECSValidationError(f"Maximum allowed limit for tags is {MAX_TAGS_PER_REQUEST}")

    include_dangling = False
    if filters:
        if filters.include_dangling:
            include_dangling = filters.include_dangling

    tags = [
        item.name
        for item in await get_all_tags(db_session=db_session, include_dangling=include_dangling)
    ]
    tags_count = len(tags)

    if offset and limit:
        tags = tags[offset : offset + limit]
    elif offset and not limit:
        tags = tags[offset:]
    elif not offset and limit:
        tags = tags[:limit]

    return Tags(tags_data=tags, total_tags_count=tags_count)
