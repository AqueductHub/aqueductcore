import { Box, Button, CircularProgress, Grid, Modal, Typography, styled } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useContext, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useExecuteExtension } from "API/graphql/mutations/extension/executeExtension";
import { useGetAllExtensions } from "API/graphql/queries/extension/getAllExtensions";
import { EXECUTE_EXTENSION_TYPE, ExtensionActionType } from "types/globalTypes";
import ExtensionActions from "components/molecules/ExtensionActions";
import { FileSelectStateContext } from "context/FileSelectProvider";
import { ExtensionParameterDataTypes } from "constants/constants";
import { actionInExtensionsType } from "types/componentTypes";
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
    background-color: ${(props) => props.theme.palette.background.default};
    box-shadow: 24;
    border-radius: ${(props) => props.theme.spacing(1)};
`;

const ModalHeader = styled(Grid)`
    background-color: ${({ theme }) => theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1)} 0 0;
    line-height: 3.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[400]};
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const HeaderIcon = styled(AutoAwesomeIcon)`
    display: inline;
    font-size: 1.5rem;
    vertical-align: middle;
`;

const ExtensionName = styled(Typography)`
    line-height: 3.25rem;
    font-size: 1.1rem;
    display: inline;
`;

const HeaderRightIcon = styled(ChevronRightIcon)`
    font-size: 3.25rem;
    line-height: 3.25rem;
    vertical-align: top;
    padding: ${(props) => props.theme.spacing(1.25)};
    margin: 0 ${(props) => props.theme.spacing(-0.5)};
`;

const AuthorName = styled(Typography)`
    line-height: 3.25rem;
    font-size: 1.1rem;
    display: inline;
    font-weight: bold;
    margin-left: ${(props) => props.theme.spacing(1.5)};
`;

const ModalOptionsGrid = styled(Grid)`
    height: 620px;
    background-color: ${({ theme }) => theme.palette.grey[200]};
    border-right: 1px solid rgba(0,0,0,0.3);
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
`;


const ModalStepGrid = styled(Grid)`
    background-color: ${(props) => props.theme.palette.common.white};
    height: 620px;
    position: relative;
`;

const ModalFooter = styled(Box)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.palette.grey[400]};
    padding: ${(props) => props.theme.spacing(2)} ${(props) => props.theme.spacing(3)};
`;


function ExtensionModal({ isOpen, handleClose, selectedExtension }: ExtensionModalProps) {

    const { experimentIdentifier } = useParams();
    const { data } = useGetAllExtensions()
    const extensions = data?.extensions
    const selectedExtensionItem = extensions?.find(extension => extension.name === selectedExtension)
    const [selectedAction, setSelectedAction] = useState<ExtensionActionType | undefined>();
    const { loading, mutate } = useExecuteExtension();
    const [inputParams, setInputParams] = useState<Array<actionInExtensionsType>>()
    const { setSelectedFile } = useContext(FileSelectStateContext)
    const [executeExtensionEnabled, setExecuteExtensionEnabled] = useState(false);

    useEffect(() => {
        setInputParams(selectedAction?.parameters.map(
            item => (item.dataType === ExtensionParameterDataTypes.EXPERIMENT
                ? { name: item.name, value: experimentIdentifier }
                : { name: item.name, value: item.defaultValue ?? "" }
            ))
        )
    }, [selectedExtension, selectedAction])

    useEffect(() => {
        let enableExecutionUpdate: boolean = true;
        enableExecutionUpdate = !inputParams?.some(param => {
            const paramElement = selectedAction?.parameters?.find(inputParam => inputParam.name === param.name);
            return (
                (paramElement?.dataType === ExtensionParameterDataTypes.STR && param.value === "") ||
                (paramElement?.dataType === ExtensionParameterDataTypes.INT && param.value === "") ||
                (paramElement?.dataType === ExtensionParameterDataTypes.FLOAT && param.value === "") ||
                (paramElement?.dataType === ExtensionParameterDataTypes.SELECT && param.value === "") ||
                (paramElement?.dataType === ExtensionParameterDataTypes.TEXTAREA && param.value === "")
            );
        });
        setExecuteExtensionEnabled(enableExecutionUpdate);
    }, [inputParams, selectedAction])

    async function handleOnCompletedExtensionExecution(executeExtension: EXECUTE_EXTENSION_TYPE) {
        handleClose()
        await client.refetchQueries({
            include: "active",
        });
        setSelectedFile(executeExtension.logFile)
        if (executeExtension.stderr) {
            toast.error(
                `Execution finished with the erorr: ${executeExtension.stderr} `,
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
                    params: formatExtensionParameters(inputParams)
                },
                onCompleted: (data) => handleOnCompletedExtensionExecution(data.executeExtension)
            })
        }
    }

    const updateSelectedActionHandler = (option: string) => {
        setSelectedAction(selectedExtensionItem?.actions.find(item => item.name == option));
    };

    return (
        <Modal
            open={isOpen}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
        >
            <ModalContainer>
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
                        <CloseIcon onClick={handleClose} sx={{ cursor: "pointer", lineHeight: "3.313rem", verticalAlign: "middle" }} />
                    </Grid>
                </ModalHeader>
                <Grid container>
                    <ModalOptionsGrid item xs={4}>
                        <ExtensionActions
                            extension={selectedExtensionItem}
                            selectedAction={selectedAction}
                            updateSelectedAction={updateSelectedActionHandler}
                        />
                    </ModalOptionsGrid>
                    {inputParams ? <ModalStepGrid item xs={8}>
                        <ActionForm selectedAction={selectedAction} inputParams={inputParams} setInputParams={setInputParams} />
                    </ModalStepGrid> : null}
                    <ModalFooter>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {loading ? <CircularProgress size={36} sx={{ mr: 3 }} /> : null}
                            <Button
                                variant="contained"
                                onClick={() => handleExecuteExtension()}
                                title='run_extension'
                                disabled={!executeExtensionEnabled}
                            >
                                Run Extension
                            </Button>
                        </Box>
                    </ModalFooter>
                </Grid>
            </ModalContainer>
        </Modal>
    )
}

export default ExtensionModal
