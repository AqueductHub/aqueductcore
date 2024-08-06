"""Celery task execution."""

from celery import Celery

from aqueductcore.backend.settings import settings

celery_app = Celery(
    "tasks",
    broker=settings.celery_message_queue,
    backend=f"db+postgresql://{settings.postgres_username}:{settings.postgres_password}"
    f"@{settings.postgres_host}:{settings.postgres_port}/{settings.postgres_db}",
)
