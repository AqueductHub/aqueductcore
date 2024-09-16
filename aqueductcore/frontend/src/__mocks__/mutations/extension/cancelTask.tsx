import { CANCEL_TASK } from "API/graphql/mutations/extension/cancelTask";
import { PendingTaskId, SampleTaskId } from "__mocks__/TasksDataMock";

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
                        "resultCode": 5,
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
                        "resultCode": 5,
                        "__typename": "CancelTaskResult"
                    }
                }
            }
        }
    ]
}
