import { Button, ClickAwayListener, Grid, TextField, Typography, styled } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import useDebouncedCallback from "hooks/useDebounceCallBack";
import { DEBOUNCE_DELAY } from "constants/constants";

const UpdateNameButton = styled(Button)`
  min-width: 0;
  padding: 0;
  margin-left: ${(props) => props.theme.spacing(1.5)};
`;

const ExperimentName = styled(Typography)`
  font-size: 1.4rem;
  line-height: ${(props) => `${props.theme.spacing(4)}`};
`;

const ExperimentNameTitleField = styled(TextField)``;

interface ExperimentTitleProps {
  experimentTitle: string;
  handleExperimentTitleUpdate: (value: string) => void;
}

export function ExperimentTitleUpdate({
  experimentTitle,
  handleExperimentTitleUpdate,
}: ExperimentTitleProps) {
  const [editNameStatus, setEditTitleStatus] = useState(false);
  const [inputWidth, setInputWidth] = useState<string | number>("auto");
  const [internalExperimentTitle, setInternalExperimentTitle] = useState<string>(experimentTitle);

  const titleField = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedCallback<string>(handleExperimentTitleUpdate, DEBOUNCE_DELAY);

  const handleClickAway = () => setEditTitleStatus(false);
  const handleTitleUpdate = () => {
    setEditTitleStatus(!editNameStatus);
    setTimeout(() => {
      titleField.current?.focus();
      titleField.current?.setSelectionRange(
        titleField.current?.value.length,
        titleField.current?.value.length
      );
    }, 0);
  };

  useEffect(() => {
    if (titleField.current) {
      const textWidth = getTextWidth(internalExperimentTitle);
      setInputWidth(textWidth);
    }
  }, [internalExperimentTitle, editNameStatus]);

  const getTextWidth = (text: string): string => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = getComputedStyle(titleField.current as Element).font;
      const fieldWidth = context.measureText(text).width + 20;
      return fieldWidth + "px";
    }
    return "auto";
  };

  const handleExperimentTitleUpdateInternal = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalExperimentTitle(event.target.value);
    if (!event.target.value.length) {
      handleExperimentTitleUpdate("");
    } else {
      debounced(event.target.value);
    }
  };

  return (
    <Grid container>
      <Grid item>
        {editNameStatus ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <ExperimentNameTitleField
              variant="standard"
              margin="none"
              value={internalExperimentTitle}
              fullWidth
              onChange={handleExperimentTitleUpdateInternal}
              inputRef={titleField}
              sx={{
                py: 0,
                flexGrow: 1,
                "& .MuiInputBase-input": { py: 0 },
              }}
              InputProps={{
                disableUnderline: true,
                style: { fontSize: 22.3, width: inputWidth },
              }}
              inputProps={{
                title: "Edit experiment title",
              }}
            />
          </ClickAwayListener>
        ) : (
          <ExperimentName title="Experiment title">{internalExperimentTitle}</ExperimentName>
        )}
      </Grid>
      <Grid item>
        {!editNameStatus && (
          <UpdateNameButton title="Edit title" onClick={handleTitleUpdate}>
            <EditOutlinedIcon sx={{ verticalAlign: "middle" }} />
          </UpdateNameButton>
        )}
      </Grid>
    </Grid>
  );
}
