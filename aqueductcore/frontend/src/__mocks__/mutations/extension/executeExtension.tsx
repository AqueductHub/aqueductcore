import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { EXECUTE_EXTENSION } from "API/graphql/mutations/extension/executeExtension";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import { logFileName } from "__mocks__/constants";

const extensionName = ExtensionsDataMock[0].name
const actionName = ExtensionsDataMock[0].actions[0].name
const parameters = ExtensionsDataMock[0].actions[0].parameters

const params = [
    ["var1", parameters[0].defaultValue],
    ["var2", parameters[1].defaultValue],
    ["var3", parameters[2].defaultValue],
    ["var4", `${selected_experiment.eid}`],
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
                        "stdout": `${params.map(param => param.join('=')).join('\n')}\ndummykey=dummyvalue\n`,
                        "logFile": logFileName,
                        "__typename": "ExtensionExecutionResult"
                    }
                }
            }
        },
    ],
};
