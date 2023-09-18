import * as React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const StyledTextField = styled(InputBase)((props: any) => ({
  input: {
    // backgroundColor: "#F8F8F8",
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
    />
  );
};

export { GoMakeTextInputIcon };
