import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";

const ExtensionActionContainer = styled(Box)``;

const ExtensionName = styled(Typography)`
    font-size: 1.0rem;
    font-weight: bold;
`;

const ActionName = styled(Typography)`
    font-size: 0.75rem;
`;

function JobExtensionActionName() {
    return (
        <ExtensionActionContainer>
            <ExtensionName>Qiskit Simulator</ExtensionName>
            <ActionName>Simulate Quskit Circuit</ActionName>
        </ExtensionActionContainer>
    );
}

export default JobExtensionActionName;
