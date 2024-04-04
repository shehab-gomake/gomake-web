import React, { useState } from "react";
import { IconButton, Paper } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IUpdateValueInputProps {
    value: string;
    onUpdate: any;
    onCancel: () => void;
    onInputChange: (e: string) => void;
    height?: string;
    width?: string;
}

const UpdatedTextInput = ({
    value,
    onUpdate,
    onCancel,
    onInputChange,
    height,
    width
}: IUpdateValueInputProps) => {
    const { errorColor, successColor, secondColor } = useGomakeTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    //  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    //     // Check if the related target of the blur event is not one of the icons
    //     if (
    //         e.relatedTarget !== document.getElementById("cancel-icon") &&
    //         e.relatedTarget !== document.getElementById("update-icon")
    //     ) {
    //         setIsFocused(false);
    //     }
    // };

    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the Paper component
        onCancel();
    };

    const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the Paper component
        onUpdate();
    };

    return (
        <Paper
            component="form"
            sx={{
                p: "4px 4px",
                display: "inline-flex",
                alignItems: "center",
                width: width || "137px",
                height: height || "26px",
                border: `1px solid ${isFocused ? secondColor(400) : 'gray'}`,
                borderRadius: "5px",
                boxShadow: "none",
            }}
            onClick={handleFocus}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                autoFocus={false}
                onBlur={handleBlur}
            //onFocus={handleFocus}
            />

            {isFocused && (
                <>
                    <IconButton
                        id="cancel-icon"
                        type="button"
                        onClick={handleCancelClick}
                        sx={{
                            m: "0 4px",
                            backgroundColor: errorColor(100),
                            borderRadius: "5px",
                            color: errorColor(600),
                            height: "16px",
                            width: "16px",
                        }}
                    >
                        <CloseIcon style={{ width: "12px", height: "12px" }} />
                    </IconButton>
                    <IconButton
                        id="update-icon"

                        onClick={handleUpdateClick}
                        sx={{
                            backgroundColor: successColor(100),
                            borderRadius: "5px",
                            color: successColor(600),
                            height: "16px",
                            width: "16px",
                        }}
                    >
                        <CheckIcon style={{ width: "12px", height: "12px" }} />
                    </IconButton>
                </>
            )}
        </Paper>
    );
};

export { UpdatedTextInput };
