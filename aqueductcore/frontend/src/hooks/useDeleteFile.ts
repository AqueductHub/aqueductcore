import toast from "react-hot-toast";
import { ExperimentDataType } from "types/globalTypes";
import { client } from "API/apolloClientConfig";
import { AQD_FILE_URI } from "constants/api";

function useFileDelete(experimentUuid: ExperimentDataType['uuid']) {

    function handleExperimentFileDelete(file_name: string) {
        const deleteFileEndpoint = file_name ? `${AQD_FILE_URI}/api/files/${experimentUuid}` : "";

        if (!deleteFileEndpoint) {
            toast.error(`Invalid file name: "${file_name}"`, {
                id: "invalid_file_name",
            });
            return;
        }

        const request_body = {
            "file_list": [file_name]
        }
        const file_list = JSON.stringify(request_body);

        fetch(deleteFileEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: file_list
        })
            .then((response) => {
                const status = response.status;
                const statusText = response.statusText;

                if (status === 200) {
                    response.json().then(async (data) => {
                        await client.refetchQueries({
                            include: "active",
                        });

                        toast.success(data.result ?? "File deleted successfully!", {
                            id: "delete_success"
                        });
                    });
                } else {
                    response.json().then((error) => {
                        toast.error(`File name: "${file_name}"\n` + (error.detail ?? statusText), {
                            id: "delete_failed_" + file_name,
                        });
                    })
                        .catch(() => {
                            toast.error(`File name: "${file_name}"\n` + statusText, {
                                id: "delete_catch_" + file_name,
                            });
                        });
                }
            })
            .catch((error) => {
                toast.error(`File name: "${file_name}"\n` + (error.message ?? `Unable to delete file.`), {
                    id: "file_delete_catch_" + file_name,
                });
            });
    }

    return { handleExperimentFileDelete }
}

export default useFileDelete;
