import * as React from "react";
import TextField from "@mui/material/TextField";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { styled } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";

const StyledTextField = styled(TextField, {
  shouldForwardProp: (propName: any) =>
    propName !== "secondColor" &&
    propName !== "primaryColor" &&
    propName !== "errorColor",
})((props: any) => ({
  width: "100%",
  input: {
    boxSizing: "border-box",
    borderRadius: props?.style?.borderRadius || "var(--theme-radius-md, 4px)",
    height: props?.style?.height || "var(--theme-input-height, 37px)",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    alignItems: "center",
    color: props?.error ? "red" : "#000000",
    boxShadow: "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    WebkitBoxShadow:
      "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    WebkitAppearance: "none",
    backgroundColor: "var(--theme-bg-primary, #FFF)",
    width: "100%",
    borderBottom: props.error
      ? `2px solid ${props.errorColor(300)}`
      : `0px solid #FFFFFF`,
    direction: props.direction,
    ...props.style,
  },

  "& .MuiOutlinedInput-root": {
    width: "100%",
    "&:hover fieldset": {
      border: props.error
        ? `2px solid ${props.errorColor(300)}`
        : `var(--theme-input-border-hover, 1px solid var(--theme-input-border-color, #FFFFFF))`,
    },
    "& fieldset": {
      border: props.error
        ? `1px solid ${props.errorColor(300)}`
        : `1px solid var(--theme-input-border-color, transparent) !important`,
      boxSizing: "border-box",
      borderRadius: props?.style?.borderRadius || "var(--theme-radius-md, 4px)",
      width: "100%",
    },

    "&.Mui-focused fieldset": {
      borderColor: props.error
        ? `${props.errorColor(300)}`
        : `var(--theme-input-border-focus-color, var(--theme-input-border-color, #E0E0E0))`,
      borderRadius: props?.style?.borderRadius || "var(--theme-radius-md, 4px)",
      width: "100%",
    },
  },
  "& .MuiInputBase-input.Mui-disabled": {
    cursor: "not-allowed",
    color: "#000",
    WebkitTextFillColor: "#000",
    opacity: 1,
  },
  "& input::placeholder": {
    color: "#B1B1B1",
    opacity: 1,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
  },
  "&.Mui-disabled": {
    cursor: "not-allowed",
    color: "#000",
    WebkitTextFillColor: "#000",
    opacity: 1,
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
  helperText,
  direction,
  sx,
  labelText,
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
  helperText?: string;
  direction?: any;
  sx?: any;
}) => {
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trimStart();
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        value: trimmedValue,
      },
    };
    onChange(modifiedEvent);
  };
  const handleWheel = (event) => {
    if (document.activeElement === event.target && type === "number") {
      event.target.blur();
    }
  };

  return (
    <>
      {labelText && (
        <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{labelText}</div>
      )}
      <StyledTextField
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        style={style}
        sx={sx}
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
        helperText={helperText}
        dir={direction}
        onWheel={handleWheel}
      />
    </>
  );
};

export { GomakeTextInput, StyledTextField };
