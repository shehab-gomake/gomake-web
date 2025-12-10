/**
 * WebSocket Stats Card Component
 *
 * Displays real-time statistics for Chatwoot WebSocket connection.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = useTheme();

  // Format uptime
  const formatUptime = (ms: number | null): string => {
    if (ms === null) return t("frontdesk.settings.webhookTestStatsNA");

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
    if (timestamp === null) return t("frontdesk.settings.webhookTestStatsNever");

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
        direction: dir,
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: dir }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: colorTokens.neutral[900],
            }}
          >
            {t("frontdesk.settings.webhookTestStatsTitle")}
          </Typography>

          <Button
            size="small"
            onClick={onResetStats}
            startIcon={<RestartAltIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              minWidth: 'auto',
              direction: dir,
            }}
          >
            {t("frontdesk.settings.webhookTestStatsReset")}
          </Button>
        </Box>

        <Divider />

        {/* Stats Grid */}
        <Stack sx={{ gap: 1.5, direction: dir }}>
          <StatItem
            icon={<TrendingUpIcon fontSize="small" />}
            label={t("frontdesk.settings.webhookTestStatsEventsReceived")}
            value={stats.eventsReceived.toLocaleString()}
            color="#3b82f6"
          />

          <StatItem
            icon={<AccessTimeIcon fontSize="small" />}
            label={t("frontdesk.settings.webhookTestStatsUptime")}
            value={formatUptime(stats.uptime)}
            color="#10b981"
          />

          <StatItem
            icon={<TrendingUpIcon fontSize="small" />}
            label={t("frontdesk.settings.webhookTestStatsEventsPerSecond")}
            value={getEventsPerSecond()}
            color="#f59e0b"
          />

          <StatItem
            icon={<ScheduleIcon fontSize="small" />}
            label={t("frontdesk.settings.webhookTestStatsLastEvent")}
            value={formatLastEventTime(stats.lastEventAt)}
            color="#8b5cf6"
          />

          <StatItem
            icon={<RestartAltIcon fontSize="small" />}
            label={t("frontdesk.settings.webhookTestStatsReconnections")}
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
              direction: dir,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, direction: dir }}>
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
                {t("frontdesk.settings.webhookTestStatsConnectionQuality")}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: stats.reconnectionAttempts === 0 ? '#10b981' : '#f59e0b',
                  fontWeight: 600,
                }}
              >
                {stats.reconnectionAttempts === 0 ? t("frontdesk.settings.webhookTestStatsExcellent") : t("frontdesk.settings.webhookTestStatsFair")}
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
                {stats.reconnectionAttempts === 1 
                  ? t("frontdesk.settings.webhookTestStatsReconnectionMessage", { count: stats.reconnectionAttempts })
                  : t("frontdesk.settings.webhookTestStatsReconnectionMessagePlural", { count: stats.reconnectionAttempts })}
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
              direction: dir,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: colorTokens.neutral[600],
              }}
            >
              {t("frontdesk.settings.webhookTestStatsConnectToView")}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
