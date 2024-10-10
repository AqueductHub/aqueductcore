import { Box, styled } from "@mui/material";

import { logType } from "types/componentTypes";
import { isNullish } from "helper/functions";

interface LogViewerProps {
    log: logType[]
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
    function prettifyValue(value: logType['value']) {
        if (value && String(value).includes('\n'))
            return String(value).split('\n').map(valueItem => `\n\t\t\t${valueItem}`).join('')
        else
            return `\t\t"${value}"`
    }
    return log.filter(logItem => !isNullish(logItem)).map(logItem => (
        `${logItem.label}: ${prettifyValue(logItem.value)}\n`
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
