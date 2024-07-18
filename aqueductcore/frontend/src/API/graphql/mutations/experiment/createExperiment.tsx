import { gql, useMutation } from "@apollo/client";

import { CREATE_EXPERIMENT_TYPE } from "types/globalTypes";

export const CREATE_EXPERIMENT = gql`
    mutation createExperiment($title: String!, $description: String!,  $tags: [String!]! ) {
        createExperiment(createExperimentInput: { title: $title, description: $description, tags: $tags}) {
            uuid
            eid
        }
    }
`;

export function useCreateExperiment() {
    const [mutate, { loading, data, error }] = useMutation<{
        createExperiment: CREATE_EXPERIMENT_TYPE;
    }>(CREATE_EXPERIMENT, {
        onError(error) {
            console.log("Create experiment failed", error);
        },
    });
    return { mutate, loading, data, error };
}
