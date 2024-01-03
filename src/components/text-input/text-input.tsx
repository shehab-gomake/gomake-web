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
    boxSizing: "border-box",
    borderRadius: props?.style?.borderRadius || 4,
    height: 56,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    alignItems: "center",
    color: props?.error ? "red" : "#000000",
    boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#FFF",
    width: "100%",
    borderBottom: props.error
      ? `2px solid ${props.errorColor(300)}`
      : `0px solid #FFFFFF`,
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
  "& input::placeholder": {
    color: "#B1B1B1",
    opacity: 1,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
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
  defaultValue,
  onBlur,
  onClick,
  onFocus,
  id,
}: {
  labelText?: string;
  value?: any;
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
  defaultValue?: any;
  onBlur?: any;
  onClick?: any;
  onFocus?: any;
  id?: any;
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
      defaultValue={defaultValue}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      id={id}
    />
  );
};

export { GomakeTextInput };
