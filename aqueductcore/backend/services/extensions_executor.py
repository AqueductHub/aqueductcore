"""The module contains business-logic level code for extension access and execution.
Extensions are stored on a file system. They are declared using `manifest.yml` files.
Depending on execution context, extensions may be implement in any language if they
can read environment variables and print to stdout.
"""

import logging
import subprocess
import venv
from pathlib import Path
from typing import List

from aqueductcore.backend.errors import AQDError, AQDValidationError
from aqueductcore.backend.models.extensions import (
    Extension,
    MANIFEST_FILE,
)
from aqueductcore.backend.services.task_executor import TaskProcessExecutionResult
from aqueductcore.backend.settings import settings

VENV_FOLDER = ".aqueduct-extension-venv"
PYTHON_BINARY = "bin/python"
EXEC_TIMEOUT = 600


class ExtensionsExecutor:
    """Class to access extensions."""

    @classmethod
    def list_extensions(cls) -> List[Extension]:
        """List all valid extensions which are present in the folder"""
        result = []
        if settings.extensions_dir_path is None:
            logging.warning(
                "Extensions directory is not set is EXTENSIONS_DIR_PATH environment variable."
            )
            return []
        for directory in Path(settings.extensions_dir_path).iterdir():
            if directory.exists() and not directory.is_file():
                if not (directory / MANIFEST_FILE).exists():
                    continue
                try:
                    extension = Extension.from_folder(directory)
                    result.append(extension)
                except AQDError as err:
                    logging.warning(
                        "Skipping %s extension parsing %s",
                        directory,
                        err,
                    )
        return sorted(result, key=lambda extension: extension.name)

    @classmethod
    def get_extension(cls, extension: str) -> Extension:
        """Returns extension instance given its name.

        Args:
            extension: extension name.

        Returns:
            Extension instance.
        """
        extensions = [p for p in cls.list_extensions() if p.name == extension]
        if len(extensions) != 1:
            raise AQDValidationError(f"There should be exactly 1 extension with name {extension}")
        return extensions[0]

    @classmethod
    def is_venv_present(cls, extension: str) -> bool:
        """Checks if inside extension folder there is a venv folder

        Args:
            extension: extension name

        Returns:
            True if virtual environment is present.
        """
        where = cls.get_extension(extension).folder
        if not where.exists() or where.is_file():
            raise AQDValidationError(f"Extension folder `{where}` does not exist.")
        venv_folder = where / VENV_FOLDER
        if venv_folder.exists() and venv_folder.is_file():
            raise AQDValidationError(f"Venv `{venv_folder}` is not a folder.")
        return venv_folder.exists()

    @classmethod
    def create_venv_python_if_not_present(cls, extension: str) -> Path:
        """If virtual environment is not present in extension directory,
        it is created and requirements are installed. The method
        returns python executable inside this venv.

        Args:
            extension: extension name.

        Returns:
            Path to a python executable inside a virtual environment.
            This path will be substituted in the `script` section
            of manifest file, if `$python` variable is used.
        """
        extension_dir = cls.get_extension(extension).folder
        venv_dir = extension_dir / VENV_FOLDER
        python_bin = (venv_dir / PYTHON_BINARY).absolute()
        if cls.is_venv_present(extension=extension):
            return python_bin
        venv.create(venv_dir, system_site_packages=False, with_pip=True)
        cls.try_install_requirements_txt(extension=extension, python=python_bin)
        cls.try_install_pyproject_toml(extension=extension, python=python_bin)
        return python_bin

    @classmethod
    def try_install_requirements_txt(cls, extension: str, python: Path) -> bool:
        """Checks in requirements.txt file is present, and
        installs requirements into a virtual environment.

        Args:
            extension: name of the extension.
            python: python binary path inside a virtual environment.

        Returns:
            True if `requirements.txt` existed and was successfully installed.
        """
        extension_dir = cls.get_extension(extension).folder
        requirements = extension_dir / "requirements.txt"
        if requirements.exists():
            result = subprocess.run(
                f"{python} -m pip install -r {requirements}",
                shell=True,
                cwd=extension_dir,
                check=False,
            )
            return result.returncode == 0
        return False

    @classmethod
    def try_install_pyproject_toml(cls, extension: str, python: Path) -> bool:
        """Checks in pyproject.toml file is present, and
        installs an extension folder as a python module into a virtual environment.

        Args:
            extension: name of the extension.
            python: python binary path inside a virtual environment.

        Returns:
            True if `pyproject.toml` existed and module was successfully installed.
        """
        extension_dir = cls.get_extension(extension).folder
        pyproject = extension_dir / "pyproject.toml"
        if pyproject.exists():
            result = subprocess.run(
                f"{python} -m pip install .",
                shell=True,
                cwd=extension_dir,
                check=False,
            )
            return result.returncode == 0
        return False

    @classmethod
    async def execute(cls, extension: str, action: str, params: dict) -> TaskProcessExecutionResult:
        """For a given extension name, action name, and a dictionary
        of parameters, runs the extension and returns execution result

        Args:
            extension: extension name.
            action: action name inside extension.
            params: parameter of values to pass to a extension.

        Returns:
            TaskProcessExecutionResult: Results of process execution.
        """
        extension_object = cls.get_extension(extension)
        action_object = extension_object.get_action(action)
        python = cls.create_venv_python_if_not_present(extension=extension)
        return await action_object.execute(
            extension=extension_object,
            params=params,
            python=python,
        )
