import React, { useState, useEffect } from "react";
import { Autocomplete, Paper, TextField, IconButton, debounce } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { RouteChangeConfirmation } from "@/components/handle-navigation/handle-navigation";
import { ArrowUpIcon } from "@/icons";
import { useRef } from "react";

interface IUpdateValueAutoCompleteProps {
    value?: any;
    onUpdate?: () => void;
    onCancel?: () => void;
    onInputChange?: (e: string) => void;
    clickedOut?: () => void;
    options?: any;
    onChange?: any;
    onChangeTextField?: any;
    height?: string;
    width?: string;
}

const UpdatedAutoComplete = ({
    onUpdate,
    onCancel,
    value,
    clickedOut,
    options,
    onChange,
    onChangeTextField,
    width,
    height
}: IUpdateValueAutoCompleteProps) => {
    const optionsListEl = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [originalValue, setOriginalValue] = useState<string>(value);
    const [updatedValue, setUpdatedValue] = useState<string>(value);

    useEffect(() => {
        setOriginalValue(value);
        setUpdatedValue(value);
    }, [value]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // onCancel();
    };


    const handleCancelClick = () => {
        onCancel();
    };

    const handleUpdateClick = () => {
        onUpdate();
    };

    // const handleChange = (event, newValue) => {
    //     setUpdatedValue(newValue);
    //     if (onChange) {
    //         onChange(event, newValue);
    //     }
    // };

    const handleChange = (event, newValue) => {
        setUpdatedValue(newValue);
        const originalNumberValue = parseFloat(originalValue);
        if (newValue !== originalNumberValue) {
            onUpdate();
        }
        if (onChange) {
            onChange(event, newValue);
        }
    };
    return (
        <>
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
                }}
                onBlur={handleBlur}
            >
                <Autocomplete
                    id="updateValueAutoComplete"
                    options={options}
                    value={updatedValue}
                    sx={{
                        ml: 1,
                        flex: 1,
                        padding: 0,
                        position: "relative",
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={onChangeTextField}
                            onFocus={handleFocus}
                            autoFocus={isFocused}
                        />
                    )}
                    onChange={handleChange}
                    popupIcon={
                        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
                            <ArrowUpIcon />
                        </div>
                    }
                    clearIcon={false}
                    PaperComponent={(props) => (
                        <Paper ref={optionsListEl} {...props}>
                            {props?.children}
                        </Paper>
                    )}
                />
                {/* {isFocused && (
                    <div>
                        <IconButton
                            id="cancel-icon"
                            onClick={handleCancelClick}
                            sx={{
                                m: "0 4px",
                                backgroundColor: "#FFF",
                                borderRadius: "5px",
                                color: secondColor(600),
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
                                backgroundColor: "#FFF",
                                borderRadius: "5px",
                                color: secondColor(600),
                                height: "16px",
                                width: "16px",
                            }}
                        >
                            <CheckIcon style={{ width: "12px", height: "12px" }} />
                        </IconButton>
                    </div>
                )} */}
            </Paper>
        </>
    );
};

export { UpdatedAutoComplete };