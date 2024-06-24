import { gql, useMutation } from "@apollo/client";

import { REMOVE_TAG_FROM_EXPERIMENT_TYPE } from "types/globalTypes";

export const REMOVE_TAG_FROM_EXPERIMENT = gql`
  mutation removeTagFromExperiment($uuid: UUID!, $tag: String!) {
    removeTagFromExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {
      uuid
      tags
    }
  }
`;

export function useRemoveTagFromExperiment() {
  const [mutate, { loading, data, error }] = useMutation<{
    removeTagFromExperiment: REMOVE_TAG_FROM_EXPERIMENT_TYPE;
  }>(REMOVE_TAG_FROM_EXPERIMENT, {
    onError(error) {
      console.log("Add experiment tag failed", error);
    },
  });
  return { mutate, loading, data, error };
}
