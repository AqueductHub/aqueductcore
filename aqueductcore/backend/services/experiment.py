"""Functions for performing operations on experiments."""

import errno
import os
import re
from datetime import date, datetime, time, timezone
from shutil import rmtree
from typing import Callable, List, Optional, Tuple
from uuid import UUID

from pydantic import ConfigDict, Field, validate_call
from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from aqueductcore.backend.context import UserInfo, UserScope
from aqueductcore.backend.errors import (
    AQDDBError,
    AQDDBExperimentNonExisting,
    AQDFilesPathError,
    AQDPermission,
    AQDValidationError,
)
from aqueductcore.backend.models import orm
from aqueductcore.backend.models.experiment import ExperimentRead, TagCreate, TagRead
from aqueductcore.backend.services.utils import (
    experiment_orm_to_model,
    generate_experiment_id_and_alias,
    tag_model_to_orm,
    tag_orm_to_model,
)
from aqueductcore.backend.services.validators import (
    MAX_EXPERIMENT_SHOULD_INCLUDE_TAGS_NUM,
    MAX_EXPERIMENT_TAGS_ALLOWED_IN_FILTER,
    MAX_EXPERIMENT_TAGS_NUM,
    ExperimentDescription,
    ExperimentTag,
    ExperimentTitle,
    ExperimentTitleFilter,
)
from aqueductcore.backend.settings import settings

ARCHIVED = "__archived__"

