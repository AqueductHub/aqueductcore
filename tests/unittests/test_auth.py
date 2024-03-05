# pylint: skip-file

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from aqueductcore.backend.main import app
from aqueductcore.backend.routers.auth import OIDCConfiguration, settings
from aqueductcore.backend.settings import settings


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


@pytest.mark.asyncio
async def test_openid_configuration(client: TestClient):
    response = client.get(
        f"{settings.api_prefix}/realms/aqueduct/protocol/openid-connect/.well-known/openid-configuration"
    )
    assert response.status_code == status.HTTP_200_OK
    OIDCConfiguration.model_validate_json(response.text)


@pytest.mark.asyncio
async def test_authorize_correct_credentials(client: TestClient):
    data = {
        "username": settings.aqueduct_username,
        "password": settings.aqueduct_password,
        "redirect_uri": "http://test.local",
        "state": "12345",
    }
    response = client.post(
        f"{settings.api_prefix}/realms/aqueduct/protocol/openid-connect/authorize",
        data=data,
        follow_redirects=False,
    )
    assert response.status_code == status.HTTP_302_FOUND
    assert response.has_redirect_location == True
    assert response.next_request.url.host == "test.local"


@pytest.mark.asyncio
async def test_authorize_incorrect_username(client: TestClient):
    data = {
        "username": "wrong",
        "password": settings.aqueduct_password,
        "redirect_uri": "http://test.local",
        "state": "12345",
    }
    response = client.post(
        f"{settings.api_prefix}/realms/aqueduct/protocol/openid-connect/authorize", data=data
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_authorize_incorrect_password(client: TestClient):
    data = {
        "username": settings.aqueduct_username,
        "password": "wrong",
        "redirect_uri": "http://test.local",
        "state": "12345",
    }
    response = client.post(
        f"{settings.api_prefix}/realms/aqueduct/protocol/openid-connect/authorize", data=data
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
