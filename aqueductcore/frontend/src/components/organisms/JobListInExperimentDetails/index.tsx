import { Grid, styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import JobExtensionActionName from "components/molecules/JobListTableCells/JobExtensionActionName";
import JobExtensionStatus from "components/molecules/JobListTableCells/JobExtensionStatus";
import { dateFormatter, jobHistoryTableFormatter } from "helper/formatters";
import { useGetAllTasks } from "API/graphql/queries/tasks/getAllTasks";
import { JobDataType, JobsListColumnsType } from "types/globalTypes";
import ExtensionsList from "components/organisms/ExtensionsList";
import { jobListRowsPerPageOptions } from "constants/constants";
import JobsListTable from "components/organisms/JobsListTable";
import { Loading } from "components/atoms/Loading";
import { Error } from "components/atoms/Error";

export const tableHeightOffset = 200;

const Title = styled(Box)`
  font-size: 1.15rem;
  margin-top: ${(props) => `${props.theme.spacing(3)}`};
`;

export const JobsListColumns: readonly JobsListColumnsType[] = [
    {
        id: "extension",
        label: "Extension",
        format: (extension) => (
            <JobExtensionActionName
                name={(extension as JobDataType['extension']).name}
                action={(extension as JobDataType['extension']).action}
            />
        ),
    },
    {
        id: "taskStatus",
        label: "Status",
        format: (status) => (
            <JobExtensionStatus
                status={status as JobDataType['taskStatus']}
            />
        ),
    },
    // {
    //   id: "experiment",
    //   label: "User",
    // },
    {
        id: "receivedAt",
        label: "submission Time",
        format: (createdAt) =>
            typeof createdAt === "string" ? dateFormatter(new Date(createdAt)) : "",
    },
];

function JobListInExperimentDetails() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(jobListRowsPerPageOptions[0]);
    const { data, loading, error } = useGetAllTasks({
        variables: {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            filters: {},
        },
        fetchPolicy: "network-only",
    });
    const pageInfo = {
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        count: data?.tasks.totalTasksCount || 0,
    };

    const tasks = data?.tasks.tasksData

    if (loading) return (<Loading isGlobal />)
    if (error) return <Error message={error.message} />;
    if (!tasks) return <></>;

    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Box display="flex" justifyContent="flex-start">
                        <Title>Experiment Jobs</Title>
                    </Box>
                </Grid>
                <Grid item xs={6} >
                    <Box display="flex" sx={{ height: '100%' }} alignItems="flex-end" justifyContent="flex-end">
                        <ExtensionsList />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <JobsListTable
                    JobRecordsColumns={JobsListColumns}
                    jobList={jobHistoryTableFormatter(tasks)}
                    maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
                    pageInfo={pageInfo}
                />
            </Box>
        </>
    );
}

export default JobListInExperimentDetails;
