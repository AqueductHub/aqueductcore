import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
import { TaskStatus } from "types/graphql/__GENERATED__/graphql";
import { TaskType } from "types/globalTypes";

export const TasksDataMock: TaskType[] = [
    {
        "extensionName": "Mock extension name-0",
        "actionName": "Mock action name-0",
        "taskStatus": TaskStatus.Failure,
        "createdBy": "Tom-0",
        "receivedAt": "2023-12-01T23:59:00.000999",
        "resultCode": 1,
        "stdOut": "Some text 2",
        "stdErr": null,
        "uuid": "caab6b1e-d275-4bb3-9803-967d03eb843d",
        "experiment": {
            uuid: ExperimentsDataMock[0].uuid,
            title: ExperimentsDataMock[0].title,
            eid: ExperimentsDataMock[0].eid
        }
    },
    {
        "extensionName": "Mock extension name-0",
        "actionName": "Mock action name-1",
        "taskStatus": TaskStatus.Pending,
        "createdBy": "Tom-0",
        "receivedAt": "2023-12-02T23:59:01.000999",
        "resultCode": null,
        "stdOut": null,
        "stdErr": "Error!",
        "uuid": "2640eb24-5d99-493c-8a44-5ade9df8769a",
        "experiment": {
            uuid: ExperimentsDataMock[0].uuid,
            title: ExperimentsDataMock[0].title,
            eid: ExperimentsDataMock[0].eid
        }
    },
    {
        "extensionName": "Mock extension name-0",
        "actionName": "Mock action name-2",
        "taskStatus": TaskStatus.Received,
        "createdBy": "Tom-0",
        "receivedAt": "2023-12-03T23:59:02.000999",
        "resultCode": null,
        "stdOut": null,
        "stdErr": null,
        "uuid": "9aec85cc-032a-4daf-b0f2-67d04d25455c",
        "experiment": {
            uuid: ExperimentsDataMock[0].uuid,
            title: ExperimentsDataMock[0].title,
            eid: ExperimentsDataMock[0].eid
        }
    }
]
export const TaskParams = [
    {
        "key": {
            "dataType": "str",
            "name": "var1",
            "displayName": null,
            "defaultValue": "1",
            "description": "variable 1",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "1",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "int",
            "name": "var2",
            "displayName": "some display name",
            "defaultValue": null,
            "description": "variable 2",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "2",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "float",
            "name": "var3",
            "displayName": null,
            "defaultValue": null,
            "description": "variable 3",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "3",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "experiment",
            "name": "var4",
            "displayName": null,
            "defaultValue": null,
            "description": "variable 4",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "240812-50",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "textarea",
            "name": "var5",
            "displayName": null,
            "defaultValue": null,
            "description": "variable 5 multiline",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "4",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "bool",
            "name": "var6",
            "displayName": null,
            "defaultValue": "1",
            "description": "boolean variable",
            "options": null,
            "__typename": "ExtensionParameterType"
        },
        "value": "1",
        "__typename": "KeyValuePair"
    },
    {
        "key": {
            "dataType": "select",
            "name": "var7",
            "displayName": null,
            "defaultValue": "string three",
            "description": "select / combobox",
            "options": [
                "string1",
                "string2",
                "string three",
                "string4"
            ],
            "__typename": "ExtensionParameterType"
        },
        "value": "string three",
        "__typename": "KeyValuePair"
    }
]
export const SampleTaskId = TasksDataMock[0].uuid;
export const PendingTaskId = TasksDataMock[1].uuid;
