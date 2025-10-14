import React from 'react';
import { Alert, Stack, Typography, Button, Box, Fade } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface ConnectionStatusBannerProps {
  /**
   * Current connection status
   */
  status: ConnectionStatus;

  /**
   * Whether to show the banner (can be controlled externally)
   */
  show: boolean;

  /**
   * Optional error message to display
   */
  error?: string | null;

  /**
   * Current user name to display on successful connection
   */
  userName?: string | null;

  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;

  /**
   * Whether a retry/connect operation is in progress
   */
  isLoading?: boolean;

  /**
   * Custom position styling
   * @default 'absolute'
   */
  position?: 'absolute' | 'relative' | 'fixed';

  /**
   * Z-index for the banner
   * @default 1200
   */
  zIndex?: number;
}

/**
 * ConnectionStatusBanner
 *
 * Displays real-time connection status with appropriate styling and actions.
 * Supports auto-hide behavior and retry functionality.
 *
 * @example
 * ```tsx
 * <ConnectionStatusBanner
 *   status="connected"
 *   show={showBanner}
 *   userName="John Doe"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export const ConnectionStatusBanner: React.FC<ConnectionStatusBannerProps> = ({
  status,
  show,
  error,
  userName,
  onRetry,
  isLoading = false,
  position = 'absolute',
  zIndex = 1200,
}) => {
  const getSeverity = (status: ConnectionStatus): 'success' | 'info' | 'warning' | 'error' => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
      case 'reconnecting':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected':
        return 'success.main';
      case 'connecting':
      case 'reconnecting':
        return 'info.main';
      case 'disconnected':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'grey.main';
    }
  };

  const getStatusMessage = (status: ConnectionStatus): React.ReactNode => {
    switch (status) {
      case 'connected':
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">
              Connected{userName ? ` as ${userName}` : ''}
            </Typography>
          </Stack>
        );
      case 'connecting':
        return 'Connecting to service...';
      case 'reconnecting':
        return 'Reconnecting...';
      default:
        return `Disconnected from service${error ? `: ${error}` : ''}`;
    }
  };

  const showRetryButton = status !== 'connected' && onRetry;

  return (
    <Fade in={show}>
      <Alert
        severity={getSeverity(status)}
        icon={false}
        sx={{
          borderRadius: 2,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          minWidth: 280,
          position,
          top: position === 'absolute' ? 16 : undefined,
          left: position === 'absolute' ? '50%' : undefined,
          transform: position === 'absolute' ? 'translateX(-50%)' : undefined,
          zIndex,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
        action={
          showRetryButton && (
            <Button
              size="small"
              variant="outlined"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
              disabled={isLoading}
            >
              Retry
            </Button>
          )
        }
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: getStatusColor(status),
              mr: 1,
            }}
          />
          {getStatusMessage(status)}
        </Stack>
      </Alert>
    </Fade>
  );
};