# pylint: disable=redefined-outer-name
func: Callable


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_all_experiments(  # pylint: disable=too-many-arguments
    user_info: UserInfo,
    db_session: AsyncSession,
    title_filter: Optional[ExperimentTitleFilter] = None,
    tags: Optional[List[ExperimentTag]] = Field(
        None, max_length=MAX_EXPERIMENT_TAGS_ALLOWED_IN_FILTER
    ),
    should_include_tags: Optional[List[ExperimentTag]] = Field(
        None, max_length=MAX_EXPERIMENT_SHOULD_INCLUDE_TAGS_NUM
    ),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    order_by_creation_date: bool = False,
) -> List[ExperimentRead]:
    """Get list of all experiments

    Args:
        db_session: Database async session.
        filters: Filter information.

    Returns:
        List of experiments data models.

    """

    statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
    )

    if UserScope.EXPERIMENT_VIEW_ALL not in user_info.scopes:
        statement = statement.filter(orm.Experiment.created_by == user_info.user_id)

    if title_filter is not None:
        statement = statement.filter(
            or_(
                orm.Experiment.title.ilike(f"%{title_filter}%"),
                orm.Experiment.alias.ilike(f"%{title_filter}%"),
            )
        )

    utc_start_date = start_date.astimezone(timezone.utc) if start_date else None
    utc_end_date = end_date.astimezone(timezone.utc) if end_date else None
    if utc_start_date is not None and utc_end_date is not None:
        statement = statement.filter(
            orm.Experiment.created_at.between(utc_start_date, utc_end_date)
        )
    elif start_date is not None:
        statement = statement.filter(orm.Experiment.created_at >= utc_start_date)
    elif end_date is not None:
        statement = statement.filter(orm.Experiment.created_at <= utc_end_date)

    if tags is not None:
        tags = [tag.lower() for tag in tags]
        statement = statement.join(orm.Experiment.tags).where(orm.Tag.key.in_(tags))

    if order_by_creation_date:
        statement = statement.order_by(orm.Experiment.created_at.desc())

    if should_include_tags is not None:
        should_include_tags = [tag.lower() for tag in should_include_tags]
        filtered_experiments = (
            select(orm.Experiment.id)
            .options(joinedload(orm.Experiment.tags))
            .join(
                orm.experiment_tag_association,
                orm.Experiment.id == orm.experiment_tag_association.c.experiment_id,
            )
            .join(orm.Tag, orm.experiment_tag_association.c.tag_key == orm.Tag.key)
            .filter(orm.Tag.key.in_(should_include_tags))
            .group_by(orm.Experiment.id)
            .having(func.count(orm.Tag.key) == len(should_include_tags))
        )
        statement = statement.filter(orm.Experiment.id.in_(filtered_experiments))

    if not (should_include_tags and (ARCHIVED in should_include_tags)):
        statement = statement.filter(~orm.Experiment.tags.any(orm.Tag.key.like(ARCHIVED)))

    result = await db_session.execute(statement)
    return [(await experiment_orm_to_model(item)) for item in result.unique().scalars().all()]


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_experiment_by_uuid(
    user_info: UserInfo, db_session: AsyncSession, experiment_id: UUID
) -> ExperimentRead:
    """Get experiment by Experiment ID

    Args:
        db_session: Database async session.
        experiment_id: ID of the experiment.

    Returns:
        Experiment data model.
    """
    statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
        .where(orm.Experiment.id == experiment_id)
    )

    if UserScope.EXPERIMENT_VIEW_ALL not in user_info.scopes:
        statement = statement.filter(orm.Experiment.created_by == user_info.user_id)

    result = await db_session.execute(statement)

    experiment = result.scalars().first()
    if experiment is None:
        raise AQDDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified ID."
        )

    return await experiment_orm_to_model(experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_experiment_by_alias(
    user_info: UserInfo, db_session: AsyncSession, alias: str
) -> ExperimentRead:
    """Get experiment by experiment unique alias

    Args:
        db_session: Database async session.
        alias: Unique alias of the experiment.

    Returns:
        Experiment data model.
    """
    statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
        .where(orm.Experiment.alias == alias)
    )

    if UserScope.EXPERIMENT_VIEW_ALL not in user_info.scopes:
        statement = statement.filter(orm.Experiment.created_by == user_info.user_id)

    result = await db_session.execute(statement)

    experiment = result.scalars().first()
    if experiment is None:
        raise AQDDBExperimentNonExisting(
            "Non-existing experiment with the specified alias for the user."
        )

    return await experiment_orm_to_model(experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
def build_experiment_dir_absolute_path(experiments_root_dir: str, experiment_id: UUID) -> str:
    """Function to build experiment absolute path from root directory and experiment id."""
    return os.path.join(experiments_root_dir, str(experiment_id))


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_experiment_files(
    user_info: UserInfo, db_session: AsyncSession, experiments_root_dir: str, experiment_id: UUID
) -> List[Tuple[str, datetime]]:
    """Returns the list of the file names associated with the experiment.

    Args:
        experiments_root_dir: Directory to search for experiments' directories based on their ID.
        experiment_id: ID of the experiment.

    Returns:
        List of file names associated with the experiment.

    """
    file_names: List[Tuple[str, datetime]] = []

    # check access to the experiment by retrieving it.
    await get_experiment_by_uuid(
        user_info=user_info, db_session=db_session, experiment_id=experiment_id
    )

    folder_path = build_experiment_dir_absolute_path(experiments_root_dir, experiment_id)

    try:
        with os.scandir(folder_path) as file_iterator:
            for entry in file_iterator:
                if entry.is_file(follow_symlinks=False):
                    file_names.append(
                        (entry.name, datetime.fromtimestamp(entry.stat().st_mtime, tz=timezone.utc))
                    )

    except OSError as error:
        if error.errno in (errno.EACCES, errno.EPERM):  # Permission denied
            raise AQDFilesPathError("Error in reading the files: Permission denied.") from error
        if error.errno == errno.ENOENT:  # File not found
            return []
        raise AQDFilesPathError("Unknown Error in accessing the file system.") from error

    return file_names


EXPERIMENT_ALIAS_PATTERN = r"^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[012])([123]0|[012][1-9]|31)-(\d+)$"


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
# pylint: disable=too-many-locals
async def create_experiment(
    user_info: UserInfo,
    db_session: AsyncSession,
    title: ExperimentTitle,
    description: ExperimentDescription,
    tags: List[ExperimentTag],
) -> ExperimentRead:
    """Create an experiment"""

    if len(tags) > MAX_EXPERIMENT_TAGS_NUM:
        raise AQDValidationError(
            f"You can have a maximum of {MAX_EXPERIMENT_TAGS_NUM} tags in an experiment."
        )

    if UserScope.EXPERIMENT_CREATE_OWN not in user_info.scopes:
        raise AQDPermission(
            "The user doesn't have the required permission(s) to create experiments."
        )

    input_tag_keys = [tag.lower() for tag in tags]
    tags_in_db_statement = select(orm.Tag).filter(orm.Tag.key.in_(input_tag_keys))
    tags_in_db = (await db_session.execute(tags_in_db_statement)).scalars().all()

    tags_orm = []
    key_list = [item.key for item in tags_in_db]
    for tag in set(tags):
        if tag.lower() not in key_list:
            tags_orm.append(orm.Tag(name=tag, key=tag.lower()))

    # get last created experiment of the day
    today = datetime.combine(date.today(), time.min)
    today_experiments_statement = (
        select(orm.Experiment.alias)
        .filter(orm.Experiment.created_at >= today)
        .where(orm.Experiment.alias.regexp_match(EXPERIMENT_ALIAS_PATTERN))
    )
    today_experiments = (await db_session.execute(today_experiments_statement)).scalars().all()

    if not today_experiments:
        experiment_id, alias = generate_experiment_id_and_alias(experiment_index=1)
    else:
        last_experiment_alias = sorted(today_experiments, key=lambda x: int(x.split("-")[-1]))[-1]
        if re.match(EXPERIMENT_ALIAS_PATTERN, last_experiment_alias):
            index = int(last_experiment_alias.split("-")[-1])
            experiment_id, alias = generate_experiment_id_and_alias(experiment_index=index + 1)
        else:
            experiment_id, alias = generate_experiment_id_and_alias(experiment_index=1)

    db_user_statement = select(orm.User).where(orm.User.id == user_info.user_id)
    db_user = (await db_session.execute(db_user_statement)).scalars().first()

    if not db_user:
        db_user = orm.User(
            id=user_info.user_id,
            username=user_info.username,
        )
        db_session.add(db_user)

    db_experiment = orm.Experiment(
        id=experiment_id,
        title=title,
        description=description,
        tags=tags_orm,
        alias=alias,
        created_by_user=db_user,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(db_experiment)

    for db_tag in tags_in_db:
        db_experiment.tags.append(db_tag)

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def update_experiment(
    user_info: UserInfo,
    db_session: AsyncSession,
    experiment_id: UUID,
    title: Optional[ExperimentTitle] = None,
    description: Optional[ExperimentDescription] = None,
) -> ExperimentRead:
    """Update experiment details"""

    statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
        .where(orm.Experiment.id == experiment_id)
    )

    if UserScope.EXPERIMENT_EDIT_ALL not in user_info.scopes:
        statement = statement.filter(orm.Experiment.created_by == user_info.user_id)

    result = await db_session.execute(statement)

    db_experiment = result.scalars().first()
    if db_experiment is None:
        raise AQDDBExperimentNonExisting(
            "Non-existing experiment with the specified ID for the user."
        )

    if title:
        db_experiment.title = title

    if description:
        db_experiment.description = description

    db_experiment.updated_at = datetime.now(timezone.utc)
    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def add_tag_to_experiment(
    user_info: UserInfo, db_session: AsyncSession, experiment_id: UUID, tag: ExperimentTag
) -> ExperimentRead:
    """Add tag to experiment"""

    experiment_statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
        .filter(orm.Experiment.id == experiment_id)
    )
    if UserScope.EXPERIMENT_EDIT_ALL not in user_info.scopes:
        experiment_statement = experiment_statement.filter(
            orm.Experiment.created_by == user_info.user_id
        )
    experiment_result = await db_session.execute(experiment_statement)
    db_experiment = experiment_result.scalars().first()
    if db_experiment is None:
        raise AQDDBExperimentNonExisting(
            "Non-existing experiment with the specified ID for the user."
        )

    tag_key = tag.lower()
    experiment_tags = [tag.key for tag in db_experiment.tags]

    if tag_key in experiment_tags:
        raise AQDDBError("DB query failed due to pre-existing tag with the Experiment.")

    tag_statement = select(orm.Tag).filter(orm.Tag.key == tag_key)

    result = await db_session.execute(tag_statement)
    db_tag = result.scalars().first()
    if db_tag is None:
        db_tag = orm.Tag(name=tag, key=tag_key)
        db_session.add(db_tag)

    db_experiment.tags.append(db_tag)

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def remove_tag_from_experiment(
    user_info: UserInfo, db_session: AsyncSession, experiment_id: UUID, tag: ExperimentTag
) -> ExperimentRead:
    """Add tag to experiment"""

    experiment_statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .options(joinedload(orm.Experiment.created_by_user))
        .filter(orm.Experiment.id == experiment_id)
    )
    if UserScope.EXPERIMENT_EDIT_ALL not in user_info.scopes:
        experiment_statement = experiment_statement.filter(
            orm.Experiment.created_by == user_info.user_id
        )

    result = await db_session.execute(experiment_statement)
    db_experiment = result.scalars().first()
    if db_experiment is None:
        raise AQDDBExperimentNonExisting(
            "Non-existing experiment with the specified ID for the user."
        )

    tag_key = tag.lower()
    experiment_tags = [tag_db.key for tag_db in db_experiment.tags]

    if tag_key not in experiment_tags:
        raise AQDDBError("DB query failed due to non-existing tag with the provided experiment.")

    db_experiment.tags = [tag for tag in db_experiment.tags if tag.key != tag_key]

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_all_tags(
    user_info: UserInfo, db_session: AsyncSession, include_dangling=False
) -> List[TagRead]:
    # pylint: disable=unused-argument
    """Get list of all tags"""
    statement = select(orm.Tag)
    if not include_dangling:
        statement = statement.join_from(orm.Tag, orm.experiment_tag_association).distinct()

    result = await db_session.execute(statement)

    return [tag_orm_to_model(item) for item in result.scalars().all()]


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def get_tag_by_name(
    user_info: UserInfo, db_session: AsyncSession, tag_name: ExperimentTag
) -> Optional[TagRead]:
    # pylint: disable=unused-argument
    """Get tag by ID"""
    statement = select(orm.Tag).filter(orm.Tag.name == tag_name)
    result = await db_session.execute(statement)
    tag = result.scalars().first()
    if tag is None:
        raise AQDDBError("DB query failed due to non-existing tag with the specified ID.")

    return tag_orm_to_model(tag)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def create_tag(user_info: UserInfo, db_session: AsyncSession, tag: TagCreate) -> TagRead:
    # pylint: disable=unused-argument
    """Create a tag with given name"""
    db_tag = tag_model_to_orm(tag)
    db_session.add(db_tag)
    await db_session.commit()

    return tag_orm_to_model(db_tag)


