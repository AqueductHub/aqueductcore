"""Celery task execution."""

from celery import Celery

from aqueductcore.backend.settings import settings

celery_app = Celery(
    "tasks",
    broker=f"amqp://{settings.rabbitmq_username}:{settings.rabbitmq_password}"
    "@{settings.rabbitmq_host}:{settings.rabbitmq_port}",
    backend=f"db+postgresql://{settings.postgres_username}:{settings.postgres_password}"
    "@{settings.postgres_host}:{settings.postgres_port}/{settings.postgres_db}",
)
