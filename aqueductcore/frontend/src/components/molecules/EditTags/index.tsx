import { Box, Button, ClickAwayListener, styled } from "@mui/material";
import { TagsDropdown } from "components/molecules/TagsDropdown";
import { TagsFieldProps } from "types/globalTypes";
import { useState } from "react";

const EditButton = styled(Button)`
  text-transform: none;
  min-width: 0;
  padding: 0;
`;

export function EditTags({ tags, selectedOptions, handleTagUpdate, isEditable = true }: TagsFieldProps) {
  const [dropdownStatus, setDropDownStatus] = useState(false);
  const handleClickAway = () => setDropDownStatus(false);
  const handleTagButtonClick = () => setDropDownStatus(!dropdownStatus);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ display: "inline", py: 0 }}>
        {!dropdownStatus && isEditable && <EditButton onClick={handleTagButtonClick}>Edit</EditButton>}
        {dropdownStatus && (
          <Box sx={{ position: "absolute", top: 50 }}>
            <TagsDropdown
              tags={tags}
              selectedOptions={selectedOptions}
              handleTagUpdate={handleTagUpdate}
              dropdownStatus={dropdownStatus}
              allowCreate={true}
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
