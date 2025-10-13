/**
 * FrontDesk Settings View
 * Main settings page with tabbed navigation
 */

import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import { settingsActiveTabAtom } from '@/store/frontdesk/atoms/settings.atoms';
import { SettingsTab } from './types/settings.types';
import { Panel, PanelHeader, PanelContent } from '@/widgets/frontdesk/design-system';

// Tab components
import { MessageTemplatesTab } from './components/message-templates/message-templates-tab';
import { GeneralSettingsTab } from './components/general/general-settings-tab';
import { NotificationSettingsTab } from './components/notifications/notification-settings-tab';

// Modals
import { TemplateEditorModal } from './components/message-templates/template-editor-modal';
import { AddGroupModal } from './components/message-templates/add-group-modal';

interface TabConfig {
  value: SettingsTab;
  label: string;
  component: React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    value: 'templates',
    label: 'Message Templates',
    component: <MessageTemplatesTab />,
  },
  {
    value: 'general',
    label: 'General Settings',
    component: <GeneralSettingsTab />,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    component: <NotificationSettingsTab />,
  },
];

export const FrontdeskSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useRecoilState(settingsActiveTabAtom);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: SettingsTab) => {
    setActiveTab(newValue);
  };

  const activeTabConfig = TABS.find((tab) => tab.value === activeTab) || TABS[0];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          px: 3,
          pt: 3,
          pb: 0,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your FrontDesk preferences and configurations
          </Typography>
        </Box>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 48,
            '& .MuiTabs-indicator': {
              backgroundColor: '#3B82F6',
            },
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#6B7280',
              '&.Mui-selected': {
                color: '#3B82F6',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
        }}
      >
        <Panel
          elevation={0}
          border="default"
          padding="none"
          sx={{
            height: '100%',
            backgroundColor: 'white',
          }}
        >
          <PanelContent padding="none" scrollable sx={{ height: '100%' }}>
            {activeTabConfig.component}
          </PanelContent>
        </Panel>
      </Box>

      {/* Modals */}
      <TemplateEditorModal />
      <AddGroupModal />
    </Box>
  );
};
