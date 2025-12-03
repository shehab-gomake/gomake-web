/**
 * FrontDesk Chatwoot Code Snippets Library
 * 
 * Copy-paste ready code patterns for fast development.
 * These are tested patterns that follow best practices.
 */

// ============================================================================
// SERVICE USAGE PATTERNS
// ============================================================================

export const SERVICE_PATTERNS = {
  // Profile (no accountId needed)
  getProfile: `
import { chatwootService } from '@/services/frontdesk';

const user = await chatwootService.profile.getProfile();
console.log(user.name, user.email, user.accounts);
`,

  // List conversations with filters
  listConversations: `
import { chatwootService } from '@/services/frontdesk';
import { ConversationStatus, ConversationAssigneeType } from '@/services/frontdesk/api/chatwoot/types';

const conversations = await chatwootService.conversations.listConversations(accountId, {
  status: [ConversationStatus.OPEN],
  assignee_type: ConversationAssigneeType.ME,
  page: 1,
  per_page: 20
});
`,

  // Get conversation details
  getConversationDetails: `
import { chatwootService } from '@/services/frontdesk';

const conversation = await chatwootService.conversations.getConversationDetails(
  accountId,
  conversationId
);
`,

  // List messages
  listMessages: `
import { chatwootService } from '@/services/frontdesk';

const messages = await chatwootService.messages.listMessages(accountId, conversationId);
`,

  // Send message
  sendMessage: `
import { chatwootService } from '@/services/frontdesk';

const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: 'Hello!',
  message_type: 'outgoing'
});
`,

  // List inboxes
  listInboxes: `
import { chatwootService } from '@/services/frontdesk';

const inboxes = await chatwootService.inboxes.listAllInboxes();
`,

  // List contacts
  listContacts: `
import { chatwootService } from '@/services/frontdesk';

const contacts = await chatwootService.contacts.listContacts(accountId, {
  page: 1,
  per_page: 20
});
`,
};

// ============================================================================
// HOOK PATTERNS
// ============================================================================

export const HOOK_PATTERNS = {
  // OPTIMIZED: Use base hook for data fetching (prevents duplicate requests)
  useBaseDataFetch: `
import { useChatwootDataFetch } from '@/widgets/frontdesk/providers/chatwoot/hooks/core/use-chatwoot-data-fetch';
import { chatwootService } from '@/services/frontdesk';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { extractPayload } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

export const useMyData = (filters?: any) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  
  const { data, loading, error, refresh } = useChatwootDataFetch({
    fetchFn: async () => {
      if (!accountId) throw new Error('Account ID required');
      return await chatwootService.myService.getData(accountId, filters);
    },
    filters,
    extractData: extractPayload,
  });

  return { data, loading, error, refresh };
};
`,

  // Basic data fetching hook (manual pattern)
  useDataFetch: `
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { extractPayload } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

export const useMyData = () => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false); // Prevent duplicate requests

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    if (isFetchingRef.current) return; // Skip if already fetching
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await chatwootService.myService.getData(accountId);
      const result = extractPayload(response);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [accountId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
`,

  // Hook with filters
  useFilteredData: `
import { useState, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { createFilterKey } from '@/widgets/frontdesk/providers/chatwoot/utils/filter-utils';

export const useFilteredConversations = (filters) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const filterKey = useMemo(() => createFilterKey(filters), [filters]);

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const result = await chatwootService.conversations.listConversations(accountId, filters);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [accountId, filterKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh: fetchData };
};
`,

  // Hook with Recoil state (with deduplication)
  useRecoilData: `
import { useRecoilState, useRecoilValue } from 'recoil';
import { useState, useCallback, useRef } from 'react';
import { chatwootConversationsAtom, chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { extractPayload } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

export const useConversations = () => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false); // Prevent duplicate requests

  const fetchConversations = useCallback(async () => {
    if (!accountId) return;
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const response = await chatwootService.conversations.listConversations(accountId);
      const data = extractPayload(response);
      setConversations(data);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [accountId, setConversations]);

  return { conversations, loading, refresh: fetchConversations };
};
`,

  // Hook with filter key caching (performance optimized)
  useFilteredDataWithCache: `
import { useState, useCallback, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { createFilterKey } from '@/widgets/frontdesk/providers/chatwoot/utils/filter-utils';
import { extractPayload } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

export const useFilteredConversations = (filters: any) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastFetchedKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  // Create stable filter key to prevent unnecessary refetches
  const filterKey = useMemo(() => createFilterKey(filters), [filters]);

  const fetchData = useCallback(async () => {
    if (!accountId) return;
    if (isFetchingRef.current) return;
    if (filterKey === lastFetchedKeyRef.current) return; // Skip if same filters
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const response = await chatwootService.conversations.listConversations(accountId, filters);
      const result = extractPayload(response);
      setData(result);
      lastFetchedKeyRef.current = filterKey;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [accountId, filterKey, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh: fetchData };
};
`,
};

// ============================================================================
// COMPONENT PATTERNS
// ============================================================================

export const COMPONENT_PATTERNS = {
  // Basic component with hook
  basicComponent: `
import React from 'react';
import { useChatwootProvider } from '@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider';
import { useMyData } from './hooks/use-my-data';

export const MyComponent: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { data, loading, error } = useMyData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      {/* Your component UI */}
    </div>
  );
};
`,

  // List component
  listComponent: `
import React from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootConversationsAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';

export const ConversationList: React.FC = () => {
  const conversations = useRecoilValue(chatwootConversationsAtom);

  if (!conversations || conversations.length === 0) {
    return <div>No conversations</div>;
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <div key={conversation.id}>
          {/* Conversation item */}
        </div>
      ))}
    </div>
  );
};
`,

  // Filter component
  filterComponent: `
import React from 'react';
import { ConversationStatus, ConversationAssigneeType } from '@/services/frontdesk/api/chatwoot/types';

interface FilterProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const ConversationFilters: React.FC<FilterProps> = ({ filters, onFiltersChange }) => {
  const handleStatusChange = (status: ConversationStatus) => {
    onFiltersChange({ ...filters, status: [status] });
  };

  return (
    <div>
      {/* Filter UI */}
    </div>
  );
};
`,
};

// ============================================================================
// UTILITY PATTERNS
// ============================================================================

export const UTILITY_PATTERNS = {
  // Filter building
  buildFilters: `
import { buildConversationFilters, createFilterKey } from '@/widgets/frontdesk/providers/chatwoot/utils/filter-utils';
import { ConversationStatus, ConversationAssigneeType } from '@/services/frontdesk/api/chatwoot/types';

const filters = buildConversationFilters({
  status: ConversationStatus.OPEN,
  assigneeType: ConversationAssigneeType.ME,
  inboxId: selectedInboxId
});

const filterKey = createFilterKey(filters);
`,

  // Response extraction
  extractResponse: `
import { extractPayload, extractMetadata } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';

const response = await chatwootService.conversations.listConversations(accountId);
const conversations = extractPayload(response);
const metadata = extractMetadata(response);
`,
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export const TYPE_PATTERNS = {
  // Common imports
  commonTypes: `
import {
  ChatwootConversation,
  ChatwootMessage,
  ChatwootInbox,
  ChatwootContact,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationListParams
} from '@/services/frontdesk/api/chatwoot/types';
`,

  // Filter types
  filterTypes: `
import { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types';

const filters: ConversationListParams = {
  status: [ConversationStatus.OPEN],
  assignee_type: ConversationAssigneeType.ME,
  page: 1,
  per_page: 20
};
`,
};

