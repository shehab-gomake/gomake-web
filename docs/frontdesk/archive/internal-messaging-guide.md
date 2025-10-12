# Internal Messaging - Client-to-Client Conversations Guide

## Overview

The internal messaging system at `http://localhost:3004/frontdesk/inbox/internal` now supports direct client-to-client conversations. Users can start private conversations with other clients, send messages in real-time, and see presence status.

## Features

### 1. **Direct Messages (DMs)**

- Start 1-on-1 conversations with any user in your organization
- Messages are delivered instantly via WebSocket
- Conversations persist across sessions

### 2. **Channel-Based Conversations**

- Join the general channel for group discussions
- Channels support multiple participants
- All channel members see messages in real-time

### 3. **Real-time Features**

- 🟢 Online/offline status indicators
- ✍️ Typing indicators
- ✅ Read receipts
- 📨 Instant message delivery
- 🔄 Auto-reconnection on connection loss

## How to Start a Conversation

### Method 1: Using the New Conversation Button

1. Click the **"+"** button in the message header
2. Select "Direct Message"
3. Search for the user by name or email
4. Click on the user to start a conversation
5. Type your message and press Enter to send

### Method 2: From the User Presence Panel

1. Look at the right sidebar showing online users
2. Click on any user's name
3. A direct message channel will be created automatically
4. Start typing your message

### Method 3: From the Conversation List

1. Check the left sidebar for existing conversations
2. Active DMs show with a 💬 icon
3. Channels show with a # symbol
4. Click any conversation to continue chatting

## Message Status Flow

Messages go through these statuses:

- **PENDING** - Message created locally
- **SENT** - Message sent to server
- **DELIVERED** - Message received by server
- **READ** - Message read by recipient

## Technical Implementation

### Channel ID Format

- Direct Messages: `dm-{sortedUserId1}-{sortedUserId2}`
- Channels: Custom names like `general`, `team-updates`, etc.

### Message Structure

```javascript
{
  channelId: "dm-user123-user456",
  content: "Hello!",
  recipientId: "user456",  // For DMs
  metadata: { type: "text" }
}
```

### WebSocket Events Used

- `sendMessage` - Send messages
- `joinChannel` - Join conversations
- `newMessage` - Receive messages
- `directMessage` - Receive DMs
- `userTyping` - Typing indicators
- `userPresenceUpdate` - Online status

## UI Components

### Conversation List (Left Sidebar)

- Shows all active channels and DMs
- Displays unread message counts
- Sorted by last message time

### Message Area (Center)

- Shows conversation history
- Displays sender names and timestamps
- Shows typing indicators at bottom
- Message input with placeholder text

### User Presence (Right Sidebar)

- Lists online users with green indicators
- Shows offline users with last seen time
- Click to start new conversations

### New Conversation Dialog

- Search users by name or email
- Shows online status for each user
- One-click to start conversation

## Troubleshooting

### Connection Issues

- Check if WebSocket server is running
- Verify JWT token is valid
- Look for connection status in header

### Messages Not Sending

- Ensure you're connected (green status)
- Check network connection
- Verify recipient exists

### Missing Conversations

- Conversations appear after first message
- Refresh page to reload history
- Check if messages are in correct channel

## Best Practices

1. **Use descriptive channel names** for group conversations
2. **Check user online status** before sending urgent messages
3. **Use typing indicators** to show you're responding
4. **Mark messages as read** to keep track of conversations
5. **Use the search feature** to find users quickly

## Security Notes

- All messages are authenticated via JWT
- Messages are scoped to your organization (printHouseId)
- Direct messages are only visible to participants
- Channel messages are visible to all channel members

## API Endpoints Used

- `POST /api/messages` - Send messages
- `GET /api/messages/channel/:channelId` - Get message history
- `WebSocket /messaging` - Real-time communication

## Future Enhancements

- [ ] File attachments
- [ ] Message reactions/emojis
- [ ] Message editing/deletion
- [ ] Group DMs (multiple participants)
- [ ] Message search
- [ ] Push notifications
- [ ] Voice/video calls
- [ ] Screen sharing

## Support

For issues or questions about the internal messaging system, contact the development team or check the main API documentation at `/frontdesk docs/frontend-api-reference.md`.
