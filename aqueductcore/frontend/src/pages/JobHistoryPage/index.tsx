import { styled } from "@mui/material";
import Box from "@mui/material/Box";

import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import JobsListTable from "components/organisms/JobsListTable";
import { JobDataType, JobsListColumnsType } from "types/globalTypes";
import { dateFormatter } from "helper/formatters";
import { useState } from "react";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentData } from "types/graphql/__GENERATED__/graphql";

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
    minWidth: 170,
    format: (experiment) => (
      <div>{(experiment as ExperimentData).title}+{(experiment as ExperimentData).eid}</div>
    ),

  },
  {
    id: "extension",
    label: "Extension",
    minWidth: 100,
    format: (extension) => (
      <div>{(extension as JobDataType['extension']).name}+{(extension as JobDataType['extension']).action}</div>
    ),
  },
  {
    id: "taskState",
    label: "Status",
    minWidth: 170,
    maxWidth: 320,
    ellipsis: true,
  },
  {
    id: "username",
    label: "User",
    minWidth: 170,
  },
  {
    id: "receiveTime",
    label: "submission Time",
    minWidth: 170,
    format: (createdAt) =>
      typeof createdAt === "string" ? dateFormatter(new Date(createdAt)) : "",
  },
];

// TODO: this will be replaced with the Mock and some functions TT-104
const jobListData = [
  {
    experiment: {
      title: 'title_exp',
      eid: 'eid_exp'
    },
    extension: {
      name: 'name_ext',
      action: 'action_ext'
    },
    taskState: 'state_1',
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
