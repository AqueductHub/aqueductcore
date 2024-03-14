"""Shared utility functions and classes."""

from __future__ import annotations


class AQDError(Exception):
    """Base class for exceptions."""


class AQDDBError(AQDError):
    """Exception raised when there is a database issue"""


class AQDValidationError(AQDDBError):
    """Exception raised when there is a validation error"""


class AQDDBExperimentNonExisting(AQDError):
    """Exception raised when there is no experiment in the DB with the specified details."""


class AQDMaxBodySizeException(AQDError):
    """Exception raised when body size for HTTP requests exceeds maximum."""

    def __init__(self, body_len: int):
        self.body_len = body_len


class AQDFilesPathError(AQDError):
    """Exception raised when there is a file system issue with the experiment's files"""


class AQDCouldNotRemoveExperiment(AQDError):
    """Exception raised when experiment-tag-map rows could not be deleted"""
