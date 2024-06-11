import { GET_EXPERIMENT_BY_ID } from "API/graphql/queries/experiment/getExperimentById";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";

export const selected_experiment = ExperimentDataMock[0]

const request = {
    query: GET_EXPERIMENT_BY_ID,
};

export const getExperiment_mock = {
    success: [
        {
            request: {
                ...request,
                variables: {
                    experimentIdentifier: {
                        type: 'UUID',
                        value: selected_experiment.id
                    },
                },
            },
            result: {
                data: {
                    experiment: {
                        id: selected_experiment.id,
                        title: selected_experiment.title,
                        description: selected_experiment.description,
                        tags: selected_experiment.tags,
                        alias: selected_experiment.alias,
                        createdAt: selected_experiment.createdAt,
                        createdBy: selected_experiment.createdBy,
                        files: selected_experiment.files,
                    },
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
        {
            request: {
                ...request,
                variables: {
                    experimentIdentifier: {
                        type: 'ALIAS',
                        value: selected_experiment.alias
                    },
                },
            },
            result: {
                data: {
                    experiment: {
                        id: selected_experiment.id,
                        title: selected_experiment.title,
                        description: selected_experiment.description,
                        tags: selected_experiment.tags,
                        alias: selected_experiment.alias,
                        createdAt: selected_experiment.createdAt,
                        createdBy: selected_experiment.createdBy,
                        files: selected_experiment.files,
                    },
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ],
};
