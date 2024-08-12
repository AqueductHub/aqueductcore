import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import { GET_EXPERIMENT_BY_ID } from "API/graphql/queries/experiment/getExperimentById";
import { ExperimentField } from "components/atoms/ExperimentField";
import { ExtensionParameterDataTypes } from "constants/constants";
import { ExtensionsActionParameterType } from "types/globalTypes";
import { TextInputField } from "components/atoms/TextInputField";
import { CheckboxField } from "components/atoms/CheckboxField";
import { TextAreaField } from "components/atoms/TextAreaField";
import { actionInExtensionsType } from "types/componentTypes";
import { IntegerField } from "components/atoms/IntegerField";
import { SelectField } from "components/atoms/SelectField";
import { FloatField } from "components/atoms/FloatField";
import { FileField } from "components/atoms/FileField";
import { client } from "API/apolloClientConfig";

interface ActionParametersProps {
    parameters?: Array<ExtensionsActionParameterType>;
    inputParams: actionInExtensionsType[];
    setInputParams: (inputParam: actionInExtensionsType[]) => void;
    readonly?: boolean;
}

function ActionParameters ({
    parameters,
    inputParams,
    setInputParams,
    readonly
}: ActionParametersProps) {
    const { experimentIdentifier } = useParams();
    
    const apolloCache = client.readQuery({
        query: GET_EXPERIMENT_BY_ID,
        variables: {
            experimentIdentifier: {
                type: "EID",
                value: experimentIdentifier,
            },
        },
    });

    function handleBooleanValue(value: string) {
        switch (value) {
            case '1':
            case 'true':
                return true
            default:
                return false
        }
    }

    return (
        <>
            {parameters?.map(parameterInfo => (
                    <Box key={parameterInfo.name}>
                        {parameterInfo.dataType == ExtensionParameterDataTypes.STR && <>
                            <TextInputField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                textFieldProps={{
                                    value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }])),
                                    disabled: readonly,
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
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }])),
                                    disabled: readonly,
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
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }])),
                                    disabled: readonly,
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == ExtensionParameterDataTypes.EXPERIMENT && apolloCache?.experiment && <>
                            <ExperimentField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                experiment_title={apolloCache.experiment.title}
                                experiment_id={apolloCache.experiment.eid}
                            />
                        </>}
                        {parameterInfo.dataType == ExtensionParameterDataTypes.TEXTAREA && <>
                            <TextAreaField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                textareaFieldProps={{
                                    value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: e.target.value }])),
                                    disabled: readonly,
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == ExtensionParameterDataTypes.BOOL && <>
                            <CheckboxField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                checkboxFieldProps={{
                                    checked: handleBooleanValue(inputParams.find((item) => item.name === parameterInfo.name)?.value ?? ''),
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: String(e.target.checked) }])),
                                    disabled: readonly,
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
                                    onChange: ((e) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: String(e.target.value) }])),
                                    disabled: readonly,
                                }}
                            />
                        </>}
                        {parameterInfo.dataType == ExtensionParameterDataTypes.FILE && <>
                            <FileField
                                title={parameterInfo?.displayName || ""}
                                description={parameterInfo?.description || ""}
                                field={parameterInfo.name}
                                experimentIdentifier={experimentIdentifier || ""}
                                fileFieldProps={{
                                    value: inputParams.find((item) => item.name === parameterInfo.name)?.value ?? '',
                                    onChange: ((_, value) => setInputParams([...inputParams.filter(param => param.name !== parameterInfo.name), { name: parameterInfo.name, value: value }])),
                                    disabled: readonly,
                                }}
                            />
                        </>}
                    </Box>
                ))}
        </>
    );
}

export default ActionParameters;
