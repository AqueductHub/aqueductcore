# pylint: skip-file
# mypy: ignore-errors
from os.path import exists
from typing import List
from uuid import UUID, uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry import Schema

from aqueductcore.backend.context import ServerContext, UserInfo, UserScope
from aqueductcore.backend.models import orm
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
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
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
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
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
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
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
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
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
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
        }
    }
"""


update_experiment_mutation = """
    mutation UpdateExperiment {
        updateExperiment(
            uuid: "1adb18c4-3adf-40cf-bcc7-4b32d1d22be7",
            experimentUpdateInput: {
                title: "Quantum Computing in Climate Modeling and Simulation",
                description: "Explore the intricate dance of entangled qubits in quantum arrays, unraveling the mysteries of their dynamic correlations and potential applications in quantum information processing.",
            }
        ) {
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
        }
    }
"""

add_tag_to_experiment_mutation = """
    mutation AddTagToExperiment {
        addTagToExperiment(
            experimentTagInput: {
                uuid: "852b81bb-ced4-4c8d-8176-9c7184206638"
                tag: "quera"
            }
        ) {
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
        }
    }
"""

add_tags_to_experiment_mutation = """
    mutation AddTagsToExperiment($experimentTagsInput: ExperimentTagsInput!) {
        addTagsToExperiment(
            experimentTagsInput: $experimentTagsInput
        ) {
            uuid
            title
            description
            tags
            createdAt
            createdBy
            updatedAt
            eid
        }
    }
"""

remove_tag_from_experiment_mutation = """
    mutation RemoveTagFromExperiment {
        removeTagFromExperiment(
            experimentTagInput: {
                uuid: "877a14dd-124c-4c43-bcc2-2cf2ce9aa991"
                tag: "laser"
            }
        ) {
                uuid
                title
                description
                tags
                createdAt
                createdBy
                updatedAt
                eid
        }
    }
"""


remove_tag_from_experiment_mutation = """
    mutation RemoveTagFromExperiment {
        removeTagFromExperiment(
            experimentTagInput: {
                uuid: "877a14dd-124c-4c43-bcc2-2cf2ce9aa991"
                tag: "laser"
            }
        ) {
                uuid
                title
                description
                tags
                createdAt
                createdBy
                updatedAt
                eid
        }
    }
"""


remove_experiment_mutation = """
    mutation RemoveExperiment {
        removeExperiment(
            experimentRemoveInput: {
                uuid: "1adb18c4-3adf-40cf-bcc7-4b32d1d22be7"
            }
        )
    }
"""


execute_plugin = """
  mutation ExecutePlugin {
        executePlugin(
            plugin: "Dummy plugin"
            function: "echo"
            params: [
                ["var1", "abc"],
                ["var2", "111"],
                ["var3", "1.33e+03"],
                ["var4", "PLACEHOLDER"],
                ["var5", "some\\nmultiline"],
                ["var6", "TRUE"],
                ["var7", "string4"],
            ]
    ) {
        returnCode, stderr, stdout
    }
  }
