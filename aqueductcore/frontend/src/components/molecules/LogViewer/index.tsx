import { Box, styled } from "@mui/material";

interface LogViewerProps {
    log: string
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

const prettyPrint = (log: string) => {
    return log;
  };


function LogViewer ({log}: LogViewerProps) {
    return (
        <LogViewerBox>
            <LogText>{prettyPrint(log)}</LogText>
        </LogViewerBox>
    );
}

export default LogViewer;
