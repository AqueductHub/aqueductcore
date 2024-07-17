import { gql, useMutation } from "@apollo/client";

import { REMOVE_EXPERIMENT_TYPE } from "types/globalTypes";

export const REMOVE_EXPERIMENT = gql`
    mutation removeExperiment($uuid: UUID!) {
        removeExperiment(experimentRemoveInput: { uuid: $uuid})
    }
`;

export function useRemoveExperiment() {
  const [mutate, { loading, data, error }] = useMutation<{
    removeExperiment: REMOVE_EXPERIMENT_TYPE;
  }>(REMOVE_EXPERIMENT, {
    update(cache) {
      cache.modify({
        fields: {
          experiment({ DELETE }) {
            return DELETE;
          },
        },
      })
    },
    onError(error) {
      console.log("Remove experiment failed", error);
    },
  });
  return { mutate, loading, data, error };
}
