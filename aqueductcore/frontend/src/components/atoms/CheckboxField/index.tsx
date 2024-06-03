import { Box, Checkbox, CheckboxProps, Grid, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents/pluginInputFields"
import { ExtensionFieldBase } from "types/globalTypes";

const CheckboxInput = styled(Checkbox)`
  padding: ${({ theme }) => theme.spacing(0.5)};
  border-color: ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.grey[600]};
`;

interface CheckboxFieldProps extends ExtensionFieldBase {
  checkboxFieldProps: CheckboxProps
}

export function CheckboxField({
  title,
  field,
  description,
  checkboxFieldProps
}: CheckboxFieldProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box>
            <CheckboxInput
              title={field}
              {...checkboxFieldProps}
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
