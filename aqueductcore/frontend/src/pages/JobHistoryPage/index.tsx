import { styled } from "@mui/material";
import Box from "@mui/material/Box";

import { drawerTopOffset, mainPadding } from "components/templates/drawerLayout";
import JobsListTable from "components/organisms/JobsListTable";

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

function JobHistoryPage() {
    return (
        <Container>
            <Title>Recent Jobs</Title>
            <Box sx={{ mt: 2 }}>
                <JobsListTable />
            </Box>
        </Container>
    );
}

export default JobHistoryPage;
