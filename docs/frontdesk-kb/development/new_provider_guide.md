# Adding a New Provider

This guide provides a comprehensive, step-by-step playbook for scaffolding a new communication provider for FrontDesk.

## Prerequisites

Before you start, ensure you have:
- Node.js and npm installed
- The development server running (`npm run dev`)
- Familiarity with React, TypeScript, and Recoil
- Read the [System Architecture](../01_architecture.md) and [Provider Architecture](../09_provider_architecture.md) docs

## Overview

A provider in FrontDesk consists of:
1. **Directory Structure** - Organized files for UI, logic, and types
2. **State Management** - Recoil atoms for provider-specific state
3. **API Service** - REST API integration (if needed)
4. **WebSocket Service** - Real-time updates (if needed)
5. **Provider Hook** - Business logic and state orchestration
6. **Provider View** - React components for UI
7. **Routing Integration** - Register in main widget
8. **Navigation** - Add to sidebar

## Step-by-Step Guide

### Step 1: Create Directory Structure

Create the folder structure for your provider:

```bash
# Replace {provider-name} with your provider name (e.g., 'slack', 'telegram')
mkdir -p src/widgets/frontdesk/providers/{provider-name}/{components,hooks,types}
```

Example for a Slack provider:
```bash
mkdir -p src/widgets/frontdesk/providers/slack/{components,hooks,types}
```

Your structure should look like:
```
src/widgets/frontdesk/providers/slack/
├── components/           # Provider-specific UI components
├── hooks/               # Provider hooks (main business logic)
├── types/               # TypeScript types and interfaces
└── slack-provider-view.tsx  # Main view component
```

### Step 2: Define TypeScript Types

Create type definitions in `types/index.ts`:

```typescript
// src/widgets/frontdesk/providers/slack/types/index.ts

/**
 * Slack Message
 */
export interface SlackMessage {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: string;
  threadTs?: string;  // Thread timestamp for replies
  reactions?: SlackReaction[];
}

/**
 * Slack Channel
 */
export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
  unreadCount: number;
  lastMessageAt?: string;
}

/**
 * Slack Reaction
 */
export interface SlackReaction {
  emoji: string;
  count: number;
  users: string[];
}

/**
 * API Response Types
 */
export interface ListChannelsResponse {
  channels: SlackChannel[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface GetMessagesResponse {
  messages: SlackMessage[];
  hasMore: boolean;
}
```

### Step 3: Define Recoil State Atoms

Create state management atoms in `src/store/frontdesk/atoms/{provider}.atoms.ts`:

```typescript
// src/store/frontdesk/atoms/slack.atoms.ts
import { atom, selector } from 'recoil';
import { SlackChannel, SlackMessage } from '@/widgets/frontdesk/providers/slack/types';

/**
 * Naming Convention: frontdesk.{provider}.{data}
 * Example: frontdesk.slack.channels
 */

// Channels list
export const slackChannelsAtom = atom<SlackChannel[]>({
  key: 'frontdesk.slack.channels',
  default: [],
});

// Messages by channel
export const slackMessagesAtom = atom<Record<string, SlackMessage[]>>({
  key: 'frontdesk.slack.messages',
  default: {},
});

// Selected channel
export const slackSelectedChannelIdAtom = atom<string | null>({
  key: 'frontdesk.slack.selectedChannelId',
  default: null,
});

// Loading state
export const slackLoadingAtom = atom<boolean>({
  key: 'frontdesk.slack.loading',
  default: false,
});

// Error state
export const slackErrorAtom = atom<string | null>({
  key: 'frontdesk.slack.error',
  default: null,
});

// WebSocket connection state
export const slackConnectionStateAtom = atom<'connected' | 'disconnected' | 'connecting'>({
  key: 'frontdesk.slack.connectionState',
  default: 'disconnected',
});

// Selector: Get selected channel
export const slackSelectedChannelSelector = selector<SlackChannel | null>({
  key: 'frontdesk.slack.selectedChannel',
  get: ({ get }) => {
    const channels = get(slackChannelsAtom);
    const selectedId = get(slackSelectedChannelIdAtom);
    return channels.find(c => c.id === selectedId) || null;
  },
});

// Selector: Get messages for selected channel
export const slackSelectedChannelMessagesSelector = selector<SlackMessage[]>({
  key: 'frontdesk.slack.selectedChannelMessages',
  get: ({ get }) => {
    const messages = get(slackMessagesAtom);
    const selectedId = get(slackSelectedChannelIdAtom);
    return selectedId ? (messages[selectedId] || []) : [];
  },
});

// Selector: Total unread count
export const slackUnreadCountSelector = selector<number>({
  key: 'frontdesk.slack.unreadCount',
  get: ({ get }) => {
    const channels = get(slackChannelsAtom);
    return channels.reduce((sum, channel) => sum + channel.unreadCount, 0);
  },
});
```

