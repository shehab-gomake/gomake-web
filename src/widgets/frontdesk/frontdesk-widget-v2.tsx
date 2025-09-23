import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

// Layout components
import { ThreeColumnLayout } from './layouts/three-column';
import { NavigationSidebar, Channel, Section } from './layouts/components/NavigationSidebar';
import { DynamicListPanel } from './layouts/components/DynamicListPanel';
import { ContentArea } from './layouts/components/ContentArea';

// Navigation controller
import { useNavigationController } from './controllers/NavigationController';
import { ProviderWrapper } from './providers/registry/ProviderRegistry';
import { unreadCountByProviderSelector } from '@/store/frontdesk';

// Provider-specific list components (to be imported when available)
// import { UnifiedConversationList } from './providers/unified/components/UnifiedConversationList';
// import { EmailConversationList } from './providers/email/components/EmailConversationList';
// import { WhatsAppConversationList } from './providers/whatsapp/components/WhatsAppConversationList';
// import { InternalConversationList } from './providers/internal/components/InternalConversationList';

// System section components
const AssignedSection: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Assigned to Me</Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      Conversations and tasks assigned to you will appear here.
    </Typography>
  </Box>
);

const AdminSection: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Admin Panel</Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      Manage provider accounts, users, and system settings.
    </Typography>
  </Box>
);

const SettingsSection: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Settings</Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      Configure your personal preferences and notifications.
    </Typography>
  </Box>
);

const FrontdeskWidgetV2: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentSection,
    currentChannel,
    currentConversationId,
    handleSectionChange,
    handleChannelChange,
    handleConversationSelect
  } = useNavigationController();

  // State for search and filters
  const [searchValue, setSearchValue] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const unreadCounts = useRecoilValue(unreadCountByProviderSelector);
  const channelBadges = useMemo(() => unreadCounts, [unreadCounts]);

  // Render list content based on selected channel
  const renderListContent = () => {
    // For system sections, show appropriate list content
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No assigned conversations
              </Typography>
            </Box>
          );
        case 'admin':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Admin options will appear here
              </Typography>
            </Box>
          );
        case 'settings':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Settings categories will appear here
              </Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // For inbox section, show channel-specific conversation lists
    // These will be replaced with actual provider list components
    switch (currentChannel) {
      case 'all':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Unified conversation list (all channels) will appear here
            </Typography>
          </Box>
        );
      case 'email':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Email conversations will appear here
            </Typography>
          </Box>
        );
      case 'whatsapp':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              WhatsApp conversations will appear here
            </Typography>
          </Box>
        );
      case 'internal':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Internal chat channels and DMs will appear here
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  // Render main content based on selected section
  const renderMainContent = () => {
    // System sections
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return <AssignedSection />;
        case 'admin':
          return <AdminSection />;
        case 'settings':
          return <SettingsSection />;
        default:
          return null;
      }
    }

    // Provider content for inbox section
    return <ProviderWrapper channel={currentChannel} />;
  };

  // Render account selector for providers that support multiple accounts
  const renderAccountSelector = () => {
    if (currentSection !== 'inbox') return null;
    
    if (currentChannel === 'email' || currentChannel === 'whatsapp') {
      return (
        <select
          value={selectedAccount || ''}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">All Accounts</option>
          <option value="account1">Account 1</option>
          <option value="account2">Account 2</option>
        </select>
      );
    }
    
    return null;
  };

  return (
    <ThreeColumnLayout
      navigationContent={
        <NavigationSidebar
          selectedChannel={currentChannel}
          selectedSection={currentSection}
          onChannelSelect={handleChannelChange}
          onSectionSelect={handleSectionChange}
          channelBadges={channelBadges}
        />
      }
      listContent={
        <DynamicListPanel
          channel={currentChannel}
          content={renderListContent()}
          searchValue={searchValue}
          onSearchChange={currentSection === 'inbox' ? setSearchValue : undefined}
          accountSelector={renderAccountSelector()}
          title={currentSection !== 'inbox' ? 
            currentSection.charAt(0).toUpperCase() + currentSection.slice(1) : 
            undefined
          }
        />
      }
      mainContent={
        <ContentArea>
          {renderMainContent()}
        </ContentArea>
      }
    />
  );
};

export default FrontdeskWidgetV2;
