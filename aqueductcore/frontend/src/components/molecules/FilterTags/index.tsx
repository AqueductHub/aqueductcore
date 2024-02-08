import { ClickAwayListener, Typography, styled, Button, Box } from "@mui/material";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import { TagsDropdown } from "components/molecules/TagsDropdown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TagsFieldProps } from "types/globalTypes";
import { useState } from "react";

const TagIdentifier = styled(Typography)`
  margin-right: ${(props) => props.theme.spacing(1)};
  text-transform: none;
`;

const SelectedTags = styled(Typography)`
  font-weight: 600;
  text-transform: none;
`;

const TagButton = styled(Button)`
  border-color: #bcbcbc;
  padding-left: ${(props) => props.theme.spacing(1.25)};
  padding-right: ${(props) => props.theme.spacing(0.75)};
`;

export function FilterTags({ tags, selectedOptions, handleTagUpdate }: TagsFieldProps) {
  const [dropdownStatus, setDropDownStatus] = useState(false);

  const handleClickAway = () => {
    setDropDownStatus(false);
  };

  const handleTagButtonClick = () => {
    setDropDownStatus(!dropdownStatus);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        <TagButton
          size="large"
          id="tag-button"
          title="View-tags"
          variant="outlined"
          color="inherit"
          onClick={handleTagButtonClick}
        >
          <LabelOutlinedIcon sx={{ marginRight: 1 }} />
          <TagIdentifier>Tags:</TagIdentifier>
          <SelectedTags color="primary">
            {selectedOptions.length === 0
              ? "None"
              : selectedOptions.length === 1
                ? selectedOptions[0]
                : "Multiple (" + selectedOptions.length + ")"}
          </SelectedTags>
          <ExpandMoreIcon />
        </TagButton>
        {dropdownStatus && (
          <Box sx={{ position: "absolute", top: 50 }}>
            <TagsDropdown
              tags={tags}
              selectedOptions={selectedOptions}
              handleTagUpdate={handleTagUpdate}
              dropdownStatus={dropdownStatus}
              allowCreate={false}
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
