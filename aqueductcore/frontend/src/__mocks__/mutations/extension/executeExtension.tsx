import { EXECUTE_EXTENSION } from "API/graphql/mutations/extension/executeExtension";
import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";

// warning: This is not based on the real mock it's just no change and submit mode of the form
export const executeExtension_mock = {
    success: [
        {
            request: {
                query: EXECUTE_EXTENSION,
                variables: {
                    "extension": "Dummy extension",
                    "action": "echo",
                    "params": [
                        ["var1", "1"],
                        ["var2", null],
                        ["var3", null],
                        ["var4", `${selected_experiment.alias}`],
                        ["var5", null],
                        ["var6", "1"],
                        ["var7", "string three"]
                    ]
                }
            },
            result: {
                data: {
                    "executeExtension": {
                        "returnCode": 0,
                        "stderr": "",
                        "stdout": `var1=1\nvar2=null\nvar3=null\nvar4=${selected_experiment.alias}\nvar5=null\nvar6=1\nvar7=string three\ndummykey=dummyvalue\n`,
                        "logFile": "log_file.log",
                        "__typename": "ExtensionExecutionResult"
                    }
                }
            }
        },
    ],
};
