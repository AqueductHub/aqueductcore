import pytest

from aqueductcore.backend.services.constants import (
    MAX_EXPERIMENT_TITLE_LENGTH,
    MAX_EXPERIMENT_DESCRIPTION_LENGTH,
    MAX_EXPERIMENT_TAGS,
    MAX_TAG_LENGTH,
    MAX_SHOULD_INCLUDE_TAGS_LENGTH,
    MAX_FILTER_TITLE_LENGTH,
    MAX_TAGS_ALLOWED_IN_FILTER,
)
from aqueductcore.backend.services.validators import (
    validate_title,
    validate_description,
    validate_tags,
    validate_experiment_filters,
    validate_tag,
)
from aqueductcore.backend.server.errors import ECSValidationError

def test_validate_title():
    title = "a" * (MAX_EXPERIMENT_TITLE_LENGTH + 1)

    with pytest.raises(ECSValidationError):
        validate_title(title)

def test_validate_description():
    description = "a" * (MAX_EXPERIMENT_DESCRIPTION_LENGTH + 1)
    
    with pytest.raises(ECSValidationError):
        validate_description(description)

def test_validate_tags_overlimit():
    tags = [f"tag_{count}" for count in range(MAX_EXPERIMENT_TAGS + 1)]
    
    with pytest.raises(ECSValidationError):
        validate_tags(tags)

def test_validate_tags_invalid_tags():
    tags = ["tag$1"]
    
    with pytest.raises(ECSValidationError):
        validate_tags(tags)


def test_validate_filters():
    title = "a" * (MAX_FILTER_TITLE_LENGTH + 1)

    with pytest.raises(ECSValidationError):
        validate_experiment_filters(title=title)

def test_validate_tags_filter_overlimit():
    tags = [f"tag_{count}" for count in range(MAX_TAGS_ALLOWED_IN_FILTER + 1)]

    with pytest.raises(ECSValidationError):
        validate_experiment_filters(tags=tags)

def test_validate_tags_filter_invalid_tags():
    tags = ["tag$1"]

    with pytest.raises(ECSValidationError):
        validate_experiment_filters(tags=tags)

def test_validate_should_include_tags_overlimit():
    should_include_tags = [f"tag_{count}" for count in range(MAX_SHOULD_INCLUDE_TAGS_LENGTH + 1)]

    with pytest.raises(ECSValidationError):
        validate_experiment_filters(should_include_tags=should_include_tags)

def test_validate_should_include_tags_invalid_tags():
    should_include_tags = ["tag$1"]

    with pytest.raises(ECSValidationError):
        validate_experiment_filters(should_include_tags=should_include_tags)

def test_validate_tag_overlimit():
    tag = "a" * (MAX_TAG_LENGTH + 1)

    with pytest.raises(ECSValidationError):
        validate_tag(tag)
