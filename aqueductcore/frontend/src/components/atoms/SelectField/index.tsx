import { Box, Select, Grid, styled, MenuItem } from "@mui/material";

import { PluginFieldBase } from "types/globalTypes";
import { FieldDescription, FieldTitle, FieldType } from "../ExperimentField";

const DropDown = styled(Select)`
  width: calc(100% - ${(props) => props.theme.spacing(1)});
  height: ${(props) => props.theme.spacing(5)};
  font-size: 0.9rem;
`;

interface SelectProps extends PluginFieldBase {
  defaultValue?: string;
}

export function SelectField({
  title,
  field,
  description = "",
  defaultValue = ""
}: SelectProps) {
  const names = ["Classical Block Codes", "Presence Versus Minimal Distance", "Implicit-Input Explicit-Output Model"]

  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1 }}>
            <DropDown defaultValue={defaultValue}>
              {names.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </DropDown>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {description && <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>}
        </Grid>
      </Grid>
    </Box>
  );
}
