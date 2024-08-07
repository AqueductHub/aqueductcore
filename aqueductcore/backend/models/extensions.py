"""Classes to parse extensions declarations, and execute them.
"""

from __future__ import annotations

from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import UUID

import yaml
from pydantic import BaseModel, Field
import strawberry

from aqueductcore.backend.errors import AQDFilesPathError, AQDValidationError
from aqueductcore.backend.services.task_executor import execute_task


MANIFEST_FILE = "manifest.yml"


class SupportedTypes(str, Enum):
    """This enum contains allowed data types, which may be passed from
    the GraphQL endpoint or specified in the manifest file."""

    INT = "int"
    STR = "str"
    TEXTAREA = "textarea"
    FLOAT = "float"
    EXPERIMENT = "experiment"
    FILE = "file"
    BOOL = "bool"
    SELECT = "select"


@strawberry.enum
class TaskStatus(Enum):
    """Statuses of task execution"""

    FAILURE = "failure"
    PENDING = "pending"
    RECEIVED = "received"
    REVOKED = "revoked"
    STARTED = "started"
    SUCCESS = "success"


class ExtensionExecutionResult(BaseModel):
    """OS process execution result"""

    return_code: Optional[int]
    stdout: Optional[str]
    stderr: Optional[str]
    task_id: UUID
    task_status: TaskStatus


class ExtensionParameter(BaseModel):
    """Typed and named parameter of the extension action"""

    name: str = Field(min_length=1)
    display_name: Optional[str] = None
    description: str = Field(min_length=1)
    data_type: SupportedTypes
    default_value: Optional[Any] = None
    options: Optional[List[str]] = None

    def __str__(self):
        return f"{self.display_name} ({self.name}: {self.data_type.name})"

    def __repr__(self):
        return f"<{str(self)}>"

    # pylint: disable=too-many-return-statements,too-many-branches
    def validate_object(self):
        """Validate variable and its default value."""

        if self.default_value:
            self.default_value = self.validate_value(self.default_value)

    def validate_value(self, value: str) -> str:
        """Validate value and return a normalised version, if possible."""
        str_value = str(value)

        if self.data_type == SupportedTypes.INT:
            try:
                int(str_value)
                return str_value
            except Exception as exc:
                raise AQDValidationError(f"{str_value} is not int.") from exc

        if self.data_type == SupportedTypes.FLOAT:
            try:
                float(str_value)
                return str_value
            except Exception as exc:
                raise AQDValidationError(f"{str_value} is not float.") from exc

        if self.data_type == SupportedTypes.BOOL:
            if str_value.lower() in ("true", "1"):
                return "1"
            if str_value.lower() in ("false", "0"):
                return "0"
            raise AQDValidationError(f"{value} is not a valid bool.")

        if self.data_type == SupportedTypes.EXPERIMENT:
            try:
                prefix, postfix = value.split("-")
                if not prefix.isdecimal() or not postfix.isalnum():
                    raise AQDValidationError("Experiment EID has wrong format.")
                return value
            except Exception as exc:
                raise AQDValidationError(f"{value} is not a valid EID.") from exc

        if self.data_type == SupportedTypes.SELECT:
            if self.options is not None:
                if value in self.options:
                    return str(value)
            raise AQDValidationError(f"{value} is not in {self.options}.")

        # for files, strings and textareas
        return str(value)


