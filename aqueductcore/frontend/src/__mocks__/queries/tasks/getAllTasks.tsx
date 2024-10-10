import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { GET_ALL_TASKS } from "API/graphql/queries/tasks/getAllTasks";
import { taskListRowsPerPageOptions, taskListRowsPerPageOptionsInExperimentDetailsPage } from "constants/constants";
import { TasksDataMock } from "__mocks__/TasksDataMock";
import { createdNewExperiment } from "__mocks__/ExperimentsDataMock";

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
                    limit: taskListRowsPerPageOptionsInExperimentDetailsPage[0],
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
                        tasksData: TasksDataMock.slice(0, taskListRowsPerPageOptionsInExperimentDetailsPage[0]),
                        totalTasksCount: TasksDataMock.slice(0, taskListRowsPerPageOptionsInExperimentDetailsPage[0]).length
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
        // New experiment mock data (it's being used in ExperimentRecordsPage.test.tsx) with no task
        {
            request: {
                ...request,
                variables: {
                    offset: 0,
                    limit: taskListRowsPerPageOptionsInExperimentDetailsPage[0],
                    filters: {
                        experiment: {
                            type: 'UUID',
                            value: createdNewExperiment.uuid
                        }
                    }
                }
            },
            result: {
                data: {
                    tasks: {
                        tasksData: [],
                        totalTasksCount: 0
                    }
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
    ]
};
