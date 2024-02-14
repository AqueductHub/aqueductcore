import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import DataObjectIcon from "@mui/icons-material/DataObject";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, styled } from "@mui/material";
import Table from "@mui/material/Table";

import { ExperimentFileType } from "types/globalTypes";
import { dateFormatter } from "helper/formatters";

const ExplorerBox = styled(Box)`
  width: 100%;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.palette.neutral.main};
  border-radius: ${(props) => props.theme.spacing(1)};
  background-color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.background.card
      : props.theme.palette.common.white};
`;

const ExplorerTableHead = styled(TableHead)`
  background-color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.common.black
      : props.theme.palette.background.paper};
`;

const FileNameCell = styled(TableCell)`
  font-weight: 600;
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
  cursor: pointer;
`;

const FileNameHeaderCell = styled(TableCell)`
  font-weight: 600;
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
`;

const DateAddedCell = styled(TableCell)`
  max-width: ${(props) => props.theme.spacing(6)};
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
`;

const DateAddedHeaderCell = styled(TableCell)`
  max-width: ${(props) => props.theme.spacing(6)};
  min-width: ${(props) => props.theme.spacing(6)};
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
  font-weight: 600;
`;

function Explorer({
  files,
  handleSelectFile,
  selectedItem,
}: {
  files: ExperimentFileType[];
  handleSelectFile: (fileIndex: number) => void;
  selectedItem: number;
}) {
  const getFileIcon = (name: string) => {
    switch (name.split(".").pop()) {
      case "png":
      case "jpg":
        return (
          <InsertPhotoOutlinedIcon
            sx={{ fontSize: 20, lineHeight: 20, verticalAlign: "middle", mr: 1 }}
          />
        );
      case "json":
        return (
          <DataObjectIcon sx={{ fontSize: 20, lineHeight: 20, verticalAlign: "middle", mr: 1 }} />
        );
      default:
        return (
          <InsertDriveFileOutlinedIcon
            sx={{ fontSize: 20, lineHeight: 20, verticalAlign: "middle", mr: 1 }}
          />
        );
    }
  };

  return (
    <ExplorerBox>
      <TableContainer
        sx={{ boxShadow: "none", borderRadius: "8px 8px 0 0", maxHeight: 540, height: 540 }}
      >
        <Table stickyHeader>
          <ExplorerTableHead>
            <TableRow>
              <FileNameHeaderCell>File name</FileNameHeaderCell>
              <DateAddedHeaderCell>Date added</DateAddedHeaderCell>
            </TableRow>
          </ExplorerTableHead>
          <TableBody>
            {files.map((row, index) => (
              <TableRow
                hover={selectedItem !== index}
                key={row.name}
                onClick={() => handleSelectFile(index)}
                sx={
                  selectedItem === index
                    ? { backgroundColor: "var(--mui-palette-fill-primaryFillPrimaryTransparent)" }
                    : null
                }
              >
                <FileNameCell>
                  {getFileIcon(row.name)}
                  {row.name}
                </FileNameCell>
                <DateAddedCell>{dateFormatter(new Date(row.modifiedAt))}</DateAddedCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ExplorerBox>
  );
}

export default Explorer;
