import { Box, Grid, TextField, styled } from "@mui/material";

import { PluginFieldBase } from "types/globalTypes";
import { FieldDescription, FieldTitle, FieldType } from "../ExperimentField";

const NumberInput = styled(TextField)`
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
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

interface NumberProps extends PluginFieldBase {
  defaultValue?: string;
}

export function NumberField({
  title,
  field,
  description = "",
  defaultValue = ""
}: NumberProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <NumberInput
              type="number"
              size="small"
              defaultValue={defaultValue}
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
