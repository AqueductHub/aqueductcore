import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_EXTENSIONS_NAME_TYPE } from "types/globalTypes";

export const GET_ALL_EXTENSION_NAMES = gql`
  query getAllPlugins {
    plugins {
      name
    }
  }
`;

export function useGetAllExtensions(options?: QueryHookOptions) {
  const extensions = useQuery<GET_ALL_EXTENSIONS_NAME_TYPE>(GET_ALL_EXTENSION_NAMES, {
    ...options
  });
  return extensions;
}
