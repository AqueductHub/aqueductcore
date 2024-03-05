"""Main starting up logic for the web server"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

from aqueductcore.backend.models import orm
from aqueductcore.backend.routers import auth, files, frontend, graphql
from aqueductcore.backend.session import async_engine
from aqueductcore.backend.settings import settings

app = FastAPI(title="Aqueduct", docs_url="/api/docs")


if settings.min_gzip_compression_size_KB != 0:
    app.add_middleware(
        middleware_class=GZipMiddleware, minimum_size=settings.min_gzip_compression_size_KB * 1024
    )


app.include_router(graphql.router, prefix=f"{settings.api_prefix}" + "/graphql", tags=["graphql"])
app.include_router(
    files.router, prefix=f"{settings.api_prefix}" + f"{settings.files_route_prefix}", tags=["files"]
)
app.include_router(
    auth.router,
    prefix=f"{settings.api_prefix}" + "/realms/aqueduct/protocol/openid-connect",
    tags=["auth"],
)

app.mount(
    "/",
    frontend.SPAStaticFiles(directory="frontend_build", html=True, check_dir=False),
    name="frontend",
)


@app.on_event("startup")
async def startup_event():
    """FastAPI process startup event handler."""

    # initialise database with relations
    async with async_engine.begin() as conn:
        await conn.run_sync(orm.Base.metadata.create_all)


@app.on_event("shutdown")
async def shutdown_event():
    """FastAPI process shutdown event handler."""
