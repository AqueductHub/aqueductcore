import { Box, Grid, Typography, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents/ExtensionInputFields"
import { ExtensionFieldBase } from "types/globalTypes";

const ExperimentBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.palette.neutral.main};
  background-color: ${({ theme }) => theme.palette.grey[200]};;
  width: calc(100% - ${(props) => props.theme.spacing(1)});
  border-radius: ${(props) => props.theme.spacing(0.5)};
  padding: ${(props) => props.theme.spacing(1)};
`;

const ExperimentTitle = styled(Typography)`
  font-size: 0.9rem;
`;

const ExperimentEID = styled(Typography)`
  font-size: 0.6rem;
  font-style: italic;
`;

interface ExperimentProps extends ExtensionFieldBase {
  experiment_title: string,
  experiment_eid: string,
}

export function ExperimentField({
  title,
  field,
  description,
  experiment_title,
  experiment_eid
}: ExperimentProps) {
  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1 }}>
            <ExperimentBox>
              <ExperimentTitle>{experiment_title}</ExperimentTitle>
              <ExperimentEID>{experiment_eid}</ExperimentEID>
            </ExperimentBox>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <FieldDescription sx={{ pl: 2 }}>{description}</FieldDescription>
        </Grid>
      </Grid>
    </Box>
  );
}
