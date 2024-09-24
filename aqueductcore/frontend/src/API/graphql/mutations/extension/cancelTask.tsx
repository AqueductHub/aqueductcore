import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import { CANCEL_TASK_TYPE } from "types/globalTypes";

export const CANCEL_TASK = gql`
    mutation CancelTask(
        $taskId: UUID!
    ) {
        cancelTask(cancelTaskInput: {taskId: $taskId}) {
            taskId
            resultCode
            taskStatus
        }
    }
`;

export function useCancelTask() {
    const [mutate, { loading, data, error }] = useMutation<{
        cancelTask: CANCEL_TASK_TYPE;
    }>(CANCEL_TASK, {
        onError(error) {
            console.log("Cancel Task failed", error);
            toast.error(error.message, {
                id: "revoke_error"
            })
        }
    });
    return { mutate, loading, data, error };
}
