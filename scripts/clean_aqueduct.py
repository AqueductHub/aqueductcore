#!/usr/bin/env python

import asyncio
import os
from shutil import rmtree

from aqueductcore.backend.models import orm
from aqueductcore.backend.session import async_engine
from aqueductcore.backend.settings import settings


async def clean_up():
    async with async_engine.begin() as conn:
        await conn.run_sync(orm.Base.metadata.drop_all)

    rmtree(str(settings.experiments_dir_path))
    os.mkdir(str(settings.experiments_dir_path))

    await async_engine.dispose()


if __name__ == "__main__":
    asyncio.run(clean_up())
