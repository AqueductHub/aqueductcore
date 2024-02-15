"""Functions for performing operations on experiments."""
import errno
import os
from datetime import date, datetime, time
from typing import Callable, List, Optional, Tuple
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from aqueductcore.backend.models import orm
from aqueductcore.backend.schemas.experiment import ExperimentRead, TagCreate, TagRead
from aqueductcore.backend.server.errors import (
    ECSDBError,
    ECSDBExperimentNonExisting,
    ECSFilesPathError,
    ECSValidationError,
)
from aqueductcore.backend.services.utils import (
    experiment_orm_to_model,
    generate_id_and_alias,
    tag_model_to_orm,
    tag_orm_to_model,
)
from aqueductcore.backend.services.validators import (
    validate_description,
    validate_experiment_filters,
    validate_tags,
    validate_title,
)


ARCHIVED = "__archived__"
func: Callable


async def get_all_experiments(  # pylint: disable=too-many-arguments
    db_session: AsyncSession,
    title: Optional[str] = None,
    tags: Optional[List[str]] = None,
    should_include_tags: Optional[List[str]] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    order_by_creation_date: bool = False,
) -> List[ExperimentRead]:
    """Get list of all experiments

    Args:
        db_session: Database async session.
        filters: Filter information.

    Returns:
        List of experiments data models.

    """

    try:
        validate_experiment_filters(title, tags, should_include_tags)
    except ECSValidationError: # pylint: disable=try-except-raise
        raise

    statement = select(orm.Experiment).options(joinedload(orm.Experiment.tags))

    if title is not None:
        statement = statement.filter(
            or_(
                orm.Experiment.title.ilike(f"%{title}%"),
                orm.Experiment.alias.ilike(f"%{title}%"),
            )
        )

    if start_date is not None and end_date is not None:
        start_date = datetime.combine(start_date, time.min)
        end_date = datetime.combine(end_date, time.max)
        statement = statement.filter(orm.Experiment.created_at.between(start_date, end_date))
    elif start_date is not None:
        start_date = datetime.combine(start_date, time.min)
        statement = statement.filter(orm.Experiment.created_at >= start_date)
    elif end_date is not None:
        end_date = datetime.combine(end_date, time.max)
        statement = statement.filter(orm.Experiment.created_at <= end_date)

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


async def get_experiment_by_uuid(db_session: AsyncSession, experiment_id: UUID) -> ExperimentRead:
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
        .where(orm.Experiment.id == experiment_id)
    )

    result = await db_session.execute(statement)

    experiment = result.scalars().first()
    if experiment is None:
        raise ECSDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified ID."
        )

    return await experiment_orm_to_model(experiment)


async def get_experiment_by_alias(db_session: AsyncSession, alias: str) -> ExperimentRead:
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
        .where(orm.Experiment.alias == alias)
    )

    result = await db_session.execute(statement)

    experiment = result.scalars().first()
    if experiment is None:
        raise ECSDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified alias."
        )

    return await experiment_orm_to_model(experiment)


def build_experiment_dir_absolute_path(experiments_root_dir: str, experiment_id: UUID) -> str:
    """Function to build experiment absolute path from root directory and experiment id."""
    return os.path.join(experiments_root_dir, str(experiment_id))


async def get_experiment_files(
    experiments_root_dir: str, experiment_id: UUID
) -> List[Tuple[str, datetime]]:
    """Returns the list of the file names associated with the experiment.

    Args:
        experiments_root_dir: Directory to search for experiments' directories based on their ID.
        experiment_id: ID of the experiment.

    Returns:
        List of file names associated with the experiment.

    """
    file_names: List[Tuple[str, datetime]] = []

    folder_path = build_experiment_dir_absolute_path(experiments_root_dir, experiment_id)

    try:
        with os.scandir(folder_path) as file_iterator:
            for entry in file_iterator:
                if entry.is_file(follow_symlinks=False):
                    file_names.append((entry.name, datetime.fromtimestamp(entry.stat().st_mtime)))

    except OSError as error:
        if error.errno in (errno.EACCES, errno.EPERM):  # Permission denied
            raise ECSFilesPathError("Error in reading the files: Permission denied.") from error
        if error.errno == errno.ENOENT:  # File not found
            return []
        raise ECSFilesPathError("Unknown Error in accessing the file system.") from error

    return file_names


