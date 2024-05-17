"""Aqueduct module for exporting data from instance."""

from __future__ import annotations

import errno
import os.path
import tarfile
from io import BytesIO
from typing import Any, Callable, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from aqueductcore import __version__
from aqueductcore.backend.errors import AQDFilesPathError
from aqueductcore.backend.models import orm
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment, Tag, User


class Exporter:
    """Aqueduct exporter class."""

    EXPERIMENTS_BASE_DIR_NAME = "experiments_files"

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
    def _get_dir_size(cls, experiments_dir: str) -> int:
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
                    total += cls._get_dir_size(entry.path)
        return total

    @classmethod
    def export_artifact(
        cls,
        metadata: bytes,
        output_fileobj: BytesIO,
        metadata_filename="metadata.json",
        experiments_root: Optional[str] = None,
        progress: Optional[Callable[[int], Any]] = None,
    ) -> None:
        """Export experiments' files and metadata to the desired location as a tar file with
        gzip compression.

        Args:
            metadata: Aqueduct metadata as bytes.
            output_fileobj: Output file object for the generated tar file.
            metadata_filename: Metadata file name to get into the generated tar file.
            experiments_root: Experiments rood directory of the Aqueduct instance.
            progress: Call back with processed data information to show progress.

        """
        try:
            with tarfile.open(mode="w:gz", fileobj=output_fileobj) as tar:
                metadata_tarinfo = tarfile.TarInfo(metadata_filename)
                metadata_tarinfo.size = len(metadata)
                tar.addfile(
                    tarinfo=metadata_tarinfo,
                    fileobj=BytesIO(metadata),
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
                                entry_size = cls._get_dir_size(entry.path)
                                tar.add(
                                    name=entry.path,
                                    arcname=os.path.join(cls.EXPERIMENTS_BASE_DIR_NAME, entry.name),
                                )
                            if progress:
                                progress(entry_size)

        except OSError as error:
            if error.errno in (errno.EACCES, errno.EPERM):  # Permission denied
                raise AQDFilesPathError("Error in reading the files: Permission denied.") from error

            raise AQDFilesPathError("Unknown Error in accessing the file system.") from error
