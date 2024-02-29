"""Single user OpenID Connect authentication server."""

from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Dict, List, cast

from fastapi import APIRouter, Depends, Form, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from fastapi.security import OpenIdConnect
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, HttpUrl
from typing_extensions import Annotated

from aqueductcore.backend.settings import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"
SECRET_KEY = settings.token_secret
ACCESS_TOKEN_EXPIRE_MINUTES = settings.tokens_expiry_time_minutes

USERNAME = settings.aqueduct_username
PASSWORD_HASH = pwd_context.hash(settings.aqueduct_password)

oauth2_scheme = OpenIdConnect(openIdConnectUrl="/auth")


class ExperimentScope(str, Enum):
    """Experiment scopes enumerator."""

    VIEW_OWN = "experiment::view::own"
    VIEW_ALL = "experiment::view::all"
    EDIT_OWN = "experiment::edit::own"
    EDIT_ALL = "experiment::edit::all"
    DELETE_OWN = "experiment::delete::own"
    DELETE_ALL = "experiment::delete::all"
    CREATE_OWN = "experiment::create::own"


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

    username: str


def authenticate_user(username: str, password: str):
    """Verify the username and password matches the environment configuration."""
    if username != USERNAME:
        return None
    if not pwd_context.verify(password, PASSWORD_HASH):
        return None
    return User(username=username)


def create_token(data: Dict, expires_delta: timedelta) -> str:
    """Create token with the specified data and expiry date."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """Get the current user based on the provided authentication token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = str(payload.get("sub"))
        if username is None:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc
    user = User(username=username)
    return user


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
    return {"sub": user.username}
