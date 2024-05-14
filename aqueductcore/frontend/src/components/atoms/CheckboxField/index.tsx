import { Box, Checkbox, Grid, Typography, styled } from "@mui/material";

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

interface CheckboxProps {
  title: string,
  field: string,
  description: string,
  defaultValue?: string;
}

export function CheckboxField({
  title = "",
  field = "",
  description = "",
  defaultValue = ""
}: CheckboxProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box>
            <Checkbox defaultValue={defaultValue} sx={{ p: 0.5, borderColor: "#999" }} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>
        </Grid>
      </Grid>
    </Box>
  );
}
