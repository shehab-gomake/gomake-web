import React, { useRef } from "react";

import {
    CommandBar,
    ICommandBarItemProps,
    CommandButton,
    Checkbox,
    IIconProps,
} from "@fluentui/react";

export interface ToolBarProps {
    onMinifyClick: () => void;
    onPrettifyClick: () => void;
    onClearClick: () => void;
    onAutoPrettifyChange: () => void;
    onDownloadClick: () => void;
    onUploadClick: () => void;
    onFixClick: () => void;
    isAutoPrettifyOn: boolean;
    isValidJson: boolean;
}

interface FileUploaderProps {
    onFileHandle: (fileContent: File) => void;
}

// Need to fix: hover is not working
export const FileUploader: React.FC<FileUploaderProps> = ({ onFileHandle }) => {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        if (inputFileRef.current) {
            // upload the same file
            inputFileRef.current.value = "";
            inputFileRef.current.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const fileUploaded = e.target.files[0];
        onFileHandle(fileUploaded);
    };

    const uploadIcon: IIconProps = {
        iconName: "Upload",
    };

    return (
        <>
            <CommandButton iconProps={uploadIcon} text="Upload" onClick={handleUploadClick} />
            <input
                ref={inputFileRef}
                style={{ display: "none" }}
                onChange={handleChange}
                type="file"
                accept="application/json"
            />
        </>
    );
};

export const ToolBar: React.FC<ToolBarProps> = ({
                                                    onMinifyClick,
                                                    onPrettifyClick,
                                                    isAutoPrettifyOn,
                                                    onAutoPrettifyChange,
                                                    onClearClick,
                                                    onDownloadClick,
                                                    onUploadClick,
                                                    onFixClick,
                                                    isValidJson,
                                                }) => {
    const leftItems: ICommandBarItemProps[] = [
        {
            key: "upload",
            text: "upload",
            onClick: onUploadClick,
        },
        {
            key: "prettify",
            text: "Prettify",
            iconProps: { iconName: "Code" },
            onClick: onPrettifyClick,
            disabled: !isValidJson || isAutoPrettifyOn,
        },
    ];

    return (
        <CommandBar
            styles={{
                root: {
                    alignItems: "center",
                    // borderTop: "1px solid rgb(237, 235, 233)",
                },
            }}
            items={leftItems}
            ariaLabel="json content commands"
        />
    );
};