"""Single user OpenID Connect authentication server."""

from datetime import datetime, timedelta, timezone
from typing import Dict, List, cast

import bcrypt
from fastapi import APIRouter, Depends, Form, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from jose import jwt
from pydantic import BaseModel, HttpUrl
from typing_extensions import Annotated

from aqueductcore.backend.context import get_current_user
from aqueductcore.backend.settings import settings

router = APIRouter()

ALGORITHM = "HS256"
SECRET_KEY = settings.token_secret
ACCESS_TOKEN_EXPIRE_MINUTES = settings.tokens_expiry_time_minutes

USERNAME = settings.aqueduct_username
PASSWORD_HASH = bcrypt.hashpw(
    password=settings.aqueduct_password.encode("utf8"), salt=bcrypt.gensalt()
)


class OIDCConfiguration(BaseModel):
    """OpenID Connect server discovery configuration data model."""

    issuer: HttpUrl
    authorization_endpoint: HttpUrl
    userinfo_endpoint: HttpUrl
    response_types_supported: List[str]
    scopes_supported: List[str]
    subject_types_supported: List[str]
    grant_types_supported: List[str]
    id_token_signing_alg_values_supported: List[str]


class User(BaseModel):
    """User data model."""

    user_id: str


def authenticate_user(username: str, password: str):
    """Verify the username and password matches the environment configuration."""
    if username != USERNAME:
        return None
    if not bcrypt.checkpw(password.encode("utf-8"), PASSWORD_HASH):
        return None
    return User(user_id=username)


def create_token(data: Dict, expires_delta: timedelta) -> str:
    """Create token with the specified data and expiry date."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.get("/.well-known/openid-configuration")
async def openid_configuration(request: Request) -> OIDCConfiguration:
    """OpenID Connect configuration endpoint for server discovery."""

    client_hostname = ""

    client_hostname = str(request.base_url)

    return OIDCConfiguration(
        issuer=cast(HttpUrl, client_hostname),
        authorization_endpoint=cast(HttpUrl, f"{client_hostname}authorize"),
        userinfo_endpoint=cast(HttpUrl, f"{client_hostname}userinfo"),
        response_types_supported=[
            "id_token token",
        ],
        scopes_supported=["openid"],
        grant_types_supported=["implicit"],
        subject_types_supported=["public"],
        id_token_signing_alg_values_supported=[ALGORITHM],
    )


@router.post("/authorize")
async def authorize(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    redirect_uri: Annotated[HttpUrl, Form()],
    state: Annotated[str, Form()],
) -> RedirectResponse:
    """Login endpoint to generate authorization code based on username and password."""
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(data={"sub": username}, expires_delta=access_token_expires)
    id_token = create_token(data={"sub": username}, expires_delta=access_token_expires)

    redirect_url = (
        f"{redirect_uri}#access_token={access_token}"
        f"&state={state}&id_token={id_token}&token_type=Bearer"
    )

    return RedirectResponse(
        url=redirect_url,
        status_code=status.HTTP_302_FOUND,
    )


@router.post("/userinfo")
async def userinfo(user: Annotated[User, Depends(get_current_user)]):
    """Get user information per OpenID Connect standard."""
    return {"sub": user.user_id}
