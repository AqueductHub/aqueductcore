import { Box, Button, CircularProgress, Grid, Modal, Typography, styled } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useExecuteExtension } from "API/graphql/mutations/extension/executeExtension";
import { useGetAllExtensions } from "API/graphql/queries/extension/getAllExtensions";
import { actionInExtensionsType, extensionActionsData } from "types/componentTypes";
import { EXECUTE_EXTENSION_TYPE, ExtensionActionType } from "types/globalTypes";
import ExtensionActions from "components/molecules/ExtensionActions";
import { ExtensionParameterDataTypes } from "constants/constants";
import { formatExtensionParameters } from "helper/formatters";
import ActionForm from "components/molecules/ActionForm";
import { client } from "API/apolloClientConfig";

interface ExtensionModalProps {
    isOpen: boolean
    handleClose: () => void
    selectedExtension?: string
}

const ModalContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1080px;
    box-shadow: 24;
    border-radius: ${(props) => props.theme.spacing(1)};
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.background.card
            : props.theme.palette.common.white};
`;

const ModalHeader = styled(Grid)`
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.common.black
            : props.theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1)} 0 0;
    line-height: 3.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[400]};
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const HeaderIcon = styled(AutoAwesomeIcon)`
    display: inline;
    font-size: 1.5rem;
    vertical-align: middle;
`;

const CloseModalIcon = styled(CloseIcon)`
    cursor: pointer;
    vertical-align: middle;
`;

const ExtensionName = styled(Typography)`
    font-size: 1.1rem;
    display: inline;
`;

const HeaderRightIcon = styled(ChevronRightIcon)`
    font-size: 3.25rem;
    vertical-align: top;
    padding: ${(props) => props.theme.spacing(1.25)};
    margin: 0 ${(props) => props.theme.spacing(-0.5)};
`;

const AuthorName = styled(Typography)`
    font-size: 1.1rem;
    display: inline;
    font-weight: bold;
    margin-left: ${(props) => props.theme.spacing(1.5)};
`;

const ModalOptionsGrid = styled(Grid)`
    height: inherit;
    overflow: hidden;
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.grey[900]
            : props.theme.palette.grey[200]};
    border-right: 1px solid rgba(0,0,0,0.3);
`;

const RunExtension = styled(Button)`
    background-color: ${(props) => props.theme.palette.primary.main};
`;

const ModalMain = styled(Grid)`
    height: 560px;
`;

const ModalInputsGrid = styled(Grid)`
    height: inherit;
    overflow-y: auto;
    position: relative;
`;

const ModalFooter = styled(Box)`
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: ${(props) => props.theme.spacing(9)};
    border-top: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[400]};
    padding: ${(props) => props.theme.spacing(2)} ${(props) => props.theme.spacing(3)};
`;

function ExtensionModal({ isOpen, handleClose, selectedExtension }: ExtensionModalProps) {

    const { experimentIdentifier } = useParams();
    const { data } = useGetAllExtensions()
    const extensions = data?.extensions
    const selectedExtensionItem = extensions?.find(extension => extension.name === selectedExtension)
    const [selectedAction, setSelectedAction] = useState<ExtensionActionType | undefined>();
    const { loading, mutate } = useExecuteExtension();
    const [functionFormData, setFunctionFormData] = useState<extensionActionsData>({});

    useEffect(() => {
        if (selectedAction && selectedExtension) {
            setFunctionFormData(prevState => {
                if (!prevState[selectedAction.name]) {
                    return {
                        ...prevState,
                        [selectedAction.name]: selectedAction.parameters.map(item => ({
                            name: item.name,
                            value: item.dataType === ExtensionParameterDataTypes.EXPERIMENT
                                ? experimentIdentifier
                                : item.defaultValue ?? ""
                        }))
                    };
                }
                return prevState;
            });
        }
    }, [selectedExtension, selectedAction])

    const isExtensionExecutable = selectedAction && functionFormData[selectedAction.name]
        && functionFormData[selectedAction.name].every(param => param.value);

    async function handleOnCompletedExtensionExecution(executeExtension: EXECUTE_EXTENSION_TYPE) {
        handleCloseModal()
        await client.refetchQueries({
            include: "active",
        });
        if (executeExtension.resultCode !== 0) {
            toast.error(
                `Execution finished with the error: ${executeExtension.stdErr} `,
                { id: "exec_extension_error" }
            )
        } else {
            toast.success(
                "Execution finished successfully",
                { id: "exec_extension_success" }
            )
        }
    }

    function handleExecuteExtension() {
        if (selectedAction) {
            mutate({
                variables: {
                    extension: selectedExtension,
                    action: selectedAction.name,
                    params: formatExtensionParameters(functionFormData[selectedAction.name])
                },
                onCompleted: (data) => handleOnCompletedExtensionExecution(data.executeExtension)
            })
        }
    }

    function handleCloseModal() {
        handleClose()
        resetExtensionForm()
    }

    function resetExtensionForm() {
        setFunctionFormData(prevState => {
            Object.entries(prevState).forEach(([key]) => {
                prevState[key].forEach((item) => {
                    item.value = selectedExtensionItem?.actions.find((action) => action.name === key)?.parameters.find((parameter) => parameter.name === item.name)?.defaultValue;
                })
            })
            return prevState;
        })
    }

    const updateSelectedActionHandler = (option: string) => {
        setSelectedAction(selectedExtensionItem?.actions.find(item => item.name === option));
    };

    const updateFormData = (actionName: string, params: Array<actionInExtensionsType>) => {
        setFunctionFormData(prevState => ({
            ...prevState,
            [actionName]: params
        }));
    };

    return (
        <Modal open={isOpen}>
            <ModalContainer>
                <form onSubmit={handleExecuteExtension}>
                    <ModalHeader
                        container
                        sx={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Grid item>
                            <HeaderIcon />
                            <AuthorName>{selectedExtensionItem?.authors}</AuthorName>
                            <HeaderRightIcon />
                            <ExtensionName>{selectedExtension}</ExtensionName>
                        </Grid>
                        <Grid item>
                            <CloseModalIcon onClick={handleCloseModal} />
                        </Grid>
                    </ModalHeader>
                    <ModalMain container>
                        <ModalOptionsGrid item xs={4}>
                            {/* left-side: Actions */}
                            {selectedExtensionItem?.actions.length ?
                                <ExtensionActions
                                    extension={selectedExtensionItem}
                                    selectedAction={selectedAction}
                                    updateSelectedAction={updateSelectedActionHandler}
                                /> : null}
                        </ModalOptionsGrid>
                        <ModalInputsGrid item xs={8}>
                            {/* right-side: Inputs */}
                            {selectedAction && functionFormData[selectedAction.name] ?
                                <ActionForm
                                    selectedAction={selectedAction}
                                    inputParams={functionFormData[selectedAction.name]}
                                    setInputParams={(params) => updateFormData(selectedAction.name, params)}
                                /> : null}
                        </ModalInputsGrid>
                    </ModalMain>
                    <ModalFooter>
                        {loading ? <CircularProgress size={36} sx={{ mr: 3 }} /> : null}
                        <RunExtension
                            type="submit"
                            variant="contained"
                            title='run_extension'
                            disabled={!isExtensionExecutable}
                        >
                            Run Extension
                        </RunExtension>
                    </ModalFooter>
                </form>
            </ModalContainer>
        </Modal >
    )
}

export default ExtensionModal
