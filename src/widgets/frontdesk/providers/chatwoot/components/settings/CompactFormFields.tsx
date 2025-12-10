/**
 * Compact Form Fields - Unified Form Components
 *
 * Provides consistent form field styling across all Chatwoot settings.
 * Includes labels, text fields, selects, and buttons.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Switch,
  FormControlLabel,
  TextFieldProps,
  ButtonProps,
  SwitchProps,
} from "@mui/material";

// Compact Form Label
interface CompactLabelProps {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}

export const CompactLabel: React.FC<CompactLabelProps> = ({
  children,
  required,
  optional,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  return (
    <Typography
      sx={{
        mb: 0.75,
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#4b5563",
        textTransform: "uppercase",
        letterSpacing: "0.025em",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        direction: dir,
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>*</span>
      )}
      {optional && (
        <span
          style={{
            fontSize: "0.688rem",
            color: "#9ca3af",
            fontWeight: 400,
            textTransform: "none",
          }}
        >
          ({t("frontdesk.teams.optional")})
        </span>
      )}
    </Typography>
  );
};

// Compact Text Field
interface CompactTextFieldProps extends Omit<TextFieldProps, "size"> {
  label?: string;
  required?: boolean;
  optional?: boolean;
}

export const CompactTextField: React.FC<CompactTextFieldProps> = ({
  label,
  required,
  optional,
  ...props
}) => (
  <Box>
    {label && (
      <CompactLabel required={required} optional={optional}>
        {label}
      </CompactLabel>
    )}
    <TextField
      {...props}
      size="small"
      fullWidth
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "0.813rem",
          py: 0.875,
        },
        ...props.sx,
      }}
    />
  </Box>
);

// Compact Form Section
interface CompactFormSectionProps {
  children: React.ReactNode;
  spacing?: number;
}

export const CompactFormSection: React.FC<CompactFormSectionProps> = ({
  children,
  spacing = 2,
}) => <Stack sx={{ gap: spacing }}>{children}</Stack>;

// Compact Primary Button
interface CompactButtonProps extends ButtonProps {
  loading?: boolean;
}

export const CompactPrimaryButton: React.FC<CompactButtonProps> = ({
  loading,
  children,
  disabled,
  ...props
}) => (
  <Button
    {...props}
    variant="contained"
    size="small"
    disabled={disabled || loading}
    startIcon={
      loading ? <CircularProgress size={14} color="inherit" /> : props.startIcon
    }
    sx={{
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.813rem",
      px: 2.5,
      py: 0.625,
      minWidth: 100,
      backgroundColor: "#6366f1",
      "&:hover": {
        backgroundColor: "#4f46e5",
      },
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      "&:disabled": {
        bgcolor: "#d1d5db",
        color: "#9ca3af",
      },
      ...props.sx,
    }}
  >
    {children}
  </Button>
);

// Compact Secondary Button
export const CompactSecondaryButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => (
  <Button
    {...props}
    variant="outlined"
    size="small"
    sx={{
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.813rem",
      px: 2,
      py: 0.625,
      borderColor: "rgba(0,0,0,0.12)",
      color: "#6b7280",
      "&:hover": {
        borderColor: "rgba(0,0,0,0.24)",
        bgcolor: "rgba(0,0,0,0.02)",
      },
      ...props.sx,
    }}
  >
    {children}
  </Button>
);

// Compact Switch - Pixel Perfect
interface CompactSwitchProps extends Omit<SwitchProps, "size"> {
  label?: string;
  description?: string;
}

export const CompactSwitch: React.FC<CompactSwitchProps> = ({
  label,
  description,
  ...props
}) => {
  const switchComponent = (
    <Switch
      {...props}
      sx={{
        width: 44,
        height: 24,
        padding: 0,
        margin: 0,
        "& .MuiSwitch-switchBase": {
          padding: 0,
          margin: "3px",
          transitionDuration: "200ms",
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#ffffff",
            "& + .MuiSwitch-track": {
              backgroundColor: "#6366f1",
              opacity: 1,
              border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.5,
            },
          },
          "&.Mui-disabled .MuiSwitch-thumb": {
            color: "#f3f4f6",
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.4,
          },
        },
        "& .MuiSwitch-thumb": {
          boxSizing: "border-box",
          width: 18,
          height: 18,
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)",
        },
        "& .MuiSwitch-track": {
          borderRadius: 12,
          backgroundColor: "#e5e7eb",
          opacity: 1,
          border: "1px solid rgba(0,0,0,0.04)",
          transition: "background-color 200ms ease-in-out",
        },
        ...props.sx,
      }}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography
              sx={{
                fontSize: "0.813rem",
                fontWeight: 500,
                color: "#1f2937",
                lineHeight: 1.4,
              }}
            >
              {label}
            </Typography>
            {description && (
              <Typography
                sx={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.4 }}
              >
                {description}
              </Typography>
            )}
          </Box>
        }
        sx={{
          ml: 0,
          mr: 0,
          alignItems: "flex-start",
          gap: "10px",
        }}
      />
    );
  }

  return switchComponent;
};

// Compact Modal Actions
interface CompactModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
}

export const CompactModalActions: React.FC<CompactModalActionsProps> = ({
  onCancel,
  onSubmit,
  submitLabel,
  cancelLabel,
  isSubmitting = false,
  submitDisabled = false,
  cancelDisabled = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  const defaultSubmitLabel = submitLabel || t("frontdesk.common.saveChanges");
  const defaultCancelLabel = cancelLabel || t("frontdesk.common.cancel");

  return (
    <Stack
      direction="row"
      sx={{ gap: 1, direction: dir, justifyContent: "flex-end" }}
    >
      <CompactSecondaryButton
        onClick={onCancel}
        disabled={cancelDisabled || isSubmitting}
      >
        {defaultCancelLabel}
      </CompactSecondaryButton>
      <CompactPrimaryButton
        onClick={onSubmit}
        loading={isSubmitting}
        disabled={submitDisabled}
      >
        {isSubmitting ? t("frontdesk.common.saving") : defaultSubmitLabel}
      </CompactPrimaryButton>
    </Stack>
  );
};
