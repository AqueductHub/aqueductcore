import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

import JobExtensionActionName from "components/molecules/JobListTableCells/JobExtensionActionName";
import JobExtensionStatus from "components/molecules/JobListTableCells/JobExtensionStatus";
import JobExperimentName from "components/molecules/JobListTableCells/JobExperimentName";
import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { JobDataType, JobsListColumnsType } from "types/globalTypes";
import { ExperimentData } from "types/graphql/__GENERATED__/graphql";
import JobsListTable from "components/organisms/JobsListTable";
import { dateFormatter } from "helper/formatters";

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
    ),
    ellipsis: true
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
    id: "taskState",
    label: "Status",
    format: (status) => (
      <JobExtensionStatus
        status={status as JobDataType['taskState']}
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

// TODO: this will be replaced with the Mock and some functions TT-104
const jobListData = [
  {
    experiment: {
      title: 'this_is_the_longest_title',
      eid: '20240508-100000'
    },
    extension: {
      name: 'name_ext',
      action: 'action_ext'
    },
    taskState: 'inProgress',
    username: 'user_name',
    receiveTime: '2023-12-25T15:43:17'
  }
]

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
  return (
    <Container>
      <Title>Recent Jobs</Title>
      <Box sx={{ mt: 2 }}>
        <JobsListTable
          JobRecordsColumns={JobsListColumns}
          jobList={jobListData}
          maxHeight={`calc(100vh - ${tableHeightOffset}px)`}
          pageInfo={pageInfo}
        />
      </Box>
    </Container>
  );
}

export default JobHistoryPage;
