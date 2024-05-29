import { gql, useMutation } from "@apollo/client";

import { EXECUTE_EXTENSION_TYPE } from "types/globalTypes";

export const EXECUTE_EXTENSION = gql`
  mutation ExecutePlugin(
    $plugin: String!
    $function: String!
    $params: [[String!]!]!
  ) {
    executePlugin(plugin: $plugin, function: $function, params: $params) {
      returnCode
      stderr
      stdout
    }
  }
`;

export function useExecuteExtension() {
  const [mutate, { loading, data, error }] = useMutation<{
    executeExtension: EXECUTE_EXTENSION_TYPE;
  }>(EXECUTE_EXTENSION, {
    onError(error) {
      console.log("Execute Extension failed", error);
    }
  });
  return { mutate, loading, data, error };
}
