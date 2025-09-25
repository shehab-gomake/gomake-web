# Direct Messages Testing Checklist

## Setup
1. Ensure the backend Messaging-Hub is running at the configured port
2. Ensure the frontend is running on port 3004
3. Have two browser windows/tabs ready with different user accounts

## Test Scenarios

### 1. WebSocket Connection
- [ ] Open Network tab in browser DevTools
- [ ] Navigate to FrontDesk > Internal > Direct Messages
- [ ] Verify WebSocket connects to `/messaging` namespace
- [ ] Check for successful authentication (no auth errors in console)

### 2. Create Direct Message Conversation
- [ ] In User A's browser, click "New Conversation" or similar button
- [ ] Search for User B in the user selector
- [ ] Select User B to start a conversation
- [ ] Verify REST API call to POST `/dms` with participantIds
- [ ] Verify the conversation appears in the conversation list
- [ ] Check that WebSocket emits `joinConversation` with conversation ID

### 3. Send Message from User A
- [ ] Type a message in the message input
- [ ] Press Enter or click Send
- [ ] Verify WebSocket emits `dm:sendMessage` event with:
  - conversationId (not channelId)
  - content
  - tempId
  - metadata
- [ ] Check that message appears immediately (optimistic update)
- [ ] Verify `dm:messageConfirmed` event is received with messageId

### 4. Receive Message on User B
- [ ] In User B's browser, navigate to Direct Messages
- [ ] Verify conversation appears in the list (may need to refresh)
- [ ] Select the conversation with User A
- [ ] Verify WebSocket receives `dm:newMessage` event
- [ ] Check that message from User A appears in real-time

### 5. Two-way Communication
- [ ] User B sends a reply message
- [ ] Verify User A receives it in real-time
- [ ] Continue sending messages back and forth
- [ ] Confirm all messages appear for both users

### 6. Typing Indicators
- [ ] User A starts typing
- [ ] Verify `dm:typingStart` event is emitted
- [ ] User B should see typing indicator
- [ ] User A stops typing or sends message
- [ ] Verify `dm:typingStop` event or typing clears
- [ ] User B's typing indicator should disappear

### 7. Read Receipts
- [ ] User A sends a message
- [ ] User B opens and reads the conversation
- [ ] Verify `dm:markAsRead` event is emitted
- [ ] Check unread counts update correctly

### 8. Reconnection Handling
- [ ] Disconnect network briefly
- [ ] Verify WebSocket attempts to reconnect
- [ ] Restore network connection
- [ ] Confirm messages sync properly after reconnection

## Common Issues to Check

1. **Event Name Mismatch**
   - Frontend emits: `dm:sendMessage`
   - Backend expects: `dm:sendMessage` ✓
   - Frontend listens: `dm:newMessage`, `dm:messageConfirmed`
   - Backend emits: `dm:newMessage`, `dm:messageConfirmed` ✓

2. **Room Management**
   - Frontend joins: via `joinConversation` event
   - Backend creates room: `conv:${conversationId}` ✓

3. **Message Structure**
   - conversationId (not channelId)
   - Proper user identification
   - Timestamp formatting

4. **REST API Integration**
   - Create conversation: POST `/dms`
   - List conversations: GET `/dms`
   - Get messages: GET `/dms/:id/messages`
   - Mark as read: POST `/dms/:id/read`

## Debug Commands

### Check WebSocket Events in Console:
```javascript
// In browser console, check Socket.IO client
const socket = window.io?.sockets?.[0];
if (socket) {
  socket.on('dm:newMessage', (data) => console.log('New Message:', data));
  socket.on('dm:messageConfirmed', (data) => console.log('Message Confirmed:', data));
  socket.on('dm:userTyping', (data) => console.log('User Typing:', data));
}
```

### Test Direct API Calls:
```javascript
// Get auth token
const token = localStorage.getItem('token');

// Create conversation
fetch('http://localhost:3000/dms', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    participantIds: ['USER_B_ID_HERE']
  })
}).then(r => r.json()).then(console.log);

// List conversations
fetch('http://localhost:3000/dms', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json()).then(console.log);
```

## Success Criteria
- [ ] Users can create DM conversations
- [ ] Messages send and receive in real-time
- [ ] No console errors related to WebSocket events
- [ ] Typing indicators work
- [ ] Read receipts update
- [ ] Messages persist after page refresh
- [ ] Conversation list updates properly