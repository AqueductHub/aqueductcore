import { Box, styled } from "@mui/material";

interface LogsViewerProps {
    logs: string
}

const LogsViewerBox = styled(Box)`
    width: 100%;
    height: 100%;
    padding: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(1.5)};
`;

const LogText = styled("pre")`
    font-size: 0.813rem;
    font-family: monospace;
`;

const prettyPrint = (logs: string) => {
    return logs;
  };


function LogsViewer ({logs}: LogsViewerProps) {
    return (
        <LogsViewerBox>
            <LogText>{prettyPrint(logs)}</LogText>
        </LogsViewerBox>
    );
}

export default LogsViewer;
