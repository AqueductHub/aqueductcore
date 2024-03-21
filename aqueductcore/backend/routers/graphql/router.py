"""Router for GraphQL API."""

from fastapi import APIRouter, Depends
from strawberry import Schema
from strawberry.extensions import QueryDepthLimiter
from strawberry.fastapi import GraphQLRouter

from aqueductcore.backend.context import context_dependency
from aqueductcore.backend.routers.graphql.mutations_schema import Mutation
from aqueductcore.backend.routers.graphql.query_schema import Query


async def get_context(custom_context=Depends(context_dependency)):
    """Helper function to return context object as FastAPI dependency."""
    return custom_context


schema = Schema(query=Query, mutation=Mutation, extensions=[QueryDepthLimiter(max_depth=5)])
router: APIRouter = GraphQLRouter(schema=schema, context_getter=get_context)
