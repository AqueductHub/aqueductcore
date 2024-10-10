import { Grid, styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import TaskExtensionActionName from "components/molecules/TaskListTableCells/TaskExtensionActionName";
import TaskExtensionStatus from "components/molecules/TaskListTableCells/TaskExtensionStatus";
import { ExperimentDataType, TaskDataType, TasksListColumnsType } from "types/globalTypes";
import { taskListRowsPerPageOptionsInExperimentDetailsPage } from "constants/constants";
import { dateFormatter, taskHistoryTableFormatter } from "helper/formatters";
import { useGetAllTasks } from "API/graphql/queries/tasks/getAllTasks";
import ExtensionsList from "components/organisms/ExtensionsList";
import TasksListTable from "components/organisms/TasksListTable";
import { Loading } from "components/atoms/Loading";
import { Error } from "components/atoms/Error";

export const tableHeightOffset = 200;

const Title = styled(Box)`
  font-size: 1.15rem;
  margin-top: ${(props) => `${props.theme.spacing(3)}`};
`;

export const TasksListColumns: readonly TasksListColumnsType[] = [
    {
        id: "extension",
        label: "Extension",
        format: (extension) => (
            <TaskExtensionActionName
                name={(extension as TaskDataType['extension']).name}
                action={(extension as TaskDataType['extension']).action}
            />
        ),
    },
    {
        id: "taskStatus",
        label: "Status",
        format: (status) => (
            <TaskExtensionStatus
                status={status as TaskDataType['taskStatus']}
            />
        ),
    },
    {
        id: "createdBy",
        label: "User",
    },
    {
        id: "receivedAt",
        label: "Submission Time",
        format: (createdAt) =>
            typeof createdAt === "string" ? dateFormatter(new Date(createdAt)) : "",
    },
];

function TaskListInExperimentDetails({ experimentUuid }: { experimentUuid: ExperimentDataType['uuid'] }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(taskListRowsPerPageOptionsInExperimentDetailsPage[0]);
    const { data, loading, error } = useGetAllTasks({
        variables: {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            filters: {
                experiment: {
                    type: "UUID",
                    value: experimentUuid
                }
            },
        },
        fetchPolicy: "network-only"
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
                        <Title>Experiment Tasks</Title>
                    </Box>
                </Grid>
                <Grid item xs={6} >
                    <Box display="flex" sx={{ height: '100%' }} alignItems="flex-end" justifyContent="flex-end">
                        <ExtensionsList />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <TasksListTable
                    rowsPerPageOptions={taskListRowsPerPageOptionsInExperimentDetailsPage}
                    TaskRecordsColumns={TasksListColumns}
                    taskList={taskHistoryTableFormatter(tasks)}
                    maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
                    pageInfo={pageInfo}
                />
            </Box>
        </>
    );
}

export default TaskListInExperimentDetails;
