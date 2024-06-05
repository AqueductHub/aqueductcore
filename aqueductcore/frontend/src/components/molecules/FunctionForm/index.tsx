import { Box, Button, styled } from "@mui/material";

import { ExperimentField } from "components/atoms/ExperimentField";
import { CheckboxField } from "components/atoms/CheckboxField";
import { TextAreaField } from "components/atoms/TextAreaField";
import { IntegerField } from "components/atoms/IntegerField";
import { SelectField } from "components/atoms/SelectField";
import { ExtensionFunctionType, ExtensionType } from "types/globalTypes";
import { FloatField } from "components/atoms/FloatField";
import { FileField } from "components/atoms/FileField";


const ModalFooter = styled(Box)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.palette.grey[400]};
    padding: ${(props) => props.theme.spacing(2)} ${(props) => props.theme.spacing(3)};
`;

const FunctionsForm = styled(Box)`
    height: 557px;
    padding: 0 ${(props) => props.theme.spacing(1)};
    overflow-y: auto;
    `;

interface FunctionFormProps {
    selectedExtension?: ExtensionType;
    selectedFunction?: ExtensionFunctionType;
}

function FunctionForm ({
    selectedExtension,
    selectedFunction,
}: FunctionFormProps) {

    console.log(selectedExtension);

    return (
        <>
            <FunctionsForm>
                <Box sx={{pt: 1.5, pb: 2}}>
                {selectedFunction?.parameters.map(parameterInfo => (
                    <Box key={parameterInfo.name}>
                        {parameterInfo.dataType == "str" && <>
                            <TextAreaField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                textareaFieldProps={{
                                    defaultValue: parameterInfo.defaultValue || ""
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "int" && <>
                            <IntegerField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                integerFieldProps={{
                                    defaultValue: parameterInfo.defaultValue || ""
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "float" && <>
                            <FloatField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                floatFieldProps={{
                                    defaultValue: parameterInfo.defaultValue || ""
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "experiment" && <>
                            <ExperimentField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                // TODO: update logic to set experiment_title and experiment_alias from query
                                experiment_title="Quantum Teleportation: Entangled Particle Communication"
                                experiment_alias="20240502-1"
                            />
                        </>}
                        {parameterInfo.dataType == "textarea" && <>
                            <TextAreaField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                textareaFieldProps={{
                                    defaultValue: parameterInfo.defaultValue || ""
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "bool" && <>
                            <CheckboxField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                checkboxFieldProps={{
                                    defaultChecked: parameterInfo.defaultValue == "1"
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "select" && <>
                            <SelectField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                options={parameterInfo.options || []}
                                selectFieldProps={{
                                    defaultValue: parameterInfo?.defaultValue
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == "file" && <>
                            <FileField
                                title={parameterInfo?.displayName || ""}
                                experimentIdentifier="20240502-1"
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                            />
                        </>}
                    </Box>
                ))}
                </Box>
            </FunctionsForm>
            <ModalFooter>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button size="small" variant="contained">Run Extention</Button>
                </Box>
            </ModalFooter>
        </>
    );
}

export default FunctionForm;
