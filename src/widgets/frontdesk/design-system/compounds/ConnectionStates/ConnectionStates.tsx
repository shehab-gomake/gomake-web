import React from 'react';
import { Stack, Alert, Button } from '@mui/material';
import { Refresh as RefreshIcon, Chat as ChatIcon } from '@mui/icons-material';
import { Panel, PanelContent } from '../Panel';
import { EmptyState } from '../EmptyState';

export interface ConnectionErrorStateProps {
  /**
   * Error message to display
   */
  error: string;

  /**
   * Callback when retry button is clicked
   */
  onRetry: () => void;

  /**
   * Whether a retry operation is in progress
   */
  isLoading?: boolean;

  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;

  /**
   * Custom title
   * @default "Connection Failed"
   */
  title?: string;

  /**
   * Custom description
   * @default "Unable to connect to the service. Please check your connection and try again."
   */
  description?: string;
}

/**
 * ConnectionErrorState
 *
 * Full-page error state for connection failures with retry functionality.
 *
 * @example
 * ```tsx
 * <ConnectionErrorState
 *   error="Network timeout"
 *   onRetry={handleRetry}
 *   isLoading={isRetrying}
 * />
 * ```
 */
export const ConnectionErrorState: React.FC<ConnectionErrorStateProps> = ({
  error,
  onRetry,
  isLoading = false,
  icon,
  title = 'Connection Failed',
  description = 'Unable to connect to the service. Please check your connection and try again.',
}) => {
  return (
    <Stack sx={{ width: '100%', gap: 2, height: '100%' }}>
      <Alert
        severity="error"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              disabled={isLoading}
            >
              Retry
            </Button>
          </Stack>
        }
      >
        Failed to connect to service: {error}
      </Alert>

      <Panel
        elevation={0}
        border="default"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
        }}
      >
        <PanelContent padding="lg">
          <EmptyState
            icon={icon || <ChatIcon sx={{ fontSize: 64 }} />}
            title={title}
            description={description}
            action={{
              label: 'Retry Connection',
              onClick: onRetry,
            }}
          />
        </PanelContent>
      </Panel>
    </Stack>
  );
};

export interface ConnectingStateProps {
  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;

  /**
   * Custom title
   * @default "Connecting..."
   */
  title?: string;

  /**
   * Custom description
   * @default "Establishing connection to service"
   */
  description?: string;

  /**
   * Optional message to show in alert banner
   * @default "Connecting to service..."
   */
  alertMessage?: string;
}

/**
 * ConnectingState
 *
 * Full-page loading state for establishing connections.
 *
 * @example
 * ```tsx
 * <ConnectingState
 *   title="Connecting to Direct Messages"
 *   description="Please wait while we establish a secure connection"
 * />
 * ```
 */
export const ConnectingState: React.FC<ConnectingStateProps> = ({
  icon,
  title = 'Connecting...',
  description = 'Establishing connection to service',
  alertMessage = 'Connecting to service...',
}) => {
  return (
    <Stack sx={{ width: '100%', gap: 2, height: '100%' }}>
      <Alert severity="info">{alertMessage}</Alert>

      <Panel
        elevation={0}
        border="default"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
        }}
      >
        <PanelContent padding="lg">
          <EmptyState
            icon={icon || <ChatIcon sx={{ fontSize: 64 }} />}
            title={title}
            description={description}
          />
        </PanelContent>
      </Panel>
    </Stack>
  );
};