import React from "react";
import { Alert, Button, CircularProgress } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface EmailConnectionStatusProps {
  status: "connected" | "connecting" | "error" | "disconnected";
  error?: string;
  accountCount?: number;
  onRetry?: () => void;
  onConnect?: () => void;
}

export const EmailConnectionStatus: React.FC<EmailConnectionStatusProps> = ({
  status,
  error,
  accountCount = 0,
  onRetry,
  onConnect,
}) => {
  if (status === "connecting") {
    return (
      <Alert
        severity="info"
        icon={<CircularProgress size={20} />}
      >
        Connecting to email service...
      </Alert>
    );
  }

  if (status === "error") {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        {error || "Failed to connect to email service"}
      </Alert>
    );
  }

  if (status === "disconnected" || accountCount === 0) {
    return (
      <Alert
        severity="warning"
        action={
          onConnect && (
            <Button size="small" onClick={onConnect}>
              Connect Account
            </Button>
          )
        }
      >
        No email accounts connected
      </Alert>
    );
  }

  return null;
};