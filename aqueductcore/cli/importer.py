"""Aqueduct module for importing data from instance."""

from __future__ import annotations

import tarfile
from tarfile import TarFile
from typing import Any, Callable, Dict, List, Optional, Sequence

from packaging.version import Version
from sqlalchemy import select
from sqlalchemy.orm import Session

from aqueductcore.backend.models import orm
from aqueductcore.cli.exporter import Exporter
from aqueductcore.cli.models import AqueductData, Experiment, Tag


class Importer:
    """Aqueduct importer class."""

    @classmethod
    def check_version_compatible(cls, aqueduct_version: str, metadata_version: str) -> bool:
        """Check if the metadata version is compatible with the current Aqueduct version.

        Args:
            metadata_version: Version string in semantic format.

        Returns:
            True if the version is compatible, False otherwise.

        """
        version = Version(metadata_version)
        cur_version = Version(aqueduct_version)

        return cur_version.major == version.major

    @classmethod
    def get_conflicting_experiments(
        cls, db_session: Session, experiments: List[Experiment]
    ) -> Sequence[orm.Experiment]:
        """Check if there are conflicting experiments with the same EID.

        Args:
            db_session: Database session to load metadata from.
            experiments: Experiments to be checked.

        Returns:
            List of database experiments that are conflicting with the provided ones.

        """
        conflict_statement = select(orm.Experiment).where(
            orm.Experiment.alias.in_([item.eid for item in experiments])
        )
        conflict_result = db_session.execute(conflict_statement).scalars().all()

        return conflict_result

    @classmethod
    def import_experiments_metadata(cls, db_session: Session, metadata: AqueductData) -> None:
        """Import metadata into the database. Conflicts raise database exceptions.

        Args:
            db_session: Database session to load metadata from.
            metadata: Aqueduct metadata object.

        """

        cur_users_statement = select(orm.User).where(
            orm.User.id.in_([item.uuid for item in metadata.users])
        )
        cur_db_users = db_session.execute(cur_users_statement).scalars().all()
        cur_db_users_dict = {item.id: item for item in cur_db_users}

        metadata_experiments: List[Experiment] = []
        for user in metadata.users:
            metadata_experiments.extend(user.experiments)

        metadata_tags: Dict[str, Tag] = {}
        for experiment in metadata_experiments:
            for tag in experiment.tags:
                metadata_tags[tag.key] = tag

        cur_db_tags_statement = select(orm.Tag).where(orm.Tag.key.in_(list(metadata_tags.keys())))
        cur_db_tags = db_session.execute(cur_db_tags_statement).scalars().all()
        cur_db_tags_dict = {item.key: item for item in cur_db_tags}

        db_tags: Dict[str, orm.Tag] = {}
        for key, value in metadata_tags.items():
            if key in cur_db_tags_dict:
                db_tags[key] = cur_db_tags_dict[key]
            else:
                db_tags[key] = orm.Tag(key=key, name=value.name)

        for user in metadata.users:
            db_user = cur_db_users_dict.get(user.uuid)
            if not db_user:
                db_user = orm.User(
                    id=user.uuid,
                    username=user.username,
                )
                cur_db_users_dict[user.uuid] = db_user
                db_session.add(db_user)

            for experiment in user.experiments:
                db_experiment = orm.Experiment(
                    id=experiment.uuid,
                    title=experiment.title,
                    description=experiment.description,
                    tags=[db_tags[tag.key] for tag in experiment.tags],
                    alias=experiment.eid,
                    created_at=experiment.created_at,
                    updated_at=experiment.updated_at,
                )
                db_user.experiments.append(db_experiment)

    @classmethod
    def import_experiment_files(
        cls,
        tar: TarFile,
        experiments_root: str,
        progress: Optional[Callable[[int], Any]] = None,
    ) -> None:
        """Import experiments' files and metadata to the desired location as a tar file with
        gzip compression.

        Args:
            metadata: Aqueduct metadata as bytes.
            tar: Tar file to read the archive.
            experiments_root: Experiments rood directory of the Aqueduct instance.
            progress: Call back with processed data information to show progress.

        """

        def experiments_filter(member: tarfile.TarInfo, _) -> Optional[tarfile.TarInfo]:
            """Extraction filter for progress bar."""

            if progress:
                progress(member.size)

            if member.path == Exporter.METADATA_FILENAME:
                return None

            if member.path.startswith(Exporter.EXPERIMENTS_BASE_DIR_NAME):
                member.path = member.path.replace(f"{Exporter.EXPERIMENTS_BASE_DIR_NAME}/", "")
            return member

        tar.extractall(path=experiments_root, filter=experiments_filter)
