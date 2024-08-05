import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper } from "@mui/material";
import JobExperimentName from "components/atoms/JobExperimentName";
import JobExtensionActionName from "components/atoms/JobExtensionActionName";

function JobsListTable () {
    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <strong>Experiment</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Extension</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Status</strong>
                        </TableCell>
                        <TableCell>
                            <strong>User</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Submission Time</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <JobExperimentName />
                        </TableCell>
                        <TableCell>
                            <JobExtensionActionName />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>Jatin Lal</TableCell>
                        <TableCell>18/07/2024 10:32</TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>
        </Paper>
    );
}

export default JobsListTable;
