# FrontDesk Shared Components Reference

**Last Updated:** 2025-10-15
**Coverage:** 31 Components Documented

This document provides a comprehensive reference for all shared components and UI elements used across FrontDesk providers. Each component is documented with its purpose, props interface, usage examples, and styling details.

---

## Table of Contents

- [Conversation Components](#conversation-components)
- [Provider Base Components](#provider-base-components)
- [Shared Base Components](#shared-base-components)
- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Utility Components](#utility-components)

---

## Conversation Components

Components for building conversation views across different providers.

### ConversationHeader

**Purpose:** Displays the header of a conversation with subject, sender info, and metadata.

**Location:** `src/widgets/frontdesk/components/conversation/conversation-header.tsx`

**Props Interface:**
```typescript
interface Props {
  subject: string;              // Conversation subject/title
  fromName: string;             // Sender's name
  receivedAt?: string;          // Timestamp (human-readable)
  label?: string;               // Label (e.g., "Inbox") - Default: "Inbox"
}
```

**Usage Example:**
```typescript
import { ConversationHeader } from '@/widgets/frontdesk/components/conversation/conversation-header';

<ConversationHeader
  subject="Re: Order #1234"
  fromName="John Smith"
  receivedAt="2 hours ago"
  label="Inbox"
/>
```

**Features:**
- Avatar with initials generation
- Subject display with typography
- Timestamp and label badges
- Uses Material-UI theme integration

---

### ConversationReplyBox

**Purpose:** Input field for replying to conversations with send button.

**Location:** `src/widgets/frontdesk/components/conversation/conversation-reply-box.tsx`

**Props Interface:**
```typescript
interface Props {
  value: string;                // Current input value
  onChange: (v: string) => void; // Input change handler
  onSend: () => void;           // Send button handler
  placeholder?: string;         // Placeholder text - Default: "Type a reply..."
  meInitial?: string;           // User's initial - Default: "Y"
}
```

**Usage Example:**
```typescript
import { ConversationReplyBox } from '@/widgets/frontdesk/components/conversation/conversation-reply-box';

<ConversationReplyBox
  value={replyText}
  onChange={setReplyText}
  onSend={handleSend}
  placeholder="Type your message..."
  meInitial="JS"
/>
```

**Features:**
- Multiline text input (max 4 rows)
- Enter key to send (Shift+Enter for new line)
- Avatar with customizable initial
- Send button with disabled state
- Auto-focus support

---

### ConversationThread

**Purpose:** Displays a thread of messages in a conversation with chat-like bubbles.

**Location:** `src/widgets/frontdesk/components/conversation/conversation-thread.tsx`

**Props Interface:**
```typescript
interface Props {
  messages: ConversationMessage[];  // Array of messages
  themLabel?: string;               // Label for "them" - Default: "Them"
}

// ConversationMessage type
type ConversationMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  at: string;  // human readable time
};
```

**Usage Example:**
```typescript
import { ConversationThread } from '@/widgets/frontdesk/components/conversation/conversation-thread';

<ConversationThread
  messages={[
    { id: '1', from: 'them', text: 'Hello!', at: '10:30 AM' },
    { id: '2', from: 'me', text: 'Hi there!', at: '10:31 AM' }
  ]}
  themLabel="Customer"
/>
```

**Features:**
- Chat bubble UI with different styles for "me" vs "them"
- Automatic avatar generation
- Message grouping (consecutive messages from same sender)
- Smooth animations on hover
- Scrollable container with custom scrollbar
- Gradient background

**Styling:**
- Message bubbles with rounded corners (different for me/them)
- Box shadows and hover effects
- Responsive avatar sizing
- Time labels with subtle typography

---

### ConversationToolbar

**Purpose:** Action toolbar with quick actions for conversations.

**Location:** `src/widgets/frontdesk/components/conversation/conversation-toolbar.tsx`

**Props Interface:**
```typescript
interface Props {
  onRefresh?: () => void;        // Refresh action
  onMarkRead?: () => void;       // Mark as read action
  onArchive?: () => void;        // Archive action
  onMore?: (e: React.MouseEvent<HTMLButtonElement>) => void; // More actions
  size?: "small" | "medium";     // Button size - Default: "small"
  dense?: boolean;               // Compact spacing - Default: true
}
```

**Usage Example:**
```typescript
import { ConversationToolbar } from '@/widgets/frontdesk/components/conversation/conversation-toolbar';

<ConversationToolbar
  onRefresh={handleRefresh}
  onMarkRead={handleMarkRead}
  onArchive={handleArchive}
  onMore={handleMoreActions}
  size="small"
  dense={true}
/>
```

**Actions:**
- Refresh icon button
- Mark as read icon button
- Archive icon button
- More options icon button

---

## Provider Base Components

Reusable components for standardizing provider views.

### BaseProviderView

**Purpose:** Base layout for provider views with connection state management.

**Location:** `src/widgets/frontdesk/components/providers/base-provider-view.tsx`

**Props Interface:**
```typescript
interface BaseProviderViewProps {
  // Provider metadata
  providerName: string;
  providerIcon: React.ReactNode;
  connectionEmail?: string;
  isConnected: boolean;
  isLoading?: boolean;
  onOpenSettings: () => void;
  onConnect: () => void;

  // Conversations
  conversations: ConversationItem[];
  conversationsLoading?: boolean;
  conversationsError?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;

  // Selection
  selectedConversation?: any;
  onSelectConversation: (item: ConversationItem) => void;
  onFetchDetail?: (id: string) => void;

  // Messages
  messages: ConversationMessage[];
  onSendReply: (text: string) => Promise<boolean>;
  isSending?: boolean;

  // Components
  conversationListComponent: React.ReactNode;
  authModalComponent: React.ReactNode;
}
```

**Usage Example:**
```typescript
import { BaseProviderView } from '@/widgets/frontdesk/components/providers/base-provider-view';

<BaseProviderView
  providerName="Email"
  providerIcon={<EmailIcon />}
  connectionEmail="user@example.com"
  isConnected={true}
  onOpenSettings={handleSettings}
  onConnect={handleConnect}
  conversations={conversations}
  onSelectConversation={handleSelect}
  messages={messages}
  onSendReply={handleReply}
  conversationListComponent={<ConversationList />}
  authModalComponent={<AuthModal />}
/>
```

**Features:**
- Two-column layout (list + viewer)
- Connection state alerts
- Loading and error states
- Conversation selection
- Message thread display
- Reply functionality

---

### BaseConversationList

**Purpose:** Virtualized conversation list with search, filters, and pagination.

**Location:** `src/widgets/frontdesk/components/providers/base-conversation-list.tsx`

**Props Interface:**
```typescript
interface BaseConversationListProps {
  items: ConversationItem[];
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSelect?: (item: ConversationItem) => void;
  selectedId?: string;
  density?: 'comfortable' | 'compact';  // Default: 'comfortable'
  enableVirtualization?: boolean;        // Default: true
}

interface ConversationItem {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
  receivedAt: string;
  unread?: boolean;
  body?: string;
}
```

**Usage Example:**
```typescript
import { BaseConversationList } from '@/widgets/frontdesk/components/providers/base-conversation-list';

<BaseConversationList
  items={conversations}
  selectedId={selectedId}
  onSelect={handleSelect}
  loading={isLoading}
  hasMore={hasMore}
  onLoadMore={loadMore}
  density="comfortable"
  enableVirtualization={true}
/>
```

**Features:**
- Automatic virtualization for lists > 50 items
- Keyboard navigation (Arrow Up/Down)
- Two density modes (comfortable/compact)
- Auto-scroll to selected item
- Infinite scroll/load more
- Empty state handling
- Error display with retry

**Performance:**
- Uses `react-window` for virtualization
- Memoized row components
- ResizeObserver for dynamic height
- Custom scrollbar styling

---

### ConversationListRow

**Purpose:** Individual row component for conversation lists.

**Location:** `src/widgets/frontdesk/components/providers/conversation-list-row.tsx`

**Props Interface:**
```typescript
interface ConversationListRowProps {
  item: ConversationItem;
  isSelected: boolean;
  density: 'comfortable' | 'compact';
  onSelect: (item: ConversationItem) => void;
  style?: React.CSSProperties;  // For virtualization
}
```

**Usage Example:**
```typescript
import { ConversationListRow } from '@/widgets/frontdesk/components/providers/conversation-list-row';

<ConversationListRow
  item={conversation}
  isSelected={selectedId === conversation.id}
  density="comfortable"
  onSelect={handleSelect}
/>
```

**Features:**
- Avatar with initials
- Unread state highlighting
- Three-line display (name, subject, snippet)
- Timestamp formatting
- Selection indicator (colored border)
- Hover effects
- Memoized for performance

---

### VirtualizedConversationList

**Purpose:** High-performance virtualized list for large conversation datasets.

**Location:** `src/widgets/frontdesk/components/providers/virtualized-conversation-list.tsx`

**Props Interface:**
```typescript
interface VirtualizedConversationListProps {
  items: ConversationItem[];
  selectedId?: string;
  density: 'comfortable' | 'compact';
  onSelect?: (item: ConversationItem) => void;
  height: number;                    // Container height in pixels
  width?: number | string;           // Default: "100%"
  overscanCount?: number;            // Default: 5
}

// Exposed handle for imperative scrolling
interface VirtualizedListHandle {
  scrollToItem: (index: number, align?: "start" | "center" | "end" | "smart" | "auto") => void;
}
```

**Usage Example:**
```typescript
import { VirtualizedConversationList } from '@/widgets/frontdesk/components/providers/virtualized-conversation-list';

const listRef = useRef<VirtualizedListHandle>(null);

<VirtualizedConversationList
  ref={listRef}
  items={conversations}
  selectedId={selectedId}
  density="comfortable"
  onSelect={handleSelect}
  height={600}
  overscanCount={10}
/>
```

**Features:**
- Uses `react-window` FixedSizeList
- Dynamic item heights based on density
- Custom scrollbar
- Imperative scroll API
- Dividers between items
- Efficient re-rendering

**Item Heights:**
- Comfortable: 80px
- Compact: 56px

---

### DensityToggle

**Purpose:** Toggle button for switching between comfortable/compact list views.

**Location:** `src/widgets/frontdesk/components/providers/density-toggle.tsx`

**Props Interface:**
```typescript
// Two variants available:

// 1. DensityToggle (Toggle button group)
export const DensityToggle: React.FC = () => {...}

// 2. DensityToggleIcon (Single icon button)
export const DensityToggleIcon: React.FC = () => {...}
```

**State Management:**
```typescript
// Uses Recoil state from email provider
import { emailUIState } from '@/widgets/frontdesk/providers/email/store/email-store';
```

**Usage Example:**
```typescript
import { DensityToggle, DensityToggleIcon } from '@/widgets/frontdesk/components/providers/density-toggle';

// Toggle button group
<DensityToggle />

// Single icon button (for compact toolbars)
<DensityToggleIcon />
```

**Features:**
- Two UI variants (toggle group / icon button)
- Smooth transitions
- Tooltip support
- Icon changes based on current density

---

## Shared Base Components

High-level shared components used across multiple providers.

### BaseAccountSidebar

**Purpose:** Sidebar for managing multiple accounts with connection status.

**Location:** `src/widgets/frontdesk/components/shared/BaseAccountSidebar.tsx`

**Props Interface:**
```typescript
interface BaseAccountSidebarProps {
  accounts: BaseAccount[];
  selectedAccountId?: string;
  onAccountSelect: (accountId: string) => void;
  onAddAccount: () => void;
  onDisconnectAccount?: (accountId: string) => void;
  onRefresh?: () => void;
  title?: string;                    // Default: "Accounts"
  addButtonLabel?: string;           // Default: "Add Account"
  emptyMessage?: string;             // Default: "No accounts connected"
  showStatus?: boolean;              // Default: true
  labelsSection?: React.ReactNode;   // Optional labels/filters section
}

interface BaseAccount {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  unreadCount?: number;
}
```

**Usage Example:**
```typescript
import { BaseAccountSidebar } from '@/widgets/frontdesk/components/shared/BaseAccountSidebar';

<BaseAccountSidebar
  accounts={emailAccounts}
  selectedAccountId={selectedId}
  onAccountSelect={handleAccountSelect}
  onAddAccount={handleAddAccount}
  onDisconnectAccount={handleDisconnect}
  onRefresh={handleRefresh}
  title="Email Accounts"
  showStatus={true}
  labelsSection={<LabelsList />}
/>
```

**Features:**
- Account list with avatars
- Online status indicators
- Unread count badges
- Add account button
- Refresh button
- Account menu (Settings, Disconnect)
- Optional labels section
- Empty state with CTA

---

### BaseConversationList (Shared)

**Purpose:** Rich conversation list with search, labels, and metadata.

**Location:** `src/widgets/frontdesk/components/shared/BaseConversationList.tsx`

**Props Interface:**
```typescript
interface BaseConversationListProps {
  conversations: BaseConversationItem[];
  selectedConversationId?: string;
  onConversationSelect: (conversation: BaseConversationItem) => void;
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  title?: string;              // Default: "Conversations"
  emptyMessage?: string;       // Default: "No conversations"
  emptySubtitle?: string;      // Default: "No messages found"
}

interface BaseConversationItem {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  unreadCount?: number;
  labels?: string[];
}
```

**Usage Example:**
```typescript
import { BaseConversationList } from '@/widgets/frontdesk/components/shared/BaseConversationList';

<BaseConversationList
  conversations={conversations}
  selectedConversationId={selectedId}
  onConversationSelect={handleSelect}
  loading={isLoading}
  onRefresh={handleRefresh}
  title="Inbox"
/>
```

**Features:**
- Rich conversation cards with metadata
- Avatar color generation
- Date formatting (relative/absolute)
- Star indicator
- Attachment indicator
- Label chips
- Unread count badges
- Load more pagination
- Empty state with icon

---

### BaseMessageInput

**Purpose:** Advanced message input with mentions, emojis, and attachments.

**Location:** `src/widgets/frontdesk/components/shared/BaseMessageInput.tsx`

**Props Interface:**
```typescript
interface BaseMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;         // Default: "Type a message..."
  disabled?: boolean;           // Default: false
  isSending?: boolean;          // Default: false
  showAttachments?: boolean;    // Default: true
  showEmojis?: boolean;         // Default: true
}
```

**Usage Example:**
```typescript
import { BaseMessageInput } from '@/widgets/frontdesk/components/shared/BaseMessageInput';

<BaseMessageInput
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  onTypingStart={() => setTyping(true)}
  onTypingStop={() => setTyping(false)}
  placeholder="Type a message..."
  showAttachments={true}
  showEmojis={true}
/>
```

**Features:**
- Multiline input (max 4 rows)
- @ Mention support with autocomplete
- Emoji button (placeholder)
- Attachment button
- Send button with loading state
- Keyboard shortcuts (Enter to send, Shift+Enter for new line, Escape to clear)
- Typing indicators (start/stop)
- Auto-focus management

**Mentions:**
- Triggered by "@" character
- Category filtering (clients, suppliers, invoices, receipts)
- Keyboard navigation (Arrow Up/Down, Enter, Tab)
- Smart positioning
- Search filtering

---

### BaseMessageViewer

**Purpose:** Message viewer with conversation header, actions, and quick reply.

**Location:** `src/widgets/frontdesk/components/shared/BaseMessageViewer.tsx`

**Props Interface:**
```typescript
interface BaseMessageViewerProps {
  conversation: BaseConversation;
  messages: BaseMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  onBack?: () => void;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onStar?: (starred: boolean) => void;
  onPrint?: () => void;
  onAddLabel?: (label: string) => void;
  quickReplyComponent?: React.ReactNode;
  showQuickReply?: boolean;     // Default: true
}

interface BaseConversation {
  id: string;
  subject: string;
  participants: string[];
  messageCount: number;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  labels?: string[];
}

interface BaseMessage {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  isOwn?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  isHighlighted?: boolean;
}
```

**Usage Example:**
```typescript
import { BaseMessageViewer } from '@/widgets/frontdesk/components/shared/BaseMessageViewer';

<BaseMessageViewer
  conversation={selectedConversation}
  messages={messages}
  currentUserId={userId}
  onBack={handleBack}
  onReply={handleReply}
  onReplyAll={handleReplyAll}
  onForward={handleForward}
  onArchive={handleArchive}
  onStar={handleStar}
  quickReplyComponent={<QuickReply />}
  showQuickReply={true}
/>
```

**Actions:**
- Back button
- Star/Unstar
- Print
- Archive
- Delete
- Reply
- Reply All
- Forward

**Features:**
- Conversation header with metadata
- Label chips
- Participant badges
- Time display (relative)
- Action buttons (icon + text variants)
- BaseMessageList integration
- Quick reply section

---

### BaseProviderSidebar

**Purpose:** Flexible sidebar for channels, direct messages, accounts, and labels.

**Location:** `src/widgets/frontdesk/components/shared/BaseProviderSidebar.tsx`

**Props Interface:**
```typescript
interface BaseProviderSidebarProps {
  title: string;
  items: BaseSidebarItem[];
  selectedItemId?: string;
  onItemSelect: (item: BaseSidebarItem) => void;
  onAddItem?: () => void;
  onRefresh?: () => void;
  showSections?: boolean;       // Default: true
  sections?: {
    channels?: string;          // Default: "CHANNELS"
    directMessages?: string;    // Default: "DIRECT MESSAGES"
    accounts?: string;          // Default: "ACCOUNTS"
    labels?: string;            // Default: "LABELS"
  };
  emptyMessage?: string;        // Default: "No items available"
  loading?: boolean;            // Default: false
}

interface BaseSidebarItem {
  id: string;
  name: string;
  type: "channel" | "direct" | "account" | "label";
  unreadCount?: number;
  isSelected?: boolean;
  icon?: React.ReactNode;
  status?: "online" | "away" | "busy" | "offline";
  lastSeen?: string;
  email?: string;
}
```

**Usage Example:**
```typescript
import { BaseProviderSidebar } from '@/widgets/frontdesk/components/shared/BaseProviderSidebar';

<BaseProviderSidebar
  title="Direct Messages"
  items={channels}
  selectedItemId={selectedId}
  onItemSelect={handleSelect}
  onAddItem={handleAddChannel}
  onRefresh={handleRefresh}
  showSections={true}
  sections={{
    channels: "Channels",
    directMessages: "Direct Messages"
  }}
/>
```

**Features:**
- Collapsible sections
- Status indicators (online, away, busy, offline)
- Unread count badges
- Last seen timestamps
- Add item button per section
- Refresh button in header
- Empty state
- Loading state

---

### BaseMessageList

**Purpose:** Chat-style message list with bubbles, typing indicators, and scroll management.

**Location:** `src/widgets/frontdesk/components/shared/BaseMessageList.tsx`

**Props Interface:**
```typescript
interface BaseMessageListProps {
  messages: BaseMessage[];
  currentUserId?: string;
  typingUsers?: string[];
  userPresence?: Record<string, any>;
  isLoadingHistory?: boolean;
  emptyMessage?: string;        // Default: "No messages yet"
  themLabel?: string;           // Default: "Them"
  lastReadMessageId?: string;
  onScrollToUnread?: () => void;
  highlightedMessageId?: string | null;
  searchQuery?: string;
}

interface BaseMessage {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  isOwn?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  isHighlighted?: boolean;
}
```

**Usage Example:**
```typescript
import { BaseMessageList } from '@/widgets/frontdesk/components/shared/BaseMessageList';

<BaseMessageList
  messages={messages}
  currentUserId={currentUser.id}
  typingUsers={typingUserIds}
  userPresence={presenceMap}
  lastReadMessageId={lastReadId}
  onScrollToUnread={handleScrollToUnread}
  highlightedMessageId={searchResultId}
  searchQuery={searchQuery}
/>
```

**Features:**
- Chat bubble UI (me vs them)
- Message grouping (same user within 5 minutes)
- Typing indicator
- Auto-scroll to bottom
- Auto-scroll to unread messages
- Scroll to highlighted message (search results)
- Search term highlighting
- Unread message indicators
- Time formatting (relative/absolute)
- Avatar with initials
- User presence display
- Empty state
- Loading state

**Styling:**
- Gradient background
- Message bubble animations
- Hover effects
- Unread pulse animation
- Custom scrollbar

---

### ConversationMessageList

**Purpose:** Unified message list for email and ticket conversations.

**Location:** `src/widgets/frontdesk/components/shared/ConversationMessageList.tsx`

**Props Interface:**
```typescript
interface ConversationMessageListProps {
  messages: UnifiedMessage[];
  variant?: "email" | "ticket";  // Default: "email"
  loading?: boolean;
  accountId?: string;            // For email attachments
  emptyStateTitle?: string;      // Default: "No messages yet"
  emptyStateDescription?: string; // Default: "Messages will appear here"
}
```

**Usage Example:**
```typescript
import { ConversationMessageList } from '@/widgets/frontdesk/components/shared/ConversationMessageList';

<ConversationMessageList
  messages={unifiedMessages}
  variant="ticket"
  loading={isLoading}
  accountId={selectedAccountId}
/>
```

**Features:**
- Renders UnifiedMessage array
- Loading state with spinner
- Empty state customization
- MessageItem integration

---

### InlineReplySection

**Purpose:** Inline reply UI for quick responses in email and tickets.

**Location:** `src/widgets/frontdesk/components/shared/InlineReplySection.tsx`

**Props Interface:**
```typescript
interface InlineReplySectionProps {
  title?: string;                // Auto-generated if not provided
  replyText: string;
  isSending: boolean;
  onReplyTextChange: (text: string) => void;
  onSend: () => void;
  onCancel: () => void;
  showReplyAll?: boolean;        // Default: false
  isReplyAll?: boolean;          // Default: false
}
```

**Usage Example:**
```typescript
import { InlineReplySection } from '@/widgets/frontdesk/components/shared/InlineReplySection';

<InlineReplySection
  title="Reply to Customer"
  replyText={replyText}
  isSending={isSending}
  onReplyTextChange={setReplyText}
  onSend={handleSend}
  onCancel={handleCancel}
  showReplyAll={true}
  isReplyAll={false}
/>
```

**Features:**
- BaseMessageInput integration
- Title display with close button
- Send/Cancel actions
- Loading state
- Reply/Reply All mode (email)
- Keyboard shortcuts

---

### MessageItem

**Purpose:** Individual message display with avatars, content, and attachments.

**Location:** `src/widgets/frontdesk/components/shared/MessageItem.tsx`

**Props Interface:**
```typescript
interface MessageItemProps {
  message: UnifiedMessage;
  variant?: "email" | "ticket";  // Default: "email"
  accountId?: string;            // Required for email attachments
  isLast?: boolean;              // Default: false
}
```

**Usage Example:**
```typescript
import { MessageItem } from '@/widgets/frontdesk/components/shared/MessageItem';

<MessageItem
  message={message}
  variant="ticket"
  accountId={accountId}
  isLast={false}
/>
```

**Features:**
- Avatar with initials and color
- Author name and email
- Timestamp formatting
- HTML content rendering
- Attachment display
- Channel badge (ticket variant)
- Status badge (ticket variant)
- Direction indicator (inbound/outbound)
- Smart content formatting

**Content Styling:**
- Paragraphs, headings, lists
- Images with max-width
- Links with hover effects
- Tables
- Blockquotes
- Text formatting (bold, italic)

---

### MentionsMenu

**Purpose:** Autocomplete menu for @ mentions with category filtering.

**Location:** `src/widgets/frontdesk/components/shared/mentions/MentionsMenu.tsx`

**Props Interface:**
```typescript
interface MentionsMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  query: string;
  category: MentionCategory;
  onCategoryChange: (c: MentionCategory) => void;
  results: MentionGroup[];
  loading: boolean;
  highlightedIndex: number;
  onHighlightChange: (next: number) => void;
  onPick: (item: MentionItem) => void;
  onClose: () => void;
}

type MentionCategory = "clients" | "suppliers" | "invoices" | "receipts" | "all";

interface MentionGroup {
  title: string;
  items: MentionItem[];
}

interface MentionItem {
  id: string;
  label: string;
  sublabel?: string;
  category: MentionCategory;
  raw?: any;
}
```

**Usage Example:**
```typescript
import { MentionsMenu } from '@/widgets/frontdesk/components/shared/mentions/MentionsMenu';

<MentionsMenu
  open={mentionOpen}
  anchorEl={inputRef.current}
  query={mentionQuery}
  category={mentionCategory}
  onCategoryChange={setMentionCategory}
  results={mentionResults}
  loading={isLoading}
  highlightedIndex={highlightedIndex}
  onHighlightChange={setHighlightedIndex}
  onPick={handlePick}
  onClose={handleClose}
/>
```

**Features:**
- Popper-based positioning
- Category groups with headers
- Keyboard navigation
- Mouse hover highlighting
- Loading state
- Empty state
- Category icons
- Category filtering with chevron
- Grouped results display

---

## UI Components

### ConversationList (UI)

**Purpose:** Generic conversation list with loading skeletons and channel indicators.

**Location:** `src/widgets/frontdesk/components/ui/ConversationList/ConversationList.tsx`

**Props Interface:**
```typescript
interface ConversationListProps {
  conversations: BaseConversation[];
  selectedId?: string;
  onSelect: (conversation: BaseConversation) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;        // Default: "No conversations"
  showChannelIndicator?: boolean; // Default: false
  renderChannelIndicator?: (conversation: BaseConversation) => React.ReactNode;
  groupByDate?: boolean;        // Default: false
  compact?: boolean;            // Default: false
}

interface BaseConversation {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}
```

**Usage Example:**
```typescript
import { ConversationList } from '@/widgets/frontdesk/components/ui/ConversationList/ConversationList';

<ConversationList
  conversations={conversations}
  selectedId={selectedId}
  onSelect={handleSelect}
  loading={isLoading}
  emptyMessage="No messages"
  showChannelIndicator={true}
  renderChannelIndicator={(conv) => <ChannelBadge channel={conv.channel} />}
  compact={false}
/>
```

**Features:**
- Avatar with initials
- Unread badge
- Time formatting (relative)
- Channel indicator (optional)
- Compact mode
- Loading skeletons
- Empty state
- Load more button
- Selection highlighting

---

### DropdownMenu

**Purpose:** Standardized dropdown menu component with design system tokens.

**Location:** `src/widgets/frontdesk/components/dropdown-menu/dropdown-menu.tsx`

**Props Interface:**
```typescript
interface DropdownMenuProps extends Omit<MenuProps, 'open'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions?: React.ReactNode;
  width?: number;                // Default: 280
  disableContentPadding?: boolean; // Default: false
}
```

**Usage Example:**
```typescript
import { DropdownMenu, MenuSubheader } from '@/widgets/frontdesk/components/dropdown-menu/dropdown-menu';

<DropdownMenu
  open={menuOpen}
  anchorEl={anchorEl}
  onClose={handleClose}
  title="Quick Actions"
  width={320}
  actions={
    <>
      <Button size="small">Cancel</Button>
      <Button size="small" variant="contained">Apply</Button>
    </>
  }
>
  <MenuSubheader>Section Title</MenuSubheader>
  <MenuItem onClick={handleAction}>Action 1</MenuItem>
  <MenuItem onClick={handleAction}>Action 2</MenuItem>
</DropdownMenu>
```

**Features:**
- Design system token integration
- Optional title
- Optional actions footer
- Customizable width
- Content padding control
- Smooth transitions
- Shadow and border styling

**Components:**
- `DropdownMenu`: Main menu component
- `MenuSubheader`: Section header

---

## Layout Components

### ThreeColumnLayout

**Purpose:** Main layout structure for FrontDesk with navigation, list, and content areas.

**Location:** `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`

**Props Interface:**
```typescript
interface ThreeColumnLayoutProps {
  navigationContent: React.ReactNode;  // Column 1 - Navigation sidebar
  listContent?: React.ReactNode;       // Column 2 - List panel (optional)
  mainContent: React.ReactNode;        // Column 3 - Main content area
  navigationWidth?: number;            // Default: 220px
  listWidth?: number;                  // Default: 280px
  hideMiddleColumn?: boolean;          // Default: false
  className?: string;
}
```

**Usage Example:**
```typescript
import { ThreeColumnLayout } from '@/widgets/frontdesk/layouts/three-column/ThreeColumnLayout';

<ThreeColumnLayout
  navigationContent={<NavigationSidebar />}
  listContent={<ConversationList />}
  mainContent={<MessageViewer />}
  navigationWidth={220}
  listWidth={300}
  hideMiddleColumn={false}
/>
```

**Features:**
- Three-column structure
- Responsive width adjustments (mobile)
- Optional middle column
- Overflow handling
- Smooth transitions
- Border separators

**Responsive Behavior:**
- Desktop: Full three columns
- Mobile: Collapsed navigation (60px), narrower list (200px)

---

### ContentArea

**Purpose:** Container for main content with fade animations.

**Location:** `src/widgets/frontdesk/layouts/components/ContentArea/ContentArea.tsx`

**Props Interface:**
```typescript
interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;  // Default: false
}
```

**Usage Example:**
```typescript
import { ContentArea } from '@/widgets/frontdesk/layouts/components/ContentArea/ContentArea';

<ContentArea noPadding={false}>
  <MessageViewer />
</ContentArea>
```

**Features:**
- Flex layout
- Overflow handling
- Fade-in animation
- Optional padding control

---

### DynamicListPanel

**Purpose:** Middle panel with header, search, and dynamic content.

**Location:** `src/widgets/frontdesk/layouts/components/DynamicListPanel/DynamicListPanel.tsx`

**Props Interface:**
```typescript
interface DynamicListPanelProps {
  channel: Channel;
  content: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  accountSelector?: React.ReactNode;
  loading?: boolean;
  error?: string;
  title?: string;                // Auto-generated from channel if not provided
  headerActions?: React.ReactNode;
  className?: string;
}

type Channel = 'all' | 'email' | 'whatsapp' | 'internal';
```

**Usage Example:**
```typescript
import { DynamicListPanel } from '@/widgets/frontdesk/layouts/components/DynamicListPanel/DynamicListPanel';

<DynamicListPanel
  channel="email"
  content={<ConversationList />}
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  accountSelector={<AccountSelector />}
  loading={isLoading}
  title="Email Inbox"
  headerActions={<RefreshButton />}
/>
```

**Features:**
- Dynamic title based on channel
- Search bar with icon
- Account selector slot
- Header actions slot
- Loading state
- Error state with styling
- Empty state
- Fade-in animation

---

### NavigationSidebar

**Purpose:** Left navigation sidebar with channels, ticket views, and settings.

**Location:** `src/widgets/frontdesk/layouts/components/NavigationSidebar/NavigationSidebar.tsx`

**Props Interface:**
```typescript
interface NavigationSidebarProps {
  selectedChannel: Channel;
  selectedSection: Section;
  selectedTicketView?: TicketView;
  onChannelSelect: (channel: Channel) => void;
  onSectionSelect: (section: Section) => void;
  onTicketViewSelect?: (view: TicketView) => void;
  channelBadges?: {
    all?: number;
    email?: number;
    whatsapp?: number;
    internal?: number;
  };
  ticketCounts?: {
    'my-tickets'?: number;
    'unassigned'?: number;
    'all-tickets'?: number;
    'done'?: number;
    'archived'?: number;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

type Channel = 'all' | 'email' | 'whatsapp' | 'internal';
type Section = 'inbox' | 'assigned' | 'admin' | 'settings';
type TicketView = 'my-tickets' | 'unassigned' | 'all-tickets' | 'done' | 'archived';
```

**Usage Example:**
```typescript
import { NavigationSidebar } from '@/widgets/frontdesk/layouts/components/NavigationSidebar/NavigationSidebar';

<NavigationSidebar
  selectedChannel={selectedChannel}
  selectedSection={selectedSection}
  selectedTicketView={selectedTicketView}
  onChannelSelect={handleChannelSelect}
  onSectionSelect={handleSectionSelect}
  onTicketViewSelect={handleTicketViewSelect}
  channelBadges={{ email: 5, whatsapp: 2 }}
  ticketCounts={{ 'my-tickets': 8, 'unassigned': 3 }}
  isCollapsed={false}
  onToggleCollapse={handleToggle}
/>
```

**Features:**
- Collapsible sidebar (220px ↔ 64px)
- Dashboard quick link
- Collapsible sections (Ticket Views, Live Chats)
- Badge counts for channels
- Badge counts for ticket views
- Settings footer
- Tooltips for collapsed state
- Selection highlighting
- Smooth transitions

**Sections:**
- Dashboard
- Ticket Views (5 views)
- Live Chats (3 channels)
- Settings

---

## Utility Components

### FrontdeskEmptyState

**Purpose:** Empty state display with title and subtitle.

**Location:** `src/widgets/frontdesk/components/empty-state.tsx`

**Props Interface:**
```typescript
interface FrontdeskEmptyStateProps {
  title?: string;      // Default: "No conversation selected"
  subtitle?: string;   // Default: "Choose a conversation from the list to preview"
}
```

**Usage Example:**
```typescript
import { FrontdeskEmptyState } from '@/widgets/frontdesk/components/empty-state';

<FrontdeskEmptyState
  title="No messages"
  subtitle="Start a conversation to see messages here"
/>
```

---

### FrontdeskLoading

**Purpose:** Loading spinner with optional label.

**Location:** `src/widgets/frontdesk/components/loading-spinner.tsx`

**Props Interface:**
```typescript
interface FrontdeskLoadingProps {
  label?: string;  // Default: "Loading..."
}
```

**Usage Example:**
```typescript
import { FrontdeskLoading } from '@/widgets/frontdesk/components/loading-spinner';

<FrontdeskLoading label="Loading messages..." />
```

---

## Type Definitions

### ConversationMessage

**Location:** `src/widgets/frontdesk/components/conversation/conversation-types.ts`

```typescript
type ConversationMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  at: string;  // human readable time
};
```

---

### Provider Types

**Location:** `src/widgets/frontdesk/components/providers/provider-types.ts`

```typescript
interface ConversationItem {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
  receivedAt: string;
  unread?: boolean;
  body?: string;
}

interface ProviderConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  email?: string;
  error?: string;
}

interface ProviderHooks<T = any> {
  connectionState: ProviderConnectionState;
  conversations: ConversationItem[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  sendReply: (data: T) => Promise<boolean>;
  isSending: boolean;
}
```

---

### Mention Types

**Location:** `src/widgets/frontdesk/components/shared/mentions/types.ts`

```typescript
type MentionCategory = "clients" | "suppliers" | "invoices" | "receipts" | "all";

interface MentionItem {
  id: string;
  label: string;
  sublabel?: string;
  category: MentionCategory;
  raw?: any;
}

interface MentionGroup {
  title: string;
  items: MentionItem[];
}
```

---

## Design System Integration

All shared components use the FrontDesk Design System for consistent styling:

```typescript
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const { primaryColor, neutralColor, secondColor } = useGomakeTheme();
```

**Color Functions:**
- `primaryColor(shade)` - Primary brand colors (50-900)
- `neutralColor(shade)` - Neutral grays (25-900)
- `secondColor(shade)` - Secondary accent colors

**Common Patterns:**
- Border colors: `neutralColor(200)`
- Background: `neutralColor(25)`, `neutralColor(50)`
- Text: `neutralColor(700)`, `neutralColor(900)`
- Hover: `primaryColor(100)`, `primaryColor(50)`
- Selected: `primaryColor(500)`

---

## Import Patterns

### Single Component Import

```typescript
import { ConversationHeader } from '@/widgets/frontdesk/components/conversation/conversation-header';
```

### Multiple Component Import

```typescript
import {
  BaseProviderView,
  BaseConversationList,
  ConversationListRow
} from '@/widgets/frontdesk/components/providers';
```

### Shared Components

```typescript
import {
  BaseMessageInput,
  BaseMessageViewer,
  BaseAccountSidebar
} from '@/widgets/frontdesk/components/shared';
```

---

## Migration Notes

### From Legacy to New Components

**Old Pattern (Direct provider implementation):**
```typescript
// ❌ Old: Custom conversation list in each provider
const EmailConversationList = () => {
  // Custom implementation
};
```

**New Pattern (Shared components):**
```typescript
// ✅ New: Use shared BaseConversationList
import { BaseConversationList } from '@/widgets/frontdesk/components/providers';

const EmailConversationList = () => {
  return (
    <BaseConversationList
      items={conversations}
      onSelect={handleSelect}
      // ...other props
    />
  );
};
```

---

## Component Status

| Component | Status | Used By | Notes |
|-----------|--------|---------|-------|
| ConversationHeader | ✅ Stable | Email, Tickets | Widely used |
| ConversationReplyBox | ✅ Stable | Email, Tickets | Widely used |
| ConversationThread | ✅ Stable | Internal DMs | Widely used |
| ConversationToolbar | ✅ Stable | Email | Widely used |
| BaseProviderView | ✅ Stable | Email, WhatsApp | Provider wrapper |
| BaseConversationList | ✅ Stable | Email, Internal | Main list component |
| BaseAccountSidebar | ✅ Stable | Email | Multi-account management |
| BaseMessageInput | ✅ Stable | Internal DMs, Tickets | Input with mentions |
| BaseMessageViewer | ✅ Stable | Email | Full message viewer |
| BaseMessageList | ✅ Stable | Internal DMs | Chat-style messages |
| MessageItem | ✅ Stable | Email, Tickets | Unified message display |
| InlineReplySection | ✅ Stable | Email, Tickets | Quick reply UI |
| ConversationMessageList | ✅ Stable | Email, Tickets | Message list wrapper |
| MentionsMenu | ✅ Stable | BaseMessageInput | Autocomplete menu |
| ThreeColumnLayout | ✅ Stable | All providers | Main layout |
| NavigationSidebar | ✅ Stable | Main widget | Left navigation |
| DynamicListPanel | ✅ Stable | All providers | Middle panel |
| ContentArea | ✅ Stable | All providers | Right content |
| DropdownMenu | ✅ Stable | Various | Menu wrapper |
| FrontdeskEmptyState | ✅ Stable | All providers | Empty states |
| FrontdeskLoading | ✅ Stable | All providers | Loading states |

---

## Best Practices

### 1. Always Use Shared Components

```typescript
// ✅ Good
import { BaseConversationList } from '@/widgets/frontdesk/components/providers';

// ❌ Bad - Don't create custom implementations
const MyCustomConversationList = () => { /* ... */ };
```

### 2. Leverage Design System

```typescript
// ✅ Good - Use theme functions
const { primaryColor, neutralColor } = useGomakeTheme();
sx={{ color: neutralColor(700), bgcolor: primaryColor(50) }}

// ❌ Bad - Hardcode colors
sx={{ color: '#666', bgcolor: '#f0f0f0' }}
```

### 3. Consistent Prop Naming

```typescript
// ✅ Good - Follow existing conventions
<BaseConversationList
  items={conversations}        // Not 'data' or 'conversations'
  selectedId={selectedId}      // Not 'selected' or 'activeId'
  onSelect={handleSelect}      // Not 'onClick' or 'onItemClick'
/>
```

### 4. Handle Loading and Error States

```typescript
// ✅ Good - Always provide loading/error handling
<BaseConversationList
  items={conversations}
  loading={isLoading}
  error={error}
  onRefresh={handleRefresh}
/>
```

### 5. Use Virtualization for Large Lists

```typescript
// ✅ Good - Enable virtualization for large datasets
<BaseConversationList
  items={conversations}
  enableVirtualization={conversations.length > 50}
/>
```

---

## Performance Considerations

### Memoization

Components use React.memo for performance:

```typescript
// ConversationListRow uses custom comparison
export const ConversationListRow = React.memo<ConversationListRowProps>(
  ({ item, isSelected, density, onSelect, style }) => {
    // Component logic
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.unread === nextProps.item.unread &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.density === nextProps.density
    );
  }
);
```

### Virtualization

Use VirtualizedConversationList for large lists:

```typescript
// Automatically enabled for lists > 50 items
<BaseConversationList
  items={longConversationList}
  enableVirtualization={true}  // Automatically uses VirtualizedConversationList
/>
```

### Callback Optimization

Use useCallback for event handlers:

```typescript
const handleSelect = useCallback((item: ConversationItem) => {
  setSelected(item);
  onSelect?.(item);
}, [onSelect]);
```

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Keyboard navigation support (Arrow keys, Enter, Escape)
- ARIA labels and roles
- Focus management
- Color contrast ratios
- Screen reader support

---

## Testing

Components are designed to be testable:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationListRow } from '@/widgets/frontdesk/components/providers/conversation-list-row';

test('should render conversation item', () => {
  const item = {
    id: '1',
    from: 'John Doe',
    subject: 'Test Subject',
    receivedAt: '2 hours ago',
    unread: true
  };

  render(
    <ConversationListRow
      item={item}
      isSelected={false}
      density="comfortable"
      onSelect={jest.fn()}
    />
  );

  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Test Subject')).toBeInTheDocument();
});
```

---

## Future Enhancements

### Planned Components

1. **ClientProfilePanel** - Rich client information sidebar
2. **AccountSelector** - Dropdown for switching accounts
3. **ChannelIndicator** - Badge for message channels (Email, WhatsApp, SMS)
4. **SearchBar** - Advanced search with filters
5. **MessageViewer** - Standalone message viewer

### Planned Features

1. Drag-and-drop file attachments
2. Emoji picker integration
3. Rich text editing
4. Advanced search with filters
5. Bulk actions
6. Conversation threading
7. Message reactions

---

## Support

For questions or issues with shared components:

1. Check this documentation
2. Review component source code
3. Check design system documentation (`docs/frontdesk-kb/04_design_system.md`)
4. Contact the FrontDesk team

---

**End of Shared Components Reference**
