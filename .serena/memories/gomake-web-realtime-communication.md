# GoMake Web - Real-time Communication Architecture

## Communication Technologies
- **Socket.IO Client 4.8.1**: Primary real-time messaging system
- **Microsoft SignalR 8.0.0**: Additional real-time features
- **QuickBlox 2.17.1**: Chat/messaging provider integration

## Socket.IO Implementation
### Service Architecture
- **MessagingService**: Centralized Socket.IO management (`src/services/frontdesk/websocket/messaging-service.ts`)
- **Connection Management**: Enhanced with session IDs, authentication, error handling
- **Event Handling**: Comprehensive event system for messaging, presence, typing indicators

### Key Features
- **Authentication**: Token-based auth with session ID tracking
- **Connection Recovery**: Automatic reconnection with exponential backoff
- **Error Handling**: Categorized error handling (auth, timeout, connection refused)
- **Message Acknowledgment**: Both fire-and-forget and confirmation-based patterns
- **Channel Management**: Join/leave channels, create/archive conversations

### Hooks Structure
```
src/hooks/socket-io/
├── use-messenger-socket-io.ts          # Core messaging
├── use-mail-test-socket-io.ts          # Email integration
├── use-quotes-socket-io.ts             # Quote management
├── use-orders-socket-io.ts             # Order tracking
├── use-production-floor-socket-io.ts    # Production monitoring
├── use-dashboard-socket-io.ts          # Dashboard updates
└── [other feature-specific hooks]
```

## FrontDesk Communication Hub
### Multi-Provider Integration
- **Gmail Integration**: OAuth-based email communication
- **WhatsApp Integration**: Business API integration
- **Internal Messaging**: Socket.IO-based real-time chat
- **Unified Interface**: Single UI for all communication channels

### Provider-Specific Hooks
```
src/hooks/frontdesk/
├── [provider-specific implementations]
└── [unified communication logic]
```

## Real-time Event Types
### Messaging Events
- `newMessage`: Incoming messages
- `directMessage`: Direct user-to-user messages
- `messageConfirmed`: Message delivery confirmation
- `messageRead`: Read receipt notifications

### Presence Events
- `userOnline`/`userOffline`: User presence status
- `statusChanged`: User status updates
- `typingStart`/`typingStop`: Typing indicators

### System Events
- `NotifyQuickBloxUser`: QuickBlox notifications
- `SendNotification`: System notifications
- `connect`/`disconnect`: Connection status
- `reconnect`/`reconnect_failed`: Reconnection events

## Configuration & Servers
- **API Server**: Primary backend API
- **Messaging Server**: Dedicated Socket.IO server
- **ERP Server**: Enterprise resource planning
- **Calculation Server**: Pricing and calculation services

## Best Practices Implemented
- **Session Management**: Persistent session IDs (not ephemeral socket.id)
- **Authentication**: Token-based with automatic refresh
- **Error Recovery**: Comprehensive error categorization and handling
- **Connection Monitoring**: Ping/pong configuration for health checks
- **Transport Fallback**: WebSocket with polling fallback
- **Reconnection Strategy**: Exponential backoff with maximum attempts