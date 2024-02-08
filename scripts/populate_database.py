#!/usr/bin/env python

import asyncio
import random
from datetime import datetime, timedelta
from random import randrange
from uuid import uuid4

from aqueductcore.backend.models import orm
from aqueductcore.backend.models.orm import Experiment, Tag
from aqueductcore.backend.server.session import async_engine, get_session


def random_date(start: datetime, end: datetime):
    """
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)


async def create_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(orm.Base.metadata.create_all)
    await async_engine.dispose()


async def populate():
    tags = []

    start_date = datetime(2020, 5, 17)
    now = datetime.now()

    async with get_session() as db_session:
        for _ in range(10):
            id = uuid4()
            tag = Tag(name=f"Tag_{str(id)[-12:]}", key=f"tag_{str(id)[-12:]}")
            tags.append(tag)
            db_session.add(tag)

        for _ in range(10):
            id = uuid4()
            date = random_date(start_date, now)
            experiment = Experiment(
                id=id,
                created_at=date,
                updated_at=date,
                title=f"experiment_{str(id)[-12:]}",
                description="description test",
                alias=f"{date.strftime('%y%m%d')}-{random.randint(1,100)}",
            )
            experiment.tags.extend(random.choices(tags, k=4))
            db_session.add(experiment)
        await db_session.commit()


if __name__ == "__main__":
    asyncio.run(populate())
