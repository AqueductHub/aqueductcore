import { REMOVE_TAG_FROM_EXPERIMENT } from "API/graphql/mutations/experiment/removeTagFromExperiment";
import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { FAVOURITE } from "constants/constants";

export const removeTagFromExperiment_mock = {
    success: [
        // FAVOURITE tag 
        {
            request: {
                query: REMOVE_TAG_FROM_EXPERIMENT,
                variables: {
                    uuid: selected_experiment.uuid,
                    tag: FAVOURITE
                }
            },
            result: {
                data: {
                    removeTagFromExperiment: {
                        uuid: selected_experiment.uuid,
                        tags: selected_experiment.tags,
                        __typename: "ExperimentData"
                    }
                }
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        },
    ],
};
