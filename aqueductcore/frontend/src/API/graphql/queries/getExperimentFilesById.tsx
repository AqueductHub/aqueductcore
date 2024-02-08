import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_EXPERIMENT_FILES_BY_ID_TYPE } from "types/globalTypes";

export const GET_EXPERIMENT_FILES_BY_ID = gql`
  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {
    experiment(experimentIdentifier: $experimentIdentifier) {
      files {
        name
        path
        modifiedAt
      }
    }
  }
`;

export function useGetExperimentFilesById(options?: QueryHookOptions) {
  const experiments = useQuery<GET_EXPERIMENT_FILES_BY_ID_TYPE>(GET_EXPERIMENT_FILES_BY_ID, {
    ...options
  });
  return experiments;
}
