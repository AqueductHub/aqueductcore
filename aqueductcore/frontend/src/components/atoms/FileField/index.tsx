import { Autocomplete, Box, Grid, TextField, styled } from "@mui/material";

import { PluginFieldBase } from "types/globalTypes";
import { FieldDescription, FieldTitle, FieldType } from "../ExperimentField";

const FileInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: #ccc;
  padding: 0;
`;

interface FileProps extends PluginFieldBase {
  defaultValue?: string;
}

export function FileField({
  title,
  field,
  description = ""
}: FileProps) {

  const options = [
    "First Option",
    "Second Option",
    "Third Option"
  ]
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <Autocomplete
              disablePortal
              options={options}
              renderInput={(params) => <FileInput {...params} size="small" />}
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
