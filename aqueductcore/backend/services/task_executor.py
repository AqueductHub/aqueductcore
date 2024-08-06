"""Celery task execution."""

from celery import Celery

from aqueductcore.backend.settings import settings

celery_app = Celery(
    "tasks",
    broker=settings.celery_message_queue,
    backend=settings.celery_backend,
)
