import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
import { TaskStatus } from "types/graphql/__GENERATED__/graphql";
import { TaskType } from "types/globalTypes";

export const TasksDataMock: TaskType[] = [
    {
        "extensionName": "Mock extension name-0",
        "actionName": "Mock action name-0",
        "taskStatus": TaskStatus.Failure,
        // "username": "Tom-0",
        "receivedAt": "2023-12-01T23:59:00.000999",
        "resultCode": 1,
        "stdOut": "Some text 2",
        "stdErr": null,
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
        // "username": "Tom-0",
        "receivedAt": "2023-12-02T23:59:01.000999",
        "resultCode": null,
        "stdOut": null,
        "stdErr": "Error!",
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
        // "username": "Tom-0",
        "receivedAt": "2023-12-03T23:59:02.000999",
        "resultCode": null,
        "stdOut": null,
        "stdErr": null,
        "experiment": {
            uuid: ExperimentsDataMock[0].uuid,
            title: ExperimentsDataMock[0].title,
            eid: ExperimentsDataMock[0].eid
        }
    }
]
