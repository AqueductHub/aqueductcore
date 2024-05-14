import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import StarIcon from "@mui/icons-material/Star";
import TableRow from "@mui/material/TableRow";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

import { useRemoveTagFromExperiment } from "API/graphql/mutations/Experiment/removeTagFromExperiment";
import { useAddTagToExperiment } from "API/graphql/mutations/Experiment/addTagToExperiment";
import { FAVOURITE, experimentRecordsRowsPerPageOptions } from "constants/constants";
import {
  ExperimentRecordsColumnsType,
  ExperimentsListTableProps,
  ExperimentDataType,
} from "types/globalTypes";

function ExperimentsListTable({
  ExperimentRecordsColumns,
  experimentList,
  maxHeight,
  pageInfo,
}: {
  ExperimentRecordsColumns: readonly ExperimentRecordsColumnsType[];
  experimentList: ExperimentsListTableProps[];
  maxHeight?: string;
  pageInfo: {
    page: number;
    setPage: (number: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (number: number) => void;
    count: number;
  };
}) {
  const [showActionId, setShowActionId] = useState("-1");
  const { page, setPage, rowsPerPage, setRowsPerPage, count } = pageInfo;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: mutateAddTag } = useAddTagToExperiment();
  const { mutate: mutateRemoveTag } = useRemoveTagFromExperiment();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const newQueryParameters: URLSearchParams = new URLSearchParams(searchParams);
    newQueryParameters.set('rowsPerPage', String(rowsPerPage))
    newQueryParameters.set('page', String(page))
    setSearchParams(newQueryParameters, { replace: true })
  }, [page, rowsPerPage])

  function handleToggleFavorite(
    e: React.MouseEvent,
    experimentId: ExperimentDataType["id"],
    addToFavourite?: boolean
  ) {
    e.stopPropagation();
    if (addToFavourite) {
      mutateAddTag({
        variables: {
          experimentId: experimentId,
          tag: FAVOURITE,
        },
      });
    } else {
      mutateRemoveTag({
        variables: {
          experimentId: experimentId,
          tag: FAVOURITE,
        },
      });
    }
  }
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {ExperimentRecordsColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <strong>{column.label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {experimentList.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.alias}
                  onMouseEnter={() => {
                    setShowActionId(row.alias); // set id here
                  }}
                  onMouseLeave={() => setShowActionId("-1")}
                  onClick={() =>
                    navigate(`/aqd/experiments/${row.alias}`, {
                      state: { from: window.location.pathname },
                    })
                  }
                  sx={{ cursor: "pointer" }}
                >
                  {ExperimentRecordsColumns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          textOverflow: column.ellipsis ? "ellipsis" : "initial",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {column.id === "star" ? (
                          value ? (
                            <StarIcon
                              color="primary"
                              fontSize="small"
                              style={{
                                cursor: row.alias === showActionId ? "pointer" : "default",
                              }}
                              onClick={(e) => handleToggleFavorite(e, row.id, false)}
                            />
                          ) : (
                            <StarBorderOutlinedIcon
                              fontSize="small"
                              style={{
                                visibility: row.alias === showActionId ? "inherit" : "hidden",
                                cursor: row.alias === showActionId ? "pointer" : "default",
                              }}
                              onClick={(e) => handleToggleFavorite(e, row.id, true)}
                            />
                          )
                        ) : column.format ? (
                          column.format(value)
                        ) : (
                          String(value)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          borderTop: `1px solid ${grey[300]}`,
        }}
        rowsPerPageOptions={experimentRecordsRowsPerPageOptions}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ExperimentsListTable;
