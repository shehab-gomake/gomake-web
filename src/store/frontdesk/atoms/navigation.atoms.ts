import { atom } from 'recoil';
import { Channel, Section } from '@/widgets/frontdesk/layouts/components/NavigationSidebar';

/**
 * Current selected section in the navigation sidebar
 */
export const selectedSectionAtom = atom<Section>({
  key: 'frontdesk.selectedSection',
  default: 'inbox'
});

/**
 * Current selected channel (provider) when in inbox section
 */
export const selectedChannelAtom = atom<Channel>({
  key: 'frontdesk.selectedChannel',
  default: 'all'
});

/**
 * Currently selected conversation ID (provider-specific)
 */
export const selectedConversationIdAtom = atom<string | null>({
  key: 'frontdesk.selectedConversationId',
  default: null
});

/**
 * Selected account IDs for multi-account providers
 * Maps provider name to selected account ID
 */
export const selectedAccountsAtom = atom<Record<string, string>>({
  key: 'frontdesk.selectedAccounts',
  default: {}
});

/**
 * Navigation history for back/forward navigation
 */
export const navigationHistoryAtom = atom<Array<{ section: Section; channel: Channel; conversationId?: string }>>({
  key: 'frontdesk.navigationHistory',
  default: []
});

/**
 * Current navigation index in history
 */
export const navigationIndexAtom = atom<number>({
  key: 'frontdesk.navigationIndex',
  default: -1
});

/**
 * Sidebar collapsed state
 */
export const sidebarCollapsedAtom = atom<boolean>({
  key: 'frontdesk.sidebarCollapsed',
  default: false
});

/**
 * List panel collapsed state (for mobile/tablet views)
 */
export const listPanelCollapsedAtom = atom<boolean>({
  key: 'frontdesk.listPanelCollapsed',
  default: false
});