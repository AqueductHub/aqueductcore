import { Typography, styled } from "@mui/material";

type Status = "FAILURE" | "PENDING" | "RECEIVED" | "REVOKED" | "STARTED" | "SUCCESS"

interface JobStatusProps {
    status: Status
}

const StatusText = styled(Typography)`
    font-size: 0.9rem;
    padding: 0 ${(props) => props.theme.spacing(1.5)};
    border-radius: ${(props) => props.theme.spacing(0.5)};
`;

const FailureStatus = styled(StatusText)`
    background-color: #FFE2E2;
    border: 1px solid #FF9C9C;
`;
const PendingStatus = styled(StatusText)`
    background-color: #EFEFEF;
    border: 1px solid #D8D8D8;
`;
const ReceivedStatus = styled(StatusText)`
    background-color: #F8F8F8;
    border: 1px solid #D2D2D2;
`;
const RevokedStatus = styled(StatusText)`
    background-color: #EFE7FF;
    border: 1px solid #D6C2FF;
`;
const StartedStatus = styled(StatusText)`
    background-color: #FFF5D1;
    border: 1px solid #F8E295;
`;
const SuccessStatus = styled(StatusText)`
    background-color: #E4FFE7;
    border: 1px solid #67D772;
`;

function JobStatus({
    status
}: JobStatusProps) {
    return (
        <>
            {status === "FAILURE" && <FailureStatus>Failure</FailureStatus>}
            {status === "PENDING" && <PendingStatus>Pending</PendingStatus>}
            {status === "RECEIVED" && <ReceivedStatus>Received</ReceivedStatus>}
            {status === "REVOKED" && <RevokedStatus>Revoked</RevokedStatus>}
            {status === "STARTED" && <StartedStatus>Started</StartedStatus>}
            {status === "SUCCESS" && <SuccessStatus>Success</SuccessStatus>}
        </>
    );
}

export default JobStatus;
