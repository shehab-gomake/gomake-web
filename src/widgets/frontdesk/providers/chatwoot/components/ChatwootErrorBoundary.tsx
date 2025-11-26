/**
 * Chatwoot Error Boundary
 *
 * Catches and handles errors in the Chatwoot provider and its children.
 * Provides user-friendly error messages and recovery options.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { colorTokens } from "@/widgets/frontdesk/design-system";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ChatwootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    const contextMsg = this.props.context ? `[${this.props.context}]` : "";
    console.error(`[ChatwootErrorBoundary]${contextMsg} Caught error:`, error);
    console.error(`[ChatwootErrorBoundary]${contextMsg} Error info:`, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to monitoring service (Sentry, etc.)
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo, context: this.props.context } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 600,
              p: 4,
              textAlign: "center",
              border: `1px solid ${colorTokens.semantic.border.default}`,
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 64,
                color: colorTokens.error[500],
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: colorTokens.semantic.text.primary,
              }}
            >
              Something went wrong
              {this.props.context && (
                <Typography component="span" sx={{ fontWeight: 400, ml: 1, fontSize: "0.8em" }}>
                  in {this.props.context}
                </Typography>
              )}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colorTokens.semantic.text.secondary,
                mb: 3,
              }}
            >
              We encountered an unexpected error while loading Chatwoot.
              {this.state.error && (
                <>
                  <br />
                  <strong>Error:</strong> {this.state.error.message}
                </>
              )}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={this.handleReset} sx={{ textTransform: "none" }}>
                Try Again
              </Button>

              <Button variant="contained" onClick={this.handleReload} sx={{ textTransform: "none" }}>
                Reload Page
              </Button>
            </Box>

            {/* Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: colorTokens.neutral[50],
                  borderRadius: 1,
                  textAlign: "left",
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
