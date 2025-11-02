/**
 * Error Boundary Component
 *
 * React error boundary to catch and display errors gracefully.
 * Prevents entire app crashes when component errors occur.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';

interface ErrorBoundaryProps {
  /** Child components to protect */
  children: ReactNode;

  /** Optional custom fallback UI */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode);

  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /** Optional context name for logging */
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default error fallback UI
 */
const DefaultErrorFallback: React.FC<{
  error: Error;
  errorInfo: ErrorInfo;
  context?: string;
  onReset: () => void;
}> = ({ error, errorInfo, context, onReset }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      p: 3,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        maxWidth: 600,
        p: 4,
        textAlign: 'center',
        border: `1px solid ${colorTokens.neutral[200]}`,
        borderRadius: 2,
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: colorTokens.error[500],
          mb: 2,
        }}
      />
      <Typography variant="h6" sx={{ mb: 1, color: colorTokens.neutral[900] }}>
        Something went wrong
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, color: colorTokens.neutral[600] }}
      >
        {context
          ? `An error occurred in ${context}. Please try again or contact support if the problem persists.`
          : 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
      </Typography>

      {/* Show error details in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: 1,
            textAlign: 'left',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: colorTokens.error[700],
              display: 'block',
              mb: 1,
            }}
          >
            {error.toString()}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: colorTokens.neutral[600],
              display: 'block',
              whiteSpace: 'pre-wrap',
              fontSize: '0.7rem',
            }}
          >
            {errorInfo.componentStack}
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onReset}
        sx={{
          textTransform: 'none',
        }}
      >
        Try Again
      </Button>
    </Paper>
  </Box>
);

/**
 * Error Boundary Component
 *
 * Wraps components to catch and handle errors gracefully.
 * Displays a fallback UI when errors occur.
 *
 * @example
 * ```tsx
 * <ErrorBoundary context="Dashboard">
 *   <DashboardView />
 * </ErrorBoundary>
 * ```
 *
 * @example With custom fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, errorInfo, reset) => (
 *     <CustomErrorUI error={error} onRetry={reset} />
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', {
        context: this.props.context,
        error,
        errorInfo,
      });
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // In production, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, context } = this.props;

    if (hasError && error && errorInfo) {
      // Render custom fallback if provided
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo, this.resetError);
        }
        return fallback;
      }

      // Render default fallback
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          context={context}
          onReset={this.resetError}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
