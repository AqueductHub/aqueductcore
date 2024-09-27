import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { GET_ALL_TASKS } from "API/graphql/queries/tasks/getAllTasks";
import { taskListRowsPerPageOptions } from "constants/constants";
import { TasksDataMock } from "__mocks__/TasksDataMock";

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
                    limit: taskListRowsPerPageOptions[0],
                    filters: {}
                }
            },
            result: {
                data: {
                    tasks: {
                        tasksData: TasksDataMock.slice(0, taskListRowsPerPageOptions[0]),
                        totalTasksCount: TasksDataMock.slice(0, taskListRowsPerPageOptions[0]).length
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
        {
            request: {
                ...request,
                variables: {
                    offset: 0,
                    limit: taskListRowsPerPageOptions[0],
                    filters: {
                        experiment: {
                            type: 'UUID',
                            value: selected_experiment.uuid
                        }
                    }
                }
            },
            result: {
                data: {
                    tasks: {
                        tasksData: TasksDataMock.slice(0, taskListRowsPerPageOptions[0]),
                        totalTasksCount: TasksDataMock.slice(0, taskListRowsPerPageOptions[0]).length
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
    ]
};
