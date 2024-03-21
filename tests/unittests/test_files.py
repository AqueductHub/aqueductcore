# pylint: skip-file
import os
import shutil
from tempfile import TemporaryDirectory
from typing import AsyncGenerator, List, Tuple
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.context import (
    ServerContext,
    UserInfo,
    UserScope,
    context_dependency,
)
from aqueductcore.backend.main import app
from aqueductcore.backend.models.experiment import ExperimentCreate
from aqueductcore.backend.services.experiment import build_experiment_dir_absolute_path
from aqueductcore.backend.services.utils import experiment_model_to_orm
from aqueductcore.backend.settings import settings

BYTES_IN_KB = 1024


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


@pytest_asyncio.fixture
async def experiment_files(experiments_data: List[ExperimentCreate]):
    main_dir = settings.experiments_dir_path

    if not os.path.exists(main_dir):
        os.makedirs(main_dir)

    experiment_uuid = experiments_data[0].id
    # make experiment file.
    experiment_dir = os.path.join(main_dir, str(experiment_uuid))
    os.makedirs(experiment_dir)

    experiment_file_name = "test_file.bin"
    # file size
    test_data = bytes(bytearray(os.urandom(settings.download_chunk_size_KB * 2 * 1024)))
    with open(os.path.join(experiment_dir, experiment_file_name), mode="wb") as file:
        file.write(test_data)

    yield (str(experiment_uuid), experiment_file_name, test_data)

    shutil.rmtree(experiment_dir)


@pytest.mark.asyncio
async def test_file_download(
    client: TestClient,
    db_session: AsyncSession,
    experiment_files: Tuple[str, str, bytes],
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)
    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    response = client.get(
        f"{settings.api_prefix}{settings.files_route_prefix}/{str(experiment_files[0])}/{experiment_files[1]}"
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.content == experiment_files[2]


@pytest.mark.asyncio
async def test_nonexisting_file_download(
    client: TestClient,
    db_session: AsyncSession,
    experiment_files: Tuple[str, str, bytes],
    experiments_data: List[ExperimentCreate],
):
    experiment_file_name = "nonexisting_test_file.txt"

    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)
    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    response = client.get(
        f"{settings.api_prefix}{settings.files_route_prefix}/{str(experiment_files[0])}/{experiment_file_name}"
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "The requested file is not found."}


@pytest.mark.asyncio
async def test_nonexisting_experiment_download(
    client: TestClient,
    db_session: AsyncSession,  # unused but need to create tables in DB.
):
    non_existing_experiment_file_name = "nonexisting_test_file.txt"

    response = client.get(
        f"{settings.api_prefix}{settings.files_route_prefix}/{str(uuid4())}/{non_existing_experiment_file_name}"
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "The specified experiment was not found."}


@pytest.mark.asyncio
async def test_invalid_filename_download(
    client: TestClient,
    db_session: AsyncSession,  # unused but need to create tables in DB.
):
    # slash (/) is removed as FastAPI already filters it out.
    invalid_filename = 'fi:l*ep"a?t>h|.t<xt'

    response = client.get(
        f"{settings.api_prefix}{settings.files_route_prefix}/{str(uuid4())}/{invalid_filename}"
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid file name." in response.json()["detail"]


@pytest.mark.asyncio
async def test_file_upload_experiment_id(
    client: TestClient,
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)
    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * BYTES_IN_KB)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(db_experiment.id)}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name": experiment_file_name},
        )
        assert response.status_code == status.HTTP_200_OK

        # check if the file is uploaded correctly in the expected directory
        server_experiment_dir = build_experiment_dir_absolute_path(
            str(settings.experiments_dir_path), db_experiment.id
        )
        with open(
            os.path.join(server_experiment_dir, experiment_file_name), mode="rb"
        ) as file_reader:
            file_content = file_reader.read()
        # clean experiment directory before assertion for clean test
        shutil.rmtree(server_experiment_dir)

        assert file_content == test_data


@pytest.mark.asyncio
async def test_file_upload_invalid_experiment_id(
    client: TestClient,
    db_session: AsyncSession,  # unused but need to create tables in DB.
):
    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * BYTES_IN_KB)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(uuid4())}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name": experiment_file_name},
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json() == {"detail": "The specified experiment was not found."}


@pytest.mark.asyncio
async def test_file_upload_max_body_size(
    client: TestClient,
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)
    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * 2 * 1024)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(db_experiment.id)}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name": experiment_file_name},
        )
        assert response.status_code == status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
        assert (
            f"Maximum request body size limit ({(settings.upload_max_file_size_KB+1)*1024} bytes)"
            in response.json()["detail"]
        )


@pytest.mark.asyncio
async def test_file_upload_max_file_size(
    client: TestClient,
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)

    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        # max file size pluse 1 byte
        test_data = bytes(bytearray(os.urandom((settings.upload_max_file_size_KB * 1024) + 1)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(db_experiment.id)}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name": experiment_file_name},
        )
        assert response.status_code == status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
        assert (
            f"Maximum file size limit ({settings.upload_max_file_size_KB*1024} bytes) exceeded."
            in response.json()["detail"]
        )


@pytest.mark.asyncio
async def test_file_upload_invalid_header(
    client: TestClient,
    db_session: AsyncSession,
):
    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        # max file size pluse 1 byte
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * BYTES_IN_KB)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(uuid4())}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name_wrong": experiment_file_name},
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        assert "Filename header is missing." in response.json()["detail"]


@pytest.mark.asyncio
async def test_file_upload_non_existing_body(
    client: TestClient,
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)

    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    experiment_file_name = "test_upload_file.zip"

    with TemporaryDirectory() as tmpdirname:
        # max file size pluse 1 byte
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * BYTES_IN_KB)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(db_experiment.id)}",
            files={"file_wrong": open(upload_file_path, "rb")},
            headers={"file_name": experiment_file_name},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "The file is not sent correctly." in response.json()["detail"]


@pytest.mark.asyncio
async def test_file_upload_invalid_filename(
    client: TestClient,
    db_session: AsyncSession,
    experiments_data: List[ExperimentCreate],
):
    db_experiment = experiment_model_to_orm(experiments_data[0])
    db_session.add(db_experiment)
    await db_session.commit()

    async def override_context_dependency() -> AsyncGenerator[ServerContext, None]:
        yield ServerContext(
            db_session=db_session, user_info=UserInfo(user_id=uuid4(), scopes=set(UserScope))
        )

    app.dependency_overrides[context_dependency] = override_context_dependency

    experiment_file_name = "test_upload_file.zip"
    invalid_filename = 'fi:l*e/p"a?t>h|.t<xt'

    with TemporaryDirectory() as tmpdirname:
        test_data = bytes(bytearray(os.urandom(settings.upload_max_file_size_KB * BYTES_IN_KB)))
        upload_file_path = os.path.join(tmpdirname, experiment_file_name)
        with open(upload_file_path, mode="wb") as file_writer:
            file_writer.write(test_data)

        response = client.post(
            f"{settings.api_prefix}{settings.files_route_prefix}/{str(db_experiment.id)}",
            files={"file": open(upload_file_path, "rb")},
            headers={"file_name": invalid_filename},
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid file name." in response.json()["detail"]
