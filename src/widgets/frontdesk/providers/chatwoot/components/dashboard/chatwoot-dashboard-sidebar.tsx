/**
 * Chatwoot Dashboard Sidebar
 *
 * Tabbed sidebar component that switches between:
 * - Overview tab: Quick view of conversations (My Conversations, Mentions, Unattended)
 * - Inbox tab: Compact notifications view
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Badge, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { ChatwootQuickView } from './chatwoot-quick-view';
import { ChatwootNotificationsCompact } from './chatwoot-notifications-compact';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

export interface ChatwootDashboardSidebarProps {
  // Props for Overview tab (Quick View)
  myConversations: ChatwootConversation[];
  mentionedConversations: ChatwootConversation[];
  unattendedConversations: ChatwootConversation[];
  onConversationSelect: (conversationId: number, inboxId?: number) => void;
  onViewAll: (view: 'my-inbox' | 'mentions' | 'unattended') => void;

  // Props for Inbox tab
  unreadNotificationCount: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      sx={{
        height: '100%',
        overflow: 'hidden',
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
      }}
    >
      {value === index && children}
    </Box>
  );
};

export const ChatwootDashboardSidebar: React.FC<ChatwootDashboardSidebarProps> = ({
  myConversations,
  mentionedConversations,
  unattendedConversations,
  onConversationSelect,
  onViewAll,
  unreadNotificationCount,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${colorTokens.neutral[200]}`,
        overflow: 'hidden',
      }}
    >
      {/* Header with Tabs */}
      <Box
        sx={{
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: colorTokens.neutral[900],
            }}
          >
            Quick Access
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: colorTokens.neutral[600],
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 2,
            },
          }}
        >
          <Tab
            label="Overview"
            id="dashboard-tab-0"
            aria-controls="dashboard-tabpanel-0"
          />
          <Tab
            label={
              unreadNotificationCount > 0 ? (
                <Badge
                  badgeContent={unreadNotificationCount}
                  color="error"
                  max={99}
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -12,
                      top: 2,
                      fontSize: '0.625rem',
                      height: 16,
                      minWidth: 16,
                      padding: '0 4px',
                    },
                  }}
                >
                  <Box component="span">Inbox</Box>
                </Badge>
              ) : (
                'Inbox'
              )
            }
            id="dashboard-tab-1"
            aria-controls="dashboard-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <ChatwootQuickView
            myConversations={myConversations}
            mentionedConversations={mentionedConversations}
            unattendedConversations={unattendedConversations}
            onConversationSelect={onConversationSelect}
            onViewAll={onViewAll}
          />
        </TabPanel>

        {/* Inbox Tab */}
        <TabPanel value={activeTab} index={1}>
          <ChatwootNotificationsCompact />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ChatwootDashboardSidebar;
