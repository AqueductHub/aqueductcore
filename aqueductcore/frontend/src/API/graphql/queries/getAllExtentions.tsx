import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_ALL_EXTENSIONS_TYPE } from "types/globalTypes";

export const GET_ALL_EXTENTIONS = gql`
  query getAllPlugins {
    plugins {
      authors
      description
      functions {
        description
        experimentVariableName
        name
        parameters {
          dataType
          defaultValue
          description
          displayName
          name
          options
        }
      }
    }
  }
`;

export function useGetAllExtentions(options?: QueryHookOptions) {
  const extentions = useQuery<GET_ALL_EXTENSIONS_TYPE>(GET_ALL_EXTENTIONS, {
    ...options
  });
  return extentions;
}
