import { Autocomplete, AutocompleteProps, Box, Grid, TextField, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType } from "components/atoms/sharedStyledComponents"
import { useGetExperimentFilesById } from "API/graphql/queries/getExperimentFilesById";
import { PluginFieldBase } from "types/globalTypes";

const FileInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  padding: 0;
  background-color: transparent;
`;

interface FileFieldProps extends PluginFieldBase {
  experimentIdentifier: string;
  fileFieldProps?: AutocompleteProps<string, false, true, false>;
}

export function FileField({
  title,
  field,
  description,
  experimentIdentifier,
  fileFieldProps,
}: FileFieldProps) {

  const {
    loading,
    data: experimentData,
    error,
  } = useGetExperimentFilesById({
    variables: {
      experimentIdentifier: {
        type: experimentIdentifier?.split("-").length === 2 ? "ALIAS" : "UUID",
        value: experimentIdentifier,
      },
    },
  });

  const experimentDetails = experimentData?.experiment;

  if (loading) return <></>
  if (error) return <></>
  if (!experimentDetails) return <></>;

  const experimentFilesList = experimentData?.experiment.files.map((item) => item.name);

  return (
    <Box>
      <Grid container sx={{ px: 2, py: 1.5 }}>
        <Grid item xs={6}>
          <FieldTitle>{title}</FieldTitle><FieldType>{field}</FieldType>
          <Box sx={{ p: 1, pr: 2 }}>
            <Autocomplete
              {...fileFieldProps}
              size="small"
              forcePopupIcon={false}
              options={experimentFilesList}
              renderInput={(params) => <FileInput {...params} />}
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
