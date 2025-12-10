/**
 * Chatwoot WebSocket Test View
 *
 * Testing interface for Chatwoot WebSocket connections.
 * Provides real-time event monitoring, connection controls, and statistics.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootWebSocketTest } from '../hooks/use-chatwoot-websocket-test';
import { WebSocketConnectionCard } from '../components/websocket-test/websocket-connection-card';
import { WebSocketEventsLog } from '../components/websocket-test/websocket-events-log';
import { WebSocketStatsCard } from '../components/websocket-test/websocket-stats-card';

export const WebhookTestView: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = useTheme();

  // WebSocket testing hook
  const {
    connectionState,
    events,
    error,
    stats,
    profile,
    selectedAccountId,
    connect,
    disconnect,
    reconnect,
    clearEvents,
    resetStats,
    exportEventsAsJSON,
    exportEventsAsCSV,
    isConnected,
    isConnecting,
  } = useChatwootWebSocketTest();

  // Get account name
  const getAccountName = () => {
    if (!profile || !selectedAccountId) return undefined;
    const account = profile.accounts?.find(acc => acc.id === selectedAccountId);
    return account?.name;
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorTokens.neutral[50],
        overflow: 'hidden',
        direction: dir,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          direction: dir,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: colorTokens.neutral[900],
          }}
        >
          {t("frontdesk.settings.webhookTestTitle")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: '0.875rem',
          }}
        >
          {t("frontdesk.settings.webhookTestDescription")}
        </Typography>
      </Box>

      {/* Info Alert */}
      {!profile && (
        <Box sx={{ px: 3, pt: 2, direction: dir }}>
          <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
            {t("frontdesk.settings.webhookTestLoadingProfile")}
          </Alert>
        </Box>
      )}

      {profile && !selectedAccountId && (
        <Box sx={{ px: 3, pt: 2, direction: dir }}>
          <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
            {t("frontdesk.settings.webhookTestSelectAccount")}
          </Alert>
        </Box>
      )}

      {!profile?.pubsub_token && profile && (
        <Box sx={{ px: 3, pt: 2, direction: dir }}>
          <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
            {t("frontdesk.settings.webhookTestMissingToken")}
          </Alert>
        </Box>
      )}

      {/* Main Content Area - Three Column Layout */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: dir === "rtl" ? '320px 1fr 300px' : '300px 1fr 320px',
          gap: 2,
          p: 3,
          overflow: 'hidden',
          minHeight: 0,
          direction: dir,
        }}
      >
        {/* Left Column - Connection Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <WebSocketConnectionCard
            connectionState={connectionState}
            error={error}
            accountId={selectedAccountId}
            userId={profile?.id}
            accountName={getAccountName()}
            userName={profile?.name || profile?.email}
            onConnect={connect}
            onDisconnect={disconnect}
            onReconnect={reconnect}
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </Box>

        {/* Middle Column - Event Log */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <WebSocketEventsLog
            events={events}
            onClearEvents={clearEvents}
            onExportJSON={exportEventsAsJSON}
            onExportCSV={exportEventsAsCSV}
          />
        </Box>

        {/* Right Column - Statistics */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <WebSocketStatsCard
            stats={stats}
            isConnected={isConnected}
            onResetStats={resetStats}
          />
        </Box>
      </Box>

      {/* Footer Info */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${colorTokens.neutral[200]}`,
          direction: dir,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: colorTokens.neutral[500],
          }}
        >
          {t("frontdesk.settings.webhookTestFooter")}
        </Typography>
      </Box>
    </Box>
  );
};

export default WebhookTestView;
