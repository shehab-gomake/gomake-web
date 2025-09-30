# How to Use getConversationsHistory and getConversation

This guide shows you how to use the new conversation history endpoints in your GoMake AI widget.

## Available Functions

### 1. `getConversationsHistory()`

Fetches all conversation history from the server.

**Endpoint**: `GET /v1/gomake-ai-service/get-conversations-history`

**Response Format**:

```typescript
[
  {
    conversationName: string,
    sessionId: string,
  },
];
```

### 2. `getConversation(sessionId: string)`

Fetches messages for a specific conversation.

**Endpoint**: `GET /v1/gomake-ai-service/get-conversation/:sessionId`

**Response Format**:

```typescript
[
  {
    id: string,
    type: "user" | "ai",
    message: string,
    timestamp: string,
  },
];
```

## Basic Usage

### 1. Import the Hook

```typescript
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";

const { getConversationsHistory, getConversation } = useAISocketIO();
```

### 2. Load Conversations History

```typescript
const [conversationsHistory, setConversationsHistory] = useState<any[]>([]);

useEffect(() => {
  const loadConversationsHistory = async () => {
    try {
      const conversations = await getConversationsHistory();
      setConversationsHistory(conversations);
      console.log("Loaded conversations:", conversations);
    } catch (error) {
      console.error("Error loading conversations history:", error);
    }
  };

  loadConversationsHistory();
}, []);
```

### 3. Load Specific Conversation

```typescript
const [chatMessages, setChatMessages] = useState<any[]>([]);

const handleConversationSelect = async (sessionId: string) => {
  try {
    const conversationMessages = await getConversation(sessionId);
    setChatMessages(conversationMessages);
    console.log("Loaded conversation messages:", conversationMessages);
  } catch (error) {
    console.error("Error loading conversation:", error);
  }
};
```

### 4. Refresh Conversations History

```typescript
const refreshConversationsHistory = async () => {
  try {
    const conversations = await getConversationsHistory();
    setConversationsHistory(conversations);
    console.log("Refreshed conversations history:", conversations);
  } catch (error) {
    console.error("Error refreshing conversations history:", error);
  }
};
```

## Complete Example Implementation

Here's how it's implemented in the main AI component:

```typescript
import { useEffect, useState } from "react";
import { useAISocketIO } from "@/hooks/socket-io/use-ai-socket-io";

const GoMakeAIComponent = () => {
  // State management
  const [conversationsHistory, setConversationsHistory] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  // Get functions from hook
  const {
    getConversationsHistory,
    getConversation,
    startSession,
    sendMessage,
    isProcessing,
    sessionId,
  } = useAISocketIO();

  // Load conversations history on component mount
  useEffect(() => {
    const loadConversationsHistory = async () => {
      try {
        const conversations = await getConversationsHistory();
        setConversationsHistory(conversations);
      } catch (error) {
        console.error("Error loading conversations history:", error);
      }
    };

    loadConversationsHistory();
  }, []);

  // Handle conversation selection
  const handleConversationSelect = async (sessionId: string) => {
    try {
      const conversationMessages = await getConversation(sessionId);
      setChatMessages(conversationMessages);
      setSelectedConversation({ sessionId, messages: conversationMessages });
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  // Refresh conversations history
  const refreshConversationsHistory = async () => {
    try {
      const conversations = await getConversationsHistory();
      setConversationsHistory(conversations);
    } catch (error) {
      console.error("Error refreshing conversations history:", error);
    }
  };

  // Handle new job (clear current conversation)
  const handleNewJobClick = async () => {
    setChatMessages([]);
    setSelectedConversation(null);
    try {
      await startSession();
    } catch (error) {
      console.error("Error starting new session:", error);
    }
  };

  return (
    <div>
      {/* Your UI components */}
      <AISidebar
        conversationsHistory={conversationsHistory}
        onConversationSelect={handleConversationSelect}
        onRefreshHistory={refreshConversationsHistory}
        selectedConversation={selectedConversation}
        onNewJobClick={handleNewJobClick}
      />
      <AIMainPanel
        chatMessages={chatMessages}
        sendMessage={sendMessage}
        isProcessing={isProcessing}
        sessionId={sessionId}
      />
    </div>
  );
};
```

## Error Handling

Both functions include comprehensive error handling:

- **HTTP Status Code Validation**: Checks for non-200 status codes
- **User-Friendly Error Messages**: Shows errors via snackbar notifications
- **Fallback Error Messages**: Provides meaningful errors even when server doesn't return specific details
- **Proper Error Propagation**: Functions throw errors so calling code can handle them

## UI Integration

The sidebar component now includes:

1. **Conversations History Section**: Shows all available conversations
2. **Refresh Button**: Allows users to reload conversations
3. **Conversation Selection**: Click on a conversation to load its messages
4. **Visual Feedback**: Selected conversation is highlighted
5. **Empty State**: Shows helpful message when no conversations exist

## Key Features

- ✅ **Automatic Loading**: Conversations history loads on component mount
- ✅ **Real-time Refresh**: Users can refresh the conversation list
- ✅ **Conversation Selection**: Click to load specific conversation messages
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- ✅ **State Management**: Proper state management for conversations and messages
- ✅ **Visual Feedback**: Clear indication of selected conversation
- ✅ **Empty States**: Helpful messages when no data is available

## API Response Examples

### getConversationsHistory Response:

```json
[
  {
    "conversationName": "Design Discussion",
    "sessionId": "abc123-def456-ghi789"
  },
  {
    "conversationName": "Printing Help",
    "sessionId": "xyz789-uvw456-rst123"
  }
]
```

### getConversation Response:

```json
[
  {
    "id": "msg1",
    "type": "user",
    "message": "How can I improve my print quality?",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  {
    "id": "msg2",
    "type": "ai",
    "message": "To improve print quality, you can try adjusting the following settings...",
    "timestamp": "2024-01-15T10:30:15Z"
  }
]
```

This implementation provides a complete conversation history system for your GoMake AI widget!
