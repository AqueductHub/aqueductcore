import { Box, Grid, Modal, Typography, styled } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

import ExtentionFunctions from "components/molecules/ExtentionFunctions";
import { ExtensionFunctionType, ExtensionType } from "types/globalTypes";
import FunctionForm from "components/molecules/FunctionForm";
import { extensions } from "__mocks__/ExtensionsDataMock";

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

const ExtentionName = styled(Typography)`
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


function ExtensionModal({ isOpen, handleClose, selectedExtension }: ExtensionModalProps) {

    const selectedExtensionItem: ExtensionType | undefined = extensions.find(extension => extension.name == selectedExtension);
    
    // const [selectedFunction, setSelectedFunction] = useState<ExtensionFunctionType>(selectedExtensionItem?.functions.find(item => item.name == selectedExtensionItem.functions[0].name);

    const defaultFunctionOption: ExtensionFunctionType | undefined = selectedExtensionItem?.functions[0];
    const [selectedFunction, setSelectedFunction] = useState<ExtensionFunctionType | undefined>(defaultFunctionOption);

    const updateSelectedFunctionHandler = (option: string) => {
        setSelectedFunction(selectedExtensionItem?.functions.find(item => item.name == option));
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
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
                        <ExtentionName>{selectedExtension}</ExtentionName>
                    </Grid>
                    <Grid item>
                        <CloseIcon onClick={handleClose} sx={{cursor: "pointer", lineHeight: "3.313rem", verticalAlign: "middle"}} />
                    </Grid>
                </ModalHeader>
                <Grid container>
                    <ModalOptionsGrid item xs={4}>
                        <ExtentionFunctions
                            extension={selectedExtensionItem}
                            selectedFunction={selectedFunction}
                            updateSelectedFunction={updateSelectedFunctionHandler}
                        />
                    </ModalOptionsGrid>
                    <ModalStepGrid item xs={8}>
                        <FunctionForm selectedFunction={selectedFunction} />
                    </ModalStepGrid>
                </Grid>
            </ModalContainer>
        </Modal>
    )
}

export default ExtensionModal;
