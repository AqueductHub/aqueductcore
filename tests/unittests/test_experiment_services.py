# pylint: skip-file

from datetime import datetime
from typing import Dict, List, Tuple
from uuid import UUID

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.models import orm
from aqueductcore.backend.schemas.experiment import ExperimentCreate, TagCreate
from aqueductcore.backend.services.experiment import (
    add_db_tag_to_experiment,
    create_db_experiment,
    get_all_experiments,
    get_all_tags,
    get_experiment_by_alias,
    get_experiment_by_uuid,
    get_experiment_files,
    remove_db_tag_from_experiment,
    update_db_experiment,
)
from aqueductcore.backend.services.utils import experiment_model_to_orm, tag_model_to_orm
from aqueductcore.backend.settings import settings


@pytest.mark.asyncio
async def test_get_all_experiments(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_experiments operation"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    experiments = await get_all_experiments(db_session)

    assert len(experiments) == len(experiments_data)

    experiments_data = sorted(
        experiments_data,
        key=lambda experiment: [experiment.id for experiment in experiments].index(experiment.id),
    )

    for idx, item in enumerate(experiments):
        assert item.id == experiments_data[idx].id
        assert item.title == experiments_data[idx].title
        assert item.description == experiments_data[idx].description


@pytest.mark.asyncio
async def test_get_all_experiments_limit_exceeded(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_experiments with higher value of limit than allowed value"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    experiments = await get_all_experiments(db_session, order_by_creation_date=True)
    



@pytest.mark.asyncio
async def test_get_all_experiments_ordered_by_creation_date(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_experiments operation"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    experiments = await get_all_experiments(db_session, order_by_creation_date=True)

    assert len(experiments) == len(experiments_data)

    experiments_data = sorted(
        experiments_data,
        key=lambda experiment: [experiment.id for experiment in experiments].index(experiment.id),
    )

    for idx, item in enumerate(experiments):
        assert item.id == experiments_data[idx].id
        assert item.title == experiments_data[idx].title
        assert item.description == experiments_data[idx].description


@pytest.mark.asyncio
async def test_get_all_experiments_filtered_by_tag(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_experiments operation"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    experiments = await get_all_experiments(db_session, tags=["tag1"])

    assert len(experiments) == 1

    for idx, item in enumerate(experiments):
        assert item.id == experiments_data[idx].id
        assert item.title == experiments_data[idx].title
        assert item.description == experiments_data[idx].description


@pytest.mark.asyncio
async def test_get_all_experiments_filtered_by_tag_ordered_by_creation_date(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_experiments operation"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    experiments = await get_all_experiments(db_session, tags=["tag1"], order_by_creation_date=True)

    assert len(experiments) == 1

    for idx, item in enumerate(experiments):
        assert item.id == experiments_data[idx].id
        assert item.title == experiments_data[idx].title
        assert item.description == experiments_data[idx].description


@pytest.mark.asyncio
async def test_get_experiment_by_uuid(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_experiment_by_uuid operation"""

    for in_experiment in experiments_data:
        db_experiment = experiment_model_to_orm(in_experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    experiment = await get_experiment_by_uuid(db_session, experiments_data[0].id)

    assert experiment.id == experiments_data[0].id
    assert experiment.title == experiments_data[0].title
    assert experiment.description == experiments_data[0].description
    assert set([(item.key, item.name) for item in experiment.tags]) == set(
        [(item.key, item.name) for item in experiments_data[0].tags]
    )


@pytest.mark.asyncio
async def test_get_experiment_by_alias(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_experiment_by_uuid operation"""

    for in_experiment in experiments_data:
        db_experiment = experiment_model_to_orm(in_experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    experiment = await get_experiment_by_alias(db_session, experiments_data[0].alias)

    assert experiment.id == experiments_data[0].id
    assert experiment.title == experiments_data[0].title
    assert experiment.description == experiments_data[0].description
    assert set([(item.key, item.name) for item in experiment.tags]) == set(
        [(item.key, item.name) for item in experiments_data[0].tags]
    )


@pytest.mark.asyncio
async def test_create_db_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create_db_experiment operation"""

    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    in_db_experiment = await create_db_experiment(
        db_session,
        title="Quantum Communication Protocols for Secure Networks",
        description="Design and evaluate quantum communication protocols to establish secure quantum networks, exploring the potential of quantum key distribution.",
        tags=["superQc", "rabi", "Laser"],
    )

    await db_session.commit()

    assert in_db_experiment.id is not None
    assert in_db_experiment.title == "Quantum Communication Protocols for Secure Networks"
    assert (
        in_db_experiment.description
        == "Design and evaluate quantum communication protocols to establish secure quantum networks, exploring the potential of quantum key distribution."
    )
    in_db_tag_names = [tag.name for tag in in_db_experiment.tags]
    assert sorted(in_db_tag_names) == sorted(
        [
            "superQc",
            "rabi",
            "laser",
        ]
    )  # Note: "laser" tag is created in fixture


@pytest.mark.asyncio
async def test_update_db_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test update_db_experiment operation"""

    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    in_db_experiment = await update_db_experiment(
        db_session=db_session,
        experiment_id=experiments_data[0].id,
        title="Quantum-enhanced Imaging for Biomedical Applications",
        description="Utilize quantum-enhanced imaging techniques for improved resolution in biomedical applications, pushing the boundaries of medical diagnostics.",
    )
    await db_session.commit()

    assert in_db_experiment.title == "Quantum-enhanced Imaging for Biomedical Applications"
    assert (
        in_db_experiment.description
        == "Utilize quantum-enhanced imaging techniques for improved resolution in biomedical applications, pushing the boundaries of medical diagnostics."
    )


@pytest.mark.asyncio
async def test_add_db_tag_to_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test update_db_experiment operation"""

    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    in_db_experiment = await add_db_tag_to_experiment(
        db_session=db_session, experiment_id=experiments_data[0].id, tag="important"
    )
    await db_session.commit()

    in_db_experiment_tags = [tag.name for tag in in_db_experiment.tags]
    assert "important" in in_db_experiment_tags


@pytest.mark.asyncio
async def test_remove_db_tag_from_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test update_db_experiment operation"""

    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    in_db_experiment = await remove_db_tag_from_experiment(
        db_session=db_session, experiment_id=experiments_data[0].id, tag="tag1"
    )
    await db_session.commit()

    in_db_experiment_tags = [tag.name for tag in in_db_experiment.tags]
    assert "Tag1" not in in_db_experiment_tags


@pytest.mark.asyncio
async def test_get_all_tags_dangling(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_tags operation"""

    for tag in experiments_data[0].tags:
        db_tag = tag_model_to_orm(tag)
        db_session.add(db_tag)

    await db_session.commit()

    tags = await get_all_tags(db_session, include_dangling=True)
    assert len(tags) == 3
    for idx, tag in enumerate(experiments_data[0].tags):
        assert tags[idx].key == tag.key
        assert tags[idx].name == tag.name

    tags = await get_all_tags(db_session, include_dangling=False)
    assert len(tags) == 0


@pytest.mark.asyncio
async def test_get_all_tags_mix_dangling(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_tags operation"""

    no_dangling_tags_expected = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        no_dangling_tags_expected.extend(experiment.tags)
        db_session.add(db_experiment)

    dangling_tags_expected = []
    for idx in range(3):
        new_tag = TagCreate(key=f"tag_dangling_{idx}", name=f"TAG_dangling_{idx}")
        db_tag = tag_model_to_orm(new_tag)
        dangling_tags_expected.append(new_tag)
        db_session.add(db_tag)

    await db_session.commit()

    tags = await get_all_tags(db_session, include_dangling=True)
    assert len(tags) == 9
    assert set([item.key for item in tags]) == set(
        [item.key for item in no_dangling_tags_expected + dangling_tags_expected]
    )
    assert set([item.name for item in tags]) == set(
        [item.name for item in no_dangling_tags_expected + dangling_tags_expected]
    )

    tags = await get_all_tags(db_session, include_dangling=False)
    assert len(tags) == 6
    assert set([item.key for item in tags]) == set([item.key for item in no_dangling_tags_expected])
    assert set([item.name for item in tags]) == set(
        [item.name for item in no_dangling_tags_expected]
    )


@pytest.mark.asyncio
async def test_get_all_tags_no_dangling(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test get_all_tags operation"""

    tags_expected = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        tags_expected.extend(experiment.tags)
        db_session.add(db_experiment)

    await db_session.commit()

    tags = await get_all_tags(db_session, include_dangling=False)

    assert len(tags) == 6

    assert set([item.key for item in tags]) == set([item.key for item in tags_expected])
    assert set([item.name for item in tags]) == set([item.name for item in tags_expected])


@pytest.mark.asyncio
async def test_add_and_get_tags_for_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Add a tag to experiment and test if map was added"""
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    for experiment in experiments_data:
        experiment_model = await get_experiment_by_uuid(db_session, experiment_id=experiment.id)
        for idx, tag in enumerate(experiment_model.tags):
            assert tag.key == experiment.tags[idx].key
            assert tag.name == experiment.tags[idx].name


@pytest.mark.asyncio
async def test_get_experiment_files(temp_experiment_files: Dict[UUID, List[Tuple[str, datetime]]]):
    for key, value in temp_experiment_files.items():
        files = await get_experiment_files(str(settings.experiments_dir_path), experiment_id=key)
        assert set(files) == set(value)


@pytest.mark.asyncio
async def test_get_experiment_files_empty(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_session.add(db_experiment)

    await db_session.commit()

    for experiment in experiments_data:
        files = await get_experiment_files(
            str(settings.experiments_dir_path), experiment_id=experiment.id
        )
        assert len(files) == 0
