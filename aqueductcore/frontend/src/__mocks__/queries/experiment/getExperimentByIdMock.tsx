import { GET_EXPERIMENT_BY_ID } from "API/graphql/queries/experiment/getExperimentById";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";

export const selected_experiment = ExperimentsDataMock[0]

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
                        value: selected_experiment.uuid
                    },
                },
            },
            result: {
                data: {
                    experiment: {
                        uuid: selected_experiment.uuid,
                        title: selected_experiment.title,
                        description: selected_experiment.description,
                        tags: selected_experiment.tags,
                        eid: selected_experiment.eid,
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
                        type: 'EID',
                        value: selected_experiment.eid
                    },
                },
            },
            result: {
                data: {
                    experiment: {
                        uuid: selected_experiment.uuid,
                        title: selected_experiment.title,
                        description: selected_experiment.description,
                        tags: selected_experiment.tags,
                        eid: selected_experiment.eid,
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
