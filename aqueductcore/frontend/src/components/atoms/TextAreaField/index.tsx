import { Box, Grid, TextareaAutosize, TextareaAutosizeProps, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType, RequiredFieldIndicator } from "components/atoms/sharedStyledComponents/ExtensionInputFields"
import { ExtensionFieldBase } from "types/globalTypes";

const TextAreaInput = styled(TextareaAutosize)`
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  resize: auto;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  background-color: transparent;
  font-size: 1rem;
  color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.common.white
      : props.theme.palette.common.black};
  line-height: ${(props) => props.theme.spacing(2.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(5)};
  padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1.5)};
  
  &:focus {
    border: 1px solid ${(props) => props.theme.palette.primary.main};
  }

  &:focus-visible {
    outline: 0;
  }
`;

interface TextAreaFieldProps extends ExtensionFieldBase {
  textareaFieldProps: TextareaAutosizeProps
}

export function TextAreaField({
  title,
  field,
  description,
  textareaFieldProps
}: TextAreaFieldProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle>
          <RequiredFieldIndicator>*</RequiredFieldIndicator>
          <FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <TextAreaInput
              title={field}
              color="primary"
              {...textareaFieldProps}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>
        </Grid>
      </Grid>
    </Box>
  );
}
