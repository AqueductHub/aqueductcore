import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";

interface JobExtensionActionNameProps {
    extensionName: string,
    actionName: string,
}

const ExtensionName = styled(Typography)`
    font-size: 1.0rem;
    font-weight: bold;
`;

const ActionName = styled(Typography)`
    font-size: 0.75rem;
    margin-top: -${(props) => props.theme.spacing(0.5)};
`;

function JobExtensionActionName({
    extensionName,
    actionName
}: JobExtensionActionNameProps) {
    return (
        <Box>
            <ExtensionName>{extensionName}</ExtensionName>
            <ActionName>{actionName}</ActionName>
        </Box>
    );
}

export default JobExtensionActionName;
