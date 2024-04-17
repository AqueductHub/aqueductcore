import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_ALL_EXPERIMENTS__TYPE } from "types/globalTypes";

export const GET_ALL_EXPERIMENTS = gql`
  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {
    experiments(offset: $offset, limit: $limit, filters: $filters) {
      experimentsData {
        id
        alias
        title
        description
        tags
        createdAt
        createdBy
      }
      totalExperimentsCount
    }
  }
`;

export function useGetAllExperiments(options?: QueryHookOptions) {
  const experiments = useQuery<GET_ALL_EXPERIMENTS__TYPE>(GET_ALL_EXPERIMENTS, {
    ...options
  });
  return experiments;
}
