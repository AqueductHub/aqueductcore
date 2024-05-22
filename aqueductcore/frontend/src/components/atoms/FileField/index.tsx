import { Autocomplete, Box, Grid, TextField, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"
import { PluginFieldBase } from "types/globalTypes";

const FileInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  padding: 0;
  background-color: transparent;
`;

interface FileProps extends PluginFieldBase {
  options: string[];
  defaultValue?: string;
}

export function FileField({
  title,
  field,
  options,
  description = ""
}: FileProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <Autocomplete
              disablePortal
              options={options}
              renderInput={(params) => <FileInput {...params} InputProps={{ inputProps: { style: { backgroundColor: "transparent" } } }} size="small" />}
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
