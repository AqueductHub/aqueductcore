import { Box, Button, Grid, Modal, Radio, Typography, styled } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CheckboxField } from "components/atoms/CheckboxField";
import { ExperimentField } from "components/atoms/ExperimentField";
import { TextAreaField } from "components/atoms/TextAreaField";

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

const ExtentionFunctionBox = styled(Box)`
    width: 100%;
    border: 1px solid #E0E0E0;
    border-radius: ${(props) => props.theme.spacing(0.5)};
    margin-top: ${(props) => props.theme.spacing(2.5)};
`;

const FunctionHeader = styled(Grid)`
    padding: 0 ${(props) => props.theme.spacing(1.5)};
    background-color: #efefef;
    border-bottom: 1px solid #E0E0E0;
    border-radius: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)} 0 0;
    &:after{clear: both;display: block;content: "";}
`;

const FunctionName = styled(Typography)`
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 36px;
    float: left;
`;

const FunctionCheckbox = styled(Box)`
    float: right;
    line-height: 36px;
`;

const FunctionDescription = styled(Typography)`
    font-size: 0.8rem;
    padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1.5)};
    background-color: #FFFFFF;
    border-radius: 0 0 ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)};
`;

const ModalOptionsGrid = styled(Grid)`
    height: 560px;
    background-color: #f5f5f5;
    border-right: 1px solid rgba(0,0,0,0.3);
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
`;

const ExtentionDescription = styled(Typography)`
    font-size: 0.8rem;
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
                        <ExtentionDescription>
                            QEC Explorer supports QEC experimentation through offline software-based decoding. Further parameters can be configured in the manifest.yml file.
                        </ExtentionDescription>
                        <ExtentionFunctionBox>
                            <FunctionHeader>
                                <FunctionName>Populate QEC Experiment</FunctionName>
                                <FunctionCheckbox>
                                    <Radio
                                        checked={true}
                                        value="a"
                                        name="radio-buttons"
                                        inputProps={{ 'aria-label': 'A' }}
                                    />
                                </FunctionCheckbox>
                            </FunctionHeader>
                            <FunctionDescription>
                                Build a new QEC experiment and add it to Aqueduct. Allows you to choose parameters including repetitions, experiment type and code size.
                            </FunctionDescription>
                        </ExtentionFunctionBox>
                        <ExtentionFunctionBox>
                            <FunctionHeader>
                                <FunctionName>Simulate Experiment</FunctionName>
                                <FunctionCheckbox>
                                    <Radio
                                        checked={false}
                                        value="a"
                                        name="radio-buttons"
                                        inputProps={{ 'aria-label': 'A' }}
                                    />
                                </FunctionCheckbox>
                            </FunctionHeader>
                            <FunctionDescription>
                                Simulate the execution of an experiment using Qiskit as a backend.
                            </FunctionDescription>
                        </ExtentionFunctionBox>
                        <ExtentionFunctionBox>
                            <FunctionHeader>
                                <FunctionName>Decode Experimental Results</FunctionName>
                                <FunctionCheckbox>
                                    <Radio
                                        checked={false}
                                        value="a"
                                        name="radio-buttons"
                                        sx={{p: 0.5}}
                                        inputProps={{ 'aria-label': 'A' }}
                                    />
                                </FunctionCheckbox>
                            </FunctionHeader>
                            <FunctionDescription>
                                Use Riverlane decoders to decode your experimental data on the cloud, after results have been gathered from a hardware run.
                            </FunctionDescription>
                        </ExtentionFunctionBox>
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
