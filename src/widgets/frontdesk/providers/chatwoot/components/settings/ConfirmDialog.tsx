/**
 * ConfirmDialog Component
 *
 * Enhanced confirmation dialog with optional name verification.
 * Used for destructive actions like delete inbox, delete team, etc.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  requireValueLabel,
  confirmText,
  confirmColor = "error",
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  // Use translations for default values
  const finalRequireValueLabel = requireValueLabel || t("frontdesk.common.typeToConfirm");
  const finalConfirmText = confirmText || t("frontdesk.common.confirm");

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
          direction: dir,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
          direction: dir,
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
        <Typography variant="h6" component="span" sx={{ fontWeight: 600, direction: dir }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ direction: dir }}>
        <Typography
          variant="body2"
          sx={{
            mb: requireValue ? 2 : 0,
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            direction: dir,
          }}
        >
          {message}
        </Typography>

        {requireValue && (
          <Box sx={{ direction: dir }}>
            <Alert severity="warning" sx={{ mb: 2, direction: dir }}>
              {t("frontdesk.common.confirmDialogCannotUndo")}{" "}
              <Typography
                component="strong"
                sx={{ fontWeight: 700, fontFamily: "monospace" }}
              >
                {requireValue}
              </Typography>{" "}
              {t("frontdesk.common.confirmDialogToConfirm")}
            </Alert>

            <TextField
              fullWidth
              size="small"
              label={finalRequireValueLabel}
              value={inputValue}
              onChange={handleInputChange}
              error={error}
              helperText={
                error
                  ? `${t("frontdesk.common.confirmDialogMustMatch")} ${requireValue}`
                  : t("frontdesk.common.confirmDialogTypeToEnable", { value: requireValue })
              }
              disabled={isLoading}
              autoFocus
              sx={{
                direction: dir,
                "& input": {
                  fontFamily: "monospace",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, direction: dir }}>
        <Button onClick={onClose} disabled={isLoading} color="inherit" sx={{ direction: dir }}>
          {t("frontdesk.common.cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          disabled={isConfirmDisabled}
          sx={{
            minWidth: 100,
            direction: dir,
          }}
        >
          {isLoading ? t("frontdesk.common.processing") : finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
