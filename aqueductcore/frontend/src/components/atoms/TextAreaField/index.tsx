import { Box, Grid, TextareaAutosize, TextareaAutosizeProps, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"
import { PluginFieldBase } from "types/globalTypes";

const TextAreaInput = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[400]};
  background-color: transparent;
  font-size: 0.9rem;
  line-height: ${(props) => props.theme.spacing(2.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(3)};
  padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1.5)};
  &.MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

interface TextAreaFieldProps extends PluginFieldBase {
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
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <TextAreaInput
              {...textareaFieldProps}
              color="primary"
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
