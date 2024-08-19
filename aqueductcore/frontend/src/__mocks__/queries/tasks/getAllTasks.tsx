import { GET_ALL_TASKS } from "API/graphql/queries/tasks/getAllTasks";
import { TasksDataMock } from "__mocks__/TasksDataMock";

const request = {
    query: GET_ALL_TASKS,
};

export const getAllTasks_mock = {
    success: [
        {
            request,
            result: {
                data: {
                    tasks: TasksDataMock
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
