import { Autocomplete, AutocompleteProps, Box, Grid, InputAdornment, TextField, styled } from "@mui/material";

import { FieldDescription, FieldTitle, FieldType, InputFieldHint } from "components/atoms/sharedStyledComponents/ExtensionInputFields"
import { useGetExperimentFilesById } from "API/graphql/queries/experiment/getExperimentFilesById";
import { ExtensionFieldBase, WithOptional } from "types/globalTypes";

const FileInput = styled(TextField)`
  resize: none;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.neutral.main};
  padding: 0;
  background-color: transparent;
`;

interface FileFieldProps extends ExtensionFieldBase {
  experimentIdentifier: string;
  fileFieldProps?: WithOptional<WithOptional<AutocompleteProps<string, false, true, false>, 'options'>, 'renderInput'>;
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
        type: experimentIdentifier?.split("-").length === 2 ? "EID" : "UUID",
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
              title={field}
              size="small"
              forcePopupIcon={false}
              options={experimentFilesList}
              renderInput={(params) => <FileInput
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <InputFieldHint>file</InputFieldHint>
                    </InputAdornment>
                  ),
                }}
              />}
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
