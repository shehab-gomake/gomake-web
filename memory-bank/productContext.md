# Product Context: gomake-web

## Purpose

FrontDesk exists to solve the **communication fragmentation problem** faced by teams managing customer conversations across multiple channels. Instead of switching between email clients, WhatsApp apps, internal messaging tools, and ticketing systems, FrontDesk provides a **unified inbox** where all conversations converge.

## Problems Solved

### 1. **Channel Fragmentation**

- **Problem**: Teams juggle multiple apps (Gmail, WhatsApp Web, Slack, ticketing tools)
- **Solution**: Single interface for all communication channels

### 2. **Context Switching Overhead**

- **Problem**: Mental overhead and time lost switching between tools
- **Solution**: Consistent three-column layout across all providers

### 3. **Missed Messages**

- **Problem**: Important messages get lost across different platforms
- **Solution**: Real-time notifications and unified notification system

### 4. **Inconsistent UX**

- **Problem**: Each tool has different UI patterns and workflows
- **Solution**: Standardized provider pattern with shared components

### 5. **Poor Customer Context**

- **Problem**: Customer history scattered across channels
- **Solution**: Unified ticket view with multi-channel conversation tabs

## How It Works

### User Flow

1. **Access**: User navigates to `http://localhost:3004/frontdesk/inbox`
2. **Select Provider**: Left sidebar shows all available providers (DMs, Email, WhatsApp, Tickets)
3. **View Conversations**: Middle panel displays conversation list with filters and search
4. **Engage**: Right panel shows conversation details and message composer
5. **Real-time Updates**: WebSocket connection keeps everything synchronized

### Architecture Pattern

```
Provider Selection → Conversation List → Conversation Detail → Message Actions
        ↓                   ↓                    ↓                    ↓
  Navigation State    List/Filter State    Message State       API Actions
        ↓                   ↓                    ↓                    ↓
    Recoil Atoms       Recoil Atoms        Recoil Atoms       WebSocket/REST
```

### Key Workflows

**Direct Messages (Internal)**

- Real-time WebSocket-based messaging
- 1:1 and group conversations
- Typing indicators and presence
- Optimistic UI updates

**Email Provider**

- OAuth integration (Gmail/Outlook)
- Email threading and conversation grouping
- Attachment handling
- Send/receive via REST API

**Tickets Provider**

- Multi-channel ticket management
- Tab-based conversation switching (Email ↔ WhatsApp ↔ SMS)
- Status management and assignment
- Real-time ticket updates via WebSocket (12 events)

## User Experience Goals

1. **Effortless Switching**: Move between channels without cognitive load
2. **Immediate Feedback**: Optimistic updates make actions feel instant
3. **Never Miss Anything**: Real-time updates and clear notification indicators
4. **Consistent Patterns**: Same layout and interaction patterns across providers
5. **Fast Performance**: Smooth scrolling, instant search, quick load times
6. **Intuitive Navigation**: Clear visual hierarchy and logical routing

## Key Features

### Implemented Features

#### Core Infrastructure

- ✅ Three-column responsive layout system
- ✅ Centralized, type-safe routing with deep linking
- ✅ Recoil-based state management with persistence
- ✅ WebSocket service with auto-reconnect
- ✅ REST API client with authentication

#### Provider Features

- ✅ **Internal DMs**: Complete WebSocket-based real-time messaging
- ✅ **Email**: Gmail OAuth integration with conversation threading
- ✅ **Tickets**: Full backend integration with 12 WebSocket events
- ✅ **WhatsApp**: Mock implementation (frontend-ready)
- 🟡 **Unified Inbox**: Partial implementation (aggregation logic in progress)

#### UI Components

- ✅ Shared message list with virtualization
- ✅ Message composer with attachment support
- ✅ Conversation search (global and in-conversation)
- ✅ Filter and sort controls
- ✅ User presence indicators
- ✅ Typing indicators
- ✅ Message status indicators (pending, sent, delivered, read)

### Provider Status Matrix

| Provider | Status      | Data Source      | Real-time | Notes                      |
| -------- | ----------- | ---------------- | --------- | -------------------------- |
| Internal | ✅ Complete | REST + WebSocket | ✅        | Full DM implementation     |
| Email    | ✅ Complete | REST + OAuth     | ❌        | Gmail integration ready    |
| WhatsApp | 🟡 Mock     | Mock data        | ❌        | UI complete, needs backend |
| Tickets  | ✅ Complete | REST + WebSocket | ✅        | 12 real-time events        |
| Unified  | 🟡 Partial  | Aggregated       | N/A       | Basic aggregation working  |

---

_Last Updated: October 20, 2025_
_Status: Production-Ready Feature Set_
