import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import toast from "react-hot-toast";

import { GET_TASK_TYPE } from "types/globalTypes";

export const GET_TASK = gql`
  query getTask($taskId: UUID!) {
    task(taskId: $taskId) {
        extensionName
        actionName
        taskStatus
        receivedAt
        resultCode
        stdOut
        stdErr
        uuid
        createdBy
        experiment {
          uuid  
          title
          eid
        }
        parameters {
            key {
                dataType
                name
                displayName
                defaultValue
                description
                options
            }
            value
        }        
    }
  }
`;

export function useGetTask(options?: QueryHookOptions) {
  const extensions = useQuery<GET_TASK_TYPE>(GET_TASK, {
    ...options,
    onError(error) {
      console.log("Opening Task Details failed", error);
      toast.error(error.message, {
        id: "open_task_error",
      })
    }
  });
  return extensions;
}
