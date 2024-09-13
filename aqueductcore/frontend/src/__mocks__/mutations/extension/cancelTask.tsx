import { CANCEL_TASK } from "API/graphql/mutations/extension/cancelTask";
import { TasksDataMock } from "__mocks__/TasksDataMock";

const taskId = TasksDataMock

export const removeTask_mock = {
    success: [
        {
            request: {
                query: CANCEL_TASK,
                variables: {
                    "taskId": taskId
                }
            },
            result: {
                data: {
                    "cancelTask": {
                        "resultCode": 5,
                        "__typename": "CancelTaskResult"
                    }
                }
            }
        }
    ]
}
