import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_EXTENSIONS_TYPE } from "types/globalTypes";

export const GET_ALL_EXTENSIONS = gql`
  query getAllExtensions {
    extensions {
        name
        authors
        description
        actions {
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

export function useGetAllExtensions(options?: QueryHookOptions) {
    const extensions = useQuery<GET_ALL_EXTENSIONS_TYPE>(GET_ALL_EXTENSIONS, {
        ...options
    });
    return extensions;
}
