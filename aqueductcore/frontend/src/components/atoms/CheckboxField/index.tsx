import { Box, Checkbox, Grid, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"

const CheckboxInput = styled(Checkbox)`
  padding: ${({ theme }) => theme.spacing(0.5)});
  border-color: ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.grey[600]};
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
            <CheckboxInput defaultValue={defaultValue} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>
        </Grid>
      </Grid>
    </Box>
  );
}
