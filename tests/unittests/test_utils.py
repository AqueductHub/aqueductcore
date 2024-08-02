from datetime import timedelta

from aqueductcore.backend.services.utils import (
    format_list_human_readable,
    is_tag_valid,
    timedelta_to_string,
)


def test_single_element():
    assert format_list_human_readable(['apple']) == 'apple'


def test_two_elements():
    assert format_list_human_readable(['apple', 'banana']) == 'apple and banana'


def test_three_elements():
    assert format_list_human_readable(['apple', 'banana', 'cherry']) == 'apple, banana and cherry'


def test_empty_list():
    assert format_list_human_readable([]) == ''


def test_mixed_data_types():
    assert format_list_human_readable(['apple', 2, 'banana']) == 'apple, 2 and banana'


def test_non_string_elements():
    assert format_list_human_readable([1, 2, 3]) == '1, 2 and 3'


def test_valid_tag_alphanumeric():
    assert is_tag_valid('Tag123') == True


def test_valid_tag_with_hyphens_and_underscores():
    assert is_tag_valid('Tag-123_ABC') == True


def test_valid_tag_with_colons_and_slashes():
    assert is_tag_valid('Tag:123/ABC') == True


def test_invalid_tag_special_characters():
    assert is_tag_valid('Tag!123@') == False


def test_invalid_tag_spaces():
    assert is_tag_valid('Tag 123') == False


def test_empty_string():
    assert is_tag_valid('') == False


def test_timedelta_seconds():
    t = timedelta(seconds=0.0)
    assert timedelta_to_string(t) == "0 seconds"
    t = timedelta(seconds=1, microseconds=40)
    assert timedelta_to_string(t) == "1 second"
    t = timedelta(seconds=59, milliseconds=999)
    assert timedelta_to_string(t) == "59 seconds"


def test_timedelta_minutes():
    t = timedelta(seconds=62)
    assert timedelta_to_string(t) == "1 minute"
    t = timedelta(seconds=122)
    assert timedelta_to_string(t) == "2 minutes"
    t = timedelta(seconds=3599)
    assert timedelta_to_string(t) == "59 minutes"


def test_timedelta_hours():
    t = timedelta(hours=1)
    assert timedelta_to_string(t) == "1 hour"
    t = timedelta(hours=2)
    assert timedelta_to_string(t) == "2 hours"
    t = timedelta(minutes=61)
    assert timedelta_to_string(t) == "1 hour 1 minute"
    t = timedelta(minutes=64)
    assert timedelta_to_string(t) == "1 hour 4 minutes"
    t = timedelta(minutes=121)
    assert timedelta_to_string(t) == "2 hours 1 minute"
    t = timedelta(seconds=3600 * 24 - 1)
    assert timedelta_to_string(t) == "23 hours 59 minutes"


def test_timedelta_days():
    t = timedelta(days=1)
    assert timedelta_to_string(t) == "1 day"
    t = timedelta(days=2)
    assert timedelta_to_string(t) == "2 days"
    t = timedelta(hours=25)
    assert timedelta_to_string(t) == "1 day 1 hour"
    t = timedelta(hours=52)
    assert timedelta_to_string(t) == "2 days 4 hours"
    t = timedelta(hours=333 * 24 + 23)
    assert timedelta_to_string(t) == "333 days 23 hours"
