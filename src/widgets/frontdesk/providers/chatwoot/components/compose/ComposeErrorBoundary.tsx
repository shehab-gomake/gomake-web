/**
 * Compose Error Boundary
 *
 * Error boundary wrapper for compose conversation modal.
 * Catches errors and provides a fallback UI with retry option.
 */

import React, { Component, ReactNode } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ComposeErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback component */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ComposeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Compose Modal
 * Catches React errors and displays fallback UI
 */
export class ComposeErrorBoundary extends Component<ComposeErrorBoundaryProps, ComposeErrorBoundaryState> {
  constructor(props: ComposeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ComposeErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Compose Modal Error:", error, errorInfo);
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            p: 4,
            textAlign: "center",
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            An error occurred while composing the conversation. Please try again or contact support if the problem
            persists.
          </Typography>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: 500, textAlign: "left" }}>
              <Typography variant="caption" component="pre" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                {this.state.error.message}
              </Typography>
            </Alert>
          )}

          <Button variant="contained" startIcon={<RefreshIcon />} onClick={this.handleReset} sx={{ minWidth: 120 }}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
