import React, { useEffect, useState } from "react";
import { IconButton, Paper, debounce } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IUpdateValueInputProps {
    value: string;
    onUpdate: () => void;
    onCancel?: () => void;
    onInputChange: (e: any) => void;
    height?: string;
    width?: string;
    withBorder?: boolean;
}

const UpdatedTextInput = ({
    value,
    onUpdate,
    onCancel,
    onInputChange,
    height,
    width,
    withBorder=false
}: IUpdateValueInputProps) => {
    const { errorColor, successColor , secondColor } = useGomakeTheme();
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    const debouncedOnBlur = debounce(handleBlur, 500);

    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        onCancel();
    };

    const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
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
                borderRadius: "5px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
                backgroundColor: "#FFF",
                border: withBorder && `1px solid ${isFocused ? secondColor(400) : 'gray'}`,

            }}
            onBlur={debouncedOnBlur}
        >
            <InputBase
                sx={{
                    ml: 1, flex: 1, fontFamily: "Heebo",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: 14,
                }}
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                autoFocus={false}
                onFocus={handleFocus}
            />

            {isFocused && (
                <>
                    <IconButton
                        id="cancel-icon"
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
