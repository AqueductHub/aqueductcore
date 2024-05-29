"""Command line interface (CLI) for Aqueduct."""

import os
from datetime import datetime, timezone
from pathlib import Path

import typer
from rich.console import Console
from sqlalchemy import create_engine
from typing_extensions import Annotated

from aqueductcore import __version__
from aqueductcore.backend.settings import settings
from aqueductcore.cli import commands
from aqueductcore.cli.models import AqueductVariant

sync_engine = create_engine(
    f"postgresql+psycopg2://{settings.postgres_username}:"
    f"{settings.postgres_password}@{settings.postgres_host}:"
    f"{settings.postgres_port}/{settings.postgres_db}"
)


app = typer.Typer(add_completion=False)


err_console = Console(stderr=True, style="red")
console = Console()


@app.command(name="export")
def exporter(
    path: Annotated[
        Path,
        typer.Argument(
            help="File path for the exported archive.",
            exists=False,
            file_okay=True,
            dir_okay=False,
            writable=True,
        ),
    ] = Path(
        os.path.join(
            os.getcwd(), f"aqueduct_data_{datetime.now(timezone.utc).strftime('%Y_%m_%d')}.tar.gz"
        )
    ),
    include_experiment_files: Annotated[
        bool,
        typer.Option(
            "--experiment-files",
            "-e",
            help="Flag to include experiments' files in the archive.",
        ),
    ] = False,
):
    """Command for exporting Aqueduct experiments' data into GZIP compressed tar archive."""

    commands.exporter(
        path=path,
        include_experiment_files=include_experiment_files,
        console=console,
        err_console=err_console,
        sync_engine=sync_engine,
        version=__version__,
        variant=AqueductVariant.CORE,
    )


@app.command(name="import")
def importer(
    file: Annotated[
        typer.FileBinaryRead,
        typer.Argument(
            help="Tar file path of the archive to import.",
            exists=True,
            file_okay=True,
            dir_okay=False,
            readable=True,
        ),
    ],
):
    """Command for importing Aqueduct experiments' data from GZIP compressed tar archive."""

    commands.importer(
        file=file,
        console=console,
        err_console=err_console,
        sync_engine=sync_engine,
        version=__version__,
    )
