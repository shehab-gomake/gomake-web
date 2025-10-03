import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import { useRouter } from "next/router";
import { useRecoilValue } from 'recoil';
// Three-column layout components (now actually two-column)
import { ThreeColumnLayout } from './layouts/three-column';
import { NavigationSidebar, Channel, Section } from './layouts/components/NavigationSidebar';
import { DynamicListPanel } from './layouts/components/DynamicListPanel';
import { ContentArea } from './layouts/components/ContentArea';

// Provider components
import { EmailProviderView } from "@/widgets/frontdesk/providers/email/email-provider-view";
import { WhatsAppProviderView } from "@/widgets/frontdesk/providers/whatsapp/whatsapp-provider-view";
import { DirectMessagesProviderView } from "@/widgets/frontdesk/providers/internal/direct-messages-provider-view";

// For unified view placeholder
import { UnifiedProvider } from './providers/unified/UnifiedProvider';
import { unreadCountByProviderSelector } from '@/store/frontdesk';

const FrontdeskWidget: React.FC = () => {
  const router = useRouter();
  const { frontdeskRoute, provider } = router.query as {
    frontdeskRoute?: string;
    provider?: string;
  };


  // Initialize state from route only on mount
  const getInitialSection = (): Section => {
    if (!frontdeskRoute || frontdeskRoute === 'inbox') return 'inbox';
    if (frontdeskRoute === 'assigned') return 'assigned';
    if (frontdeskRoute === 'admin') return 'admin';
    if (frontdeskRoute === 'settings') return 'settings';
    return 'inbox';
  };

  const getInitialChannel = (): Channel => {
    if (frontdeskRoute !== 'inbox' && !provider) return 'all';
    if (provider === 'email') return 'email';
    if (provider === 'whatsapp') return 'whatsapp';
    if (provider === 'internal') return 'internal';
    if (provider === 'unified') return 'all';
    return 'all';
  };

  // Use state for navigation - this prevents hard refreshes
  const [currentSection, setCurrentSection] = useState<Section>(getInitialSection());
  const [currentChannel, setCurrentChannel] = useState<Channel>(getInitialChannel());
  const [searchValue, setSearchValue] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const channelBadges = useRecoilValue(unreadCountByProviderSelector);

  // Only sync with route on initial load
  useEffect(() => {
    if (!isInitialized) {
      setCurrentSection(getInitialSection());
      setCurrentChannel(getInitialChannel());
      setIsInitialized(true);
    }
  }, [frontdeskRoute, provider, isInitialized]);

  // Navigation handlers - update state immediately, then update URL
  const handleSectionChange = (section: Section) => {
    // Update state immediately for instant UI response
    setCurrentSection(section);

    // Update URL without causing a re-render
    const url = section === 'inbox'
      ? '/frontdesk/inbox'
      : `/frontdesk/${section}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  const handleChannelChange = (channel: Channel) => {
    // Update state immediately for instant UI response
    setCurrentChannel(channel);

    // Update URL without causing a re-render
    const channelMap = { 'all': 'unified', 'email': 'email', 'whatsapp': 'whatsapp', 'internal': 'internal' };
    const url = `/frontdesk/inbox/${channelMap[channel]}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  // Render list content based on selection (kept for compatibility but not displayed)
  const renderListContent = () => {
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Assigned conversations will appear here
              </Typography>
            </Box>
          );
        case 'admin':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Admin options
              </Typography>
            </Box>
          );
        case 'settings':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Settings options
              </Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // For inbox, show conversation lists
    switch (currentChannel) {
      case 'all':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              All conversations
            </Typography>
          </Box>
        );
      case 'email':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Email conversations
            </Typography>
          </Box>
        );
      case 'whatsapp':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              WhatsApp conversations
            </Typography>
          </Box>
        );
      case 'internal':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Direct Messages
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  // Render main content based on selection
  const renderMainContent = () => {
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Assigned to Me</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Work board coming soon</Typography>
            </Box>
          );
        case 'admin':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Admin</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Provider accounts management</Typography>
            </Box>
          );
        case 'settings':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Settings</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>User settings</Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // For inbox, show provider content
    switch (currentChannel) {
      case 'all':
        return <UnifiedProvider />;
      case 'email':
        return <EmailProviderView />;
      case 'whatsapp':
        return <WhatsAppProviderView />;
      case 'internal':
        return <DirectMessagesProviderView />;
      default:
        return null;
    }
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

export default FrontdeskWidget;
