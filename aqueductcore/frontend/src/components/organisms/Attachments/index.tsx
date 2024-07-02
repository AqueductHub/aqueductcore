// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Grid, Typography, styled } from "@mui/material";
import { ChangeEvent, useContext } from "react";

import { BorderedButtonWithIcon } from "components/atoms/sharedStyledComponents/BorderedButtonWithIcon";
import { VisuallyHiddenInput } from "components/atoms/sharedStyledComponents/VisuallyHiddenInput";
import { ExperimentDataType, ExperimentFileType } from "types/globalTypes";
import { FileSelectStateContext } from "context/FileSelectProvider";
import useFileUpload from "hooks/useUploadFile";
import Explorer from "./Explorer";
import Viewer from "./Viewer";

const SectionTitle = styled(Typography)`
font-size: 1.15rem;
margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
`;

interface AttachmentProps {
  experimentUuid: ExperimentDataType['uuid'];
  experimentFiles: ExperimentFileType[];
}

function Attachments({ experimentUuid, experimentFiles }: AttachmentProps) {
  const { selectedFile, setSelectedFile } = useContext(FileSelectStateContext)
  const { handleExperimentFileUpload } = useFileUpload(experimentUuid)
  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      [...e.target.files].forEach(file => {
        handleExperimentFileUpload(file)
      })
    }
  }
  return (
    <>
      <SectionTitle sx={{ mt: 3 }}>Attachment</SectionTitle>
      <Grid container spacing={1} sx={{ mt: 0.5 }}>
        <Grid item>
          <BorderedButtonWithIcon
            // @ts-expect-error is not assignable to type
            component="label"
            role={undefined}
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<UploadFileOutlinedIcon />}
          >
            File upload
            <VisuallyHiddenInput type="file" multiple onChange={handleChangeFile} />
          </BorderedButtonWithIcon>
        </Grid>
        {/* <Grid item>
          <Divider orientation="vertical" />
        </Grid> */}
        {/* <Grid item>
          <BorderedButtonWithIcon
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Delete
          </BorderedButtonWithIcon>
        </Grid> */}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} lg={6}>
          <Explorer
            files={experimentFiles}
            handleSelectFile={setSelectedFile}
            selectedItem={selectedFile}
            handleExperimentFileUpload={handleExperimentFileUpload}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Viewer
            file={experimentFiles.find(file => file.name === selectedFile)}
            handleSelectFile={setSelectedFile}
            experimentUuid={experimentUuid}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Attachments;
