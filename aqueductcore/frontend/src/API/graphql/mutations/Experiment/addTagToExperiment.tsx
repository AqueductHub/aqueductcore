import { gql, useMutation } from "@apollo/client";

import { ADD_TAG_TO_EXPERIMENT_TYPE } from "types/globalTypes";

export const ADD_TAG_TO_EXPERIMENT = gql`
  mutation addTagToExperiment($experimentId: UUID!, $tag: String!) {
    addTagToExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {
      id
      tags
    }
  }
`;

export function useAddTagToExperiment() {
  const [mutate, { loading, data, error }] = useMutation<{
    addTagToExperiment: ADD_TAG_TO_EXPERIMENT_TYPE;
  }>(ADD_TAG_TO_EXPERIMENT, {
    onError(error) {
      console.log("Add experiment tag failed", error);
    },
  });
  return { mutate, loading, data, error };
}
