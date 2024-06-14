import { Grid, Typography, styled } from "@mui/material";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
// import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
// import { Divider } from "@mui/material";
import { useState } from "react";

import { ExperimentFileType } from "types/globalTypes";
import Explorer from "./Explorer";
import Viewer from "./Viewer";

const SectionTitle = styled(Typography)`
  font-size: 1.15rem;
  margin-top: ${(props) => `${props.theme.spacing(1.5)}`};
`;

// const BorderedButtonWithIcon = styled(Button)`
//   border-color: ${(props) => props.theme.palette.neutral.main};
//   color: ${(props) =>
//     props.theme.palette.mode === "dark"
//       ? props.theme.palette.common.white
//       : props.theme.palette.common.black};
//   text-transform: none;
//   padding-left: ${(props) => `${props.theme.spacing}`};
//   padding-right: ${(props) => `${props.theme.spacing}`};
// `;

interface AttachmentProps {
  experimentUuid: ExperimentFileType[];
  experimentFiles: ExperimentFileType[];
}

function Attachments({ experimentUuid, experimentFiles }: AttachmentProps) {
  const [selectedItem, setSelectedItem] = useState();

  return (
    <>
      <SectionTitle sx={{ mt: 3 }}>Attachment</SectionTitle>
      {/* // TODO:  will be uncommented when functionality is back*/}
      {/* <Grid container spacing={1} sx={{ mt: 0.5 }}>
        <Grid item>
          <BorderedButtonWithIcon
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<UploadFileOutlinedIcon />}
          >
            File upload
          </BorderedButtonWithIcon>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" />
        </Grid>
        <Grid item>
          <BorderedButtonWithIcon
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<FileDownloadOutlinedIcon />}
          >
            Download
          </BorderedButtonWithIcon>
        </Grid>
        <Grid item>
          <BorderedButtonWithIcon
            variant="outlined"
            size="small"
            color="neutral"
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Delete
          </BorderedButtonWithIcon>
        </Grid>
      </Grid> */}
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} lg={6}>
          <Explorer
            files={experimentFiles}
            handleSelectFile={setSelectedItem}
            selectedItem={selectedItem}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Viewer file={selectedItem && experimentFiles.find(item => item.modifiedAt === selectedItem)} handleSelectFile={setSelectedItem} experimentUuid={experimentUuid} />
        </Grid>
      </Grid>
    </>
  );
}

export default Attachments;
