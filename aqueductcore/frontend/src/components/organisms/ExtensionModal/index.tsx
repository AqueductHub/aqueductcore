import { Box, Button, Grid, Modal, Typography, styled } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CheckboxField } from "components/atoms/CheckboxField";
import { ExperimentField } from "components/atoms/ExperimentField";
import { TextAreaField } from "components/atoms/TextAreaField";
import ExtentionFunctions from "components/molecules/ExtentionFunctions";

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

const ModalHeader = styled(Box)`
    background-color: #e7e7e7;
    border-radius: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1)} 0 0;
    line-height: 52px;
    border-bottom: 1px solid #BBBBBB;
    padding: 0 ${(props) => props.theme.spacing(1.5)};
`;

const ExtentionName = styled(Typography)`
    line-height: 52px;
    font-size: 1.1rem;
    display: inline;
    margin-left: ${(props) => props.theme.spacing(1.2)};
`;


const ModalOptionsGrid = styled(Grid)`
    height: 560px;
    background-color: #f5f5f5;
    border-right: 1px solid rgba(0,0,0,0.3);
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
`;


const ModalStepGrid = styled(Grid)`
    height: 100%;
    background-color: white;
    height: 560px;
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
    position: relative;
`;

const ModalFooter = styled(Box)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
`;

function ExtensionModal({ isOpen, handleClose, selectedExtension }: ExtensionModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalContainer>
                <ModalHeader>
                    <AutoAwesomeIcon sx={{ display: "inline", fontSize: "1.5rem", verticalAlign: "middle" }} />
                    <ExtentionName>{selectedExtension}</ExtentionName>
                </ModalHeader>
                <Grid container>
                    <ModalOptionsGrid item xs={4}>
                        <ExtentionFunctions />
                    </ModalOptionsGrid>
                    <ModalStepGrid item xs={8}>
                        <ExperimentField
                            title="Experiment"
                            field="experiment_eid"
                            description="Experiment to run this extension on"
                            experiment_title="Quantum Memory - Rotated Planar"
                            experiment_alias="03062024-3"
                        />
                        <TextAreaField
                            title="Output File"
                            field="output_file"
                            description="Destination for the file output within this Experiment after extension is run. This field should include the file extension, if required."
                            textareaFieldProps={{
                                defaultValue: "output.stim"
                            }}
                        />
                        <CheckboxField
                            title="Enable Debugging"
                            field="debugging"
                            description="If debugging is enabled, logs from Qiskit will be appended to the file automatically. Note that this can decrease performance."
                            checkboxFieldProps={{
                                defaultChecked: true
                            }}
                        />
                        <ModalFooter>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button size="small" variant="contained">Run Extention</Button>
                            </Box>
                        </ModalFooter>
                    </ModalStepGrid>
                </Grid>
            </ModalContainer>
        </Modal>
    )
}

export default ExtensionModal;
