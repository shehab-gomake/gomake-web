/**
 * RichTextEditor Component
 *
 * Simple rich text editor for greeting messages, CSAT messages, etc.
 * Features: Basic formatting, character count, placeholder support.
 */

import React from "react";
import { Box, Typography, TextareaAutosize, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface RichTextEditorProps {
  /** Current content value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum rows for textarea */
  minRows?: number;
  /** Optional label */
  label?: string;
  /** Optional help text */
  helpText?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  maxLength,
  minRows = 4,
  label,
  helpText,
  disabled = false,
  error,
}) => {
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const remainingChars = maxLength ? maxLength - value.length : undefined;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Label */}
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: error ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {label}
          {maxLength && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                ml: 1,
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            >
              ({remainingChars} characters remaining)
            </Typography>
          )}
        </Typography>
      )}

      {/* Editor Container */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${
            error ? theme.palette.error.main : theme.palette.divider
          }`,
          borderRadius: 1,
          backgroundColor: disabled
            ? theme.palette.action.disabledBackground
            : theme.palette.background.paper,
          transition: "border-color 0.2s",
          "&:focus-within": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          },
        }}
      >
        <TextareaAutosize
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          minRows={minRows}
          disabled={disabled}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontFamily: theme.typography.fontFamily,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            padding: theme.spacing(1.5),
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          }}
        />
      </Paper>

      {/* Help Text or Error */}
      {(helpText || error) && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "block",
            color: error
              ? theme.palette.error.main
              : theme.palette.text.secondary,
          }}
        >
          {error || helpText}
        </Typography>
      )}

      {/* Character Count (if no label) */}
      {!label && maxLength && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "block",
            textAlign: "right",
            color:
              remainingChars !== undefined && remainingChars < 20
                ? theme.palette.warning.main
                : theme.palette.text.secondary,
          }}
        >
          {value.length} / {maxLength}
        </Typography>
      )}
    </Box>
  );
};