### Step 4: Create API Service (Optional)

If your provider needs REST API integration, create a service class:

```typescript
// src/services/frontdesk/api/slack.service.ts
import axios from 'axios';
import { getUserToken } from '@/services/storage-data';
import {
  SlackChannel,
  SlackMessage,
  ListChannelsResponse,
  GetMessagesResponse
} from '@/widgets/frontdesk/providers/slack/types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class SlackService {
  private getHeaders() {
    const token = getUserToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all Slack channels
   */
  async listChannels(): Promise<ListChannelsResponse> {
    const response = await axios.get<ListChannelsResponse>(
      `${BASE_URL}/api/slack/channels`,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Get messages for a specific channel
   */
  async getMessages(channelId: string, limit = 50): Promise<GetMessagesResponse> {
    const response = await axios.get<GetMessagesResponse>(
      `${BASE_URL}/api/slack/channels/${channelId}/messages`,
      {
        headers: this.getHeaders(),
        params: { limit }
      }
    );
    return response.data;
  }

  /**
   * Send a message to a channel
   */
  async sendMessage(channelId: string, content: string): Promise<SlackMessage> {
    const response = await axios.post<SlackMessage>(
      `${BASE_URL}/api/slack/channels/${channelId}/messages`,
      { content },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Mark channel as read
   */
  async markChannelAsRead(channelId: string): Promise<void> {
    await axios.post(
      `${BASE_URL}/api/slack/channels/${channelId}/mark-read`,
      {},
      { headers: this.getHeaders() }
    );
  }
}

export const slackService = new SlackService();
```

Export from services index:
```typescript
// src/services/frontdesk/api/index.ts
export * from './slack.service';
```

### Step 5: Create WebSocket Service (Optional)

If your provider needs real-time updates:

