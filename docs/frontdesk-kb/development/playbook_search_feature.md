# Developer Playbook: The Search Feature

This playbook provides a deep, code-level guide to the two search functionalities within the Direct Messages provider: **Global Search** and **In-Conversation Search**.

-   **Primary Hook**: `hooks/use-conversation-search.ts`
-   **UI Components**:
    -   `components/direct-messages/global-search.tsx`
    -   `components/direct-messages/in-conversation-search.tsx`
-   **API Service**: `services/frontdesk/api/direct-messages.service.ts`

## 1. Architecture Overview

The search feature is controlled entirely by the `use-conversation-search.ts` hook. This hook manages the state and logic for both search modes and provides a set of functions to the UI components.

-   **Global Search**: A modal that searches for a query across all of the user's conversations.
-   **In-Conversation Search**: An inline search bar that appears within an active conversation and only searches within that context.

## 2. Deep Dive: Global Search

### Step 1: Initiation

The user clicks the search icon in the `ConversationSidebar`, which calls the `openGlobalSearch()` function from the `use-conversation-search` hook.

### Step 2: The `global-search.tsx` Component

This component renders a modal with a text input. As the user types, a debounced `useEffect` calls the `onSearch` prop, which is connected to the `performGlobalSearch` function in the hook.

```typescript
// Inside global-search.tsx
useEffect(() => {
  // ... debouncing logic ...
  searchTimeoutRef.current = setTimeout(async () => {
    // Calls the function passed down from the hook
    const searchResults = await onSearch(trimmedQuery);
    setResults(searchResults);
  }, 300);
}, [query, onSearch]);
```

### Step 3: `performGlobalSearch` in the Hook

This function in `use-conversation-search.ts` calls the API service.

```typescript
// Inside use-conversation-search.ts
const performGlobalSearch = async (query: string) => {
  // ...
  const response = await directMessagesService.searchAllMessages(query, {
    limit: 50,
    sortBy: 'relevance',
    includeConversationInfo: true,
  });
  // ...
};
```

-   **API Method**: `searchAllMessages` in `direct-messages.service.ts`
-   **Endpoint**: `GET /dms/search`

### Step 4: Jumping to the Message

When the user clicks on a search result, the `onResultSelect` prop is called, which is connected to the `jumpToMessage` function in the hook.

## 3. Deep Dive: In-Conversation Search

### Step 1: Initiation

The user clicks the search icon in the `MessageViewHeader` of an active conversation, which calls `openConversationSearch()`.

### Step 2: The `in-conversation-search.tsx` Component

This component renders a search bar at the top of the message list. It functions similarly to the global search, calling `onSearch` as the user types. It also includes UI for navigating between results.

### Step 3: `performConversationSearch` in the Hook

This function calls the API service with the active conversation's ID.

```typescript
// Inside use-conversation-search.ts
const performConversationSearch = async (query: string) => {
  // ...
  const response = await directMessagesService.searchMessagesInConversation(
    deps.activeConversationId,
    normalizedQuery,
    // ... options
  );
  // ...
};
```

-   **API Method**: `searchMessagesInConversation` in `direct-messages.service.ts`
-   **Endpoint**: `GET /dms/:conversationId/search`

### Step 4: Navigating and Jumping

When the user clicks the up/down arrows or presses Enter, the `onNavigateToResult` function is called. This function updates the `currentSearchIndex` and then calls `jumpToMessage`.

## 4. The `jumpToMessage` Function: A Critical Piece of Logic

The `jumpToMessage` function in `use-conversation-search.ts` is the most complex part of the feature. It is responsible for getting the user from a search result to the actual message in the conversation view.

**Key Logic:**

1.  **Switch Conversation**: If the search result is from a different conversation, it first calls `deps.selectConversation` to switch to the correct one.
2.  **Highlight**: It immediately sets the `highlightedMessageId` state, which causes the `MessageList` to apply a visual highlight to the target message.
3.  **Check if Loaded**: It checks if the target message is already present in the locally stored messages for that conversation.
4.  **Smart Load (if not loaded)**: If the message is not present, it does **not** load the entire message history. Instead, it calls `directMessagesService.loadMessagesAroundTarget`. This special function makes two API calls: one to get messages *before* the target and one to get messages *after*. This efficiently loads just enough context to display the message without fetching thousands of old messages.
5.  **Update State**: It merges the newly loaded messages into the Recoil state.
6.  **Clear Highlight**: It uses a `setTimeout` to clear the highlight after a few seconds.

**Key Insight for Debugging**: If a user reports that clicking a search result doesn't work, the `jumpToMessage` function is the primary place to investigate. Common issues could be:
-   The `loadMessagesAroundTarget` function failing.
-   The logic for merging the new messages into the existing state having a bug.
-   The `selectConversation` call failing before the jump can occur.
