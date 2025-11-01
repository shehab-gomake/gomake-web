/**
 * Reply Composer Email Fields Component
 *
 * Email recipient fields (TO, CC, BCC) for email-based conversations.
 * Only shown when replying (not for private notes).
 */

import React from "react";
import { Stack, Typography, TextField, Link } from "@mui/material";

export interface ReplyComposerEmailFieldsProps {
  /** TO email addresses */
  toEmails: string;
  /** CC email addresses */
  ccEmails: string;
  /** BCC email addresses */
  bccEmails: string;
  /** Whether to show BCC field */
  showBcc: boolean;
  /** Callback when TO changes */
  onToChange: (value: string) => void;
  /** Callback when CC changes */
  onCcChange: (value: string) => void;
  /** Callback when BCC changes */
  onBccChange: (value: string) => void;
  /** Callback when BCC visibility toggles */
  onToggleBcc: () => void;
  /** Border color */
  borderColor?: string;
  /** Text color */
  textColor?: string;
  /** Light gray text color */
  lightGrayText?: string;
}

export const ReplyComposerEmailFields: React.FC<ReplyComposerEmailFieldsProps> = ({
  toEmails,
  ccEmails,
  bccEmails,
  showBcc,
  onToChange,
  onCcChange,
  onBccChange,
  onToggleBcc,
  borderColor = "#E5E7EB",
  textColor = "#111827",
  lightGrayText = "#6B7280",
}) => {
  const fieldStyle = {
    "& .MuiInput-root": {
      backgroundColor: "transparent",
      color: textColor,
      fontSize: "0.875rem",
      "&::placeholder": {
        color: lightGrayText,
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      py: 0.5,
      px: 0,
    },
  };

  return (
    <Stack
      spacing={0.5}
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
      }}
    >
      {/* TO Field */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
        <Typography
          variant="body2"
          sx={{
            color: lightGrayText,
            fontSize: "0.8125rem",
            fontWeight: 500,
            minWidth: 40,
          }}
        >
          TO
        </Typography>
        <TextField
          size="small"
          value={toEmails}
          onChange={(e) => onToChange(e.target.value)}
          fullWidth
          variant="standard"
          placeholder="recipient@email.com"
          InputProps={{
            disableUnderline: true,
          }}
          sx={fieldStyle}
        />
      </Stack>

      {/* CC Field */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
        <Typography
          variant="body2"
          sx={{
            color: lightGrayText,
            fontSize: "0.8125rem",
            fontWeight: 500,
            minWidth: 40,
          }}
        >
          CC
        </Typography>
        <TextField
          size="small"
          value={ccEmails}
          onChange={(e) => onCcChange(e.target.value)}
          fullWidth
          variant="standard"
          placeholder="Optional"
          InputProps={{
            disableUnderline: true,
          }}
          sx={fieldStyle}
        />
        {!showBcc && (
          <Link
            component="button"
            onClick={onToggleBcc}
            underline="none"
            sx={{
              color: lightGrayText,
              fontSize: "0.8125rem",
              fontWeight: 500,
              "&:hover": {
                color: textColor,
              },
            }}
          >
            BCC
          </Link>
        )}
      </Stack>

      {/* BCC Field (conditional) */}
      {showBcc && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
          <Typography
            variant="body2"
            sx={{
              color: lightGrayText,
              fontSize: "0.8125rem",
              fontWeight: 500,
              minWidth: 40,
            }}
          >
            BCC
          </Typography>
          <TextField
            size="small"
            value={bccEmails}
            onChange={(e) => onBccChange(e.target.value)}
            fullWidth
            variant="standard"
            placeholder="Optional"
            InputProps={{
              disableUnderline: true,
            }}
            sx={fieldStyle}
          />
        </Stack>
      )}
    </Stack>
  );
};
