# Direct Messages Search API - Frontend Developer Guide

## Overview
The search feature allows users to find messages across all their conversations with advanced features like text highlighting, contextual snippets, and direct message navigation.

## API Endpoints

### 1. Search Across All Conversations
**Endpoint:** `GET /dms/search` or `GET /dms/search/all`
**Purpose:** Search for messages across ALL conversations the user is a member of

#### Request
```typescript
interface SearchRequest {
  // Query Parameters
  query: string;           // Required: Search text (max 1000 chars)
  limit?: number;          // Optional: Results per page (default: 50, max: 200)
  offset?: number;         // Optional: Pagination offset (default: 0)
  sortBy?: 'relevance' | 'date_desc' | 'date_asc'; // Optional: Sort order (default: 'relevance')
  useFullText?: boolean;   // Optional: Use PostgreSQL full-text search (default: true)
  includeConversationInfo?: boolean; // Optional: Include conversation details (default: true)
}
```

#### Response
```typescript
interface SearchResult {
  // Core Message Data
  id: string;                    // Message unique ID
  content: string;               // Full message content
  contentSnippet: string;        // Smart snippet with "..." ellipsis
  createdAt: Date;               // Message timestamp
  userId: string | null;         // Sender's user ID
  conversationId: string;        // Conversation ID
  isSystem: boolean;             // System message flag

  // Search Relevance
  rank?: number;                 // Relevance score (higher = more relevant)

  // Text Highlighting
  highlights?: Array<{
    start: number;               // Start position in content
    end: number;                 // End position in content
    text: string;                // Matched text
  }>;

  // Navigation Data
  messagePosition?: {
    messageIndex: number;        // Message position in conversation (0-based)
    totalMessages: number;       // Total messages in conversation
    previousMessageId?: string;  // Previous message ID for context loading
    nextMessageId?: string;      // Next message ID for context loading
  };

  // User Information
  user?: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
  };

  // Conversation Information
  conversation?: {
    id: string;
    name: string | null;
    type: 'direct' | 'group';
    participantCount: number;
  };
}
```

### 2. Search Within Specific Conversation
**Endpoint:** `GET /dms/:conversationId/search`
**Purpose:** Search messages within a single conversation only

Uses similar request/response structure but scoped to one conversation.

## Frontend Implementation Guide

### 1. Basic Search Implementation

