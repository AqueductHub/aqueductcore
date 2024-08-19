import { Box, styled } from "@mui/material";

import ActionParameters from "components/molecules/ActionParameters";
import { actionInExtensionsType } from "types/componentTypes";
import { ExtensionActionType } from "types/globalTypes";

const Container = styled(Box)`
    padding: 0 ${(props) => props.theme.spacing(1)};
    overflow-y: auto;
`;

interface ActionFormProps {
    selectedAction?: ExtensionActionType;
    setInputParams: (inputParam: actionInExtensionsType[]) => void
    inputParams: actionInExtensionsType[];
}

function ActionForm({
    selectedAction,
    inputParams,
    setInputParams
}: ActionFormProps) {
    return (
        <Container>
            <Box sx={{ pt: 1.5, pb: 2 }}>
                <ActionParameters
                    parameters={selectedAction?.parameters}
                    inputParams={inputParams}
                    setInputParams={setInputParams}
                />
            </Box>
        </Container>
    );
}

export default ActionForm;
