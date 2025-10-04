# Frontend Migration Guide: V2 Unified Ticketing System

**Date**: 2025-10-01
**Target Audience**: Frontend Developers
**Status**: Ready for Implementation
**Backend Version**: 2.0.0 (Unified Multi-Provider)

---

## Table of Contents

1. [Overview](#overview)
2. [What Changed in V2](#what-changed-in-v2)
3. [Breaking Changes](#breaking-changes)
4. [Migration Steps](#migration-steps)
5. [New API Reference](#new-api-reference)
6. [New Features Available](#new-features-available)
7. [Code Examples](#code-examples)
8. [Testing Checklist](#testing-checklist)

---

## Overview

The V2 Unified Ticketing System introduces a **provider-agnostic architecture** that works uniformly across Email, WhatsApp, SMS, and future channels. This guide will help you migrate your frontend code to use the new V2 APIs.

### Key Improvements

✅ **Unified API**: Same endpoint works for Email, WhatsApp, SMS
✅ **On-Demand Sync**: Fetch conversation history only when creating ticket
✅ **Better Routing**: `originProviderChannelId` ensures correct reply channel
✅ **Smart Lifecycle**: Automatic handling of closed/resolved tickets
✅ **Review Queue**: New event system for conversations without tickets

---

## What Changed in V2

### 1. Ticket Creation API

**Old (V1)**:
```typescript
POST /tickets/create-from-conversation
{
  "conversationId": "uuid or threadId",  // Ambiguous
  "emailAccountId": "account-uuid",      // Email-specific
  "priority": "MEDIUM"
}
```

**New (V2)**:
```typescript
POST /tickets/create-from-conversation
{
  "providerConversationId": "thread-abc123",  // Generic: threadId, chatId, etc.
  "providerChannelId": "channel-uuid",        // Generic: works for all providers
  "priority": "MEDIUM",
  "categoryId": "category-uuid",              // Optional
  "assigneeId": "user-uuid"                   // Optional: assign immediately
}
```

### 2. Ticket Response Schema

**New Fields in Ticket Object**:
```typescript
interface Ticket {
  // ... existing fields

  // NEW: Origin tracking
  originProviderChannelId: string;
  originProviderChannel: {
    id: string;
    type: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';
    identifier: string;  // email address or phone number
    name: string;
  };
}
```

### 3. Webhook Events

**New Event**: `conversation.needs.review`
```typescript
{
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS',
  identifier: string,
  subject?: string,
  content: string,
  preview: string,  // First 100 chars
  metadata: object,
  printHouseId: string,
  timestamp: Date
}
```

**Enhanced Event**: `webhook.message.processed`
```typescript
{
  webhookType: 'email' | 'whatsapp' | 'sms',
  status: 'success' | 'no_ticket' | 'error',
  action: 'new_ticket_created_for_closed' |    // NEW
          'ticket_reopened_and_message_added' | // NEW
          'message_added_to_ticket' |
          'queued_for_review',
  ticketId?: string,
  previousTicketId?: string,  // NEW: When creating ticket for closed ticket
  identifier: string,
  printHouseId: string
}
```

---

## Breaking Changes

### ⚠️ BREAKING: CreateFromConversationDto

**Changed Fields**:
- `conversationId` → `providerConversationId` ✅
- `emailAccountId` → `providerChannelId` ✅

**Migration Required**: Update all ticket creation calls

### ⚠️ BREAKING: ProviderChannel Mapping

You need to maintain a mapping of user accounts to `ProviderChannel` IDs.

**Before V2**: You stored `emailAccountId`
**After V2**: You need `providerChannelId`

---

## Migration Steps

### Step 1: Update Account Data Structure

**Add `providerChannelId` to your account models**:

```typescript
// OLD
interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook';
}

// NEW
interface ConnectedAccount {
  id: string;
  type: 'EMAIL' | 'WHATSAPP' | 'SMS';
  identifier: string;  // Email or phone
  provider: 'gmail' | 'outlook' | 'whatsapp' | 'twilio';

  // NEW FIELD
  providerChannelId: string;  // From backend ProviderChannel table
}
```

**How to get `providerChannelId`**:

When user connects an account, fetch it from the backend:

```typescript
// After OAuth flow completes
const response = await api.get('/email/accounts');
// Response includes provider channels

const accounts = response.data.map(account => ({
  ...account,
  providerChannelId: account.providerChannel?.id  // Backend provides this
}));

// Store in your state management
accountsStore.setAccounts(accounts);
```

### Step 2: Update Ticket Creation Code

**Old Code**:
```typescript
// ❌ OLD - Don't use anymore
async function createTicketFromEmail(threadId: string, emailAccountId: string) {
  const response = await api.post('/tickets/create-from-conversation', {
    conversationId: threadId,
    emailAccountId: emailAccountId,
    priority: 'MEDIUM'
  });
  return response.data;
}
```

**New Code**:
```typescript
// ✅ NEW - Works for Email, WhatsApp, SMS
async function createTicketFromConversation(
  providerConversationId: string,
  account: ConnectedAccount,
  priority: TicketPriority = 'MEDIUM'
) {
  const response = await api.post('/tickets/create-from-conversation', {
    providerConversationId,
    providerChannelId: account.providerChannelId,
    priority,
    // Optional fields
    categoryId: selectedCategory?.id,
    assigneeId: selectedAgent?.id,
  });

  return response.data;
}

// Usage for Email
const gmailAccount = accounts.find(a => a.type === 'EMAIL' && a.provider === 'gmail');
await createTicketFromConversation(gmailThreadId, gmailAccount, 'HIGH');

// Usage for WhatsApp (future)
const whatsappAccount = accounts.find(a => a.type === 'WHATSAPP');
await createTicketFromConversation(whatsappChatId, whatsappAccount, 'MEDIUM');
```

### Step 3: Update Ticket Display to Show Origin

**Display which channel the ticket came from**:

```typescript
function TicketHeader({ ticket }: { ticket: Ticket }) {
  const channelIcon = {
    EMAIL: '📧',
    WHATSAPP: '💬',
    SMS: '📱',
    PUSH: '🔔',
  }[ticket.originProviderChannel.type];

  return (
    <div className="ticket-header">
      <h1>Ticket #{ticket.ticketNumber}</h1>
      <div className="origin-info">
        <span className="channel-icon">{channelIcon}</span>
        <span className="channel-name">
          {ticket.originProviderChannel.type}
        </span>
        <span className="channel-identifier">
          {ticket.originProviderChannel.identifier}
        </span>
      </div>
      <div className="status-badge">{ticket.status}</div>
    </div>
  );
}
```

### Step 4: Implement Review Queue (NEW Feature)

**Create a Review Queue component to display conversations without tickets**:

```typescript
import { useEffect, useState } from 'react';
import { useEventBus } from './hooks/useEventBus';

interface PendingConversation {
  id: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  from: string;
  subject?: string;
  preview: string;
  timestamp: Date;
  metadata: any;
}

export function ReviewQueue() {
  const [conversations, setConversations] = useState<PendingConversation[]>([]);
  const eventBus = useEventBus();

  useEffect(() => {
    // Listen for conversations needing review
    const unsubscribe = eventBus.on('conversation.needs.review', (event) => {
      const newConversation: PendingConversation = {
        id: event.metadata?.messageId || `${Date.now()}`,
        channel: event.channel,
        from: event.identifier,
        subject: event.subject,
        preview: event.preview,
        timestamp: new Date(event.timestamp),
        metadata: event.metadata,
      };

      setConversations(prev => [newConversation, ...prev]);

      // Optional: Show notification
      showNotification(`New ${event.channel} message from ${event.identifier}`);
    });

    return unsubscribe;
  }, [eventBus]);

  const handleCreateTicket = async (conversation: PendingConversation) => {
    // Find the account for this channel and identifier
    const account = findAccountForConversation(conversation);

    if (!account) {
      alert('No connected account found for this conversation');
      return;
    }

    try {
      const ticket = await createTicketFromConversation(
        conversation.id,
        account,
        'MEDIUM'
      );

      // Remove from queue
      setConversations(prev => prev.filter(c => c.id !== conversation.id));

      // Navigate to ticket
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket');
    }
  };

  return (
    <div className="review-queue">
      <h2>Conversations Awaiting Review ({conversations.length})</h2>

      {conversations.length === 0 && (
        <div className="empty-state">
          No conversations pending review
        </div>
      )}

      {conversations.map(conv => (
        <div key={conv.id} className="conversation-card">
          <div className="header">
            <span className="channel-badge">{conv.channel}</span>
            <span className="from">{conv.from}</span>
            <span className="time">{formatDistanceToNow(conv.timestamp)}</span>
          </div>

          {conv.subject && (
            <div className="subject">{conv.subject}</div>
          )}

          <div className="preview">{conv.preview}</div>

          <div className="actions">
            <button
              onClick={() => handleCreateTicket(conv)}
              className="btn-primary"
            >
              Create Ticket
            </button>
            <button
              onClick={() => handleDismiss(conv.id)}
              className="btn-secondary"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Step 5: Handle Ticket Lifecycle Events

**Listen for ticket lifecycle changes**:

```typescript
useEffect(() => {
  const unsubscribe = eventBus.on('webhook.message.processed', (event) => {
    switch (event.action) {
      case 'new_ticket_created_for_closed':
        // Show notification: "New ticket created for follow-up"
        showNotification(
          `New ticket #${event.ticketId} created (previous ticket was closed)`
        );
        // Refresh ticket list
        refreshTickets();
        break;

      case 'ticket_reopened_and_message_added':
        // Show notification: "Ticket reopened"
        showNotification(`Ticket reopened due to customer reply`);
        // Update ticket in UI
        updateTicketStatus(event.ticketId, 'OPEN');
        break;

      case 'message_added_to_ticket':
        // Update message count
        incrementMessageCount(event.ticketId);
        break;
    }
  });

  return unsubscribe;
}, [eventBus]);
```

---

## New API Reference

### 1. POST /tickets/create-from-conversation (V2)

**Request**:
```typescript
{
  providerConversationId: string;  // Required: Gmail threadId, WhatsApp chatId, etc.
  providerChannelId: string;       // Required: ProviderChannel ID from backend
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  categoryId?: string;             // Optional: Auto-assign category
  assigneeId?: string;             // Optional: Auto-assign to agent
}
```

**Response**:
```typescript
{
  id: string;
  ticketNumber: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  // NEW: Origin tracking
  originProviderChannelId: string;
  originProviderChannel: {
    id: string;
    type: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';
    identifier: string;
    name: string;
  };

  // Conversation with full history
  conversation: {
    id: string;
    name: string;
    messages: Message[];  // All messages synced from provider
  };

  // Standard fields
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  assigneeId?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. GET /provider-channels (NEW)

**Fetch all provider channels for the organization**:

```typescript
GET /provider-channels

Response:
{
  data: [
    {
      id: string;
      type: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';
      identifier: string;  // support@company.com, +1234567890, etc.
      name: string;
      providerId: string;
      provider: {
        id: string;
        type: 'EMAIL' | 'WHATSAPP' | 'SMS';
        name: string;
      };
      isActive: boolean;
    }
  ]
}
```

**Usage**: Fetch on app load and store in state management

### 3. Existing Endpoints (Unchanged)

All other ticket endpoints remain the same:
- `GET /tickets` - List tickets
- `POST /tickets/:id/reply` - Reply to ticket
- `PATCH /tickets/:id/status` - Update status
- `POST /tickets/:id/assign` - Assign ticket
- `POST /tickets/:id/merge` - Merge tickets
- etc.

---

## New Features Available

### 1. Multi-Channel Support

Create tickets from **any** provider using the same API:

```typescript
// Email ticket
await createTicket(gmailThreadId, emailAccount);

// WhatsApp ticket (when implemented)
await createTicket(whatsappChatId, whatsappAccount);

// SMS ticket (when implemented)
await createTicket(twilioConversationSid, smsAccount);
```

### 2. Smart Origin Tracking

Know exactly which channel a ticket came from:

```typescript
function getReplyChannel(ticket: Ticket) {
  // Automatically use the correct channel for replies
  return ticket.originProviderChannel;
}

// When replying, backend automatically routes to correct provider
await replyToTicket(ticket.id, messageContent);
// Backend uses originProviderChannelId to send via correct channel
```

### 3. Automatic Lifecycle Management

The system automatically handles:
- **Closed tickets**: Creates new ticket for follow-ups
- **Resolved tickets**: Auto-reopens on customer reply
- **Open tickets**: Adds messages normally

**You don't need to handle this logic in frontend!** Just listen for events.

### 4. Review Queue

Display conversations that don't have tickets yet:

```typescript
// Agent dashboard shows:
// - Review Queue (conversations without tickets)
// - My Tickets (assigned tickets)
// - Unassigned Tickets (for managers)

<Dashboard>
  <ReviewQueue />  {/* NEW */}
  <MyTickets />
  <UnassignedTickets />
</Dashboard>
```

---

## Code Examples

### Complete Example: Ticket Creation Flow

```typescript
import { useState, useEffect } from 'react';
import { useAccounts } from './hooks/useAccounts';
import { useApi } from './hooks/useApi';

function GmailInboxView() {
  const { accounts } = useAccounts();
  const api = useApi();
  const [threads, setThreads] = useState<GmailThread[]>([]);

  // Get Gmail account with providerChannelId
  const gmailAccount = accounts.find(
    a => a.type === 'EMAIL' && a.provider === 'gmail'
  );

  const handleCreateTicketFromThread = async (thread: GmailThread) => {
    if (!gmailAccount) {
      alert('No Gmail account connected');
      return;
    }

    try {
      // Show loading state
      setCreatingTicket(thread.id);

      // Call V2 API
      const ticket = await api.post('/tickets/create-from-conversation', {
        providerConversationId: thread.id,  // Gmail thread ID
        providerChannelId: gmailAccount.providerChannelId,
        priority: 'MEDIUM',
      });

      // Success!
      showSuccessNotification(`Ticket #${ticket.ticketNumber} created`);

      // Navigate to ticket
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket: ' + error.message);
    } finally {
      setCreatingTicket(null);
    }
  };

  return (
    <div className="gmail-inbox">
      {threads.map(thread => (
        <div key={thread.id} className="thread-item">
          <div className="thread-info">
            <div className="from">{thread.from}</div>
            <div className="subject">{thread.subject}</div>
            <div className="preview">{thread.preview}</div>
          </div>
          <button
            onClick={() => handleCreateTicketFromThread(thread)}
            disabled={creatingTicket === thread.id}
          >
            {creatingTicket === thread.id ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Complete Example: Review Queue with Real-Time Updates

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function ReviewQueueContainer() {
  const [conversations, setConversations] = useState<PendingConversation[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(process.env.REACT_APP_WS_URL, {
      auth: {
        token: getAuthToken(),
      },
    });

    // Listen for review queue events
    newSocket.on('conversation.needs.review', (event) => {
      console.log('New conversation for review:', event);

      setConversations(prev => [{
        id: event.metadata?.threadId || event.metadata?.messageId,
        channel: event.channel,
        from: event.identifier,
        subject: event.subject,
        preview: event.preview,
        timestamp: new Date(event.timestamp),
        metadata: event.metadata,
        printHouseId: event.printHouseId,
      }, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateTicket = async (conversation: PendingConversation) => {
    // Find account that matches this conversation
    const account = await findMatchingAccount(
      conversation.channel,
      conversation.from
    );

    if (!account) {
      alert('No matching account found');
      return;
    }

    // Create ticket using V2 API
    const ticket = await api.post('/tickets/create-from-conversation', {
      providerConversationId: conversation.id,
      providerChannelId: account.providerChannelId,
      priority: 'MEDIUM',
    });

    // Remove from queue
    setConversations(prev =>
      prev.filter(c => c.id !== conversation.id)
    );

    // Show success
    toast.success(`Ticket #${ticket.ticketNumber} created`);
    navigate(`/tickets/${ticket.id}`);
  };

  return <ReviewQueue conversations={conversations} onCreate={handleCreateTicket} />;
}
```

---

## Testing Checklist

### Backend Integration Tests

- [ ] **Test 1**: Fetch provider channels for organization
  ```typescript
  const channels = await api.get('/provider-channels');
  expect(channels.data).toBeInstanceOf(Array);
  expect(channels.data[0]).toHaveProperty('providerChannelId');
  ```

- [ ] **Test 2**: Create ticket from Gmail thread
  ```typescript
  const ticket = await api.post('/tickets/create-from-conversation', {
    providerConversationId: 'gmail-thread-123',
    providerChannelId: 'channel-uuid',
    priority: 'MEDIUM',
  });
  expect(ticket).toHaveProperty('originProviderChannelId');
  expect(ticket.originProviderChannel.type).toBe('EMAIL');
  ```

- [ ] **Test 3**: Verify conversation sync
  ```typescript
  const ticket = await api.post('/tickets/create-from-conversation', { ... });
  expect(ticket.conversation.messages.length).toBeGreaterThan(0);
  // All messages from Gmail thread should be synced
  ```

### Frontend Component Tests

- [ ] **Test 4**: Review queue receives events
  ```typescript
  // Mock WebSocket event
  mockSocket.emit('conversation.needs.review', mockEvent);

  // Verify UI updates
  expect(screen.getByText(mockEvent.from)).toBeInTheDocument();
  ```

- [ ] **Test 5**: Ticket creation flow
  ```typescript
  // Click "Create Ticket" button
  fireEvent.click(screen.getByText('Create Ticket'));

  // Verify API called with correct params
  expect(mockApi.post).toHaveBeenCalledWith(
    '/tickets/create-from-conversation',
    expect.objectContaining({
      providerConversationId: expect.any(String),
      providerChannelId: expect.any(String),
    })
  );
  ```

- [ ] **Test 6**: Ticket displays origin channel
  ```typescript
  render(<TicketHeader ticket={mockTicket} />);
  expect(screen.getByText(mockTicket.originProviderChannel.type)).toBeInTheDocument();
  ```

### E2E Tests

- [ ] **Test 7**: Complete ticket creation from Gmail
  1. Navigate to Gmail inbox
  2. Select thread
  3. Click "Create Ticket"
  4. Verify ticket created with correct data
  5. Verify redirected to ticket detail page

- [ ] **Test 8**: Review queue workflow
  1. Send email to support (via external email)
  2. Verify appears in review queue
  3. Click "Create Ticket"
  4. Verify ticket created
  5. Verify removed from review queue

---

## Migration Timeline

### Phase 1: Preparation (1-2 days)
- [ ] Review this guide
- [ ] Understand new data structures
- [ ] Set up development environment
- [ ] Fetch and store provider channels

### Phase 2: Code Updates (2-3 days)
- [ ] Update account data models
- [ ] Update ticket creation calls
- [ ] Update ticket display components
- [ ] Test existing functionality still works

### Phase 3: New Features (3-5 days)
- [ ] Implement Review Queue component
- [ ] Implement WebSocket event listeners
- [ ] Implement origin channel display
- [ ] Add lifecycle event handlers

### Phase 4: Testing (2-3 days)
- [ ] Unit tests for components
- [ ] Integration tests for API calls
- [ ] E2E tests for complete flows
- [ ] User acceptance testing

### Phase 5: Deployment (1 day)
- [ ] Deploy to staging
- [ ] Verify all features work
- [ ] Deploy to production
- [ ] Monitor for issues

**Total Estimated Time**: 8-14 days

---

## Troubleshooting

### Issue 1: "Provider channel not found"

**Problem**: Backend returns 404 when creating ticket

**Solution**: Ensure you're passing the correct `providerChannelId` from your stored accounts:

```typescript
// Verify you have the channel ID
console.log('Account:', account);
console.log('Provider Channel ID:', account.providerChannelId);

if (!account.providerChannelId) {
  // Re-fetch accounts from backend
  await refreshAccounts();
}
```

### Issue 2: Review queue not receiving events

**Problem**: `conversation.needs.review` events not showing up

**Solution**:
1. Verify WebSocket connection is established
2. Check you're subscribed to correct organization room
3. Verify token is valid

```typescript
socket.on('connect', () => {
  console.log('Connected to WebSocket');
  // Join organization room
  socket.emit('join', { organizationId: user.organizationId });
});

socket.on('conversation.needs.review', (event) => {
  console.log('Received event:', event);
});
```

### Issue 3: Duplicate tickets created

**Problem**: Multiple clicks create multiple tickets

**Solution**: Add debouncing and loading states:

```typescript
const [isCreating, setIsCreating] = useState(false);

const handleCreateTicket = async () => {
  if (isCreating) return; // Prevent double-click

  setIsCreating(true);
  try {
    await createTicket(...);
  } finally {
    setIsCreating(false);
  }
};
```

---

## Support & Resources

- **Backend API Docs**: [ticketing-api-reference.md](./ticketing-api-reference.md)
- **Implementation Plan**: [UNIFIED_TICKETING_IMPLEMENTATION_PLAN.md](./UNIFIED_TICKETING_IMPLEMENTATION_PLAN.md)
- **Phase 3 Details**: [PHASE_3_WEBHOOK_LIFECYCLE_COMPLETE.md](./PHASE_3_WEBHOOK_LIFECYCLE_COMPLETE.md)
- **Backend Status**: [TICKETING_SYSTEM_STATUS.md](./TICKETING_SYSTEM_STATUS.md)

---

## Summary

The V2 Unified Ticketing System is **backward compatible** with careful migration. The key changes are:

1. **Use `providerChannelId` instead of `emailAccountId`**
2. **Use `providerConversationId` for generic thread/chat IDs**
3. **Implement Review Queue for conversations without tickets**
4. **Display `originProviderChannel` to show ticket source**
5. **Listen for new lifecycle events**

Follow this guide step-by-step, test thoroughly, and you'll have a modern, multi-channel ticketing interface! 🚀

---

**Last Updated**: 2025-10-01
**Version**: 2.0
**Status**: Ready for Implementation
