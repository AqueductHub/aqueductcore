import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { GET_ALL_PLUGINS_TYPE } from "types/globalTypes";

export const GET_ALL_PLUGINS = gql`
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

export function useGetAllPlugins(options?: QueryHookOptions) {
  const plugins = useQuery<GET_ALL_PLUGINS_TYPE>(GET_ALL_PLUGINS, {
    ...options
  });
  return plugins;
}
