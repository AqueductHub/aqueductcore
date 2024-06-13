import { createContext, useState } from "react";

import { FileSelectContextType } from "types/componentTypes";

const FileSelectStateContext = createContext<FileSelectContextType>(
    { selectedFile: undefined, setSelectedFile: () => { } }
);

function FileSelectProvider(props: { children: React.ReactNode }) {
    const [selectedFile, setSelectedFile] = useState<FileSelectContextType['selectedFile']>();
    return (
        <FileSelectStateContext.Provider value={{ selectedFile, setSelectedFile }}>
            {props.children}
        </FileSelectStateContext.Provider>
    );
}

export { FileSelectProvider, FileSelectStateContext };
