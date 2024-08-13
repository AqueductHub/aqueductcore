import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";

import { ExtensionActionInfo, ExtensionInfo } from "types/graphql/__GENERATED__/graphql";

const ExtensionActionContainer = styled(Box)``;

const ExtensionName = styled(Typography)`
    font-weight: bold;
`;

const ActionName = styled(Typography)`
    font-size: 0.75rem;
`;

interface JobExtensionActionNameProp {
    name: ExtensionInfo['name'],
    action: ExtensionActionInfo['name']
}

function JobExtensionActionName({ name, action }: JobExtensionActionNameProp) {
    return (
        <ExtensionActionContainer>
            <ExtensionName noWrap>{name}</ExtensionName>
            <ActionName noWrap>{action}</ActionName>
        </ExtensionActionContainer>
    );
}

export default JobExtensionActionName;
