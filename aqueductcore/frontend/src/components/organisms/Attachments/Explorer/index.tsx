import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { Box, TableSortLabel, styled } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import TableContainer from "@mui/material/TableContainer";
import { DragEvent, useMemo, useState } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";

import { FileSelectContextType, SortOrder, selectedFileType } from "types/componentTypes";
import { getComparator, stableSort } from "helper/functions";
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

const HeaderCell = styled(TableCell)`
  font-weight: 600;
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
`;

const FileNameCell = styled(TableCell)`
  font-weight: 600;
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
  cursor: pointer;
`;

const DateAddedCell = styled(TableCell)`
  max-width: ${(props) => props.theme.spacing(6)};
  padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(1.25)};
  cursor: pointer;
`;

interface HeadCell {
  id: keyof ExperimentFileType;
  label: string;
}

export const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    label: 'File name',
  },
  {
    id: 'modifiedAt',
    label: 'Date added',
  }
];

function Explorer({
  files,
  handleSelectFile,
  selectedItem,
  handleExperimentFileUpload
}: {
  files: ExperimentFileType[];
  handleSelectFile: FileSelectContextType['setSelectedFile'];
  selectedItem: selectedFileType;
  handleExperimentFileUpload?: (file: File) => void
}) {
  const [order, setOrder] = useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = useState<keyof ExperimentFileType>('modifiedAt');

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

  const createSortHandler =
    (property: keyof ExperimentFileType) => () => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

  const visibleRows = useMemo(() =>
    stableSort(files, getComparator(order, orderBy)),
    [files, order, orderBy],
  );

  function dropHandler(ev: DragEvent<HTMLDivElement>) {
    if (!handleExperimentFileUpload) return;
    dragLeaveHandler(ev)
    ev.preventDefault();
    if (ev?.dataTransfer) {
      if (ev.dataTransfer?.items) {
        [...ev.dataTransfer.items].forEach((item) => {
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) {
              handleExperimentFileUpload(file)
            }
          }
        });
      } else {
        [...ev.dataTransfer.files].forEach((file) => {
          handleExperimentFileUpload(file)
        });
      }
    }
  }

  function dragOverHandler(ev: DragEvent<HTMLDivElement>) {
    if (!handleExperimentFileUpload) return;
    ev.preventDefault();
    ev.currentTarget.style.background = "rgba(0, 0, 0, 0.08)"
  }

  function dragLeaveHandler(ev: DragEvent<HTMLDivElement>) {
    ev.currentTarget.style.background = "inherit"
  }

  return (
    <ExplorerBox>
      <div onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
        <TableContainer
          sx={{ boxShadow: "none", borderRadius: "8px 8px 0 0", maxHeight: 540, height: 540 }}
        >
          <Table stickyHeader>
            <ExplorerTableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <HeaderCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </HeaderCell>
                ))}
              </TableRow>
            </ExplorerTableHead>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow
                  hover={selectedItem !== index}
                  key={row.name}
                  onClick={() => handleSelectFile(String(row.name))}
                  selected={selectedItem === row.name}
                >
                  <FileNameCell>
                    {getFileIcon(String(row.name))}
                    {row.name}
                  </FileNameCell>
                  <DateAddedCell>{dateFormatter(new Date(row.modifiedAt))}</DateAddedCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ExplorerBox>
  );
}

export default Explorer;
