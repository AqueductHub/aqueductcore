
import { PendingTaskId, SampleTaskId, TaskParams, TasksDataMock } from "__mocks__/TasksDataMock";
import { GET_TASK } from "API/graphql/queries/tasks/getTask";

const request = {
    query: GET_TASK,
};

export const getTask_mock = {
    success: [
        {
            request: {
                ...request,
                variables: {
                    taskId: SampleTaskId
                }
            },
            result: {
                data: {
                    task: {
                        ...TasksDataMock.find(task => task.uuid === SampleTaskId),
                        parameters: TaskParams
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
        {
            request: {
                ...request,
                variables: {
                    taskId: PendingTaskId
                }
            },
            result: {
                data: {
                    task: {
                        ...TasksDataMock.find(task => task.uuid === PendingTaskId),
                        parameters: TaskParams
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
