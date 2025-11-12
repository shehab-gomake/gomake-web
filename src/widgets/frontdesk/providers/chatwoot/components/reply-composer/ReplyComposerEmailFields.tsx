/**
 * Reply Composer Email Fields Component
 *
 * Email recipient fields (TO, CC, BCC) for email-based conversations.
 * Only shown when replying (not for private notes).
 */

import React from "react";
import { Stack, Typography, TextField, Link, Chip, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface ReplyComposerEmailFieldsProps {
  /** TO email addresses */
  toEmails: string;
  /** CC email addresses */
  ccEmails: string;
  /** BCC email addresses */
  bccEmails: string;
  /** Whether to show CC field */
  showCc: boolean;
  /** Whether to show BCC field */
  showBcc: boolean;
  /** Callback when CC changes */
  onCcChange: (value: string) => void;
  /** Callback when BCC changes */
  onBccChange: (value: string) => void;
  /** Callback when CC visibility toggles */
  onToggleCc: () => void;
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
  showCc,
  showBcc,
  onCcChange,
  onBccChange,
  onToggleCc,
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

  const handleCloseCc = () => {
    onCcChange("");
    onToggleCc();
  };

  const handleCloseBcc = () => {
    onBccChange("");
    onToggleBcc();
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
      {/* TO Field - Displayed as read-only chip */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32, width: "100%" }}>
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
        {toEmails ? (
          <Chip
            label={toEmails}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.875rem",
              backgroundColor: "#E5E7EB",
              color: textColor,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: lightGrayText,
              fontSize: "0.875rem",
            }}
          >
            No recipient
          </Typography>
        )}
        {/* Spacer to push buttons to the right */}
        <Box sx={{ flex: 1 }} />
        {/* CC and BCC buttons - shown together on the very right */}
        <Stack direction="row" spacing={1}>
          {!showCc && (
            <Link
              component="button"
              onClick={onToggleCc}
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
              CC
            </Link>
          )}
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
      </Stack>

      {/* CC Field (conditional) */}
      {showCc && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32, width: "100%" }}>
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
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              size="small"
              value={ccEmails}
              onChange={(e) => onCcChange(e.target.value)}
              variant="standard"
              placeholder="Optional"
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              sx={fieldStyle}
            />
          </Box>
          {/* Close button on the very right */}
          <IconButton
            size="small"
            onClick={handleCloseCc}
            sx={{
              padding: 0.5,
              color: lightGrayText,
              "&:hover": {
                color: textColor,
                backgroundColor: "transparent",
              },
            }}
            aria-label="Close CC field"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}

      {/* BCC Field (conditional) */}
      {showBcc && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32, width: "100%" }}>
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
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              size="small"
              value={bccEmails}
              onChange={(e) => onBccChange(e.target.value)}
              variant="standard"
              placeholder="Optional"
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              sx={fieldStyle}
            />
          </Box>
          {/* Close button */}
          <IconButton
            size="small"
            onClick={handleCloseBcc}
            sx={{
              padding: 0.5,
              color: lightGrayText,
              "&:hover": {
                color: textColor,
                backgroundColor: "transparent",
              },
            }}
            aria-label="Close BCC field"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
};
