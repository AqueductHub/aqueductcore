import { CANCEL_TASK } from "API/graphql/mutations/extension/cancelTask";
import { PendingTaskId, SampleTaskId } from "__mocks__/TasksDataMock";
import { TaskStatus } from "types/graphql/__GENERATED__/graphql";

export const cancelTask_mock = {
    success: [
        {
            request: {
                query: CANCEL_TASK,
                variables: {
                    "taskId": SampleTaskId
                }
            },
            result: {
                data: {
                    "cancelTask": {
                        "taskId": "id-0",
                        "taskStatus": TaskStatus.Revoked,
                        "resultCode": 0,
                        "__typename": "CancelTaskResult"
                    }
                }
            }
        },
        {
            request: {
                query: CANCEL_TASK,
                variables: {
                    "taskId": PendingTaskId
                }
            },
            result: {
                data: {
                    "cancelTask": {
                        "taskId": "id-1",
                        "taskStatus": TaskStatus.Revoked,
                        "resultCode": 0,
                        "__typename": "CancelTaskResult"
                    }
                }
            }
        }
    ]
}
