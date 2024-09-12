import { Box, styled } from "@mui/material";

import { logArray } from "types/componentTypes";

interface LogViewerProps {
    log: logArray
}

const LogViewerBox = styled(Box)`
    width: 100%;
    height: 100%;
    padding: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(1.5)};
`;

const LogText = styled("pre")`
    font-size: 0.813rem;
    font-family: monospace;
`;

const prettyPrint = (log: LogViewerProps['log']) => {
    return log.map(logItem => (
        `${logItem.label}: \t\t ${logItem.value} \n`
    ))
};


function LogViewer({ log }: LogViewerProps) {
    return (
        <LogViewerBox>
            <LogText>{prettyPrint(log)}</LogText>
        </LogViewerBox>
    );
}

export default LogViewer;
