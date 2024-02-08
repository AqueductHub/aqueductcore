# pylint: skip-file
# mypy: ignore-errors
from typing import List

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry import Schema

from aqueductcore.backend.routers.graphql.mutations_schema import Mutation
from aqueductcore.backend.routers.graphql.query_schema import Query
from aqueductcore.backend.schemas.experiment import ExperimentCreate
from aqueductcore.backend.server.context import ServerContext
from aqueductcore.backend.services.utils import experiment_model_to_orm
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


@pytest.mark.asyncio
async def test_create_experiment(
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
    resp = await schema.execute(create_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["createExperiment"]
    assert resp_data["title"] == "Quantum Supremacy and Benchmarking Quantum Processors"
    assert (
        resp_data["description"]
        == "Assess the quantum supremacy of state-of-the-art processors through rigorous benchmarking, pushing the boundaries of computational capabilities."
    )
    assert sorted(resp_data["tags"]) == sorted(["fusion", "cold"])


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
