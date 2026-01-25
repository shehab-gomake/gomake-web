import * as React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const StyledTextField = styled(InputBase)((props: any) => ({
  input: {
    backgroundColor: props?.color || "#FFF",
    boxSizing: "border-box",
    borderRadius: "10px",
    height: 44,
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 14,
    lineHeight: "21px",
    paddingLeft: props?.style?.paddingInputLeft || "40px",
    paddingRight: props?.style?.paddingInputRight || "40px",
    color: props?.error ? "red" : "#000",
    boxShadow: "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    WebkitBoxShadow:
      "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    border: props.error
      ? `1px solid ${props.errorColor(300)}`
      : `1px solid var(--theme-input-border-color, transparent)`,
    ...props.style,
  },
  "&:hover input": {
    borderColor: props.error
      ? props.errorColor(300)
      : "var(--theme-input-border-hover-color, var(--theme-input-border-color, transparent))",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      border: props.error
        ? `2px solid ${props.errorColor(300)}`
        : `2px solid var(--theme-input-border-hover-color, var(--theme-input-border-color, transparent))`,
    },
    "& fieldset": {
      border: props.error
        ? `1px solid ${props.errorColor(300)}`
        : `1px solid var(--theme-input-border-color, transparent)`,
      boxSizing: "border-box",
      borderRadius: props?.style?.borderRadius || 4,
      width: "100%",
    },
    "&.Mui-focused fieldset": {
      borderColor: props.error
        ? props.errorColor(300)
        : "var(--theme-input-border-focus-color, var(--theme-input-border-color, transparent))",
      borderRadius: props?.style?.borderRadius || "var(--theme-radius-md, 4px)",
      width: "100%",
    },
  },
  "& input::placeholder": {
    color: "#B1B1B1",
    opacity: 1,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
  },
}));

const GoMakeTextInputIcon = ({
  value,
  onChange,
  style,
  error,
  endAdornment,
  type,
  startAdornment,
  placeholder,
  bgColor,
  inputRef,
  sx,
  onKeyDown,
}: {
  labelText?: string;
  placeholder?: any;
  value?: string;
  onChange?: any;
  style?: any;
  error?: any;
  endAdornment?: any;
  type?: any;
  startAdornment?: any;
  bgColor?: any;
  inputRef?: any;
  sx?: any;
  onKeyDown?: any;
}) => {
  return (
    <StyledTextField
      value={value}
      onChange={onChange}
      style={style}
      error={error}
      endAdornment={endAdornment}
      type={type}
      startAdornment={startAdornment}
      placeholder={placeholder}
      color={bgColor}
      inputRef={inputRef}
      id={"searchInput"}
      sx={sx}
      onKeyDown={onKeyDown}
    />
  );
};

export { GoMakeTextInputIcon };
