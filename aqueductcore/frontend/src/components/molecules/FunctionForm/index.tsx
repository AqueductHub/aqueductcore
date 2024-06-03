import { useParams } from "react-router-dom";
import { Box, styled } from "@mui/material";

import { GET_EXPERIMENT_BY_ID } from "API/graphql/queries/experiment/getExperimentById";
import { ExperimentField } from "components/atoms/ExperimentField";
import { ExtensionParameterDataTypes } from "constants/constants";
import { functionInExtensionsType } from "types/componentTypes";
import { CheckboxField } from "components/atoms/CheckboxField";
import { TextAreaField } from "components/atoms/TextAreaField";
import { IntegerField } from "components/atoms/IntegerField";
import { SelectField } from "components/atoms/SelectField";
import { ExtensionFunctionType } from "types/globalTypes";
import { FloatField } from "components/atoms/FloatField";
import { client } from "API/apolloClientConfig";

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
    const { experimentIdentifier } = useParams();

    const { experiment } = client.readQuery({
        query: GET_EXPERIMENT_BY_ID,
        variables: {
            experimentIdentifier: {
                type: "ALIAS",
                value: experimentIdentifier,
            },
        },
    });

    return (
        <>
            <FunctionsForm>
                <Box sx={{ pt: 1.5, pb: 2 }}>
                    {selectedFunction?.parameters.map(parameterInfo => (
                        <Box key={parameterInfo.name}>
                            {parameterInfo.dataType == ExtensionParameterDataTypes.STR && <>
                                <TextAreaField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    textareaFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.INT && <>
                                <IntegerField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    integerFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.FLOAT && <>
                                <FloatField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    floatFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.EXPERIMENT && <>
                                <ExperimentField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    experiment_title={experiment.title}
                                    experiment_alias={experiment.alias}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.TEXTAREA && <>
                                <TextAreaField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    textareaFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.BOOL && <>
                                <CheckboxField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    checkboxFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: String(e.target.checked) }]))
                                    }}
                                />
                            </>}
                            {parameterInfo.dataType == ExtensionParameterDataTypes.SELECT && <>
                                <SelectField
                                    title={parameterInfo?.displayName || ""}
                                    description={parameterInfo?.description || ""}
                                    field={parameterInfo.name}
                                    options={parameterInfo.options || []}
                                    selectFieldProps={{
                                        value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                        onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: String(e.target.value) }]))
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
