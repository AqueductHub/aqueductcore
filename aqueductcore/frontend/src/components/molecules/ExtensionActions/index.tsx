import { Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography, styled } from "@mui/material"
import { useEffect } from "react";

import { ExtensionActionType, ExtensionType } from "types/globalTypes";

const ExtensionActionBox = styled(Box)`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(0.5)};
`;

const ExtensionDescription = styled(Typography)`
    font-size: 0.8rem;
`;

const HiddenRadio = styled(Radio)`
    display: none;
`;

const ActionHeader = styled(Grid)<{ $isSelected?: boolean }>`
    padding: 0 ${(props) => props.theme.spacing(1.5)};
    background-color: ${({ theme, $isSelected }) => $isSelected ? theme.palette.primary.main : theme.palette.grey[500]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)} 0 0;
    &:after{clear: both;display: block;content: "";}
`;

const ActionsFormControl = styled(FormControl)`
    width: 100%;
    .MuiFormControlLabel-root {
        width: 100%;
        display: block;
        margin-right: 0;
        margin-left: 0;
    }
`;

const ActionName = styled(Typography)`
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 2.37rem;
    float: left;
`;

const ActionCheckbox = styled(Box)`
    float: right;
    line-height: 2.37rem;
`;

const ActionDescription = styled(Typography)`
    font-size: 0.8rem;
    padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1.5)};
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
        ? props.theme.palette.background.card
        : props.theme.palette.grey[200]};
    border-radius: 0 0 ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)};
`;

interface ExtensionActionsProps {
    extension?: ExtensionType;
    selectedAction?: ExtensionActionType;
    updateSelectedAction: (value: string) => void;
}

function ExtensionActions({
    extension,
    selectedAction,
    updateSelectedAction
}: ExtensionActionsProps) {

    const handleLabelClick = (value: string) => {
        updateSelectedAction(value);
    };


    useEffect(() => {
        if (extension?.actions) {
            updateSelectedAction(extension?.actions[0].name)
        }
    }, [])

    return (
        <>
            <ExtensionDescription>{extension?.description}</ExtensionDescription>
            <ActionsFormControl>
                <RadioGroup
                    defaultValue={extension?.actions[0].name}
                >
                    {extension?.actions.map(ActionInfo => (
                        <FormControlLabel
                            onClick={() => handleLabelClick(ActionInfo.name)}
                            sx={{ mt: 2.5 }}
                            key={ActionInfo.name}
                            value={ActionInfo.name}
                            control={<HiddenRadio />}
                            label={
                                <ExtensionActionBox>
                                    <ActionHeader $isSelected={selectedAction?.name == ActionInfo.name}>
                                        <ActionName>{ActionInfo.name}</ActionName>
                                        <ActionCheckbox>
                                            <Radio
                                                size="small"
                                                color="default"
                                                checked={selectedAction?.name == ActionInfo.name}
                                            />
                                        </ActionCheckbox>
                                    </ActionHeader>
                                    <ActionDescription>
                                        {ActionInfo.description}
                                    </ActionDescription>
                                </ExtensionActionBox>
                            }
                        />
                    ))}
                </RadioGroup>
            </ActionsFormControl>
        </>
    );
}

export default ExtensionActions;
