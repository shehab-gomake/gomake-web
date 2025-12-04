import React from "react";
import { Box, Typography, Button, Stack, Alert, useTheme, alpha } from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;

  /**
   * Error message or description
   */
  message?: string;

  /**
   * Error object (for technical details)
   */
  error?: Error | string;

  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;

  /**
   * Callback when go home button is clicked
   */
  onGoHome?: () => void;

  /**
   * Show technical error details
   * @default false (only in development)
   */
  showDetails?: boolean;

  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
}

/**
 * Error state component for displaying errors in Chatwoot provider
 *
 * Provides user-friendly error messages with options to retry or navigate away.
 * In development mode, shows technical error details.
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorState
 *     title="Failed to load conversations"
 *     message="We couldn't load your conversations. Please try again."
 *     error={error}
 *     onRetry={handleRetry}
 *     onGoHome={() => router.push('/frontdesk')}
 *   />
 * )}
 * ```
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again or contact support if the problem persists.",
  error,
  onRetry,
  onGoHome,
  showDetails = process.env.NODE_ENV === "development",
  icon,
}) => {
  const theme = useTheme();
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 4,
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette.error.main, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        {icon || (
          <ErrorOutlineIcon
            sx={{
              fontSize: 56,
              color: alpha(theme.palette.error.main, 0.6),
            }}
          />
        )}
      </Box>

      {/* Text Content */}
      <Stack spacing={1} sx={{ mb: 3, maxWidth: 500 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colorTokens.neutral[900],
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </Stack>

      {/* Technical Error Details (Dev only) */}
      {showDetails && errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            maxWidth: 600,
            textAlign: "left",
          }}
        >
          <Typography variant="caption" component="div" sx={{ fontFamily: "monospace" }}>
            <strong>Error Details:</strong>
            <br />
            {errorMessage}
          </Typography>
          {error instanceof Error && error.stack && (
            <Typography
              variant="caption"
              component="pre"
              sx={{
                mt: 1,
                fontSize: "0.7rem",
                maxHeight: 200,
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {error.stack}
            </Typography>
          )}
        </Alert>
      )}

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Try Again
          </Button>
        )}

        {onGoHome && (
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={onGoHome}
            sx={{
              borderColor: colorTokens.neutral[300],
              color: colorTokens.neutral[700],
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Go Home
          </Button>
        )}
      </Stack>

      {/* Help Text */}
      <Typography
        variant="caption"
        sx={{
          mt: 4,
          color: colorTokens.neutral[500],
        }}
      >
        If this problem continues, please contact support
      </Typography>
    </Box>
  );
};

/**
 * Network error state variant
 */
export const NetworkErrorState: React.FC<Pick<ErrorStateProps, "onRetry" | "onGoHome">> = ({
  onRetry,
  onGoHome,
}) => {
  return (
    <ErrorState
      title="Connection Error"
      message="We couldn't connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
};

/**
 * Permission error state variant
 */
export const PermissionErrorState: React.FC<Pick<ErrorStateProps, "onGoHome">> = ({ onGoHome }) => {
  return (
    <ErrorState
      title="Access Denied"
      message="You don't have permission to view this content. Please contact your administrator."
      onGoHome={onGoHome}
    />
  );
};

/**
 * Not found error state variant
 */
export const NotFoundErrorState: React.FC<Pick<ErrorStateProps, "onGoHome">> = ({ onGoHome }) => {
  return (
    <ErrorState
      title="Not Found"
      message="The content you're looking for doesn't exist or has been removed."
      onGoHome={onGoHome}
    />
  );
};
