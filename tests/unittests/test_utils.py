from aqueductcore.backend.services.utils import format_list_human_readable, is_tag_valid


def test_single_element():
    assert format_list_human_readable(["apple"]) == "apple"


def test_two_elements():
    assert format_list_human_readable(["apple", "banana"]) == "apple and banana"


def test_three_elements():
    assert format_list_human_readable(["apple", "banana", "cherry"]) == "apple, banana and cherry"


def test_empty_list():
    assert format_list_human_readable([]) == ""


def test_mixed_data_types():
    assert format_list_human_readable(["apple", 2, "banana"]) == "apple, 2 and banana"


def test_non_string_elements():
    assert format_list_human_readable([1, 2, 3]) == "1, 2 and 3"


def test_valid_tag_alphanumeric():
    assert is_tag_valid("Tag123") == True


def test_valid_tag_with_hyphens_and_underscores():
    assert is_tag_valid("Tag-123_ABC") == True


def test_valid_tag_with_colons_and_slashes():
    assert is_tag_valid("Tag:123/ABC") == True


def test_invalid_tag_special_characters():
    assert is_tag_valid("Tag!123@") == False


def test_invalid_tag_spaces():
    assert is_tag_valid("Tag 123") == False


def test_empty_string():
    assert is_tag_valid("") == False
