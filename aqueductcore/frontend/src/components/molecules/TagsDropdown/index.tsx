import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { ClearIcon } from "@mui/x-date-pickers";
import { useCallback } from "react";
import {
  Autocomplete,
  Checkbox,
  useTheme,
  styled,
  Paper,
  Chip,
  Box,
  ListItem,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";

import { removeFavouriteAndArchivedTag } from "helper/formatters";
import { TagType } from "types/globalTypes";

interface TagsDropdownProps {
  tags: TagType[];
  selectedOptions: TagType[];
  handleTagUpdate: (value: TagType[]) => void;
  dropdownStatus: boolean;
  allowCreate: boolean;
}

const CreateTagText = styled(Typography)`
  display: "inline";
  margin-right: ${(props) => `${props.theme.spacing(1)}`};
  color: ${(props) => props.theme.palette.primary.main};
`;

export function TagsDropdown({
  tags,
  selectedOptions,
  handleTagUpdate,
  dropdownStatus,
  allowCreate,
}: TagsDropdownProps) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const theme = useTheme();

  const filter = createFilterOptions<TagType>();

  const setRef = useCallback(
    (elmRef: HTMLDivElement | null) => {
      const element = elmRef?.querySelector("input") as HTMLInputElement;
      if (dropdownStatus && element)
        if (element.parentElement) {
          element.parentElement.style.background = theme.palette.background.paper;
          element.parentElement.style.borderRadius = `${theme.spacing(1)} ${theme.spacing(1)} 0 0`;
        }
      element?.focus();
    },
    [dropdownStatus]
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        open
        freeSolo
        multiple
        disableClearable
        disableCloseOnSelect
        disablePortal
        id="dropdown"
        options={removeFavouriteAndArchivedTag(tags)}
        value={selectedOptions}
        onChange={(e, value) => {
          handleTagUpdate(value);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;

          const isExisting = options.some((option) => inputValue === option);

          if (inputValue && !isExisting && allowCreate) {
            filtered.unshift(inputValue);
          }

          return filtered;
        }}
        isOptionEqualToValue={(option, value) => option === value}
        PaperComponent={({ children }) => (
          <Paper sx={{ borderRadius: ` 0 0 ${theme.spacing(1)} ${theme.spacing(1)}` }}>
            {children}
          </Paper>
        )}
        sx={{
          position: "absolute",
          width: 320,
          zIndex: 1300,
        }}
        ChipProps={{ deleteIcon: <CloseIcon /> }}
        renderInput={(params) => (
          <Paper>
            <TextField
              name="tag-options"
              ref={setRef}
              placeholder={selectedOptions.length === 0 ? "Search tag" : ""}
              sx={{
                "& fieldset": { border: "none" },
              }}
              {...params}
            />
          </Paper>
        )}
        renderTags={(tagValue, getTagProps) => {
          return removeFavouriteAndArchivedTag(tagValue).map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              deleteIcon={<ClearIcon />}
              sx={{ borderRadius: 1 }}
            />
          ));
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <ListItem {...props} key={option}>
              {tags.includes(option) ? (
                <>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                  <Chip sx={{ borderRadius: 1 }} label={option} />
                </>
              ) : (
                <>
                  <CreateTagText>Create</CreateTagText>
                  <Chip sx={{ borderRadius: 1 }} label={option} />
                </>
              )}
            </ListItem>
          );
        }}
      />
    </Box>
  );
}
