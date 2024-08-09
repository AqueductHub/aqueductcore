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

function JobExtensionActionName({ name, action }: { name: ExtensionInfo['name'], action: ExtensionActionInfo['name'] }) {
    return (
        <ExtensionActionContainer>
            <ExtensionName noWrap>{name}</ExtensionName>
            <ActionName noWrap>{action}</ActionName>
        </ExtensionActionContainer>
    );
}

export default JobExtensionActionName;
