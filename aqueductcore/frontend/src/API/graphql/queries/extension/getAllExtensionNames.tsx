import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_EXTENSIONS_NAME_TYPE } from "types/globalTypes";

export const GET_ALL_EXTENSION_NAMES = gql`
  query getAllExtensions {
    plugins {
      name
    }
  }
`;

export function useGetAllExtensionNames(options?: QueryHookOptions) {
  const extensionNames = useQuery<GET_ALL_EXTENSIONS_NAME_TYPE>(GET_ALL_EXTENSION_NAMES, {
    ...options
  });
  return extensionNames;
}
