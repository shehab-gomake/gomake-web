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
    fontFamily: "Jost",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    alignItems: "center",
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
        : `2px solid #B9B9D9`,
    },
    "& fieldset": {
      border: props.error
        ? `1px solid ${props.errorColor(300)}`
        : `1px solid #B9B9D9`,
      boxSizing: "border-box",
      borderRadius: props?.style?.borderRadius || 4,
      width: "100%",
    },
    "&.Mui-focused fieldset": {
      borderColor: props.error ? `${props.errorColor(300)}` : "#B9B9D9",
      borderRadius: props?.style?.borderRadius || 4,
      width: "100%",
    },
  },
}));

const GomakeTextInput = ({
  labelText,
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
}) => {
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();
  return (
    <StyledTextField
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
    />
  );
};

export { GomakeTextInput };