async def create_db_experiment(
    db_session: AsyncSession, title: str, description: str, tags: List[str]
) -> ExperimentRead:
    """Create an experiment"""

    try:
        validate_title(title)
        validate_description(description)
        validate_tags(tags)
    except ECSValidationError: # pylint: disable=try-except-raise
        raise

    input_tag_keys = [tag.lower() for tag in tags]
    tags_in_db_statement = select(orm.Tag).filter(orm.Tag.key.in_(input_tag_keys))
    result = await db_session.execute(tags_in_db_statement)
    tags_in_db = result.scalars().all()

    tags_orm = []
    key_list = [item.key for item in tags_in_db]
    for tag in set(tags):
        if tag.lower() not in key_list:
            tags_orm.append(orm.Tag(name=tag, key=tag.lower()))

    experiment_id, alias = generate_id_and_alias()
    db_experiment = orm.Experiment(
        id=experiment_id,
        title=title,
        description=description,
        tags=tags_orm,
        alias=alias,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db_session.add(db_experiment)

    for db_tag in tags_in_db:
        db_experiment.tags.append(db_tag)

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


async def update_db_experiment(
    db_session: AsyncSession,
    experiment_id: UUID,
    title: Optional[str] = None,
    description: Optional[str] = None,
) -> ExperimentRead:
    """Update experiment details"""

    try:
        validate_title(title)
        validate_description(description)
    except ECSValidationError: # pylint: disable=try-except-raise
        raise

    statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .where(orm.Experiment.id == experiment_id)
    )
    result = await db_session.execute(statement)

    db_experiment = result.scalars().first()
    if db_experiment is None:
        raise ECSDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified ID."
        )

    if title:
        db_experiment.title = title

    if description:
        db_experiment.description = description

    db_experiment.updated_at = datetime.now()
    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


async def add_db_tag_to_experiment(
    db_session: AsyncSession, experiment_id: UUID, tag: str
) -> ExperimentRead:
    """Add tag to experiment"""

    experiment_statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .filter(orm.Experiment.id == experiment_id)
    )
    experiment_result = await db_session.execute(experiment_statement)
    db_experiment = experiment_result.scalars().first()
    if db_experiment is None:
        raise ECSDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified ID."
        )

    tag_key = tag.lower()
    experiment_tags = [tag.key for tag in db_experiment.tags]

    if tag_key in experiment_tags:
        raise ECSDBError("DB query failed due to pre-existing tag with the Experiment.")

    tag_statement = select(orm.Tag).filter(orm.Tag.key == tag_key)

    result = await db_session.execute(tag_statement)
    db_tag = result.scalars().first()
    if db_tag is None:
        db_tag = orm.Tag(name=tag, key=tag_key)
        db_session.add(db_tag)

    db_experiment.tags.append(db_tag)

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


async def remove_db_tag_from_experiment(
    db_session: AsyncSession, experiment_id: UUID, tag: str
) -> ExperimentRead:
    """Add tag to experiment"""

    experiment_statement = (
        select(orm.Experiment)
        .options(joinedload(orm.Experiment.tags))
        .filter(orm.Experiment.id == experiment_id)
    )
    result = await db_session.execute(experiment_statement)
    db_experiment = result.scalars().first()
    if db_experiment is None:
        raise ECSDBExperimentNonExisting(
            "DB query failed due to non-existing experiment with the specified ID."
        )

    tag_key = tag.lower()
    experiment_tags = [tag_db.key for tag_db in db_experiment.tags]

    if tag_key not in experiment_tags:
        raise ECSDBError("DB query failed due to non-existing tag with the provided experiment.")

    db_experiment.tags = [tag for tag in db_experiment.tags if tag.key != tag_key]

    await db_session.commit()

    return await experiment_orm_to_model(db_experiment)


async def get_all_tags(db_session: AsyncSession, include_dangling=False) -> List[TagRead]:
    """Get list of all tags"""
    statement = select(orm.Tag)
    if not include_dangling:
        statement = statement.join_from(orm.Tag, orm.experiment_tag_association).distinct()

    result = await db_session.execute(statement)

    return [tag_orm_to_model(item) for item in result.scalars().all()]


async def get_tag_by_name(db_session: AsyncSession, tag_name: str) -> Optional[TagRead]:
    """Get tag by ID"""
    statement = select(orm.Tag).filter(orm.Tag.name == tag_name)
    result = await db_session.execute(statement)
    tag = result.scalars().first()
    if tag is None:
        raise ECSDBError("DB query failed due to non-existing tag with the specified ID.")

    return tag_orm_to_model(tag)


async def create_tag(db_session: AsyncSession, tag: TagCreate) -> TagRead:
    """Create a tag with given name"""
    db_tag = tag_model_to_orm(tag)
    db_session.add(db_tag)
    await db_session.commit()

    return tag_orm_to_model(db_tag)
