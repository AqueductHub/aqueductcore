import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_ALL_PLUGINS_TYPE } from "types/globalTypes";

export const GET_ALL_PLUGINS = gql`
  query getAllTags {
    tags {
      tagsData
    }
  }
`;

export function useGetAllTags(options?: QueryHookOptions) {
  const experiments = useQuery<GET_ALL_PLUGINS_TYPE>(GET_ALL_PLUGINS, {
    ...options
  });
  return experiments;
}
