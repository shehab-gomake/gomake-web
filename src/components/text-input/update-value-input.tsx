import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { IconButton, Paper } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { FONT_FAMILY } from "@/utils/font-family";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";
import { detectLanguage } from "@/utils/helpers";

interface IUpdateValueInputProps {
    value: string;
    onUpdate: () => void;
    onCancel: () => void;
    onInputChange: (e: string) => void;
    clickedOut: () => void;
}

const UpdateValueInput = ({
    value,
    onUpdate,
    onCancel,
    onInputChange,
    clickedOut,
}: IUpdateValueInputProps) => {
    const { errorColor, successColor, secondColor } = useGomakeTheme();
    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        onInputChange(event.target.value);
    };
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onUpdate();
        }
    };
    const systemLanguage = localStorage.getItem("systemLanguage");
    const lang = systemLanguage === "ar" ? "ar" : "en";
    const inputDir = lang === "ar" ? "rtl" : "ltr";
    const [direction, setDirection] = useState(inputDir)
    const language = detectLanguage(value);
    useEffect(() => {
        if (language === "English") {
            setDirection("ltr")
        }
        else if (language === "Arabic") {
            setDirection("rtl")
        }
        else {
            setDirection(inputDir)
        }

    }, [value])

    return (
        <ClickOutside onClick={clickedOut}>
            <RouteChangeConfirmation />
            <Paper
                component="form"
                sx={{
                    p: "4px 4px",
                    display: "inline-flex",
                    alignItems: "center",
                    width: "137px",
                    height: "26px",
                    border: "1px solid " + secondColor(400),
                    boxShadow: "none",
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, ...FONT_FAMILY.Lexend(400, 14), direction: direction }}
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