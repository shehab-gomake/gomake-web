# Frontend UI Requirements for Messaging Hub

This document outlines the UI components and features needed to fully utilize the messaging service capabilities.

## Core UI Components Needed

### 1. 💬 Message Interface
```
┌─────────────────────────────────────┐
│ Channel: #general                   │
├─────────────────────────────────────┤
│ John Doe                  2:30 PM   │
│ Hello everyone! 👋                  │
│                                     │
│ You                       2:31 PM   │
│ Hi John! How's it going?            │
│ ✓✓ Read by 3 people                │
│                                     │
│ Sarah is typing...                  │
├─────────────────────────────────────┤
│ [Type a message...            ] [>] │
└─────────────────────────────────────┘
```

**Required Features:**
- Message bubbles with sender info and timestamps
- Read receipt indicators (✓ sent, ✓✓ read)
- Typing indicators with user names
- Message input with send button
- Auto-scroll to latest messages

### 2. 📋 Channel Sidebar
```
┌─────────────────────┐
│ CHANNELS            │
├─────────────────────┤
│ # general      (12) │ ← Unread count
│ # development   (3) │
│ # design            │
│ + Add Channel       │
├─────────────────────┤
│ DIRECT MESSAGES     │
├─────────────────────┤
│ 🟢 John Doe         │ ← Online status
│ 🟡 Sarah Smith      │ ← Away status
│ ⚫ Mike Johnson     │ ← Offline status
│ + New Message       │
└─────────────────────┘
```

**Required Features:**
- Channel list with unread message counts
- Direct message list with online status indicators
- Add channel/start DM functionality
- Status indicators: 🟢 Online, 🟡 Away, 🔴 Busy, ⚫ Offline

### 3. 👥 User Presence Panel
```
┌─────────────────────────────────┐
│ ONLINE NOW (5)                  │
├─────────────────────────────────┤
│ 🟢 John Doe        Active now   │
│ 🟢 Sarah Smith     Active now   │
│ 🟡 Mike Johnson    Away         │
│ 🔴 Lisa Wilson     Busy         │
│ ⚫ Tom Brown        Last: 2h ago │
└─────────────────────────────────┘
```

**Required Features:**
- Real-time online user list
- Status indicators with last seen times
- Click to start direct message
- User avatars/profile pictures

### 4. ⚙️ Status Selector
```
┌─────────────────┐
│ Your Status     │
├─────────────────┤
│ ● Online        │ ← Current status
│   Away          │
│   Busy          │
│   Offline       │
└─────────────────┘
```

**Required Features:**
- Dropdown/modal to change user status
- Visual indication of current status
- Status persistence across sessions

## Essential UI Features to Implement

### 🔔 Real-time Notifications
- **Desktop notifications** for new messages when tab is inactive
- **Badge counts** on browser tab title
- **Sound alerts** for incoming messages (optional toggle)
- **Unread message indicators** in channel list

### ⌨️ Typing Experience
- **Typing indicators** showing "User is typing..." with animated dots
- **Auto-save drafts** when switching channels
- **Keyboard shortcuts**: Enter to send, Shift+Enter for new line
- **Emoji picker** integration

### 📱 Responsive Design
- **Mobile-friendly** chat interface
- **Collapsible sidebar** on smaller screens
- **Touch-friendly** message sending
- **Swipe gestures** for mobile navigation

### 🎨 Message Formatting
- **Rich text support** (bold, italic, links)
- **Emoji rendering** with Unicode support
- **File upload** indicators and preview
- **Message timestamps** with relative time (e.g., "2 minutes ago")

## Required State Management

### 📊 Application State
```typescript
interface AppState {
  // Connection status
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';

  // Current user
  currentUser: {
    id: string;
    email: string;
    name: string;
    status: 'online' | 'away' | 'busy' | 'offline';
  };

  // Channels and messages
  channels: Channel[];
  activeChannelId: string;
  messages: Record<string, Message[]>; // channelId -> messages
  unreadCounts: Record<string, number>;

  // Users and presence
  onlineUsers: string[];
  userPresence: Record<string, PresenceData>;
  typingUsers: Record<string, string[]>; // channelId -> userIds

  // UI state
  isSidebarOpen: boolean;
  isTyping: boolean;
  draft: Record<string, string>; // channelId -> draft message
}
```

## User Interactions to Handle

### 💬 Messaging Actions
- **Send message** - Enter key or click send button
- **Edit message** - Click on own message to edit
- **Delete message** - Right-click context menu
- **Reply to message** - Click reply button
- **React to message** - Click emoji reaction button

### 🏠 Channel Actions
- **Switch channels** - Click on channel in sidebar
- **Join channel** - Automatically when switching
- **Leave channel** - Right-click channel, leave option
- **Create channel** - Plus button in channels section

### 👤 User Actions
- **Start direct message** - Click on user in presence panel
- **Change status** - Click on status dropdown
- **View user profile** - Click on user name in messages

## Mobile-Specific Considerations

### 📱 Mobile UI Adaptations
```
Mobile Layout:
┌─────────────────────┐
│ ≡  #general    👤  │ ← Header with menu and profile
├─────────────────────┤
│ Messages area       │
│                     │
│                     │
│                     │
├─────────────────────┤
│ [Type message...] > │ ← Input bar
└─────────────────────┘
```

**Mobile Features:**
- **Hamburger menu** for channel sidebar
- **Pull-to-refresh** for loading older messages
- **Push notifications** integration
- **App-like navigation** with back buttons

## Integration Checklist

### ✅ Implementation Steps
1. **Set up WebSocket connection** using the integration guide
2. **Implement message components** with proper state management
3. **Add presence tracking** with visual indicators
4. **Create typing indicators** with real-time updates
5. **Build channel management** with join/leave functionality
6. **Add status management** with dropdown selector
7. **Implement notifications** for better UX
8. **Test multi-user scenarios** with multiple browser tabs

### 🧪 Testing Scenarios
- **Multi-tab testing** - Open multiple tabs with different users
- **Network disconnection** - Test reconnection behavior
- **Long message threads** - Test scrolling and performance
- **Rapid typing** - Test typing indicator debouncing
- **Status changes** - Test presence updates across clients

### 🎯 Success Criteria
- ✅ Users can send and receive messages in real-time
- ✅ Typing indicators appear and disappear correctly
- ✅ Online status updates immediately across all clients
- ✅ Unread message counts are accurate
- ✅ Direct messages work between specific users
- ✅ Channel switching is smooth and immediate
- ✅ Mobile experience is fully functional

## Quick Start Priority

### 🚀 MVP Features (Build First)
1. **Basic message interface** - Send/receive text messages
2. **Channel switching** - Join different channels
3. **Online presence** - Show who's online
4. **Simple typing indicators** - Basic "user is typing"

### 🌟 Enhanced Features (Build Second)
1. **Read receipts** - Message read status
2. **Direct messaging** - Private conversations
3. **Status management** - Away/busy/offline states
4. **Desktop notifications** - Browser notifications

### 🎨 Polish Features (Build Last)
1. **Rich text formatting** - Bold/italic/emoji
2. **File uploads** - Image/document sharing
3. **Message reactions** - Emoji reactions
4. **Advanced notifications** - Sound/vibration

This should give your frontend team a clear roadmap for building a complete messaging interface that takes full advantage of your WebSocket service!