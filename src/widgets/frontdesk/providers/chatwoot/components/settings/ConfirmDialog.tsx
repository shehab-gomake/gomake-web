/**
 * ConfirmDialog Component
 *
 * Enhanced confirmation dialog with optional name verification.
 * Used for destructive actions like delete inbox, delete team, etc.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface ConfirmDialogProps {
  /** Dialog open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title: string;
  /** Confirmation message */
  message: string;
  /** Require typing a specific value to confirm (e.g., resource name) */
  requireValue?: string;
  /** Label for the verification input */
  requireValueLabel?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Confirm button color */
  confirmColor?: "error" | "warning" | "primary";
  /** Loading state */
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  requireValue,
  requireValueLabel = "Type to confirm",
  confirmText = "Confirm",
  confirmColor = "error",
  isLoading = false,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setInputValue("");
      setError(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    // If value verification is required, check it matches
    if (requireValue && inputValue !== requireValue) {
      setError(true);
      return;
    }

    await onConfirm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(false);
  };

  const isConfirmDisabled =
    isLoading || (requireValue && inputValue !== requireValue);

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
        }}
      >
        <WarningIcon
          sx={{
            color:
              confirmColor === "error"
                ? theme.palette.error.main
                : theme.palette.warning.main,
            fontSize: 28,
          }}
        />
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body2"
          sx={{
            mb: requireValue ? 2 : 0,
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>

        {requireValue && (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. Please type{" "}
              <Typography
                component="strong"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {requireValue}
              </Typography>{" "}
              to confirm.
            </Alert>

            <TextField
              fullWidth
              size="small"
              label={requireValueLabel}
              value={inputValue}
              onChange={handleInputChange}
              error={error}
              helperText={
                error
                  ? `Must match exactly: ${requireValue}`
                  : `Type "${requireValue}" to enable confirmation`
              }
              disabled={isLoading}
              autoFocus
              sx={{
                "& input": {
                  fontFamily: "monospace",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          disabled={isConfirmDisabled}
          sx={{
            minWidth: 100,
          }}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
