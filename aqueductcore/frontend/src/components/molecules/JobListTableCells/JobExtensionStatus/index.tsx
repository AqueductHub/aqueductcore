import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";

import { TaskStatus } from "types/graphql/__GENERATED__/graphql";
import { JobDataType } from "types/globalTypes";

const ExtensionActionContainer = styled(Box)`
    display: inline-block;
`;

const StatusBase = styled(Typography)`
    width: 92px;
    height: 25px;
    font-size: 12px;
    border-radius: ${(props) => props.theme.spacing(3)};
    padding: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)};
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;

    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
    }
`;

const StatusFailed = styled(StatusBase)`
    background-color: ${({ theme }) => theme.palette.chip.failedBackground};
    border: 1px solid ${({ theme }) => theme.palette.chip.failedBorder};
`;

const StatusCompleted = styled(StatusBase)`
    background-color: ${({ theme }) => theme.palette.chip.completedBackground};
    border: 1px solid ${({ theme }) => theme.palette.chip.completedBorder};
`;

const StatusInProgress = styled(StatusBase)`
    background-color: ${({ theme }) => theme.palette.chip.inProgressBackground};
    border: 1px solid ${({ theme }) => theme.palette.chip.inProgressBorder};
`;

const StatusPending = styled(StatusBase)`
    background-color: ${({ theme }) => theme.palette.chip.pendingBackground};
    border: 1px solid ${({ theme }) => theme.palette.chip.pendingBorder};
`;

const StatusCancel = styled(StatusBase)`
    background-color: ${({ theme }) => theme.palette.chip.cancelledBackground};
    border: 1px solid ${({ theme }) => theme.palette.chip.cancelledBorder};
`;

function JobExtensionStatus({ status }: { status: JobDataType['taskStatus'] }) {

    function handleStatus(status: JobDataType['taskStatus']) {
        switch (status) {
            case TaskStatus.Failure:
                return <StatusFailed>Failed</StatusFailed>
            case TaskStatus.Success:
                return <StatusCompleted>Completed</StatusCompleted>
            case TaskStatus.Pending:
                return <StatusPending>Pending</StatusPending>
            case TaskStatus.Received:
                return <StatusInProgress>Received</StatusInProgress>
            case TaskStatus.Started:
                return <StatusInProgress>In Progress</StatusInProgress>
            case TaskStatus.Revoked:
                return <StatusCancel>Cancelled</StatusCancel>
            default:
                return <StatusBase>-</StatusBase>
        }
    }

    return (
        <ExtensionActionContainer>
            {handleStatus(status)}
        </ExtensionActionContainer>
    );
}

export default JobExtensionStatus;
