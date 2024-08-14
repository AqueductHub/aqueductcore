import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import JobExtensionActionName from "components/molecules/JobListTableCells/JobExtensionActionName";
import JobExtensionStatus from "components/molecules/JobListTableCells/JobExtensionStatus";
import JobExperimentName from "components/molecules/JobListTableCells/JobExperimentName";
import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import { dateFormatter, processJobHistoryTableData } from "helper/formatters";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { useGetAllTasks } from "API/graphql/queries/tasks/getAllTasks";
import { JobDataType, JobsListColumnsType } from "types/globalTypes";
import { ExperimentData } from "types/graphql/__GENERATED__/graphql";
import JobsListTable from "components/organisms/JobsListTable";
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

export const JobsListColumns: readonly JobsListColumnsType[] = [
  {
    id: "experiment",
    label: "Experiment",
    // minWidth: 350,
    format: (experiment) => (
      <JobExperimentName
        name={(experiment as ExperimentData).title}
        eid={(experiment as ExperimentData).eid}
      />
    )
  },
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
  {
    id: "username",
    label: "User",
  },
  {
    id: "receiveTime",
    label: "submission Time",
    format: (createdAt) =>
      typeof createdAt === "string" ? dateFormatter(new Date(createdAt)) : "",
  },
];

function JobHistoryPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(experimentRecordsRowsPerPageOptions[0]);
  const pageInfo = {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    //!TODO: add number TT-124
    count: 100,
  };

  const { data, loading, error } = useGetAllTasks();
  const tasks = data?.tasks

  if (loading) return (<Loading />)
  if (error) return <Error message={error.message} />;
  if (!tasks) return <></>;

  return (
    <Container>
      <Title>Recent Jobs</Title>
      <Box sx={{ mt: 2 }}>
        <JobsListTable
          JobRecordsColumns={JobsListColumns}
          jobList={processJobHistoryTableData(tasks)}
          maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
          pageInfo={pageInfo}
        />
      </Box>
    </Container>
  );
}

export default JobHistoryPage;
