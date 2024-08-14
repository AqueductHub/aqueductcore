import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";

import { JobDataType } from "types/globalTypes";

const ExtensionActionContainer = styled(Box)``;

const StatusBase = styled(Typography)`
    width: 92px;
    height: 25px;
    font-size: 12px;
    border-radius: ${(props) => props.theme.spacing(3)};
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    background-color: #D2D2D2;
    border: 1px solid #ECECEC;

    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
    }
`;
const StatusFailed = styled(StatusBase)`
        background-color: #FFE2E2;
        border: 1px solid #FF9C9C;
`
const StatusCompleted = styled(StatusBase)`
        background-color: #E4FFE7;
        border: 1px solid #67D772
`
const StatusInProgress = styled(StatusBase)`
        background-color: #FFF5D1;
        border: 1px solid #F8E295
`
const StatusPending = styled(StatusBase)`
        background-color: #F8F8F8;
        border: 1px solid #D2D2D2
`
const StatusCancel = styled(StatusBase)`
        background-color: #EFE7FF;
        border: 1px solid #D6C2FF
`

function JobExtensionStatus({ status }: { status: JobDataType['taskState'] }) {

    function handleStatus(status: JobDataType['taskState']) {
        switch (status) {
            case 'failed':
                return <StatusFailed>Failed</StatusFailed>
            case 'completed':
                return <StatusCompleted>Completed</StatusCompleted>
            case 'inProgress':
                return <StatusInProgress>In Progress</StatusInProgress>
            case 'pending':
                return <StatusPending>Pending</StatusPending>
            case 'cancelling':
                return <StatusCancel>Cancelling...</StatusCancel>
            case 'cancel':
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
