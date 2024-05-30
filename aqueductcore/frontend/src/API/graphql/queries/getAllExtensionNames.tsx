import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_EXTENSIONS_NAME_TYPE } from "types/globalTypes";

export const GET_ALL_EXTENSIONS = gql`
  query getAllPlugins {
    plugins {
      name
      authors
      description
      functions {
        description
        experimentVariableName
        name
        parameters {
          name
          description
          defaultValue
          displayName
          dataType
          options
        }
      }
    }
  }
`;

export function useGetAllExtensions(options?: QueryHookOptions) {
  const extensions = useQuery<GET_ALL_EXTENSIONS_NAME_TYPE>(GET_ALL_EXTENSIONS, {
    ...options
  });
  return extensions;
}
