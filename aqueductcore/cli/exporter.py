"""Aqueduct module for exporting data from instance."""

from __future__ import annotations

import os.path
from io import BytesIO
from tarfile import TarFile, TarInfo
from typing import Any, Callable, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from aqueductcore import __version__
from aqueductcore.backend.models import orm
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment, Tag, User


class Exporter:
    """Aqueduct exporter class."""

    EXPERIMENTS_BASE_DIR_NAME = "experiments_files"
    METADATA_FILENAME = "metadata.json"

    @classmethod
    def export_experiments_metadata(
        cls,
        db_session: Session,
    ) -> AqueductData:
        """Export instance data as an object.

        Args:
            db_session: Database session to load metadata from.

        Returns:
            Instance metadata as an AqueductData object.

        """
        statement = select(orm.User)

        result = db_session.execute(statement)

        data = AqueductData(version=__version__, variant=AqueductVariant.CORE, users=[])
        for user in result.unique().scalars().all():
            user_data = User(uuid=user.id, username=user.username, experiments=[])
            for experiment in user.experiments:
                user_data.experiments.append(
                    Experiment(
                        uuid=experiment.id,
                        eid=experiment.alias,
                        title=experiment.title,
                        description=experiment.description,
                        created_at=experiment.created_at,
                        updated_at=experiment.updated_at,
                        tags=[Tag(key=item.key, name=item.name) for item in experiment.tags],
                    )
                )
            data.users.append(user_data)

        return data

    @classmethod
    def get_dir_size(cls, experiments_dir: str) -> int:
        """Get the directory size in bytes given the path.

        Args:
            experiments_dir: Path to find the files size.

        Returns:
            Size of the directory including its files recursively in bytes.

        """
        total = 0
        with os.scandir(experiments_dir) as iterator:
            for entry in iterator:
                if entry.is_file():
                    total += entry.stat().st_size
                elif entry.is_dir():
                    total += cls.get_dir_size(entry.path)
        return total

    @classmethod
    def export_archive(
        cls,
        metadata_bytes: bytes,
        tar: TarFile,
        experiments_root: Optional[str] = None,
        progress: Optional[Callable[[int], Any]] = None,
    ) -> None:
        """Export experiments' files and metadata to the desired location as a tar file with
        gzip compression.

        Args:
            metadata_bytes: Aqueduct metadata encoded as bytes.
            tar: Tar file to generate the archive.
            experiments_root: Experiments rood directory of the Aqueduct instance.
            progress: Call back with processed data information to show progress.

        """

        metadata_tarinfo = TarInfo(cls.METADATA_FILENAME)
        metadata_tarinfo.size = len(metadata_bytes)
        tar.addfile(
            tarinfo=metadata_tarinfo,
            fileobj=BytesIO(metadata_bytes),
        )
        if progress:
            progress(metadata_tarinfo.size)
        if experiments_root:
            with os.scandir(experiments_root) as dir_iterator:
                for entry in dir_iterator:
                    entry_size = 0
                    if entry.is_file(follow_symlinks=False):
                        entry_size = entry.stat().st_size
                        tar.add(
                            name=entry.path,
                            arcname=os.path.join(cls.EXPERIMENTS_BASE_DIR_NAME, entry.name),
                        )
                    elif entry.is_dir(follow_symlinks=False):
                        entry_size = cls.get_dir_size(entry.path)
                        tar.add(
                            name=entry.path,
                            arcname=os.path.join(cls.EXPERIMENTS_BASE_DIR_NAME, entry.name),
                        )
                    if progress:
                        progress(entry_size)
