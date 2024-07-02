import toast from "react-hot-toast";
import { useContext } from "react";

import { FileSelectStateContext } from "context/FileSelectProvider";
import { ExperimentDataType } from "types/globalTypes";
import { client } from "API/apolloClientConfig";
import { AQD_FILE_URI } from "constants/api";

function useFileUpload(experimentUuid: ExperimentDataType['uuid']) {
    const { setSelectedFile } = useContext(FileSelectStateContext)

    function handleExperimentFileUpload(file: File) {
        const uploadFileEndpoint = file ? `${AQD_FILE_URI}/api/files/${experimentUuid}` : "";

        const data = new FormData();
        data.append('file', file);

        fetch(uploadFileEndpoint, {
            method: 'POST',
            headers: {
                file_name: file.name
            },
            body: data
        })
            .then((response) => {
                const status = response.status
                const statusText = response.statusText
                // SUCCESS
                if (status === 200) {
                    response.json().then(async (data) => {
                        await client.refetchQueries({
                            include: "active",
                        });
                        // ! file.name is fronm client! might cause issues,
                        // TODO: it should be in the response.
                        setSelectedFile(file.name)
                        toast.success(data.result ?? "File uploaded successfully!", {
                            id: "upload_success",
                        });
                    })
                    // Response failure message
                } else {
                    response.json().then((error) => {
                        toast.error(error.detail ?? statusText, {
                            id: "upload_failed",
                        });
                    })
                        // No failure message
                        .catch(() => {
                            toast.error(statusText, {
                                id: "upload_catch",
                            });
                        });
                }
            })
    }
    return { handleExperimentFileUpload }
}

export default useFileUpload;
