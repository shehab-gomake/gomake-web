/**
 * Compact Modal - Unified Modal Component
 * 
 * Provides consistent modal styling across all Chatwoot settings.
 * High-density, compact design with muted colors and purple accents.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CompactModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  error?: string | null;
  isLoading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
}

export const CompactModal: React.FC<CompactModalProps> = ({
  open,
  onClose,
  title,
  icon,
  children,
  actions,
  error,
  isLoading = false,
  maxWidth = "sm",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const handleClose = () => {
    if (!disabled) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          direction: dir,
        },
      }}
    >
      {/* Compact Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.5,
          pt: 2,
          px: 2.5,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          direction: dir,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, direction: dir }}>
          {icon && (
            <Box sx={{ display: "flex", alignItems: "center", color: "#6366f1" }}>
              {React.cloneElement(icon as React.ReactElement, { 
                sx: { fontSize: 18 } 
              })}
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", color: "#1f2937" }}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={disabled}
          sx={{
            color: "#6b7280",
            p: 0.5,
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.04)",
              color: "#1f2937",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Compact Content */}
      <DialogContent sx={{ pt: 2.5, px: 2.5, pb: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "6px",
              fontSize: "0.813rem",
              py: 0.75,
            }}
          >
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress size={32} sx={{ color: "#6366f1" }} />
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      {/* Compact Actions */}
      {actions && (
        <DialogActions
          sx={{
            px: 2.5,
            pb: 2,
            pt: 1.5,
            gap: 1,
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

