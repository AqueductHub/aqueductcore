import { Box, Select, Grid, Typography, styled, MenuItem } from "@mui/material";

const FieldTitle = styled(Typography)`
    font-size: 1rem;
    font-weight: bold;
    display: inline;
    margin-right: ${(props) => props.theme.spacing(0.5)};
`;

const FieldType = styled(Typography)`
    font-size: 0.8rem;
    display: inline;
    font-family: monospace;
    color: #999;
`;

const FieldDescription = styled(Typography)`
  font-size: 0.8rem;
  font-style: italic;
  border-left: 2px solid #999;
  color: #555;
  height: 100%;
`;

const DropDown = styled(Select)`
  width: calc(100% - 8px);
  height: ${(props) => props.theme.spacing(4.5)};
`;

interface SelectProps {
  title: string,
  field: string,
  description?: string,
  defaultValue?: string;
}

export function SelectField({
  title = "",
  field = "",
  description = "",
  defaultValue = ""
}: SelectProps) {
  const names = ["a", "b", "c"]

  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1 }}>
            <DropDown defaultValue={defaultValue} inputProps={{}}>
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
