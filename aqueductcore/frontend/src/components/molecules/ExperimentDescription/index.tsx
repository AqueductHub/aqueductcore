import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";

import useDebouncedCallback from "hooks/useDebounceCallBack";
import { DEBOUNCE_DELAY } from "constants/constants";

const SectionTitle = styled(Typography)`
  font-size: 1.15rem;
  margin-top: ${(props) => `${props.theme.spacing(3)}`};
`;

const ExperimentDescription = styled(Typography)`
  font-size: 0.9335rem;
  padding: ${(props) => `${props.theme.spacing(1.5)}`};
  margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
  margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
  border: 1px solid ${(props) => props.theme.palette.neutral.main};
  border-radius: ${(props) => props.theme.spacing(1)};
  white-space: pre-line;
  line-height: 1.48;
`;

const EditDescriptionButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  color: ${(props) => props.theme.palette.primary.main};
  margin-top: ${(props) => `${props.theme.spacing(2.5)}`};
`;

const ExperimentDescriptionTextField = styled(TextareaAutosize)`
  padding: ${(props) => `${props.theme.spacing(1.5)}`} ${(props) => `${props.theme.spacing(1.5)}`};
  border: 1px solid ${(props) => props.theme.palette.neutral.main};
  margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
  margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
  border-radius: ${(props) => props.theme.spacing(1)};
  vertical-align: middle;
  font-size: 0.92rem;
  letter-spacing: 10;
  line-height: 1.5;
  resize: none;
  width: 100%;
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

interface ExperimentDescriptionProps {
  experimentDescription: string;
  handleExperimentDescriptionUpdate: (value: string) => void;
}

export function ExperimentDescriptionUpdate({
  experimentDescription,
  handleExperimentDescriptionUpdate,
}: ExperimentDescriptionProps) {
  const [editDescriptionStatus, setEditDescriptionStatus] = useState(false);
  const handleClickAway = () => setEditDescriptionStatus(false);
  const handleDescriptionUpdate = () => {
    setEditDescriptionStatus(!editDescriptionStatus);
    setTimeout(() => {
      descriptionField.current?.focus();
      descriptionField.current?.setSelectionRange(
        descriptionField.current?.value.length,
        descriptionField.current?.value.length
      );
    }, 0);
  };
  const descriptionField = useRef<HTMLInputElement>(null);

  const [internalExperimentDescription, setInternalExperimentDescription] =
    useState<string>(experimentDescription);

  const handleExperimentDescriptionUpdateInternal = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInternalExperimentDescription(event.target.value);
    if (!event.target.value.length) {
      handleExperimentDescriptionUpdate("");
    } else {
      debounced(event.target.value);
    }
  };

  const debounced = useDebouncedCallback<string>(
    handleExperimentDescriptionUpdate,
    DEBOUNCE_DELAY
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-start">
            <SectionTitle>Description</SectionTitle>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            {!editDescriptionStatus && (
              <EditDescriptionButton
                title="Edit description"
                size="small"
                variant="text"
                onClick={handleDescriptionUpdate}
              >
                Edit
              </EditDescriptionButton>
            )}
          </Box>
        </Grid>
      </Grid>
      {editDescriptionStatus ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <ExperimentDescriptionTextField
            title="Edit experiment description"
            color="primary"
            value={internalExperimentDescription}
            onChange={handleExperimentDescriptionUpdateInternal}
            ref={descriptionField}
          />
        </ClickAwayListener>
      ) : (
        <ExperimentDescription title="Experiment description">
          {internalExperimentDescription}
        </ExperimentDescription>
      )}
    </Box>
  );
}
