import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import TaskExtensionActionName from "components/molecules/TaskListTableCells/TaskExtensionActionName";
import TaskExtensionStatus from "components/molecules/TaskListTableCells/TaskExtensionStatus";
import TaskExperimentName from "components/molecules/TaskListTableCells/TaskExperimentName";
import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import { dateFormatter, taskHistoryTableFormatter } from "helper/formatters";
import { useGetAllTasks } from "API/graphql/queries/tasks/getAllTasks";
import { TaskDataType, TasksListColumnsType } from "types/globalTypes";
import { ExperimentData } from "types/graphql/__GENERATED__/graphql";
import { taskListRowsPerPageOptions } from "constants/constants";
import TasksListTable from "components/organisms/TasksListTable";
import { Loading } from "components/atoms/Loading";
import { Error } from "components/atoms/Error";

export const tableHeightOffset = 200;

const Container = styled(Box)`
  margin: -${mainPadding}px;
  margin-top: -${drawerTopOffset + mainPadding}px;
  padding: ${(props) => `${props.theme.spacing(2.5)}`};
`;

const Title = styled(Box)`
  width: "100%";
  margin-bottom: ${(props) => `${props.theme.spacing(2.5)}`};
  font-weight: bold;
`;

export const TasksListColumns: readonly TasksListColumnsType[] = [
  {
    id: "experiment",
    label: "Experiment",
    // minWidth: 350,
    format: (experiment) => (
      <TaskExperimentName
        name={(experiment as ExperimentData).title}
        eid={(experiment as ExperimentData).eid}
      />
    )
  },
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

function TaskHistoryPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(taskListRowsPerPageOptions[0]);
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

  if (loading) return (<Loading />)
  if (error) return <Error message={error.message} />;
  if (!tasks) return <></>;

  return (
    <Container>
      <Title>Recent Tasks</Title>
      <Box sx={{ mt: 2 }}>
        <TasksListTable
          TaskRecordsColumns={TasksListColumns}
          taskList={taskHistoryTableFormatter(tasks)}
          maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
          pageInfo={pageInfo}
        />
      </Box>
    </Container>
  );
}

export default TaskHistoryPage;
