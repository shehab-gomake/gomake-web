import { useRouter } from 'next/router';
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Channel, Section } from '../layouts/components/NavigationSidebar';

// Navigation state interface
export interface NavigationState {
  section: Section;
  channel: Channel;
  conversationId?: string;
}

// Hook for managing navigation state
export const useNavigationController = () => {
  const router = useRouter();
  
  // Parse current route
  const getCurrentState = useCallback((): NavigationState => {
    const { frontdeskRoute, provider } = router.query;
    
    // Determine section from route
    let section: Section = 'inbox';
    if (frontdeskRoute === 'assigned') section = 'assigned';
    else if (frontdeskRoute === 'admin') section = 'admin';
    else if (frontdeskRoute === 'settings') section = 'settings';
    
    // Determine channel from provider or default
    let channel: Channel = 'all';
    if (provider === 'email') channel = 'email';
    else if (provider === 'whatsapp') channel = 'whatsapp';
    else if (provider === 'internal') channel = 'internal';
    
    return { section, channel };
  }, [router.query]);
  
  // Navigate to new state
  const navigate = useCallback((state: Partial<NavigationState>) => {
    const currentState = getCurrentState();
    const newState = { ...currentState, ...state };
    
    // Build route path
    let path = '/frontdesk';
    
    if (newState.section !== 'inbox') {
      path += `/${newState.section}`;
    } else if (newState.channel !== 'all') {
      path += `?provider=${newState.channel}`;
    }
    
    if (newState.conversationId) {
      const separator = path.includes('?') ? '&' : '?';
      path += `${separator}conversation=${newState.conversationId}`;
    }
    
    router.push(path);
  }, [router, getCurrentState]);
  
  // Handle section change
  const handleSectionChange = useCallback((section: Section) => {
    navigate({ section });
  }, [navigate]);
  
  // Handle channel change
  const handleChannelChange = useCallback((channel: Channel) => {
    navigate({ section: 'inbox', channel });
  }, [navigate]);
  
  // Handle conversation selection
  const handleConversationSelect = useCallback((conversationId: string) => {
    navigate({ conversationId });
  }, [navigate]);
  
  // Sync with route changes
  const currentState = getCurrentState();
  
  return {
    currentSection: currentState.section,
    currentChannel: currentState.channel,
    currentConversationId: currentState.conversationId,
    navigate,
    handleSectionChange,
    handleChannelChange,
    handleConversationSelect
  };
};

// Navigation utilities
export class NavigationUtils {
  static buildRoute(section: Section, channel?: Channel, conversationId?: string): string {
    let path = '/frontdesk';
    
    if (section !== 'inbox') {
      path += `/${section}`;
    } else if (channel && channel !== 'all') {
      path += `?provider=${channel}`;
    }
    
    if (conversationId) {
      const separator = path.includes('?') ? '&' : '?';
      path += `${separator}conversation=${conversationId}`;
    }
    
    return path;
  }
  
  static parseRoute(query: any): NavigationState {
    const { frontdeskRoute, provider, conversation } = query;
    
    let section: Section = 'inbox';
    if (frontdeskRoute === 'assigned') section = 'assigned';
    else if (frontdeskRoute === 'admin') section = 'admin';
    else if (frontdeskRoute === 'settings') section = 'settings';
    
    let channel: Channel = 'all';
    if (provider === 'email') channel = 'email';
    else if (provider === 'whatsapp') channel = 'whatsapp';
    else if (provider === 'internal') channel = 'internal';
    
    return { 
      section, 
      channel,
      conversationId: conversation as string | undefined
    };
  }
  
  static isInboxSection(section: Section): boolean {
    return section === 'inbox';
  }
  
  static getChannelDisplayName(channel: Channel): string {
    switch (channel) {
      case 'all':
        return 'All Channels';
      case 'email':
        return 'Email';
      case 'whatsapp':
        return 'WhatsApp';
      case 'internal':
        return 'Internal Chat';
      default:
        return 'Unknown';
    }
  }
  
  static getSectionDisplayName(section: Section): string {
    switch (section) {
      case 'inbox':
        return 'Inbox';
      case 'assigned':
        return 'Assigned';
      case 'admin':
        return 'Admin';
      case 'settings':
        return 'Settings';
      default:
        return 'Unknown';
    }
  }
}

export default useNavigationController;