@validate_call(config=ConfigDict(arbitrary_types_allowed=True))
async def remove_experiment(
    user_info: UserInfo, db_session: AsyncSession, experiment_id: UUID
) -> UUID:
    """Remove experiment from database"""

    get_experiment_statement = select(orm.Experiment).where(orm.Experiment.id == experiment_id)

    if UserScope.EXPERIMENT_DELETE_ALL not in user_info.scopes:
        if UserScope.EXPERIMENT_DELETE_OWN not in user_info.scopes:
            raise AQDPermission("The user doesn't have the permission to remove the experiment.")

        get_experiment_statement = get_experiment_statement.filter(
            orm.Experiment.created_by == user_info.user_id
        )

    get_experiment_result = await db_session.execute(get_experiment_statement)
    if not get_experiment_result.scalars().first():
        raise AQDDBExperimentNonExisting(
            "Non-existing experiment with the specified ID for the user."
        )

    folder_path = build_experiment_dir_absolute_path(
        experiments_root_dir=str(settings.experiments_dir_path), experiment_id=experiment_id
    )

    remove_experiment_tag_links_statement = delete(orm.experiment_tag_association).where(
        orm.experiment_tag_association.c.experiment_id == experiment_id
    )

    await db_session.execute(remove_experiment_tag_links_statement)
    remove_experiment_statement = delete(orm.Experiment).where(orm.Experiment.id == experiment_id)
    await db_session.execute(remove_experiment_statement)

    rmtree(folder_path, ignore_errors=True)

    await db_session.commit()

    return experiment_id
