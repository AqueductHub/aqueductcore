import { Box, Grid, TextareaAutosize, styled } from "@mui/material";

import { PluginFieldBase } from "types/globalTypes";
import { FieldDescription, FieldTitle, FieldType } from "../ExperimentField";

const TextAreaInput = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  font-size: 0.9rem;;
  line-height: ${(props) => props.theme.spacing(2.5)};
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(3)};
  padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1.5)};
`;

interface TextAreaProps extends PluginFieldBase {
  defaultValue?: string;
}

export function TextAreaField({
  title,
  field,
  description = "",
  defaultValue = ""
}: TextAreaProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <TextAreaInput defaultValue={defaultValue} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>
        </Grid>
      </Grid>
    </Box>
  );
}
