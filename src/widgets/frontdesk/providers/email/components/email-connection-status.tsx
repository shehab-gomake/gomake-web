import React from "react";
import { Alert, Button, CircularProgress, alpha } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  const { primaryColor, neutralColor } = useGomakeTheme();
  if (status === "connecting") {
    return (
      <Alert
        severity="info"
        icon={<CircularProgress size={20} sx={{ color: primaryColor(500) }} />}
        sx={{
          backgroundColor: alpha(primaryColor(50), 0.8),
          borderColor: primaryColor(200),
          color: primaryColor(800),
        }}
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
              sx={{
                color: 'error.main',
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: alpha('#f44336', 0.1),
                  borderColor: 'error.dark',
                }
              }}
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
            <Button
              size="small"
              onClick={onConnect}
              sx={{
                color: primaryColor(600),
                borderColor: primaryColor(300),
                backgroundColor: alpha(primaryColor(50), 0.5),
                '&:hover': {
                  backgroundColor: alpha(primaryColor(100), 0.8),
                  borderColor: primaryColor(400),
                }
              }}
            >
              Connect Account
            </Button>
          )
        }
        sx={{
          backgroundColor: alpha('#ff9800', 0.1),
          borderColor: '#ff9800',
          color: '#e65100',
        }}
      >
        No email accounts connected
      </Alert>
    );
  }

  return null;
};