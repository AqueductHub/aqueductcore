import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_USER_INFO_TYPE } from "types/globalTypes";

export const GET_CURRENT_USER_INFO = gql`
  query getCurrentUserInfo {
    getCurrentUserInfo {
      scopes
      username
    }
  }
`;

export function useGetCurrentUserInfo(options?: QueryHookOptions) {
  const userInfo = useQuery<GET_USER_INFO_TYPE>(GET_CURRENT_USER_INFO, {
    ...options
  });
  return userInfo;
}