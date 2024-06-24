import { Box, Button, IconButton, Typography, styled, useTheme } from "@mui/material";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReactJson from "@microlink/react-json-view";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

import { ExperimentDataType, ExperimentFileType, PreviewFilesType } from "types/globalTypes";
import { FileSelectContextType } from "types/componentTypes";
import { mdUrlTransformer } from "helper/formatters";
import { AQD_FILE_URI } from "constants/api";

const ViewerBox = styled(Box)`
  width: 100%;
  height: ${({ theme }) => theme.spacing(25)};
  border: 1px solid ${({ theme }) => theme.palette.neutral.main};
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: ${({ theme }) => theme.spacing(67.5)};
  background-color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.background.card
      : props.theme.palette.common.white};
`;

const ViewerBoxHeader = styled(Box)`
  border-radius: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1)} 0 0`};
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutral.main};
  padding: 0 ${({ theme }) => theme.spacing(1.25)};
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.palette.background.paper};
`;

const ViewerBoxHeaderContent = styled(Typography)`
  width: 100%;
  line-height: ${({ theme }) => theme.spacing(6)};
  font-weight: 600;
  font-size: 0.85rem;
`;

const NoPreview = styled(Box)`
  width: 100%;
  height: calc(100% - ${({ theme }) => theme.spacing(6.25)});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpecialFilePreview = styled(Box)`
  width: 100%;
  height: calc(100% - ${({ theme }) => theme.spacing(6.25)});
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  overflow: scroll;
  background-color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.common.black
      : props.theme.palette.common.white};
`;

const FilePreviewImages = styled(Box)`
  width: 100%;
  height: calc(100% - ${({ theme }) => theme.spacing(6.25)});
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoFileSelectedError = styled(Typography)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 50%;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) =>
    theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.grey[400]};
`;

const ImageView = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TextViewer = styled("textarea")`
  width: 100%;
  height: calc(100% - ${({ theme }) => theme.spacing(6.25)});
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: none;
  outline: none;
  resize: none;
`;

function Viewer({
  file,
  experimentUuid,
  handleSelectFile,
}: {
  file?: ExperimentFileType;
  experimentUuid: ExperimentDataType['uuid'];
  handleSelectFile: FileSelectContextType['setSelectedFile'];
}) {

  const [info, setInfo] = useState<{ data: unknown; type: PreviewFilesType }>();
  const fileURL = file ? `${AQD_FILE_URI}${file.path}/${file.name}` : "";
  const theme = useTheme()

  useEffect(() => {
    if (file) {
      fetch(fileURL).then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          response.json().then((data) => {
            setInfo({
              data,
              type: "JSON",
            });
          });
        } else if (contentType?.includes("text/x-markdown")) {
          response.text().then((data) => {
            setInfo({
              data,
              type: "MARKDOWN",
            });
          });
        } else if (contentType?.includes("text/plain")) {
          response.text().then((data) => {
            setInfo({
              data,
              type: "text/plain",
            });
          });
        } else if (contentType?.includes("image/jpeg")) {
          setInfo({
            data: fileURL,
            type: "image/jpeg",
          });
        } else if (contentType?.includes("image/png")) {
          setInfo({
            data: fileURL,
            type: "image/png",
          });
        } else
          setInfo({
            data: fileURL,
            type: "file",
          });
      });
    }
  }, [file]);

  return (
    <ViewerBox>
      <ViewerBoxHeader>
        <ViewerBoxHeaderContent title="file_name">{file ? file.name : "No file selected"}</ViewerBoxHeaderContent>
        {file ? (
          <>
            {info?.type !== "file" ? (
              <IconButton href={fileURL} component="a" target="_blank" rel="noopener noreferrer">
                <OpenInNewIcon titleAccess="Open in new tab" />
              </IconButton>
            ) : null}
            <IconButton onClick={() => handleSelectFile(undefined)}>
              <CloseIcon titleAccess="Close" />
            </IconButton>
          </>
        ) : null}
      </ViewerBoxHeader>
      {file && info && info.data ? (
        /*  JSON */
        info?.type === "JSON" ? (
          <SpecialFilePreview>
            <ReactJson src={info.data} theme={theme.palette.mode === 'dark' ? 'bright' : 'bright:inverted'} />
          </SpecialFilePreview>
          /* MARKDOWN */
        ) : info?.type === "MARKDOWN" ? (
          <SpecialFilePreview>
            {info && <Markdown urlTransform={(url) => mdUrlTransformer(url, experimentUuid)}>{String(info?.data)}</Markdown>}
          </SpecialFilePreview>
          /* TEXT */
        ) : info?.type === "text/plain" ? (
          <TextViewer readOnly value={String(info.data)} />
          /* IMAGES */
        ) : ["image/jpeg", "image/png"].includes(info?.type) ? (
          <FilePreviewImages>
            <ImageView alt={file.name} src={fileURL} />
          </FilePreviewImages>
          /* Files */
        ) :
          info?.type === "file" ? (
            <NoPreview>
              <NoFileSelectedError>
                <InsertDriveFileIcon sx={{ fontSize: 36 }} />
                No preview available for this file.
                <Button
                  href={fileURL}
                  size="small"
                  color="inherit"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  download
                  <OpenInNewIcon fontSize="small" />
                </Button>
              </NoFileSelectedError>
            </NoPreview>
          ) : null
      ) : (
        /* No Preview */
        <NoPreview>
          <NoFileSelectedError>
            <FileOpenOutlinedIcon sx={{ fontSize: 36, mb: 2 }} />
            Please select a file from explorer
          </NoFileSelectedError>
        </NoPreview>
      )}
    </ViewerBox>
  );
}

export default Viewer;
