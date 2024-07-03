import { DragEvent, PropsWithChildren } from "react";
import {
    useTheme,
} from "@mui/material";


function DrawerLayout({ children, handleUpload }: PropsWithChildren<{ handleUpload?: (file: File) => void }>) {
    const theme = useTheme();
    function dropHandler(ev: DragEvent<HTMLDivElement>) {
        if (!handleUpload) return;
        dragLeaveHandler(ev)
        ev.preventDefault();
        if (ev?.dataTransfer) {
            if (ev.dataTransfer?.items) {
                [...ev.dataTransfer.items].forEach((item) => {
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        if (file) {
                            handleUpload(file)
                        }
                    }
                });
            } else {
                [...ev.dataTransfer.files].forEach((file) => {
                    handleUpload(file)
                });
            }
        }
    }

    function dragOverHandler(ev: DragEvent<HTMLDivElement>) {
        if (!handleUpload) return;
        ev.preventDefault();
        ev.currentTarget.style.background = theme.palette.action.selected
    }

    function dragLeaveHandler(ev: DragEvent<HTMLDivElement>) {
        ev.currentTarget.style.background = "inherit"
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
