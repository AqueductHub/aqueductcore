import { Box, Grid, TextField, TextFieldProps, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"
import { PluginFieldBase } from "types/globalTypes";

const IntegerInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  padding: 0;
  font-size: 0.9rem;
  line-height: ${(props) => props.theme.spacing(2.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(3)};
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

interface IntegerFieldProps extends PluginFieldBase {
  defaultValue?: string;
  integerFieldProps?: TextFieldProps
}

export function IntegerField({
  title,
  field,
  description,
  defaultValue,
  integerFieldProps
}: IntegerFieldProps) {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '.' || event.key === 'e' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  };

  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <IntegerInput
              {...integerFieldProps}
              type="number"
              size="small"
              defaultValue={defaultValue}
              onKeyDown={handleKeyDown}
              InputProps={{ inputProps: { step: 1, inputMode: 'numeric', pattern: '[0-9]*' } }}
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
