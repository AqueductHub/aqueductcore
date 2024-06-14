import { ADD_TAG_TO_EXPERIMENT } from "API/graphql/mutations/experiment/addTagToExperiment";
import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { FAVOURITE } from "constants/constants";

export const addTagToExperiment_mock = {
    success: [
        // FAVOURITE tag 
        {
            request: {
                query: ADD_TAG_TO_EXPERIMENT,
                variables: {
                    uuid: selected_experiment.uuid,
                    tag: FAVOURITE
                }
            },
            result: {
                data: {
                    addTagToExperiment: {
                        uuid: selected_experiment.uuid,
                        tags: [
                            ...selected_experiment.tags,
                            FAVOURITE
                        ],
                        __typename: "ExperimentData"
                    }
                }
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
    ],
};
