import React, { createContext, useContext } from "react";
import { useFilesUploaderSignalr } from "@/hooks/signalr/use-files-uploader-signalr";
import { useFilesUploaderSocketIO } from "@/hooks/socket-io/use-files-uploader-socket-io";


const FileUploaderContext = createContext<any>(null);

export const FileUploaderProvider = ({ children }: { children: React.ReactNode }) => {
    // const fileUploaderSignalRState = useFilesUploaderSignalr();
    const fileUploaderSocketIOState = useFilesUploaderSocketIO();

    return (
        <FileUploaderContext.Provider value={fileUploaderSocketIOState}>
            {children}
        </FileUploaderContext.Provider>
    );
};

export const useFileUploader = () => {
    const context = useContext(FileUploaderContext);
    if (!context) {
        throw new Error("useFileUploader must be used within a FileUploaderProvider");
    }
    return context;
};