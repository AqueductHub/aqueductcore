import { IconButton, TextField, styled } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

import useDebouncedCallback from "hooks/useDebounceCallBack";
import { DEBOUNCE_DELAY } from "constants/constants";

interface SearchBarProps {
  searchString: string;
  handleSearchStringUpdate: (value: string) => void;
}

const SearchField = styled(TextField)`
  width: 300px;
`;

export const SearchBar = ({ searchString, handleSearchStringUpdate }: SearchBarProps) => {
  // internal state, it's needed only to manage clear icon functional
  const [text, setText] = useState<string>(searchString);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    // if value is changed to empty string
    if (!event.target.value.length) {
      handleSearchStringUpdate("");
      debounced("");
    } else {
      debounced(event.target.value);
    }
  };

  const handleClearInput = () => {
    handleSearchStringUpdate("");
    setText("");
  };

  const debounced = useDebouncedCallback<string>(handleSearchStringUpdate, DEBOUNCE_DELAY);

  return (
    <SearchField
      size="small"
      fullWidth
      variant="outlined"
      autoComplete="off"
      title="Search Experiments"
      name="search-string"
      placeholder="Search by EID and Name"
      value={text}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon
              sx={{
                marginRight: 0.2,
              }}
            />
          </InputAdornment>
        ),
        endAdornment: text.length ? (
          <InputAdornment position="end">
            <IconButton size="small" aria-label="clear" onClick={handleClearInput}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};
