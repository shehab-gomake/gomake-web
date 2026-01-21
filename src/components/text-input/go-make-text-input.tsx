import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { CSSProperties, ReactNode } from "react";

const StyledTextField = styled(TextField)(
  ({ direction, error }: { direction?: "ltr" | "rtl"; error }) => ({
    direction: direction,
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md, 8px)",
    alignSelf: "stretch",
    borderRadius: "var(--radius-md, 8px)",
    border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
    background: "var(--Colors-Background-bg-primary, #FFF)",
    boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
    "& input": {
      color: error ? "red" : "#000000",
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
      fontFamily: "Heebo",
      fontWeight: 500,
      width: "100%",
      "& fieldset": {
        border: "transparent",
      },
      "& input::placeholder": {
        color: "#B1B1B1",
        opacity: 1,
        fontFamily: "Heebo",
        fontStyle: "normal",
        fontWeight: 500,
      },
    },
  })
);

interface GoMakeTextInputProps {
  value?: any;
  onChange?: any;

  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  style?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  defaultValue?: any;
  type?: any;
  multiline?: boolean;
  InputProps?: any; // Can be more specific depending on usage
  autoFocus?: boolean;
  onMouseLeave?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  onFocus?: () => void;
  id?: string;
  helperText?: ReactNode;
  direction?: "ltr" | "rtl";
  error?: any;
  sx?: any;
}

const GoMakeTextInput = ({
  value,
  onChange,
  onKeyDown,
  style,
  placeholder,
  defaultValue,
  disabled,
  type,
  multiline,
  InputProps,
  autoFocus,
  onMouseLeave,
  onBlur,
  onClick,
  onFocus,
  id,
  helperText,
  direction,
  error,
  sx,
}: GoMakeTextInputProps) => {
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
    <StyledTextField
      value={value}
      onChange={handleChange}
      disabled={disabled}
      type={type}
      autoComplete="off"
      autoFocus={autoFocus}
      error={error}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      multiline={multiline}
      InputProps={InputProps}
      onMouseLeave={onMouseLeave}
      defaultValue={defaultValue}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      id={id}
      helperText={helperText}
      dir={direction}
      onWheel={handleWheel}
      style={style}
      sx={sx}
    />
  );
};

export { GoMakeTextInput, StyledTextField };