class ExtensionAction(BaseModel):
    """Each extension may have multiple actions. This class represents
    one action which may be executed."""

    name: str = Field(min_length=1)
    description: Optional[str] = None
    display_name: Optional[str] = None
    script: str
    parameters: List[ExtensionParameter]

    def execute(
        self,
        extension: Extension,
        params: dict,
        python: str | Path | None = None,
    ) -> ExtensionExecutionResult:
        """Passes parameters to the action code and awaits
        execution results

        Args:
            extension: extension instance to access settings.
            params: dictionary of names params.

        Returns:
            ExtensionExecutionResult: OS process results.
        """
        self.validate_values(params)
        my_env = {key: str(val) for key, val in (extension.constants or {}).items()}
        my_env.update(params)
        my_env["aqueduct_url"] = extension.aqueduct_url
        if extension.aqueduct_api_token is not None:
            my_env["API_TOKEN"] = extension.aqueduct_api_token

        cwd = Path.home()
        if extension.manifest_file:
            cwd = Path(extension.manifest_file).parent

        rich_script = self.script
        if python:
            rel_python = Path(python).relative_to(cwd)
            rich_script = rich_script.replace("$python ", f"{rel_python} ")

        task = execute_task(
            extension_directory_name=cwd.name,
            shell_script=rich_script,
            execute_blocking=False,
            **my_env,
        )
        # TODO: probably this is a duplication.
        return ExtensionExecutionResult(
            return_code=task.result_code,
            stdout=task.std_out,
            stderr=task.std_err,
            task_id=task.task_id,
            task_status=TaskStatus(task.status),
        )

    def get_default_experiment_parameter(self) -> Optional[ExtensionParameter]:
        """Return first experiment variable defined in manifest.

        Return:
            Extension parameter object.
        """
        for variable in self.parameters:
            if variable.data_type == SupportedTypes.EXPERIMENT:
                return variable
        return None

    def validate_object(self):
        """Validate the instance of the actions and its parameters."""

        for param in self.parameters:
            param.validate_object()

    def validate_values(self, params: Dict[str, str]):
        """Check params dict to agree with data types definition for the actions"""
        # do keys coincide?
        provided_keys = set(params)
        expected_keys = set(param.name for param in self.parameters)
        if expected_keys != provided_keys:
            raise AQDValidationError(
                "Parameters error: keys don't match expected set. "
                f"Missing keys: {expected_keys - provided_keys}; "
                f"Unexpected keys: {provided_keys - expected_keys}"
            )
        for arg in self.parameters:
            params[arg.name] = arg.validate_value(params[arg.name])


# pylint: disable=too-many-instance-attributes,too-many-arguments
class Extension(BaseModel):
    """Class representing an extension"""

    name: str
    description: Optional[str] = None
    display_name: Optional[str] = None
    authors: str
    actions: List[ExtensionAction]
    aqueduct_url: str
    manifest_file: Optional[str] = None
    aqueduct_api_token: Optional[str] = None
    constants: Optional[Dict[str, Any]] = None
    _folder: Optional[Path] = None

    @classmethod
    def from_folder(cls, path: Path) -> Extension:
        """Given a folder, parses a extension definition"""
        if not path.exists() or path.is_file():
            raise AQDFilesPathError(f"{path} should be an existing folder.")

        manifest = path / MANIFEST_FILE
        if not (manifest.exists() and manifest.is_file()):
            raise AQDFilesPathError(f"File {manifest} should exist.")

        with open(manifest, "r", encoding="utf-8") as manifest_stream:
            # load of the first document in the yaml file.
            # if there are more documents, they will be ignored
            extension_as_dict = yaml.safe_load(manifest_stream)
            extension = Extension(**extension_as_dict)
            extension.manifest_file = str(manifest.resolve().absolute())
            extension.aqueduct_api_token = None
            extension.validate_object()
            extension._folder = path.resolve().absolute()
            return extension

    def get_action(self, name: str) -> ExtensionAction:
        """Get extension action by its name.

        Args:
            name: action name

        Returns:
            Extension action object
        """
        actions = [f for f in self.actions if f.name == name]
        if len(actions) != 1:
            raise AQDValidationError(f"There should be exactly 1 action with name {name}")
        return actions[0]

    def validate_object(self):
        """Validate instance of the extension and its actions."""
        if not self.name:
            raise AQDValidationError("Extension should have a name.")
        for func in self.actions:
            func.validate_object()

    @property
    def folder(self):
        """Folder with extension specification. Raises if not initialised."""
        if self._folder is None:
            raise AQDFilesPathError(f"Extension {self.name} folder is not known.")
        return self._folder
