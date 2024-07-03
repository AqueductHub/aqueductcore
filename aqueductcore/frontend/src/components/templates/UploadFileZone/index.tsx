import { DragEvent, PropsWithChildren } from "react";
import {
    useTheme,
} from "@mui/material";


function DrawerLayout({ children, handleUpload }: PropsWithChildren<{ handleUpload?: (file: File) => void }>) {
    const theme = useTheme();
    function dropHandler(e: DragEvent<HTMLDivElement>) {
        if (!handleUpload) return;
        dragLeaveHandler(e)
        e.preventDefault();
        if (e?.dataTransfer) {
            if (e.dataTransfer?.items) {
                [...e.dataTransfer.items].forEach((item) => {
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        if (file) {
                            handleUpload(file)
                        }
                    }
                });
            }
        }
    }

    function dragOverHandler(e: DragEvent<HTMLDivElement>) {
        if (!handleUpload) return;
        e.preventDefault();
        e.currentTarget.style.background = theme.palette.action.selected
    }

    function dragLeaveHandler(e: DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = "inherit"
    }
    return (
        <div
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
        >
            {children}
        </div>)
}
export default DrawerLayout;
