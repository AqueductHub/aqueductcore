"""CLI commands module."""

import tarfile
from pathlib import Path
from typing import List

import typer
from rich.console import Console
from sqlalchemy import Engine

from aqueductcore.backend.models import orm
from aqueductcore.backend.settings import settings
from aqueductcore.cli.exporter import Exporter
from aqueductcore.cli.importer import Importer
from aqueductcore.cli.models import AqueductData, AqueductVariant, Experiment
from aqueductcore.cli.session import get_session


def exporter(  # pylint: disable=too-many-arguments
    path: Path,
    include_experiment_files: bool,
    console: Console,
    err_console: Console,
    sync_engine: Engine,
    version: str,
    variant: AqueductVariant,
):
    """Command for exporting Aqueduct experiments' data into GZIP compressed tar archive."""

    tar_suffix = ".tar.gz"
    if not path.name.endswith(tar_suffix):
        err_console.print(
            f"[bold yellow]Warning[/bold yellow]: Archive path '{path}'"
            f" doesn't end with '{tar_suffix}'."
        )

    with path.open(mode="wb") as file:
        console.print(f"Adding experiments' metadata to '{file.name}'...")
        with get_session(sync_engine) as db_session:
            orm.Base.metadata.create_all(sync_engine)  # create relations if database is empty
            metadata = Exporter.export_experiments_metadata(
                db_session=db_session, version=version, variant=variant
            )
            json_str = metadata.model_dump_json(indent=2)

        dir_path = str(settings.experiments_dir_path)

        if include_experiment_files:
            total = Exporter.get_size(dir_path) + len(json_str.encode())
            console.print(
                f"Adding experiments' files in '{settings.experiments_dir_path}'"
                f" to '{file.name}' ..."
            )
        else:
            total = len(json_str.encode())
        with typer.progressbar(length=total, label="Progress") as progress:
            with tarfile.open(fileobj=file, mode="w:gz") as tar:
                Exporter.export_archive(
                    metadata_bytes=json_str.encode(encoding="utf-8"),
                    tar=tar,
                    experiments_root=(
                        str(settings.experiments_dir_path) if include_experiment_files else None
                    ),
                    progress=progress.update,
                )
        console.print(f"Successfully exported data to '{file.name}'.")


def importer(
    file: typer.FileBinaryRead,
    console: Console,
    err_console: Console,
    sync_engine: Engine,
    version: str,
):
    """Command for importing Aqueduct experiments' data from GZIP compressed tar archive."""

    console.print(f"Reading {file.name}...")
    with tarfile.open(mode="r:gz", fileobj=file) as tar:
        metadata_file = tar.extractfile(member=Exporter.METADATA_FILENAME)
        if metadata_file is None:
            err_console.print(
                "Import failed: Experiments metadata couldn't be found in the archive."
            )
            raise typer.Exit(code=1)

        console.print(f"Importing experiments' metadata from '{file.name}'...")
        metadata_json = metadata_file.read().decode()
        metadata = AqueductData.model_validate_json(json_data=metadata_json)

        if not Importer.check_version_compatible(
            aqueduct_version=version, metadata_version=metadata.version
        ):
            err_console.print(
                f"Version of the imported archive, '{metadata.version}', is not "
                f"compatible with current version of Aqueduct instance `{version}`."
            )
            raise typer.Exit(code=1)

        metadata_experiments: List[Experiment] = []
        for user in metadata.users:
            metadata_experiments.extend(user.experiments)

        with get_session(sync_engine) as db_session:
            orm.Base.metadata.create_all(sync_engine)  # create relations if database is empty
            conflicts = Importer.get_conflicting_experiments(
                db_session=db_session, experiments=metadata_experiments
            )
            if len(conflicts) > 0:
                err_console.print(
                    "Import failed: The following conflicting experiments with the "
                    f"same IDs are found: {[item.alias for item in conflicts]}."
                )
                raise typer.Exit(code=1)
            Importer.import_experiments_metadata(db_session=db_session, metadata=metadata)

            dir_path = str(settings.experiments_dir_path)
            total = Exporter.get_size(dir_path)
            console.print(
                f"Importing experiments' files from '{file.name}'"
                f" to '{settings.experiments_dir_path}'..."
            )
            with typer.progressbar(length=total, label="Experiments") as progress:
                Importer.import_experiment_files(
                    tar,
                    str(settings.experiments_dir_path),
                    progress=progress.update,
                )

            console.print(f"Successfully imported '{file.name}'.")
