import { GET_ALL_TASKS } from "API/graphql/queries/tasks/getAllTasks";
import { TasksDataMock } from "__mocks__/TasksDataMock";
import { jobListRowsPerPageOptions } from "constants/constants";

const request = {
    query: GET_ALL_TASKS,
};

export const getAllTasks_mock = {
    success: [
        {
            request: {
                ...request,
                variables: {
                    offset: 0,
                    limit: jobListRowsPerPageOptions[0],
                    filters: {}
                }
            },
            result: {
                data: {
                    tasks: {
                        tasksData: TasksDataMock.slice(0, jobListRowsPerPageOptions[0]),
                        totalTasksCount: TasksDataMock.slice(0, jobListRowsPerPageOptions[0]).length
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