```typescript
// src/services/frontdesk/websocket/slack-websocket.service.ts
import { io, Socket } from 'socket.io-client';
import { SlackMessage } from '@/widgets/frontdesk/providers/slack/types';

class SlackWebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${process.env.REACT_APP_WS_URL}/slack`, {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('[SlackWebSocket] Connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[SlackWebSocket] Connection error:', error);
        reject(error);
      });

      // Set up event handlers
      this.socket.on('message.new', (message: SlackMessage) => {
        this.emit('message.new', message);
      });

      this.socket.on('channel.updated', (data: any) => {
        this.emit('channel.updated', data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listener management
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

export const slackWebSocketService = new SlackWebSocketService();
```

Export from websocket index:
```typescript
// src/services/frontdesk/websocket/index.ts
export * from './slack-websocket.service';
```

### Step 6: Create Provider Hook

Implement the main business logic in a custom hook:

```typescript
// src/widgets/frontdesk/providers/slack/hooks/use-slack-provider.ts
import { useEffect, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { slackService, slackWebSocketService } from '@/services/frontdesk';
import {
  slackChannelsAtom,
  slackMessagesAtom,
  slackSelectedChannelIdAtom,
  slackLoadingAtom,
  slackErrorAtom,
  slackConnectionStateAtom,
  slackSelectedChannelSelector,
  slackSelectedChannelMessagesSelector,
  slackUnreadCountSelector,
} from '@/store/frontdesk/atoms/slack.atoms';
import { getUserToken } from '@/services/storage-data';

export interface UseSlackProviderResult {
  // State
  channels: SlackChannel[];
  selectedChannel: SlackChannel | null;
  messages: SlackMessage[];
  isLoading: boolean;
  error: string | null;
  connectionState: 'connected' | 'disconnected' | 'connecting';
  unreadCount: number;

  // Actions
  fetchChannels: () => Promise<void>;
  selectChannel: (channelId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
}

export function useSlackProvider(): UseSlackProviderResult {
  // Atoms
  const [channels, setChannels] = useRecoilState(slackChannelsAtom);
  const [messages, setMessages] = useRecoilState(slackMessagesAtom);
  const [selectedChannelId, setSelectedChannelId] = useRecoilState(slackSelectedChannelIdAtom);
  const [isLoading, setIsLoading] = useRecoilState(slackLoadingAtom);
  const [error, setError] = useRecoilState(slackErrorAtom);
  const [connectionState, setConnectionState] = useRecoilState(slackConnectionStateAtom);

  // Selectors
  const selectedChannel = useRecoilValue(slackSelectedChannelSelector);
  const selectedChannelMessages = useRecoilValue(slackSelectedChannelMessagesSelector);
  const unreadCount = useRecoilValue(slackUnreadCountSelector);

  // WebSocket Connection
  useEffect(() => {
    const token = getUserToken();
    if (!token) return;

    setConnectionState('connecting');

    slackWebSocketService.connect(token)
      .then(() => setConnectionState('connected'))
      .catch((err) => {
        setConnectionState('disconnected');
        setError(`WebSocket connection failed: ${err.message}`);
      });

    // Set up event listeners
    slackWebSocketService.on('message.new', (message: SlackMessage) => {
      setMessages(prev => ({
        ...prev,
        [message.channelId]: [...(prev[message.channelId] || []), message],
      }));
    });

    return () => {
      slackWebSocketService.disconnect();
    };
  }, []);

  // Fetch channels
  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await slackService.listChannels();
      setChannels(response.channels);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch channels');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select channel and fetch messages
  const selectChannel = useCallback(async (channelId: string) => {
    setSelectedChannelId(channelId);

    // Fetch messages if not already loaded
    if (!messages[channelId]) {
      try {
        const response = await slackService.getMessages(channelId);
        setMessages(prev => ({
          ...prev,
          [channelId]: response.messages,
        }));
      } catch (err: any) {
        setError(`Failed to load messages: ${err.message}`);
      }
    }
  }, [messages]);

  // Send message with optimistic update
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChannelId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: SlackMessage = {
      id: tempId,
      channelId: selectedChannelId,
      userId: 'me',
      content,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setMessages(prev => ({
      ...prev,
      [selectedChannelId]: [...(prev[selectedChannelId] || []), tempMessage],
    }));

    try {
      const sentMessage = await slackService.sendMessage(selectedChannelId, content);

      // Replace temp message with server response
      setMessages(prev => ({
        ...prev,
        [selectedChannelId]: prev[selectedChannelId].map(m =>
          m.id === tempId ? sentMessage : m
        ),
      }));
    } catch (err: any) {
      // Revert on failure
      setMessages(prev => ({
        ...prev,
        [selectedChannelId]: prev[selectedChannelId].filter(m => m.id !== tempId),
      }));
      setError(`Failed to send message: ${err.message}`);
    }
  }, [selectedChannelId]);

  // Mark channel as read
  const markAsRead = useCallback(async () => {
    if (!selectedChannelId) return;

    try {
      await slackService.markChannelAsRead(selectedChannelId);

      // Update unread count locally
      setChannels(prev => prev.map(c =>
        c.id === selectedChannelId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  }, [selectedChannelId]);

  // Initial fetch
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    // State
    channels,
    selectedChannel,
    messages: selectedChannelMessages,
    isLoading,
    error,
    connectionState,
    unreadCount,

    // Actions
    fetchChannels,
    selectChannel,
    sendMessage,
    markAsRead,
  };
}
```

### Step 7: Create Provider View Components

Create the main view component:

```typescript
// src/widgets/frontdesk/providers/slack/slack-provider-view.tsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useSlackProvider } from './hooks/use-slack-provider';
import { ChannelList } from './components/channel-list';
import { MessageView } from './components/message-view';

export const SlackProviderView: React.FC = () => {
  const provider = useSlackProvider();

  if (provider.isLoading && provider.channels.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (provider.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{provider.error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Channel List - Left Panel */}
      <Box sx={{ width: 300, borderRight: '1px solid #e0e0e0' }}>
        <ChannelList
          channels={provider.channels}
          selectedChannelId={provider.selectedChannel?.id || null}
          onSelectChannel={provider.selectChannel}
        />
      </Box>

      {/* Message View - Right Panel */}
      <Box sx={{ flex: 1 }}>
        {provider.selectedChannel ? (
          <MessageView
            channel={provider.selectedChannel}
            messages={provider.messages}
            onSendMessage={provider.sendMessage}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">Select a channel to view messages</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
```

Create sub-components:

```typescript
// src/widgets/frontdesk/providers/slack/components/channel-list.tsx
import React from 'react';
import { List, ListItemButton, ListItemText, Badge } from '@mui/material';
import { SlackChannel } from '../types';

interface ChannelListProps {
  channels: SlackChannel[];
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
}) => {
  return (
    <List>
      {channels.map(channel => (
        <ListItemButton
          key={channel.id}
          selected={channel.id === selectedChannelId}
          onClick={() => onSelectChannel(channel.id)}
        >
          <ListItemText
            primary={`# ${channel.name}`}
            secondary={`${channel.memberCount} members`}
          />
          {channel.unreadCount > 0 && (
            <Badge badgeContent={channel.unreadCount} color="primary" />
          )}
        </ListItemButton>
      ))}
    </List>
  );
};
```

### Step 8: Register Provider in Main Widget

Update the routing in `frontdesk-widget.tsx`:

```typescript
// src/widgets/frontdesk/frontdesk-widget.tsx

// 1. Import the provider view
import { SlackProviderView } from '@/widgets/frontdesk/providers/slack/slack-provider-view';

// 2. Add case in renderMainContent function
const renderMainContent = () => {
  // ... existing code ...

  switch (currentChannel) {
    case 'all':
      return <UnifiedProvider />;
    case 'email':
      return <EmailProviderView />;
    case 'whatsapp':
      return <WhatsAppProviderView />;
    case 'internal':
      return <DirectMessagesProviderView />;
    case 'slack':  // NEW
      return <SlackProviderView />;
    default:
      return null;
  }
};
```

### Step 9: Add Navigation Entry

Update the NavigationSidebar to include your provider:

```typescript
// src/widgets/frontdesk/layouts/components/NavigationSidebar.tsx

// 1. Import icon
import SlackIcon from '@mui/icons-material/Chat'; // Use appropriate icon

// 2. Add to channels array in the component
const channels: Channel[] = [
  { id: 'all', label: 'All', icon: InboxIcon },
  { id: 'email', label: 'Email', icon: EmailIcon },
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
  { id: 'internal', label: 'Direct Messages', icon: ForumIcon },
  { id: 'slack', label: 'Slack', icon: SlackIcon }, // NEW
];
```

### Step 10: Add Unread Count to Badge

Update the unread count selector:

```typescript
// src/store/frontdesk/index.ts

import { slackUnreadCountSelector } from './atoms/slack.atoms';

export const unreadCountByProviderSelector = selector<Record<string, number>>({
  key: 'frontdesk.unreadCountByProvider',
  get: ({ get }) => {
    return {
      email: get(emailUnreadCountSelector),
      whatsapp: get(whatsappUnreadCountSelector),
      internal: get(internalUnreadCountSelector),
      slack: get(slackUnreadCountSelector), // NEW
    };
  },
});
```

### Step 11: Test Your Provider

1. **Start dev server**: `npm run dev`
2. **Navigate to FrontDesk**: `http://localhost:3004/frontdesk/inbox`
3. **Click on your provider** in the sidebar
4. **Test functionality**:
   - Channel list loads
   - Messages display correctly
   - Sending messages works
   - Unread badges update
   - WebSocket events trigger UI updates

### Step 12: Add Documentation

Create provider documentation:

```markdown
<!-- docs/frontdesk-kb/providers/slack.md -->
# Slack Provider

## Overview
The Slack provider integrates Slack workspaces into FrontDesk.

## Features
- Real-time message sync
- Channel browsing
- Message sending
- Unread tracking

## Architecture
- **Hook**: `use-slack-provider.ts`
- **State**: `slack.atoms.ts`
- **API**: `slack.service.ts`
- **WebSocket**: `slack-websocket.service.ts`

## Usage
The provider automatically connects when selected in the sidebar.
```

Update the providers index:

```markdown
<!-- docs/frontdesk-kb/providers/README.md -->
## Available Providers

- [Internal DMs](./internal_dms.md)
- [Email](./email.md)
- [WhatsApp](./whatsapp.md)
- [Tickets](./tickets.md)
- [Slack](./slack.md) <!-- NEW -->
```

## Common Patterns & Best Practices

### Optimistic Updates
Always update UI immediately, then reconcile with server:

```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;

  // 1. Update UI immediately
  setMessages(prev => [...prev, { id: tempId, content, status: 'pending' }]);

  try {
    // 2. Send to server
    const message = await api.sendMessage(content);

    // 3. Replace temp with real
    setMessages(prev => prev.map(m => m.id === tempId ? message : m));
  } catch (error) {
    // 4. Revert on error
    setMessages(prev => prev.filter(m => m.id !== tempId));
    showError('Failed to send message');
  }
};
```

### Error Handling
Always handle errors gracefully:

```typescript
try {
  const result = await api.fetchData();
  setData(result);
  setError(null);
} catch (err: any) {
  console.error('[ProviderName] Error:', err);
  setError(err.response?.data?.message || err.message || 'Unknown error');
}
```

### Loading States
Show appropriate loading indicators:

```typescript
const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await api.fetch();
    setData(data);
  } finally {
    setIsLoading(false);  // Always reset loading
  }
};
```

## Troubleshooting

### Provider not appearing in sidebar
- Check that you added the channel to `NavigationSidebar.tsx`
- Verify the channel ID matches in both sidebar and routing

### State not persisting
- Ensure atom keys follow naming convention: `frontdesk.{provider}.{data}`
- Check that atoms are exported from `src/store/frontdesk/atoms/`

### WebSocket not connecting
- Verify WebSocket URL in environment variables
- Check authentication token is being passed
- Look for connection errors in browser console

### API calls failing
- Check API endpoint URLs
- Verify authentication headers are included
- Inspect Network tab in DevTools for response errors

## Next Steps

After implementing your provider:
1. Write unit tests for the hook
2. Test with mock data first
3. Add integration tests
4. Document any provider-specific behavior
5. Update this guide with lessons learned
