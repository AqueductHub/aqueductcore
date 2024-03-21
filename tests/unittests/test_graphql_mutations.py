# pylint: skip-file
# mypy: ignore-errors
from os.path import exists
from typing import List

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry import Schema

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.routers.graphql.mutations_schema import Mutation
from aqueductcore.backend.routers.graphql.query_schema import Query
from aqueductcore.backend.services.experiment import build_experiment_dir_absolute_path
from aqueductcore.backend.services.utils import experiment_model_to_orm
from aqueductcore.backend.services.validators import (
    MAX_EXPERIMENT_DESCRIPTION_LENGTH,
    MAX_EXPERIMENT_TAGS_NUM,
    MAX_EXPERIMENT_TITLE_LENGTH,
)
from aqueductcore.backend.settings import settings
from tests.unittests.initial_data import experiment_data


@pytest.fixture()
def experiments_data() -> List[ExperimentCreate]:
    data = experiment_data
    return data


create_experiment_mutation = """
    mutation CreateExperiment {
        createExperiment(
            createExperimentInput: {
                title: "Quantum Supremacy and Benchmarking Quantum Processors",
                description: "Assess the quantum supremacy of state-of-the-art processors through rigorous benchmarking, pushing the boundaries of computational capabilities.",
                tags: [
                    "fusion",
                    "cold"
                ]
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""


create_experiment_mutation_invalid_title = (
    """
    mutation CreateExperiment {
        createExperiment(
            createExperimentInput: {
                title: \""""
    + "".join("a" for _ in range(MAX_EXPERIMENT_TITLE_LENGTH + 1))
    + """\",
                description: "Assess the quantum supremacy of state-of-the-art processors through rigorous benchmarking, pushing the boundaries of computational capabilities.",
                tags: [
                    "fusion",
                    "cold"
                ]
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""
)


create_experiment_mutation_invalid_description = (
    """
    mutation CreateExperiment {
        createExperiment(
            createExperimentInput: {
                title: "Quantum Supremacy and Benchmarking Quantum Processors",
                description: \""""
    + "".join("a" for _ in range(MAX_EXPERIMENT_DESCRIPTION_LENGTH + 1))
    + """\",
                tags: [
                    "fusion",
                    "cold"
                ]
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""
)


create_experiment_mutation_over_limit_tags = (
    """
    mutation CreateExperiment {
        createExperiment(
            createExperimentInput: {
                title: "Quantum Supremacy and Benchmarking Quantum Processors",
                description: "Assess the quantum supremacy of state-of-the-art processors through rigorous benchmarking, pushing the boundaries of computational capabilities.",
                tags: ["""
    + ",".join(f'"{tag}"' for tag in range(MAX_EXPERIMENT_TAGS_NUM + 1))
    + """]
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""
)


create_experiment_mutation_invalid_tags = """
    mutation CreateExperiment {
        createExperiment(
            createExperimentInput: {
                title: "Quantum Supremacy and Benchmarking Quantum Processors",
                description: "Assess the quantum supremacy of state-of-the-art processors through rigorous benchmarking, pushing the boundaries of computational capabilities.",
                tags: ["tag$1"]
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""


update_experiment_mutation = """
    mutation UpdateExperiment {
        updateExperiment(
            experimentId: "1adb18c4-3adf-40cf-bcc7-4b32d1d22be7",
            experimentUpdateInput: {
                title: "Quantum Computing in Climate Modeling and Simulation",
                description: "Explore the intricate dance of entangled qubits in quantum arrays, unraveling the mysteries of their dynamic correlations and potential applications in quantum information processing.",
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""

add_tag_to_experiment_mutation = """
    mutation AddTagToExperiment {
        addTagToExperiment(
            experimentTagInput: {
                experimentId: "852b81bb-ced4-4c8d-8176-9c7184206638"
                tag: "quera"
            }
        ) {
            id
            title
            description
            tags
            createdAt
            updatedAt
            alias
        }
    }
"""

remove_tag_from_experiment_mutation = """
    mutation RemoveTagFromExperiment {
        removeTagFromExperiment(
            experimentTagInput: {
                experimentId: "877a14dd-124c-4c43-bcc2-2cf2ce9aa991"
                tag: "laser"
            }
        ) {
                id
                title
                description
                tags
                createdAt
                updatedAt
                alias
        }
    }
"""


remove_tag_from_experiment_mutation = """
    mutation RemoveTagFromExperiment {
        removeTagFromExperiment(
            experimentTagInput: {
                experimentId: "877a14dd-124c-4c43-bcc2-2cf2ce9aa991"
                tag: "laser"
            }
        ) {
                id
                title
                description
                tags
                createdAt
                updatedAt
                alias
        }
    }
"""


remove_experiment_mutation = """
    mutation RemoveExperiment {
        removeExperiment(
            experimentRemoveInput: {
                experimentId: "1adb18c4-3adf-40cf-bcc7-4b32d1d22be7"
            }
        )
    }
"""


@pytest.mark.asyncio
async def test_create_experiment_invalid_title(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(create_experiment_mutation_invalid_title, context_value=context)

    assert resp.errors is not None
    assert (
        resp.errors[0].message
        == f"Title should be maximum {MAX_EXPERIMENT_TITLE_LENGTH} characters long."
    )


@pytest.mark.asyncio
async def test_create_experiment_invalid_description(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(
        create_experiment_mutation_invalid_description, context_value=context
    )

    assert resp.errors is not None
    assert (
        resp.errors[0].message
        == f"Description should be maximum {MAX_EXPERIMENT_DESCRIPTION_LENGTH} characters long."
    )


@pytest.mark.asyncio
async def test_create_experiment_invalid_tags(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(create_experiment_mutation_invalid_tags, context_value=context)

    assert resp.data is None
    assert resp.errors is not None
    assert "Tag should be less than" in resp.errors[0].message


@pytest.mark.asyncio
async def test_create_experiment_over_limit_tags(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(create_experiment_mutation_over_limit_tags, context_value=context)

    assert resp.errors is not None
    assert (
        resp.errors[0].message
        == f"You can have a maximum of {MAX_EXPERIMENT_TAGS_NUM} tags in an experiment."
    )


@pytest.mark.asyncio
async def test_update_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test update experiment graphql mutation"""

    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(update_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["updateExperiment"]
    assert resp_data["title"] == "Quantum Computing in Climate Modeling and Simulation"
    assert (
        resp_data["description"]
        == "Explore the intricate dance of entangled qubits in quantum arrays, unraveling the mysteries of their dynamic correlations and potential applications in quantum information processing."
    )


@pytest.mark.asyncio
async def test_add_tag_to_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test add tag to experiment graphql mutation"""
    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(add_tag_to_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["addTagToExperiment"]
    assert "quera" in resp_data["tags"]


@pytest.mark.asyncio
async def test_remove_tag_from_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test remove tag from experiment graphql mutation"""

    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(remove_tag_from_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["removeTagFromExperiment"]
    assert "laser" not in resp_data["tags"]


@pytest.mark.asyncio
async def test_remove_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test remove tag from experiment graphql mutation"""

    db_experiments = []
    for experiment in experiments_data:
        db_exerperiment = experiment_model_to_orm(experiment)
        db_experiments.append(db_exerperiment)
        db_session.add(db_exerperiment)
        await db_session.commit()
        await db_session.refresh(db_exerperiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(db_session=db_session)
    resp = await schema.execute(remove_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    experiment_files_path = build_experiment_dir_absolute_path(
        experiments_root_dir=str(settings.experiments_dir_path), experiment_id=experiment.id
    )
    assert exists(experiment_files_path) == False
