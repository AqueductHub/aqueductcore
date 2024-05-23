import { Box, Select, Grid, styled, MenuItem } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"
import { PluginFieldBase } from "types/globalTypes";

const DropDown = styled(Select)`
  width: calc(100% - ${(props) => props.theme.spacing(1)});
  height: ${(props) => props.theme.spacing(5)};
  font-size: 0.9rem;
  border-color: ${({ theme }) => theme.palette.neutral.main};
`;

interface SelectProps extends PluginFieldBase {
  options: string[];
  selectFieldProps?: SelectProps
}

export function SelectField({
  title,
  field,
  description,
  options,
  selectFieldProps
}: SelectProps) {

  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1 }}>
            <DropDown
              {...selectFieldProps}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
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
