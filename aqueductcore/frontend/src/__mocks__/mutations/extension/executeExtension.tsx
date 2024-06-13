import { EXECUTE_EXTENSION } from "API/graphql/mutations/extension/executeExtension";
import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";

import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";

// warning: This is not based on the real mock it's just no change and submit mode of the form

const extensionName = ExtensionsDataMock[0].name
const actionName = ExtensionsDataMock[0].actions[0].name
const parameters = ExtensionsDataMock[0].actions[0].parameters

const params = [
    ["var1", parameters[0].defaultValue],
    ["var2", parameters[1].defaultValue],
    ["var3", parameters[2].defaultValue],
    ["var4", `${selected_experiment.alias}`],
    ["var5", parameters[4].defaultValue],
    ["var6", parameters[5].defaultValue],
    ["var7", parameters[6].defaultValue]
]

export const executeExtension_mock = {
    success: [
        {
            request: {
                query: EXECUTE_EXTENSION,
                variables: {
                    "extension": extensionName,
                    "action": actionName,
                    "params": params
                }
            },
            result: {
                data: {
                    "executeExtension": {
                        "returnCode": 0,
                        "stderr": "",
                        // "stdout": `var1=1\nvar2=null\nvar3=null\nvar4=${selected_experiment.alias}\nvar5=null\nvar6=1\nvar7=string three\ndummykey=dummyvalue\n`,
                        "stdout": `${params.map(param => param.join('=')).join('\n')}\ndummykey=dummyvalue\n`,
                        "__typename": "ExtensionExecutionResult"
                    }
                }
            }
        },
    ],
};
