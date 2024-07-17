import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Grid, Typography, styled } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";

import { BorderedButtonWithIcon } from "components/atoms/sharedStyledComponents/BorderedButtonWithIcon";
import DeleteExperimentFileModal from "components/organisms/DeleteExperimentFileModal"
import { VisuallyHiddenInput } from "components/atoms/sharedStyledComponents/VisuallyHiddenInput";
import { ExperimentDataType, ExperimentFileType } from "types/globalTypes";
import { FileSelectStateContext } from "context/FileSelectProvider";
import useFileUpload from "hooks/useUploadFile";
import Explorer from "./Explorer";
import Viewer from "./Viewer";
import useFileDelete from "hooks/useDeleteFile";

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
  const [isDeleteExperimentFileModalOpen, setDeleteExperimentFileModalOpen] = useState(false);
  const { handleExperimentFileUpload } = useFileUpload(experimentUuid)
  const { handleExperimentFileDelete } = useFileDelete(experimentUuid)
  const handleOpenDeleteExperimentFileModal = () => setDeleteExperimentFileModalOpen(true);
  const handleCloseDeleteExperimentFileModal = () => setDeleteExperimentFileModalOpen(false);

  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      [...e.target.files].forEach(file => {
        handleExperimentFileUpload(file)
      })
    }
  }
  function handleFileDelete() {
    if (selectedFile) {
      handleExperimentFileDelete(selectedFile)
      setDeleteExperimentFileModalOpen(false)
      setSelectedFile(undefined)
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
        {selectedFile && <Grid item>
          <BorderedButtonWithIcon
            variant="outlined"
            size="small"
            color="neutral"
            sx={{ ml: 0.5 }}
            onClick={handleOpenDeleteExperimentFileModal}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Delete
          </BorderedButtonWithIcon>
          <DeleteExperimentFileModal
            open={isDeleteExperimentFileModalOpen}
            onClose={handleCloseDeleteExperimentFileModal}
            handleDeleteExperimentFile={handleFileDelete}
          />
        </Grid>}
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
