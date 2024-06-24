import { gql, useMutation } from "@apollo/client";

import { UPDATE_EXPERIMENT_DETAILS_TYPE } from "types/globalTypes";

export const UPDATE_EXPERIMENT = gql`
  mutation updateExperimentName(
    $uuid: UUID!
    $experimentUpdateInput: ExperimentUpdateInput!
  ) {
    updateExperiment(uuid: $uuid, experimentUpdateInput: $experimentUpdateInput) {
      uuid
      title
      description
      eid
    }
  }
`;

export function useUpdateExperiment() {
  const [mutate, { loading, data, error }] = useMutation<{
    experiment: UPDATE_EXPERIMENT_DETAILS_TYPE;
  }>(UPDATE_EXPERIMENT, {
    onError(error) {
      console.log("Update experiment details failed", error);
    }
  });
  return { mutate, loading, data, error };
}
