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
                            id: "upload_success" + file.name,
                        });
                    })
                    // Response failure message
                } else {
                    response.json().then((error) => {
                        toast.error(`file name: "${file.name}"\n` + (error.detail ?? statusText), {
                            id: "upload_failed" + file.name,
                        });
                    })
                        // No failure message
                        .catch(() => {
                            toast.error(`file name: "${file.name}"\n` + statusText, {
                                id: "upload_catch" + file.name,
                            });
                        });
                }
            })
            // Somethings went wrong with the file
            .catch((error) => {
                toast.error(`file name: "${file.name}"\n` + (error.message ?? `Unable to upload file.`), {
                    id: "file_catch" + file.name,
                });
            });
    }
    return { handleExperimentFileUpload }
}

export default useFileUpload;
