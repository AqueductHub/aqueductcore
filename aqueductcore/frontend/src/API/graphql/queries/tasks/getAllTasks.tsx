import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_TASKS_TYPE } from "types/globalTypes";

export const GET_ALL_TASKS = gql`
  query getAllTasks {
    tasks(taskFilter: {}) {
        extensionName
        actionName
        taskStatus
        username
        receiveTime
        resultCode
        stdOut
        stdErr
        experiment {
          uuid  
          title
          eid
        }
    }
  }
`;

export function useGetAllTasks(options?: QueryHookOptions) {
  const extensions = useQuery<GET_ALL_TASKS_TYPE>(GET_ALL_TASKS, {
    ...options
  });
  return extensions;
}
