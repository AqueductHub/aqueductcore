import { gql, QueryHookOptions, useQuery } from "@apollo/client";

import { GET_ALL_TASKS_TYPE } from "types/globalTypes";

export const GET_ALL_TASKS = gql`
  query getAllTasks($offset: Int!, $limit: Int!, $filters: TasksFilterInput) {
    tasks(offset: $offset, limit: $limit, filters: $filters) {
      tasksData {
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
      }
      totalTasksCount
    }
  }
`;

export function useGetAllTasks(options?: QueryHookOptions) {
  const extensions = useQuery<GET_ALL_TASKS_TYPE>(GET_ALL_TASKS, {
    ...options
  });
  return extensions;
}
