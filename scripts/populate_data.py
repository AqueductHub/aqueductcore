#!/usr/bin/env python

import asyncio
import os
import random
from datetime import datetime, timedelta, timezone
from random import randrange
from uuid import UUID, uuid4

from aqueductcore.backend.models import orm
from aqueductcore.backend.models.orm import Experiment, Tag, User
from aqueductcore.backend.session import async_engine, get_session
from aqueductcore.backend.settings import settings


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

    start_date = datetime.now(timezone.utc) - timedelta(weeks=52)
    now = datetime.now(timezone.utc)

    await create_tables()

    async with get_session() as db_session:
        for _ in range(10):
            id = uuid4()
            tag = Tag(name=f"Tag_{str(id)[-12:]}", key=f"tag_{str(id)[-12:]}")
            tags.append(tag)
            db_session.add(tag)

        admin_user = User(id=UUID(int=0), username="admin")
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
            admin_user.experiments.append(experiment)
            experiment_dir = os.path.join(str(settings.experiments_dir_path), f"{experiment.id}")
            os.mkdir(experiment_dir)
            file_size = 1024 * 1024 * 1  # 10 MB
            for file_idx in range(10):
                file_name = f"test_file_{file_idx}"
                file_path = os.path.join(experiment_dir, file_name)
                data = bytes(bytearray(os.urandom(file_size)))
                with open(file_path, mode="wb") as file_writer:
                    file_writer.write(data)

        db_session.add(admin_user)
        await db_session.commit()


if __name__ == "__main__":
    asyncio.run(populate())
