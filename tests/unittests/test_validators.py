import pytest

from aqueductcore.backend.server.errors import ECSValidationError
from aqueductcore.backend.services.validators import (
    MAX_EXPERIMENT_DESCRIPTION_LENGTH,
    MAX_EXPERIMENT_TAG_LENGTH,
    MAX_EXPERIMENT_TITLE_LENGTH,
    validate_description,
    validate_tag,
    validate_title,
)


def test_validate_title():
    title = "a" * (MAX_EXPERIMENT_TITLE_LENGTH + 1)

    with pytest.raises(ECSValidationError):
        validate_title(title, max_len=MAX_EXPERIMENT_TITLE_LENGTH)


def test_validate_description():
    description = "a" * (MAX_EXPERIMENT_DESCRIPTION_LENGTH + 1)

    with pytest.raises(ECSValidationError):
        validate_description(description, max_len=MAX_EXPERIMENT_DESCRIPTION_LENGTH)


def test_validate_tags_invalid_tags():
    invalid_tags = ["tag$1"]

    for tag in invalid_tags:
        with pytest.raises(ECSValidationError):
            validate_tag(tag, max_len=MAX_EXPERIMENT_TAG_LENGTH)
