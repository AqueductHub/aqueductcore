import { Box, Grid, TextareaAutosize, Typography, styled } from "@mui/material";

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

const TextAreaInput = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: #ccc;
  border-radius: ${(props) => props.theme.spacing(0.5)};
  min-height: ${(props) => props.theme.spacing(2.5)};
  padding: ${(props) => props.theme.spacing(1)};
`;

interface TextAreaProps {
  title: string,
  field: string,
  description: string,
  defaultValue?: string;
}

export function TextAreaField({
  title = "",
  field = "",
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
