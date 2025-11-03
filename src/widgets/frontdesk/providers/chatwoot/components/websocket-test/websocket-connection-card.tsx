/**
 * WebSocket Connection Card Component
 *
 * Displays connection status and controls for Chatwoot WebSocket testing.
 */

import React from 'react';
import { Box, Button, Typography, Card, CardContent, Chip, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import { ChatwootWebSocketState } from '@/store/frontdesk/atoms/chatwoot.atoms';

interface WebSocketConnectionCardProps {
  connectionState: ChatwootWebSocketState;
  error: string | null;
  accountId: number | null;
  userId: number | undefined;
  accountName?: string;
  userName?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onReconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const WebSocketConnectionCard: React.FC<WebSocketConnectionCardProps> = ({
  connectionState,
  error,
  accountId,
  userId,
  accountName,
  userName,
  onConnect,
  onDisconnect,
  onReconnect,
  isConnected,
  isConnecting,
}) => {
  const theme = useTheme();

  // Connection status configuration
  const getStatusConfig = () => {
    switch (connectionState) {
      case ChatwootWebSocketState.CONNECTED:
        return {
          icon: <CheckCircleIcon />,
          label: 'Connected',
          color: '#10b981',
          bgColor: '#d1fae5',
        };
      case ChatwootWebSocketState.CONNECTING:
        return {
          icon: <HourglassEmptyIcon />,
          label: 'Connecting...',
          color: '#f59e0b',
          bgColor: '#fef3c7',
        };
      case ChatwootWebSocketState.ERROR:
        return {
          icon: <ErrorIcon />,
          label: 'Error',
          color: '#ef4444',
          bgColor: '#fee2e2',
        };
      case ChatwootWebSocketState.DISCONNECTED:
      default:
        return {
          icon: <CancelIcon />,
          label: 'Disconnected',
          color: '#6b7280',
          bgColor: '#f3f4f6',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        {/* Header */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: colorTokens.neutral[900],
          }}
        >
          Connection
        </Typography>

        <Divider />

        {/* Status Indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            borderRadius: 1.5,
            backgroundColor: statusConfig.bgColor,
          }}
        >
          <Box sx={{ color: statusConfig.color, display: 'flex' }}>
            {statusConfig.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: statusConfig.color,
              }}
            >
              {statusConfig.label}
            </Typography>
            {error && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: colorTokens.neutral[600],
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Connection Info */}
        <Stack spacing={1.5}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: colorTokens.neutral[600],
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Account
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {accountId ? (
                <Chip
                  label={accountName || `Account #${accountId}`}
                  size="small"
                  sx={{
                    fontSize: '0.813rem',
                    height: 24,
                    backgroundColor: colorTokens.neutral[100],
                    color: colorTokens.neutral[700],
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.813rem',
                    color: colorTokens.neutral[400],
                    fontStyle: 'italic',
                  }}
                >
                  No account selected
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: colorTokens.neutral[600],
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              User
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {userId ? (
                <Chip
                  label={userName || `User #${userId}`}
                  size="small"
                  sx={{
                    fontSize: '0.813rem',
                    height: 24,
                    backgroundColor: colorTokens.neutral[100],
                    color: colorTokens.neutral[700],
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.813rem',
                    color: colorTokens.neutral[400],
                    fontStyle: 'italic',
                  }}
                >
                  No user
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Stack spacing={1}>
            {!isConnected && !isConnecting && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onConnect}
                disabled={!accountId || !userId}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Connect
              </Button>
            )}

            {isConnecting && (
              <Button
                variant="outlined"
                fullWidth
                disabled
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Connecting...
              </Button>
            )}

            {isConnected && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={onDisconnect}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Disconnect
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={onReconnect}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Reconnect
                </Button>
              </>
            )}
          </Stack>

          {!accountId && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: colorTokens.neutral[500],
                display: 'block',
                mt: 1,
                textAlign: 'center',
              }}
            >
              Please select an account to connect
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