"""


@pytest.mark.asyncio
async def test_create_experiment_invalid_title(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
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

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
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
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(create_experiment_mutation_invalid_tags, context_value=context)

    assert resp.data is None
    assert resp.errors is not None
    assert (
        resp.errors[0].message
        == "Tag can only contain alphanumeric characters, colons, hyphens, underscores and slashes"
    )


@pytest.mark.asyncio
async def test_create_experiment_over_limit_tags(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test create experiment graphql mutation"""
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
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

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
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

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(add_tag_to_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["addTagToExperiment"]
    assert "quera" in resp_data["tags"]


@pytest.mark.asyncio
async def test_add_tags_to_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test add tag to experiment graphql mutation"""

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )

    expected_tags = ["test1", "test2", "test3"]
    resp = await schema.execute(
        add_tags_to_experiment_mutation,
        context_value=context,
        variable_values={
            "experimentTagsInput": {
                "uuid": str(experiments_data[0].uuid),
                "tags": expected_tags,
            }
        },
    )

    assert resp.errors is None
    assert resp.data is not None

    resp_data = resp.data["addTagsToExperiment"]
    for tag in expected_tags:
        assert tag in resp_data["tags"]

    # test duplicate tags returns error
    expected_tags = ["test1", "test2", "test2"]
    resp = await schema.execute(
        add_tags_to_experiment_mutation,
        context_value=context,
        variable_values={
            "experimentTagsInput": {
                "uuid": str(experiments_data[0].uuid),
                "tags": expected_tags,
            }
        },
    )
    assert resp.errors is not None
    assert resp.data is None
    assert resp.errors[0].message == "Duplicate tags are not allowed in the request."

    # test duplicate tags returns error
    expected_tags = ["test1", "tesT2", "test2"]
    resp = await schema.execute(
        add_tags_to_experiment_mutation,
        context_value=context,
        variable_values={
            "experimentTagsInput": {
                "uuid": str(experiments_data[0].uuid),
                "tags": expected_tags,
            }
        },
    )
    assert resp.errors is not None
    assert resp.data is None
    assert resp.errors[0].message == "Duplicate tags are not allowed in the request."


@pytest.mark.asyncio
async def test_remove_tag_from_experiment(
    db_session: AsyncSession, experiments_data: List[ExperimentCreate]
):
    """Test remove tag from experiment graphql mutation"""

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
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

    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    schema = Schema(query=Query, mutation=Mutation)

    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(remove_experiment_mutation, context_value=context)

    assert resp.errors is None
    assert resp.data is not None

    experiment_files_path = build_experiment_dir_absolute_path(
        experiments_root_dir=str(settings.experiments_dir_path), experiment_uuid=experiment.uuid
    )
    assert exists(experiment_files_path) == False


@pytest.mark.asyncio
async def test_execute_plugin_stdout_ok(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    # fixture is here to ensure that files are cleaned after execution
    temp_experiment_files,
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    exp_eid = experiment_data[0].eid
    query = execute_plugin.replace("PLACEHOLDER", exp_eid)

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query,
        context_value=context,
    )
    assert resp.errors is None
    res = resp.data["executePlugin"]
    assert res["returnCode"] == 0
    assert res["stdout"] == (
        "var1=abc\n"
        "var2=111\n"
        "var3=1.33e+03\n"
        f"var4={exp_eid}\n"
        "var5=some\nmultiline\n"
        "var6=1\n"
        "var7=string4\n"
        "dummykey=dummyvalue\n"
    )
    assert res["stderr"] == ""


@pytest.mark.asyncio
async def test_execute_plugin_stderr_ok(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    # fixture is here to ensure that files are cleaned after execution
    temp_experiment_files,
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    exp_eid = experiment_data[0].eid
    query = execute_plugin.replace("PLACEHOLDER", exp_eid)
    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query.replace("echo", "echo_stderr"),
        context_value=context,
    )
    assert resp.errors is None
    res = resp.data["executePlugin"]
    assert res["returnCode"] == 13
    assert res["stdout"] == ""
    assert res["stderr"] == (
        "var1=abc\n"
        "var2=111\n"
        "var3=1.33e+03\n"
        f"var4={exp_eid}\n"
        "var5=some\nmultiline\n"
        "var6=1\n"
        "var7=string4\n"
        "dummykey=dummyvalue\n"
    )


@pytest.mark.asyncio
async def test_execute_plugin_failed_validation(
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
    # fixture is here to ensure that files are cleaned after execution
    temp_experiment_files,
):
    db_user = orm.User(uuid=UUID(int=0), username=settings.default_username)
    db_session.add(db_user)

    db_experiments = []
    for experiment in experiments_data:
        db_experiment = experiment_model_to_orm(experiment)
        db_experiment.created_by_user = db_user
        db_experiments.append(db_experiment)
        db_session.add(db_experiment)
        await db_session.commit()
        await db_session.refresh(db_experiment)

    exp_eid = experiment_data[0].eid
    query = execute_plugin.replace("PLACEHOLDER", exp_eid)

    schema = Schema(query=Query, mutation=Mutation)
    context = ServerContext(
        db_session=db_session,
        user_info=UserInfo(uuid=uuid4(), username=settings.default_username, scopes=set(UserScope)),
    )
    resp = await schema.execute(
        query.replace("111", "non_number"),
        context_value=context,
    )
    assert resp.errors[0].message == "non_number is not int."
