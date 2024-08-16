import { Paper, Table, TablePagination } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { grey } from "@mui/material/colors";
import { useState } from "react";

import { JobDataType, JobsListColumnsType } from "types/globalTypes";
import { jobListRowsPerPageOptions } from "constants/constants";
import JobDetailsModal from "../JobDetailsModal";

function JobsListTable({
    JobRecordsColumns,
    jobList,
    maxHeight,
    pageInfo,
}: {
    JobRecordsColumns: readonly JobsListColumnsType[];
    jobList: JobDataType[];
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
    const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);  
    const { page, setPage, rowsPerPage, setRowsPerPage, count } = pageInfo;
    
    const handleCloseJobDetailsModal = () => setJobDetailsModalOpen(false);
    const handleOpenJobDetailsModal = () => setJobDetailsModalOpen(true);
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(showActionId);
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {JobRecordsColumns.map((column) => (
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
                        {jobList.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.receiveTime}
                                    onMouseEnter={() => {
                                        setShowActionId(row.receiveTime); // set id here
                                    }}
                                    onMouseLeave={() => setShowActionId("-1")}
                                    onClick={() =>
                                        handleOpenJobDetailsModal()
                                    }
                                    sx={{ cursor: "pointer" }}
                                >
                                    {JobRecordsColumns.map((column) => {
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
                                                {column.format ? (
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
                rowsPerPageOptions={jobListRowsPerPageOptions}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <JobDetailsModal
                isOpen={jobDetailsModalOpen}
                handleClose={handleCloseJobDetailsModal}
                selectedExtension={"name_ext"}
                selectedAction={"action_ext"}
            />
        </Paper>
    );
}

export default JobsListTable;
