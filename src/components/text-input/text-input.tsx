import * as React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const StyledTextField = styled(TextField, {
  shouldForwardProp: (propName: any) =>
    propName !== "secondColor" &&
    propName !== "primaryColor" &&
    propName !== "errorColor",
})((props: any) => ({
  width: "100%",
  input: {
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
    borderRadius: props?.style?.borderRadius || 4,
    height: 56,
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.08)",
    width: "100%",
    color: props.error
      ? `${props.errorColor(300)}`
      : `${props.primaryColor(300)}`,
    ...props.style,
  },

  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      border: props.error
        ? `2px solid ${props.errorColor(300)}`
        : `2px solid #FFFFFF`,
    },
    "& fieldset": {
      border: props.error
        ? `1px solid ${props.errorColor(300)}`
        : `1px solid #FFFFFF`,
      boxSizing: "border-box",
      borderRadius: props?.style?.borderRadius || 4,
      width: "100%",
    },
    "&.Mui-focused fieldset": {
      borderColor: props.error ? `${props.errorColor(300)}` : "#FFFFFF",
      borderRadius: props?.style?.borderRadius || 4,
      width: "100%",
    },
  },
}));

const GomakeTextInput = ({
  value,
  onChange,
  style,
  error,
  type,
  disabled,
  placeholder,
  onKeyDown,
  multiline,
  InputProps,
  autoFocus,
  onMouseLeave,
}: {
  labelText?: string;
  value?: string;
  onChange?: any;
  style?: any;
  error?: any;
  type?: any;
  disabled?: any;
  placeholder?: any;
  onKeyDown?: any;
  multiline?: any;
  InputProps?: any;
  autoFocus?: any;
  onMouseLeave?: any;
}) => {
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();
  return (
    <StyledTextField
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      style={style}
      error={error}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      multiline={multiline}
      InputProps={InputProps}
      // @ts-ignore
      secondColor={secondColor}
      primaryColor={primaryColor}
      errorColor={errorColor}
      onMouseLeave={onMouseLeave}
    />
  );
};

export { GomakeTextInput };
