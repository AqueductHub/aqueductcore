// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Grid, Typography, styled } from "@mui/material";
import { ChangeEvent, useContext } from "react";
import toast from "react-hot-toast";

import { BorderedButtonWithIcon } from "components/atoms/sharedStyledComponents/BorderedButtonWithIcon";
import { VisuallyHiddenInput } from "components/atoms/sharedStyledComponents/VisuallyHiddenInput";
import { FileSelectStateContext } from "context/FileSelectProvider";
import { ExperimentFileType } from "types/globalTypes";
import { client } from "API/apolloClientConfig";
import { AQD_FILE_URI } from "constants/api";
import Explorer from "./Explorer";
import Viewer from "./Viewer";

const SectionTitle = styled(Typography)`
font-size: 1.15rem;
margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
`;

interface AttachmentProps {
  experimentUuid: ExperimentFileType[];
  experimentFiles: ExperimentFileType[];
}

function Attachments({ experimentUuid, experimentFiles }: AttachmentProps) {
  const { selectedFile, setSelectedFile } = useContext(FileSelectStateContext)

  function handleExperimentFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target?.files[0]
      const uploadFileEndpoint = file ? `${AQD_FILE_URI}/api/files/${experimentUuid}` : "";

      const data = new FormData();
      data.append('file', file);

      fetch(uploadFileEndpoint, {
        method: 'POST',
        headers: {
          file_name: file.name
        },
        body: data
      })
        .then((response) => {
          const status = response.status
          const statusText = response.statusText
          // SUCCESS
          if (status === 200) {
            response.json().then(async (data) => {
              await client.refetchQueries({
                include: "active",
              });
              // ! file.name is fronm client! might cause issues,
              // TODO: it should be in the response.
              setSelectedFile(file.name)
              toast.success(data.result ?? "File uploaded successfully!", {
                id: "upload_success",
              });
            })
            // Response failure message
          } else {
            response.json().then((error) => {
              toast.error(error.detail ?? statusText, {
                id: "upload_failed",
              });
            })
              // No failure message
              .catch(() => {
                toast.error(statusText, {
                  id: "upload_catch",
                });
              });
          }
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
            <VisuallyHiddenInput type="file" onChange={handleExperimentFileUpload} />
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
