import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import { EXECUTE_EXTENSION_TYPE } from "types/globalTypes";

export const EXECUTE_EXTENSION = gql`
  mutation ExecuteExtension(
    $extension: String!
    $action: String!
    $params: [[String!]!]!
  ) {
    executeExtension(extension: $extension, action: $action, params: $params) {
      returnCode
      stdErr
      stdOut
    }
  }
`;

export function useExecuteExtension() {
  const [mutate, { loading, data, error }] = useMutation<{
    executeExtension: EXECUTE_EXTENSION_TYPE;
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
