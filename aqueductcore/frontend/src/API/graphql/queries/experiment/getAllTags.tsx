import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_TAGS_TYPE } from "types/globalTypes";

export const GET_ALL_TAGS = gql`
  query getAllTags {
    tags {
      tagsData
    }
  }
`;

export function useGetAllTags(options?: QueryHookOptions) {
  const tags = useQuery<GET_ALL_TAGS_TYPE>(GET_ALL_TAGS, {
    ...options
  });
  return tags;
}
