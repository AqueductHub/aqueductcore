import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_EXPERIMENT_BY_ID_TYPE } from "types/globalTypes";

export const GET_EXPERIMENT_BY_ID = gql`
  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {
    experiment(experimentIdentifier: $experimentIdentifier) {
      id
      title
      description
      tags
      alias
      createdAt
      createdBy
      files {
        name
        path
        modifiedAt
      }
    }
  }
`;

export function useGetExperimentById(options?: QueryHookOptions) {
  const experiment = useQuery<GET_EXPERIMENT_BY_ID_TYPE>(GET_EXPERIMENT_BY_ID, {
    ...options
  });
  return experiment;
}
