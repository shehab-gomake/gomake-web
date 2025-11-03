/**
 * WebSocket Stats Card Component
 *
 * Displays real-time statistics for Chatwoot WebSocket connection.
 */

import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { ChatwootWebSocketStats } from '@/store/frontdesk/atoms/chatwoot.atoms';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface WebSocketStatsCardProps {
  stats: ChatwootWebSocketStats;
  isConnected: boolean;
  onResetStats: () => void;
}

export const WebSocketStatsCard: React.FC<WebSocketStatsCardProps> = ({
  stats,
  isConnected,
  onResetStats,
}) => {
  const theme = useTheme();

  // Format uptime
  const formatUptime = (ms: number | null): string => {
    if (ms === null) return 'N/A';

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Format last event time
  const formatLastEventTime = (timestamp: number | null): string => {
    if (timestamp === null) return 'Never';

    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  // Calculate events per second
  const getEventsPerSecond = (): string => {
    if (!isConnected || stats.uptime === null || stats.uptime === 0) {
      return '0.0';
    }

    const seconds = stats.uptime / 1000;
    const rate = stats.eventsReceived / seconds;
    return rate.toFixed(1);
  };

  // Stat item component
  const StatItem = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        backgroundColor: colorTokens.neutral[50],
        border: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color, display: 'flex' }}>{icon}</Box>
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
          {label}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: '1.5rem',
          color: colorTokens.neutral[900],
        }}
      >
        {value}
      </Typography>
    </Box>
  );

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: colorTokens.neutral[900],
            }}
          >
            Statistics
          </Typography>

          <Button
            size="small"
            onClick={onResetStats}
            startIcon={<RestartAltIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              minWidth: 'auto',
            }}
          >
            Reset
          </Button>
        </Box>

        <Divider />

        {/* Stats Grid */}
        <Stack spacing={1.5}>
          <StatItem
            icon={<TrendingUpIcon fontSize="small" />}
            label="Events Received"
            value={stats.eventsReceived.toLocaleString()}
            color="#3b82f6"
          />

          <StatItem
            icon={<AccessTimeIcon fontSize="small" />}
            label="Uptime"
            value={formatUptime(stats.uptime)}
            color="#10b981"
          />

          <StatItem
            icon={<TrendingUpIcon fontSize="small" />}
            label="Events/Second"
            value={getEventsPerSecond()}
            color="#f59e0b"
          />

          <StatItem
            icon={<ScheduleIcon fontSize="small" />}
            label="Last Event"
            value={formatLastEventTime(stats.lastEventAt)}
            color="#8b5cf6"
          />

          <StatItem
            icon={<RestartAltIcon fontSize="small" />}
            label="Reconnections"
            value={stats.reconnectionAttempts}
            color={stats.reconnectionAttempts > 0 ? '#ef4444' : '#6b7280'}
          />
        </Stack>

        {/* Connection Quality Indicator */}
        {isConnected && (
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: `1px solid ${colorTokens.neutral[200]}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
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
                Connection Quality
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: stats.reconnectionAttempts === 0 ? '#10b981' : '#f59e0b',
                  fontWeight: 600,
                }}
              >
                {stats.reconnectionAttempts === 0 ? 'Excellent' : 'Fair'}
              </Typography>
            </Box>

            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colorTokens.neutral[200],
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: stats.reconnectionAttempts === 0 ? '100%' : '60%',
                  backgroundColor: stats.reconnectionAttempts === 0 ? '#10b981' : '#f59e0b',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>

            {stats.reconnectionAttempts > 0 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.688rem',
                  color: colorTokens.neutral[500],
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Connection has experienced {stats.reconnectionAttempts} reconnection{stats.reconnectionAttempts !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        )}

        {!isConnected && (
          <Box
            sx={{
              mt: 'auto',
              p: 2,
              borderRadius: 1.5,
              backgroundColor: colorTokens.neutral[100],
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: colorTokens.neutral[600],
              }}
            >
              Connect to view live statistics
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
