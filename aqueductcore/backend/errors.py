"""Shared utility functions and classes."""

from __future__ import annotations


class ECSError(Exception):
    """Base class for exceptions."""


class ECSDBError(ECSError):
    """Exception raised when there is a database issue"""


class ECSValidationError(ECSDBError):
    """Exception raised when there is a validation error"""


class ECSPermission(ECSDBError):
    """Exception raised when there is a permission error"""


class ECSDBExperimentNonExisting(ECSError):
    """Exception raised when there is no experiment in the DB with the specified details."""


class ECSMaxBodySizeException(ECSError):
    """Exception raised when body size for HTTP requests exceeds maximum."""

    def __init__(self, body_len: int):
        self.body_len = body_len


class ECSFilesPathError(ECSError):
    """Exception raised when there is a file system issue with the experiment's files"""


class ECSFileUploadError(ECSError):
    """Exception raised when there is an issue with file upload."""
