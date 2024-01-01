import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { IconButton, Paper, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";

interface IUpdateValueInputProps {
    value: string;
    onUpdate: () => void;
    onCancel: () => void;
    onInputChange: (e: string) => void;
    clickedOut: () => void;
}

const UpdateValuePhoneInput = ({
    value,
    onUpdate,
    onCancel,
    onInputChange,
    clickedOut,
}: IUpdateValueInputProps) => {
    const { errorColor, successColor } = useGomakeTheme();
    return (
        <ClickOutside onClick={clickedOut}>
            <RouteChangeConfirmation />
            <Paper
                component="form"
                sx={{
                    p: "4px 4px",
                    display: "inline-flex",
                    alignItems: "center",
                    width: "230px",
                    height: "26px",
                    boxShadow: "none",
                }}
            >
                <PhoneInputComponent
                    onChange={onInputChange}
                    value={value}
                    autoFocus={true}
                />
                <Stack direction={"column"} gap={"2px"}>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdate();
                        }}
                        sx={{
                            m: "0 4px",
                            backgroundColor: successColor(100),
                            borderRadius: "5px",
                            color: successColor(600),
                            height: "16px",
                            width: "16px",
                        }}
                    >
                        <CheckIcon style={{ width: "12px", height: "12px" }} />
                    </IconButton>
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
                </Stack>
            </Paper>
        </ClickOutside>
    );
};

export { UpdateValuePhoneInput };