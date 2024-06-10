import { ExtensionType } from "types/globalTypes";

export const ExtensionsDataMock: ExtensionType[] = [
    {
        "name": "Dummy plugin",
        "description": "This plugin prints environment variables passed to it. No requests to Aqueduct sent.\n",
        "authors": "aqueduct@riverlane.com",
        "functions": [
            {
                "description": "Print values to stdout",
                "name": "echo",
                "experimentVariableName": "var4",
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
                        "displayName": "some display name",
                        "name": "var2",
                        "options": null
                    },
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
                    },
                    {
                        "dataType": "textarea",
                        "defaultValue": null,
                        "description": "variable 5 multiline",
                        "displayName": null,
                        "name": "var5",
                        "options": null
                    },
                    {
                        "dataType": "bool",
                        "defaultValue": "1",
                        "description": "boolean variable",
                        "displayName": null,
                        "name": "var6",
                        "options": null
                    },
                    {
                        "dataType": "select",
                        "defaultValue": "string three",
                        "description": "select / combobox",
                        "displayName": null,
                        "name": "var7",
                        "options": [
                            "string1",
                            "string2",
                            "string three",
                            "string4"
                        ]
                    }
                ]
            },
            {
                "description": "Print values to stdout",
                "name": "echo_stderr",
                "experimentVariableName": "var4",
                "parameters": [
                    {
                        "dataType": "str",
                        "defaultValue": "1",
                        "description": "variable 1",
                        "displayName": null,
                        "name": "var_1",
                        "options": null
                    },
                    {
                        "dataType": "int",
                        "defaultValue": null,
                        "description": "variable 2",
                        "displayName": "some display name",
                        "name": "var_2",
                        "options": null
                    },
                    {
                        "dataType": "float",
                        "defaultValue": null,
                        "description": "variable 3",
                        "displayName": null,
                        "name": "var_3",
                        "options": null
                    },
                    {
                        "dataType": "experiment",
                        "defaultValue": null,
                        "description": "variable 4",
                        "displayName": null,
                        "name": "var_4",
                        "options": null
                    },
                    {
                        "dataType": "textarea",
                        "defaultValue": null,
                        "description": "variable 5 multiline",
                        "displayName": null,
                        "name": "var_5",
                        "options": null
                    },
                    {
                        "dataType": "bool",
                        "defaultValue": "1",
                        "description": "boolean variable",
                        "displayName": null,
                        "name": "var_6",
                        "options": null
                    },
                    {
                        "dataType": "select",
                        "defaultValue": "string three",
                        "description": "select / combobox",
                        "displayName": null,
                        "name": "var_7",
                        "options": [
                            "string1",
                            "string2",
                            "string three",
                            "string4"
                        ]
                    }
                ]
            }
        ],
    },
    {
        "name": "Wolfram alpha solution plugin",
        "description": "This plugin solves mathematical problems using Wolfram|Alpha cloud engine. To run the plugin, please obtain an App ID at https://developer.wolframalpha.com/access\n",
        "authors": "aqueduct@riverlane.com",
        "functions": [
            {
                "description": "solve an equation and return a text answer\n",
                "name": "solve as text",
                "experimentVariableName": "experiment",
                "parameters": [
                    {
                        "dataType": "str",
                        "defaultValue": null,
                        "description": "equation to solve",
                        "displayName": null,
                        "name": "equation",
                        "options": null
                    },
                    {
                        "dataType": "experiment",
                        "defaultValue": null,
                        "description": "experiment to store result",
                        "displayName": null,
                        "name": "experiment",
                        "options": null
                    },
                    {
                        "dataType": "str",
                        "defaultValue": null,
                        "description": "file name to store result",
                        "displayName": null,
                        "name": "result_file",
                        "options": null
                    }
                ]
            }
        ],
    }
]
