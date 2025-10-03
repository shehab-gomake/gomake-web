# WebSocket Messaging Integration Guide

This guide explains how to integrate with the Messaging Hub WebSocket service for real-time communication features.

## Overview

The Messaging Hub provides a WebSocket-based real-time messaging service with the following features:
- User-to-user messaging
- Channel-based messaging
- Presence tracking (online/offline status)
- Typing indicators
- Read receipts
- Multi-tenant organization isolation

## Connection Setup

### 1. Install Socket.IO Client

```bash
npm install socket.io-client
```

### 2. Connect to the WebSocket Server

```typescript
import { io, Socket } from 'socket.io-client';

// Replace with your server URL
const SERVER_URL = 'http://localhost:3000';

// Your JWT authentication token
const authToken = 'your-jwt-token-here';

const socket: Socket = io(`${SERVER_URL}/messaging`, {
  auth: {
    token: authToken
  },
  transports: ['websocket', 'polling']
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to messaging service');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

## Authentication

The WebSocket connection requires a valid JWT token. The token can be provided in two ways:

### Option 1: Auth Object (Recommended)
```typescript
const socket = io(`${SERVER_URL}/messaging`, {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Option 2: Authorization Header
```typescript
const socket = io(`${SERVER_URL}/messaging`, {
  extraHeaders: {
    'Authorization': 'Bearer your-jwt-token'
  }
});
```

## Core Messaging Features

### 1. Sending Messages

```typescript
// Send a message to a channel
const sendMessage = (channelId: string, content: string, recipientId?: string) => {
  const messageData = {
    channelId,
    content,
    recipientId, // Optional: for direct messages
    messageId: generateUniqueId(), // Generate unique ID
    metadata: {
      type: 'text',
      timestamp: new Date().toISOString()
    }
  };

  socket.emit('sendMessage', messageData, (response) => {
    if (response.success) {
      console.log('Message sent successfully:', response.messageId);
    } else {
      console.error('Failed to send message:', response.error);
    }
  });
};

// Example usage
sendMessage('channel-123', 'Hello everyone!');
sendMessage('channel-123', 'Direct message', 'user-456'); // Direct message
```

### 2. Receiving Messages

```typescript
// Listen for new messages in channels
socket.on('newMessage', (message) => {
  console.log('New message received:', message);
  // Message structure:
  // {
  //   channelId: string,
  //   content: string,
  //   userId: string,
  //   userEmail: string,
  //   userName: string,
  //   organizationId: string,
  //   timestamp: string,
  //   recipientId?: string,
  //   messageId?: string,
  //   metadata?: object
  // }
});

// Listen for direct messages
socket.on('directMessage', (message) => {
  console.log('Direct message received:', message);
  // Handle direct message UI update
});
```

## Channel Management

### 1. Join a Channel

```typescript
const joinChannel = (channelId: string) => {
  socket.emit('joinChannel', { channelId }, (response) => {
    if (response.success) {
      console.log(`Joined channel: ${response.channelId}`);
    }
  });
};
```

### 2. Leave a Channel

```typescript
const leaveChannel = (channelId: string) => {
  socket.emit('leaveChannel', { channelId }, (response) => {
    if (response.success) {
      console.log(`Left channel: ${response.channelId}`);
    }
  });
};
```

## Typing Indicators

### 1. Start Typing

```typescript
const startTyping = (channelId: string) => {
  socket.emit('typingStart', { channelId });
};
```

### 2. Stop Typing

```typescript
const stopTyping = (channelId: string) => {
  socket.emit('typingStop', { channelId });
};
```

### 3. Listen for Typing Events

```typescript
socket.on('userTyping', (data) => {
  console.log('User typing:', data);
  // Data structure:
  // {
  //   userId: string,
  //   userEmail: string,
  //   userName: string,
  //   channelId: string,
  //   isTyping: boolean
  // }

  if (data.isTyping) {
    showTypingIndicator(data.userName, data.channelId);
  } else {
    hideTypingIndicator(data.userId, data.channelId);
  }
});
```

## Presence Management

### 1. Get User Presence

```typescript
// Get presence for all users in organization
const getAllPresence = () => {
  socket.emit('getPresence', {}, (response) => {
    if (response.success) {
      console.log('Online users:', response.onlineUsers);
      console.log('Presence data:', response.presence);
    }
  });
};

// Get presence for specific users
const getUsersPresence = (userIds: string[]) => {
  socket.emit('getPresence', { userIds }, (response) => {
    if (response.success) {
      console.log('User presence:', response.presence);
    }
  });
};
```

### 2. Listen for Presence Events

```typescript
// User comes online
socket.on('userOnline', (data) => {
  console.log('User online:', data);
  // Data structure:
  // {
  //   userId: string,
  //   email: string,
  //   firstName: string,
  //   lastName: string,
  //   timestamp: string,
  //   onlineUsers: string[]
  // }
  updateUserStatus(data.userId, 'online');
});

// User goes offline
socket.on('userOffline', (data) => {
  console.log('User offline:', data);
  // Data structure:
  // {
  //   userId: string,
  //   email: string,
  //   timestamp: string,
  //   lastSeen: string
  // }
  updateUserStatus(data.userId, 'offline');
});
```

### 3. Update User Status

```typescript
const updateStatus = (status: 'online' | 'away' | 'busy' | 'offline') => {
  socket.emit('updateStatus', { status }, (response) => {
    if (response.success) {
      console.log('Status updated successfully');
    }
  });
};

// Listen for status changes
socket.on('statusChanged', (data) => {
  console.log('User status changed:', data);
  // Data structure:
  // {
  //   userId: string,
  //   status: string,
  //   timestamp: string
  // }
});
```

## Read Receipts

### 1. Mark Message as Read

```typescript
const markAsRead = (messageId: string) => {
  socket.emit('markAsRead', { messageId }, (response) => {
    if (response.success) {
      console.log('Message marked as read');
    }
  });
};
```

### 2. Listen for Read Receipts

```typescript
socket.on('messageRead', (data) => {
  console.log('Message read by user:', data);
  // Data structure:
  // {
  //   messageId: string,
  //   readBy: string,
  //   readAt: string
  // }
  updateMessageReadStatus(data.messageId, data.readBy, data.readAt);
});
```

## Complete React Hook Example

```typescript
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  channelId: string;
  content: string;
  userId: string;
  userEmail: string;
  userName: string;
  organizationId: string;
  timestamp: string;
  recipientId?: string;
  messageId?: string;
}

export const useMessaging = (authToken: string, serverUrl: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    if (!authToken) return;

    const newSocket = io(`${serverUrl}/messaging`, {
      auth: { token: authToken },
      transports: ['websocket', 'polling']
    });

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('Connected to messaging service');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from messaging service');
      setConnected(false);
    });

    // Message handlers
    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('directMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Presence handlers
    newSocket.on('userOnline', (data) => {
      setOnlineUsers(data.onlineUsers);
    });

    newSocket.on('userOffline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Typing handlers
    newSocket.on('userTyping', (data) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const channelTypers = newMap.get(data.channelId) || [];

        if (data.isTyping) {
          if (!channelTypers.includes(data.userId)) {
            newMap.set(data.channelId, [...channelTypers, data.userId]);
          }
        } else {
          newMap.set(data.channelId, channelTypers.filter(id => id !== data.userId));
        }

        return newMap;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [authToken, serverUrl]);

  const sendMessage = (channelId: string, content: string, recipientId?: string) => {
    if (!socket) return;

    const messageData = {
      channelId,
      content,
      recipientId,
      messageId: Date.now().toString(),
      metadata: { type: 'text' }
    };

    socket.emit('sendMessage', messageData);
  };

  const joinChannel = (channelId: string) => {
    if (!socket) return;
    socket.emit('joinChannel', { channelId });
  };

  const leaveChannel = (channelId: string) => {
    if (!socket) return;
    socket.emit('leaveChannel', { channelId });
  };

  const startTyping = (channelId: string) => {
    if (!socket) return;
    socket.emit('typingStart', { channelId });
  };

  const stopTyping = (channelId: string) => {
    if (!socket) return;
    socket.emit('typingStop', { channelId });
  };

  return {
    socket,
    connected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinChannel,
    leaveChannel,
    startTyping,
    stopTyping
  };
};
```

## Error Handling

### Common Error Scenarios

```typescript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);

  switch (error.message) {
    case 'No authentication token provided':
      // Redirect to login
      break;
    case 'Invalid authentication token':
      // Refresh token or redirect to login
      break;
    case 'Authentication failed':
      // Handle auth failure
      break;
    default:
      // Generic connection error
      break;
  }
});

socket.on('exception', (error) => {
  console.error('Socket exception:', error);
  // Handle WebSocket exceptions
});
```

## Best Practices

### 1. Connection Management
- Always check if socket is connected before emitting events
- Implement reconnection logic for network failures
- Clean up socket connections in component unmount

### 2. Message Handling
- Use unique message IDs to prevent duplicates
- Implement message persistence for offline scenarios
- Handle message ordering for real-time updates

### 3. Performance
- Debounce typing indicators to reduce network traffic
- Implement message pagination for large conversations
- Use connection pooling for multiple channels

### 4. Security
- Always validate JWT tokens on the client side
- Implement rate limiting for message sending
- Sanitize message content to prevent XSS attacks

## Environment Configuration

```typescript
// Environment variables
const config = {
  WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3000',
  ENABLE_LOGGING: process.env.NODE_ENV === 'development'
};

// Socket configuration
const socketConfig = {
  auth: { token: authToken },
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 10
};
```

## Testing

### Manual Testing with Browser Console

```javascript
// Connect to the service
const socket = io('http://localhost:3000/messaging', {
  auth: { token: 'your-jwt-token' }
});

// Send a test message
socket.emit('sendMessage', {
  channelId: 'test-channel',
  content: 'Hello from browser console!',
  messageId: Date.now().toString()
});

// Listen for responses
socket.on('newMessage', console.log);
socket.on('userOnline', console.log);
socket.on('userTyping', console.log);
```

This documentation provides everything needed to integrate with the Messaging Hub WebSocket service. For additional support or questions, refer to the API documentation or contact the development team.