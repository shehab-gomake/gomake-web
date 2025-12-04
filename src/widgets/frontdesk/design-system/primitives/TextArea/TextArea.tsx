import React from "react";
import { TextField, TextFieldProps, SxProps, Theme } from "@mui/material";
import { colorTokens, radiusTokens, semanticTypography } from "../../tokens";
import { transitionTokens } from "../../tokens/layout.tokens";

export interface TextAreaProps extends Omit<TextFieldProps, "variant" | "multiline" | "size"> {
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows */
  maxRows?: number;
  /** Whether to auto-resize */
  autoResize?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show character count */
  showCharCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
}

const sizeStyles = {
  sm: {
    fontSize: semanticTypography.body.small.fontSize,
    padding: "8px 10px",
    lineHeight: 1.4,
  },
  md: {
    fontSize: semanticTypography.body.medium.fontSize,
    padding: "10px 12px",
    lineHeight: 1.5,
  },
  lg: {
    fontSize: semanticTypography.body.large.fontSize,
    padding: "12px 14px",
    lineHeight: 1.6,
  },
};

/**
 * TextArea Component
 *
 * Multi-line text input with token-based styling
 */
export const TextArea: React.FC<TextAreaProps> = ({
  minRows = 3,
  maxRows = 10,
  autoResize = true,
  size = "md",
  showCharCount = false,
  maxLength,
  error = false,
  helperText,
  value,
  sx = {},
  ...rest
}) => {
  const sizeStyle = sizeStyles[size];
  const charCount = typeof value === "string" ? value.length : 0;

  const textAreaStyles: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      borderRadius: radiusTokens.md,
      backgroundColor: colorTokens.semantic.background.primary,
      transition: transitionTokens.presets.colors,
      "& fieldset": {
        borderColor: error ? colorTokens.error[500] : colorTokens.semantic.border.default,
      },
      "&:hover fieldset": {
        borderColor: error ? colorTokens.error[600] : colorTokens.semantic.border.medium,
      },
      "&.Mui-focused fieldset": {
        borderColor: error ? colorTokens.error[500] : colorTokens.primary[500],
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": {
      ...sizeStyle,
      fontFamily: "inherit",
      resize: autoResize ? "none" : "vertical",
    },
    "& .MuiInputLabel-root": {
      ...semanticTypography.label.medium,
      color: error ? colorTokens.error[600] : colorTokens.semantic.text.secondary,
      "&.Mui-focused": {
        color: error ? colorTokens.error[600] : colorTokens.primary[600],
      },
    },
    "& .MuiFormHelperText-root": {
      ...semanticTypography.caption.medium,
      color: error ? colorTokens.error[600] : colorTokens.semantic.text.secondary,
      mt: 0.5,
      mx: 0,
      display: "flex",
      justifyContent: "space-between",
    },
    ...sx,
  };

  const combinedHelperText =
    showCharCount && maxLength
      ? `${helperText || ""} ${charCount}/${maxLength}`
      : showCharCount
      ? `${helperText || ""} ${charCount} characters`
      : helperText;

  return (
    <TextField
      multiline
      minRows={minRows}
      maxRows={maxRows}
      error={error}
      helperText={combinedHelperText}
      value={value}
      inputProps={{
        maxLength,
      }}
      sx={textAreaStyles}
      {...rest}
    />
  );
};
