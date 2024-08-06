import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { IconButton, Paper } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { FONT_FAMILY } from "@/utils/font-family";
import { ChangeEvent, KeyboardEvent } from "react";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";

interface IUpdateValueInputProps {
    value: string;
    onUpdate: () => void;
    onCancel: () => void;
    onInputChange: (e: string) => void;
    clickedOut: () => void;
    height?: string;
    width?: string;
}

const UpdateValueInput = ({
    value,
    onUpdate,
    onCancel,
    onInputChange,
    clickedOut,
    height,
    width
}: IUpdateValueInputProps) => {
    const { errorColor, successColor, secondColor } = useGomakeTheme();
    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = event.target.value.trimStart();
        onInputChange(trimmedValue);
    };
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onUpdate();
        }
    };

    return (
        <ClickOutside onClick={clickedOut}>
            <RouteChangeConfirmation />
            <Paper
                component="form"
                sx={{
                    p: "4px 4px",
                    display: "inline-flex",
                    alignItems: "center",
                    width: width || "137px",
                    height: height || "26px",
                    border: "1px solid " + secondColor(400),
                    boxShadow: "none",
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, ...FONT_FAMILY.Lexend(400, 14) }}
                    value={value}
                    onChange={handleTextChange}
                    autoFocus={true}
                    onKeyPress={handleKeyPress}
                />

                <IconButton
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel()
                    }}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate();
                    }}
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
            </Paper>
        </ClickOutside>
    );
};

export { UpdateValueInput };