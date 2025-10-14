import { selector } from 'recoil';
import { 
  selectedSectionAtom, 
  selectedChannelAtom,
  selectedConversationIdAtom,
  selectedAccountsAtom,
  navigationHistoryAtom,
  navigationIndexAtom
} from '../atoms/navigation.atoms';

/**
 * Current navigation state
 */
export const currentNavigationStateSelector = selector({
  key: 'frontdesk.selectors.currentNavigationState',
  get: ({ get }) => ({
    section: get(selectedSectionAtom),
    channel: get(selectedChannelAtom),
    conversationId: get(selectedConversationIdAtom),
    selectedAccounts: get(selectedAccountsAtom)
  })
});

/**
 * Whether user is in inbox section
 */
export const isInboxSectionSelector = selector({
  key: 'frontdesk.selectors.isInboxSection',
  get: ({ get }) => get(selectedSectionAtom) === 'inbox'
});

/**
 * Whether user can navigate back
 */
export const canNavigateBackSelector = selector({
  key: 'frontdesk.selectors.canNavigateBack',
  get: ({ get }) => {
    const history = get(navigationHistoryAtom);
    const currentIndex = get(navigationIndexAtom);
    return currentIndex > 0 && history.length > 0;
  }
});

/**
 * Whether user can navigate forward
 */
export const canNavigateForwardSelector = selector({
  key: 'frontdesk.selectors.canNavigateForward',
  get: ({ get }) => {
    const history = get(navigationHistoryAtom);
    const currentIndex = get(navigationIndexAtom);
    return currentIndex < history.length - 1;
  }
});

/**
 * Get selected account for a specific provider
 */
export const selectedAccountByProviderSelector = (provider: string) => selector({
  key: `frontdesk.selectors.selectedAccountByProvider.${provider}`,
  get: ({ get }) => {
    const selectedAccounts = get(selectedAccountsAtom);
    return selectedAccounts[provider] || null;
  }
});

/**
 * Current route path based on navigation state
 */
export const currentRoutePathSelector = selector({
  key: 'frontdesk.selectors.currentRoutePath',
  get: ({ get }) => {
    const section = get(selectedSectionAtom);
    const channel = get(selectedChannelAtom);
    const conversationId = get(selectedConversationIdAtom);
    
    let path = '/frontdesk';
    
    if (section !== 'inbox') {
      path += `/${section}`;
    } else if (channel !== 'all') {
      path += `?provider=${channel}`;
    }
    
    if (conversationId) {
      const separator = path.includes('?') ? '&' : '?';
      path += `${separator}conversation=${conversationId}`;
    }
    
    return path;
  }
});