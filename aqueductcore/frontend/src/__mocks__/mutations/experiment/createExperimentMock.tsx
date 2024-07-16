import { CREATE_EXPERIMENT } from "API/graphql/mutations/experiment/createExperiment";
import { createdNewExperiment } from "__mocks__/ExperimentsDataMock";

export const createExperiment_mock = {
    success: [
        {
            request: {
                query: CREATE_EXPERIMENT,
                variables: {
                    title: createdNewExperiment.title,
                    description: createdNewExperiment.description,
                    tags: createdNewExperiment.tags
                }
            },
            result: {
                data: {
                    createExperiment: {
                        uuid: createdNewExperiment.uuid,
                        eid: createdNewExperiment.eid
                    }
                }
            }
        },
    ],
};
