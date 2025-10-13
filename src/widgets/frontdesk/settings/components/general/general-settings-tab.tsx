/**
 * General Settings Tab
 * Placeholder for general FrontDesk settings
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Panel, PanelHeader, PanelContent } from '@/widgets/frontdesk/design-system';
import { Settings as SettingsIcon } from '@mui/icons-material';

export const GeneralSettingsTab: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Panel elevation={1}>
        <PanelHeader title="General Settings" subtitle="Configure general FrontDesk preferences" />
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
            <SettingsIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
              General settings will include workspace preferences, default views, and behavior configurations.
            </Typography>
          </Box>
        </PanelContent>
      </Panel>
    </Box>
  );
};
