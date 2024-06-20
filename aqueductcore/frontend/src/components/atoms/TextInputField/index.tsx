import { Box, Grid, InputAdornment, TextField, TextFieldProps, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType, InputFieldHint, RequiredFieldIndicator } from "components/atoms/sharedStyledComponents/ExtensionInputFields"
import { ExtensionFieldBase } from "types/globalTypes";

const TextFieldInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  padding: 0;
  font-size: 0.9rem;
  line-height: ${(props) => props.theme.spacing(2.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(3)};
`;

interface TextInputFieldProps extends ExtensionFieldBase {
  defaultValue?: string;
  textFieldProps?: TextFieldProps
}

export function TextInputField({
  title,
  field,
  description,
  defaultValue,
  textFieldProps
}: TextInputFieldProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle>
          <RequiredFieldIndicator>*</RequiredFieldIndicator>
          <FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <TextFieldInput
              {...textFieldProps}
              size="small"
              title={field}
              defaultValue={defaultValue}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <InputFieldHint>string</InputFieldHint>
                </InputAdornment>,
              }}
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
