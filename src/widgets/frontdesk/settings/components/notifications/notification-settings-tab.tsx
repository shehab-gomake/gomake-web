/**
 * Notification Settings Tab
 * Placeholder for notification preferences
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Panel, PanelHeader, PanelContent } from '@/widgets/frontdesk/design-system';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

export const NotificationSettingsTab: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Panel elevation={1}>
        <PanelHeader
          title="Notification Settings"
          subtitle="Manage notification preferences and alerts"
        />
        <PanelContent padding="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 2,
            }}
          >
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
              Notification settings will allow you to customize alerts for new messages, ticket updates, mentions, and more.
            </Typography>
          </Box>
        </PanelContent>
      </Panel>
    </Box>
  );
};
