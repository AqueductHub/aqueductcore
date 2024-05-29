import { GET_ALL_PLUGINS } from "API/graphql/queries/getAllPlugins";

const request = {
  query: GET_ALL_PLUGINS,
};

export const getAllPlugins_mock = {
  success: {
    request,
    result: {
        "data": {
          "plugins": [
            {
              "authors": "test@email.com",
              "description": "Description of plugin.\n",
              "functions": [
                {
                  "description": "Description of fields",
                  "experimentVariableName": "var1",
                  "name": "echo",
                  "parameters": [
                    {
                      "dataType": "str",
                      "defaultValue": "1",
                      "description": "variable 1",
                      "displayName": null,
                      "name": "var1",
                      "options": null
                    },
                    {
                      "dataType": "int",
                      "defaultValue": null,
                      "description": "variable 2",
                      "displayName": "variable 2",
                      "name": "var2",
                      "options": null
                    }
                  ]
                },
                {
                  "description": "Description of fields",
                  "experimentVariableName": "var2",
                  "name": "echo_stderr",
                  "parameters": [
                    {
                      "dataType": "float",
                      "defaultValue": null,
                      "description": "variable 3",
                      "displayName": null,
                      "name": "var3",
                      "options": null
                    },
                    {
                      "dataType": "experiment",
                      "defaultValue": null,
                      "description": "variable 4",
                      "displayName": null,
                      "name": "var4",
                      "options": null
                    }
                  ]
                }
              ]
            },
            {
              "authors": "test@email.com",
              "description": "Description of plugin.\n",
              "functions": [
                {
                  "description": "Description of plugin.\n",
                  "experimentVariableName": "var1",
                  "name": "solve as text",
                  "parameters": [
                    {
                      "dataType": "str",
                      "defaultValue": null,
                      "description": "variable 1",
                      "displayName": null,
                      "name": "var1",
                      "options": null
                    },
                    {
                      "dataType": "experiment",
                      "defaultValue": null,
                      "description": "variable 2",
                      "displayName": null,
                      "name": "var2",
                      "options": null
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
};
