import { Box, styled } from "@mui/material";

import { ExtensionFunctionType } from "types/globalTypes";
import { ExperimentField } from "components/atoms/ExperimentField";
import { CheckboxField } from "components/atoms/CheckboxField";
import { TextAreaField } from "components/atoms/TextAreaField";
import { IntegerField } from "components/atoms/IntegerField";
import { SelectField } from "components/atoms/SelectField";
import { FloatField } from "components/atoms/FloatField";
import { functionInExtensionsType } from "types/componentTypes";
// import { MutationExecutePluginArgs } from "types/graphql/__GENERATED__/graphql";

const FunctionsForm = styled(Box)`
    height: 557px;
    padding: 0 ${(props) => props.theme.spacing(1)};
    overflow-y: auto;
    `;

interface FunctionFormProps {
    selectedFunction?: ExtensionFunctionType;
    setInputParams: (inputParam: functionInExtensionsType[]) => void
    inputParams: functionInExtensionsType[];
}

function FunctionForm({
    selectedFunction,
    setInputParams,
    inputParams
}: FunctionFormProps) {
    return (
        <>
            <FunctionsForm>
                <Box sx={{ pt: 1.5, pb: 2 }}>
                    {selectedFunction?.parameters.map(parameterInfo => (
                        <Box key={parameterInfo.name}>
                            {parameterInfo.dataType == "str" && <>
                                <TextAreaField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    textareaFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams, { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == "int" && <>
                                <IntegerField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    integerFieldProps={{
                                        defaultValue: parameterInfo.defaultValue || "",
                                        // eslint-disable-next-line
                                        onChange: ((e) => setInputParams([...inputParams, { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == "float" && <>
                                <FloatField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    floatFieldProps={{
                                        defaultValue: parameterInfo.defaultValue || "",
                                        // eslint-disable-next-line
                                        onChange: ((e) => setInputParams([...inputParams, { name: parameterInfo.name, value: e.target.value }]))
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
                                        defaultValue: parameterInfo.defaultValue || "",
                                        // eslint-disable-next-line
                                        onChange: ((e) => setInputParams([...inputParams, { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == "bool" && <>
                                <CheckboxField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    checkboxFieldProps={{
                                        defaultChecked: parameterInfo.defaultValue == "1",
                                        // eslint-disable-next-line
                                        onChange: ((e) => setInputParams([...inputParams, { name: parameterInfo.name, value: e.target.value }]))
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
                                        defaultValue: parameterInfo?.defaultValue,
                                        // eslint-disable-next-line
                                        // onChange: ((e) => setInputParams([{name: parameterInfo.name , value: e.target.value}]))
                                    }}
                                />
                            </>}
                        </Box>
                    ))}
                </Box>
            </FunctionsForm>
        </>
    );
}

export default FunctionForm;