```javascript
// Search across all conversations
async function searchAllConversations(searchText) {
  const response = await fetch(`/api/dms/search?query=${encodeURIComponent(searchText)}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const results = await response.json();
  return results;
}
```

### 2. Advanced Search with Options

```javascript
async function advancedSearch(params) {
  const queryParams = new URLSearchParams({
    query: params.searchText,
    limit: params.limit || 50,
    offset: params.offset || 0,
    sortBy: params.sortBy || 'relevance',
    useFullText: true,
    includeConversationInfo: true
  });

  const response = await fetch(`/api/dms/search?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  return response.json();
}
```

### 3. Displaying Search Results with Highlights

```javascript
function renderSearchResult(result) {
  // Display snippet with context
  const snippet = result.contentSnippet; // e.g., "...omar abc test test..."

  // Apply highlights to full content if needed
  let highlightedContent = result.content;
  if (result.highlights && result.highlights.length > 0) {
    // Sort highlights by position (descending) to avoid offset issues
    const sortedHighlights = [...result.highlights].sort((a, b) => b.start - a.start);

    sortedHighlights.forEach(highlight => {
      const before = highlightedContent.slice(0, highlight.start);
      const match = highlightedContent.slice(highlight.start, highlight.end);
      const after = highlightedContent.slice(highlight.end);
      highlightedContent = `${before}<mark>${match}</mark>${after}`;
    });
  }

  return {
    snippet,
    highlightedContent,
    conversation: result.conversation?.name || 'Direct Message',
    sender: result.user?.name || 'Unknown',
    time: new Date(result.createdAt).toLocaleString()
  };
}
```

### 4. Jumping to Message in Conversation

```javascript
async function jumpToMessage(result) {
  const { conversationId, id: messageId, messagePosition } = result;

  // 1. Navigate to conversation view
  router.push(`/conversations/${conversationId}`);

  // 2. Use position data to load the right page/section
  if (messagePosition) {
    const { messageIndex, totalMessages, previousMessageId, nextMessageId } = messagePosition;

    // Calculate which "page" of messages to load
    const messagesPerPage = 50;
    const targetPage = Math.floor(messageIndex / messagesPerPage);

    // Load messages around the target
    const messages = await loadMessagesAroundIndex(
      conversationId,
      messageIndex,
      messagesPerPage
    );

    // Scroll to the specific message
    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      messageElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Highlight the message temporarily
      messageElement?.classList.add('highlight-flash');
    }, 100);
  }
}

// Helper function to load messages around a specific index
async function loadMessagesAroundIndex(conversationId, targetIndex, pageSize) {
  // Calculate offset to center the target message
  const offset = Math.max(0, targetIndex - Math.floor(pageSize / 2));

  const response = await fetch(
    `/api/dms/${conversationId}/messages?limit=${pageSize}&offset=${offset}`,
    {
      headers: { 'Authorization': `Bearer ${authToken}` }
    }
  );

  return response.json();
}
```

### 5. Implementing Search UI

```jsx
// React Component Example
function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await advancedSearch({
        searchText: searchQuery,
        sortBy,
        limit: 50
      });
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && performSearch()}
          placeholder="Search across all conversations..."
          maxLength={1000}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Most Relevant</option>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
        <button onClick={performSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="search-results">
        {results.map(result => (
          <SearchResultItem
            key={result.id}
            result={result}
            onJumpToMessage={() => jumpToMessage(result)}
          />
        ))}
      </div>
    </div>
  );
}

function SearchResultItem({ result, onJumpToMessage }) {
  const displayData = renderSearchResult(result);

  return (
    <div className="search-result-item" onClick={onJumpToMessage}>
      <div className="result-header">
        <span className="conversation-name">{displayData.conversation}</span>
        <span className="message-time">{displayData.time}</span>
      </div>
      <div className="result-sender">{displayData.sender}</div>
      <div className="result-snippet">{displayData.snippet}</div>
      {result.rank && (
        <div className="result-relevance">
          Relevance: {(result.rank * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
```

## Key Features & Best Practices

### 1. Search Behavior
- **Case-insensitive**: Searches ignore case
- **Word matching**: Searches for whole words when using full-text search
- **Multiple results per conversation**: If "abc" appears in multiple messages in conv-123, all matching messages are returned
- **Active conversations only**: Only searches in conversations where user hasn't left

### 2. Performance Optimization
- **Use pagination**: Always paginate results with `limit` and `offset`
- **Cache results**: Cache search results client-side for quick re-display
- **Debounce search**: Add debounce (300-500ms) to avoid excessive API calls
- **Lazy load**: Load conversation messages only when user clicks to jump

### 3. UI/UX Recommendations
- **Show loading states**: Display skeleton loaders during search
- **Empty states**: Handle no results gracefully
- **Error handling**: Show friendly error messages for network issues
- **Highlight matches**: Use the highlights array to visually mark matched text
- **Quick jump**: Make clicking a result immediately jump to the message
- **Context preview**: Show 2-3 messages before/after using previousMessageId/nextMessageId

### 4. Advanced Features

#### Real-time Search Updates
```javascript
// Subscribe to new messages and update search results if they match
socket.on('newMessage', (message) => {
  if (currentSearchQuery && message.content.includes(currentSearchQuery)) {
    // Add to results or show notification
    addToSearchResults(message);
  }
});
```

#### Search History
```javascript
// Store recent searches in localStorage
const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
searchHistory.unshift(searchQuery);
localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)));
```

#### Export Search Results
```javascript
function exportSearchResults(results) {
  const csv = results.map(r => ({
    Date: new Date(r.createdAt).toISOString(),
    Sender: r.user?.name || 'Unknown',
    Conversation: r.conversation?.name || 'Direct',
    Message: r.content
  }));

  downloadCSV(csv, 'search-results.csv');
}
```

## Error Handling

```javascript
async function searchWithErrorHandling(query) {
  try {
    const results = await searchAllConversations(query);
    return { success: true, data: results };
  } catch (error) {
    console.error('Search failed:', error);

    // Handle specific error cases
    if (error.status === 400) {
      return {
        success: false,
        error: 'Invalid search query. Please try different keywords.'
      };
    }

    if (error.status === 401) {
      // Redirect to login
      router.push('/login');
      return { success: false, error: 'Please log in to search messages.' };
    }

    return {
      success: false,
      error: 'Search failed. Please try again later.'
    };
  }
}
```

## Testing Search Functionality

```javascript
// Example test searches
const testQueries = [
  'hello',           // Simple word
  'user@email.com',  // Email search
  'meeting agenda',  // Multi-word
  'ABC-123',        // With special chars
  'very long search query that tests the maximum character limit', // Long query
];

// Test pagination
async function testPagination() {
  const page1 = await search({ query: 'test', limit: 10, offset: 0 });
  const page2 = await search({ query: 'test', limit: 10, offset: 10 });
  console.assert(page1[0].id !== page2[0].id, 'Pagination working');
}

// Test sorting
async function testSorting() {
  const byRelevance = await search({ query: 'test', sortBy: 'relevance' });
  const byDate = await search({ query: 'test', sortBy: 'date_desc' });
  console.assert(byRelevance[0].rank !== undefined, 'Relevance includes rank');
}
```

## Summary

The search API provides a powerful way to find messages across all conversations with features designed for optimal user experience:

1. **Comprehensive search** across all user conversations
2. **Smart snippets** showing context around matches
3. **Highlight positions** for visual emphasis
4. **Navigation data** for jumping directly to messages
5. **Flexible sorting** by relevance or date
6. **Full-text search** with PostgreSQL for better results

Frontend developers can leverage these features to build a search experience that allows users to quickly find and navigate to any message in their conversation history.