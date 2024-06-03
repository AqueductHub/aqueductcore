import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

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
    executePlugin: EXECUTE_EXTENSION_TYPE;
  }>(EXECUTE_EXTENSION, {
    onError(error) {
      console.log("Execute Extension failed", error);
      toast.error(error.message, {
        id: "execution_error",
      })
    }
  });
  return { mutate, loading, data, error };
}
