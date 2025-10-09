# FrontDesk Design System

A comprehensive, type-safe design system for building consistent UI across all FrontDesk providers (Email, Direct Messages, WhatsApp, Tickets).

## 🎯 Goals

- **Consistency**: Unified visual language across all providers
- **Reusability**: DRY principles with shared, composable components
- **Type Safety**: Full TypeScript support with strict typing
- **Performance**: Optimized components with proper memoization
- **Accessibility**: WCAG 2.1 AA compliant components
- **Developer Experience**: Clear APIs and comprehensive documentation

## 📦 What's Included

```
design-system/
├── tokens/              # Design tokens (colors, spacing, typography, etc.)
├── primitives/          # Base components (Button, Input, Avatar, etc.)
├── compounds/           # Complex components (ListItem, Panel, etc.)
├── layouts/             # Layout components (ThreeColumnLayout, etc.)
├── theme.ts             # MUI theme configuration
└── index.ts             # Main export
```

## 🚀 Quick Start

### Basic Import

```tsx
import {
  // Tokens
  tokens,
  colorTokens,
  spacingTokens,

  // Primitives
  Avatar,
  Badge,
  PriorityBadge,
  TicketTypeBadge,
  ChannelBadge,
  MessageStatusIndicator,
  Button,
  IconButton,
  QuickActionButton,
  Chip,
  SearchInput,
  TextInput,

  // Compounds
  ConversationListItem,
  TicketListItem,
  Panel,
  PanelHeader,
  PanelContent,
  EmptyState,
  ConnectionStatusBanner,
  MessageViewHeader,
  MessageCard,
  AttachmentCard,
  ConversationSidebar,
  QuickActionMenu,
  QuickActionItem,
  ConnectionErrorState,
  ConnectingState,

  // Layouts
  ThreeColumnLayout,
  NavigationColumn,
  ListColumn,
  ContentColumn,
} from '@/widgets/frontdesk/design-system';
```

### Using Design Tokens

```tsx
import { tokens, colorTokens, getSemanticColor } from '@/widgets/frontdesk/design-system';

// Direct token access
const primaryBlue = colorTokens.primary[600];  // #2563EB
const mediumSpacing = tokens.spacing[4];        // 16px

// Semantic colors
const textColor = getSemanticColor('text', 'primary');  // #111827
const borderColor = colorTokens.semantic.border.default; // #E5E7EB
```

## 🎨 Design Tokens

### Colors

Based on Tailwind CSS color palette with semantic mappings:

```tsx
// Scale-based colors (50-900)
colorTokens.primary[600]   // #2563EB
colorTokens.neutral[500]   // #6B7280
colorTokens.success[600]   // #16A34A
colorTokens.error[600]     // #DC2626

// Semantic colors
colorTokens.semantic.text.primary      // #111827
colorTokens.semantic.text.secondary    // #6B7280
colorTokens.semantic.background.primary // #FFFFFF
colorTokens.semantic.border.default    // #E5E7EB
colorTokens.semantic.status.online     // #22C55E

// Communication channel colors
colorTokens.semantic.channels.email.main       // #2563EB (Blue)
colorTokens.semantic.channels.whatsapp.main    // #25D366 (Green)
colorTokens.semantic.channels.sms.main         // #7C3AED (Purple)
colorTokens.semantic.channels.phone.main       // #0891B2 (Cyan)
colorTokens.semantic.channels.private_note.main // #F59E0B (Amber)
colorTokens.semantic.channels.internal.main    // #6B7280 (Gray)
colorTokens.semantic.channels.web_chat.main    // #8B5CF6 (Purple)
```

### Spacing

4px base unit system (compatible with Tailwind):

```tsx
spacingTokens[2]   // 8px
spacingTokens[4]   // 16px
spacingTokens[6]   // 24px

// Semantic spacing
semanticSpacing.component.md    // 12px - default spacing
semanticSpacing.listItem.default // 12px - list item padding
semanticSpacing.avatar.md       // 32px - medium avatar size
```

### Typography

```tsx
// Font sizes
typographyTokens.fontSize.sm   // 12px
typographyTokens.fontSize.base // 13px
typographyTokens.fontSize.md   // 14px

// Semantic typography
const bodyStyle = getTypographyStyle('body', 'medium');
// { fontSize: 14, fontWeight: 400, lineHeight: 1.5 }
```

### Shadows

```tsx
shadowTokens.sm   // Subtle lift
shadowTokens.md   // Dropdowns, popovers
shadowTokens.lg   // Modals, drawers
shadowTokens.focus // Keyboard focus ring
```

## 🧱 Primitive Components

### Avatar

User avatars with presence, badges, and automatic color generation.

```tsx
<Avatar
  name="John Doe"
  size="md"                    // xs | sm | md | lg | xl | xxl
  presence="online"            // online | away | busy | offline
  unreadCount={3}              // Shows badge
  src="/path/to/image.jpg"
/>

// Avatar Group
<AvatarGroup
  users={[
    { name: "Alice", src: "/alice.jpg" },
    { name: "Bob" },
    { name: "Charlie" },
  ]}
  max={3}
  size="sm"
/>
```

### Badge

Notification badges, unread counts, status indicators.

```tsx
<Badge
  variant="count"              // count | dot | status
  color="primary"              // primary | success | warning | error | neutral
  size="md"                    // sm | md | lg
  badgeContent={5}
>
  <NotificationIcon />
</Badge>
```

### PriorityBadge

Professional priority indicators for tickets (replaces emoji-based priorities).

```tsx
<PriorityBadge
  priority="High"              // Urgent | High | Medium | Low
  mode="both"                  // icon | label | both
  size="sm"                    // xs | sm | md
  showBackground={false}       // Show colored background
/>

// Colors:
// Urgent/High: Red (●)
// Medium: Amber (●)
// Low: Green (●)
```

### TicketTypeBadge

Visual indicators for ticket types with appropriate icons.

```tsx
<TicketTypeBadge
  type="Bug"                   // Bug | Feature | Task | Support
  size="sm"                    // xs | sm | md
  showTooltip={true}
/>

// Icons:
// Bug: 🐛 (Red)
// Feature: ✨ (Blue)
// Task: 🔧 (Gray)
// Support: 📞 (Cyan)
```

### ChannelBadge

Communication channel indicators for multi-channel ticket systems.

```tsx
<ChannelBadge
  channel="email"              // email | whatsapp | sms | phone | private_note | internal | web_chat
  direction="inbound"          // inbound | outbound
  mode="both"                  // icon | label | both
  size="sm"                    // xs | sm | md
  showDirection={true}         // Show arrow indicators
/>

// Channels:
// Email: 📧 (Blue)
// WhatsApp: 💬 (Green)
// SMS: 📱 (Purple)
// Phone: 📞 (Cyan)
// Private Note: 🔒 (Amber, highlighted background)
// Internal: 💬 (Gray)
// Web Chat: 💻 (Purple)
```

### MessageStatusIndicator

Delivery and read status indicators for messages.

```tsx
<MessageStatusIndicator
  status="delivered"           // pending | sent | delivered | read | failed
  size="sm"                    // xs | sm | md
  showLabel={false}
/>

// Status indicators:
// Pending: ⏱️ (with spinner)
// Sent: ✓ (Gray)
// Delivered: ✓✓ (Gray)
// Read: ✓✓ (Blue)
// Failed: ❌ (Red)
```

### Button

Primary action buttons with consistent styling.

```tsx
<Button
  variant="primary"            // primary | secondary | ghost | danger
  size="md"                    // sm | md | lg
  startIcon={<AddIcon />}
  onClick={handleClick}
>
  Create New
</Button>

// Icon Button
<IconButton
  variant="default"            // default | ghost | primary
  tooltip="Search"
  tooltipPlacement="top"
>
  <SearchIcon />
</IconButton>
```

### QuickActionButton

Specialized dropdown button for quick actions with lightning bolt icon and dropdown indicator.

```tsx
<QuickActionButton
  size="sm"                    // sm | md | lg
  isOpen={menuOpen}
  loading={false}
  onClick={(e) => setAnchorEl(e.currentTarget)}
>
  Quick Actions
</QuickActionButton>

// Features:
// - Lightning bolt icon (⚡)
// - Dropdown arrow indicator (rotates when open)
// - Loading state support
// - Primary button styling
// - Automatic open/close visual states
```

### Chip

Tags, filters, status indicators.

```tsx
<Chip
  label="High Priority"
  variant="soft"               // filled | outlined | soft
  color="error"                // primary | success | warning | error | neutral
  size="small"
  onDelete={handleDelete}
/>
```

### Inputs

```tsx
// Search Input
<SearchInput
  placeholder="Search messages..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onClear={() => setQuery('')}
  showClear
/>

// Text Input
<TextInput
  label="Email"
  placeholder="Enter email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!emailError}
  helperText={emailError}
/>
```

## 🔨 Compound Components

### ConversationListItem

Universal list item for conversations (Email, DM, WhatsApp, Tickets).

```tsx
<ConversationListItem
  id="conv-123"
  title="Important: Q4 Planning"
  participants={["alice@company.com", "bob@company.com"]}
  snippet="Let's discuss the roadmap for next quarter..."
  timestamp="2 min ago"
  isRead={false}
  isSelected={true}
  unreadCount={3}
  hasAttachments={true}
  isStarred={false}
  presence="online"
  onClick={() => handleSelect('conv-123')}
/>
```

### TicketListItem

Specialized list item for tickets/tasks with professional priority and type indicators.

```tsx
<TicketListItem
  id="TICKET-1234"
  ticketNumber="TICKET-1234"
  title="Fix login bug"
  status="In Progress"
  priority="High"              // Uses PriorityBadge (colored dots)
  type="Bug"                   // Uses TicketTypeBadge (🐛 icon)
  updatedAt="2 hours ago"
  isSelected={true}
  isChecked={false}
  isUnread={true}
  participants={[
    { userId: "1", name: "Alice", avatarUrl: "/alice.jpg" }
  ]}
  onClick={() => selectTicket('TICKET-1234')}
  onCheck={(checked) => handleCheck('TICKET-1234', checked)}
/>

// Improved layout:
// ┌────────────────────────────────────┐
// │ TICKET-1234 · 2h ago    [In Progress]│
// │ 🐛 Fix login bug                   │
// │ ● 👤 2h ago                  [●]  │
// └────────────────────────────────────┘
```

### Panel Components

Container components with consistent structure.

```tsx
<Panel elevation={1} border="default" padding="none">
  <PanelHeader
    title="Conversations"
    subtitle="23 unread"
    actions={
      <>
        <IconButton tooltip="Filter">
          <FilterIcon />
        </IconButton>
        <IconButton tooltip="Refresh">
          <RefreshIcon />
        </IconButton>
      </>
    }
  />

  <PanelContent padding="md" scrollable>
    {/* Content here */}
  </PanelContent>
</Panel>
```

### EmptyState

Display when lists or sections have no content.

```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No messages"
  description="You're all caught up! No new messages in your inbox."
  action={{
    label: "Compose Message",
    onClick: handleCompose,
  }}
  secondaryAction={{
    label: "View Archive",
    onClick: handleViewArchive,
  }}
/>
```

### ConnectionStatusBanner

Real-time connection status indicator with auto-hide and retry functionality.

```tsx
<ConnectionStatusBanner
  status="connected"           // disconnected | connecting | connected | reconnecting | error
  show={showBanner}
  error="Network timeout"
  userName="John Doe"
  onRetry={handleRetry}
  isLoading={isRetrying}
  position="absolute"          // absolute | relative | fixed
  zIndex={1200}
/>
```

### MessageViewHeader

Header for message/conversation views with action buttons.

```tsx
<MessageViewHeader
  title="Engineering Team"
  conversationType="GROUP_DM"  // DM | GROUP_DM
  isFavorite={false}
  isArchived={false}
  isSearchActive={false}
  onSearch={handleSearch}
  onFavorite={handleFavorite}
  onArchive={handleArchive}
  onClose={handleClose}
>
  <ParticipantsList members={members} />
</MessageViewHeader>
```

### MessageCard

Unified message display for multi-channel ticket communication. Supports email, WhatsApp, SMS, phone, private notes, and internal messages with channel-specific styling.

```tsx
<MessageCard
  id="msg-123"
  channel="email"              // email | whatsapp | sms | phone | private_note | internal | web_chat
  direction="inbound"          // inbound | outbound
  status="read"                // pending | sent | delivered | read | failed
  author={{
    name: "Alice Smith",
    email: "alice@example.com",
    avatarUrl: "/alice.jpg"
  }}
  recipient={{
    name: "Support Team",
    email: "support@company.com"
  }}
  content="Hi, I'm experiencing issues with the payment gateway..."
  timestamp="2024-02-09T10:31:00Z"
  attachments={[
    { id: "1", name: "screenshot.png", size: 1024000, mimeType: "image/png" }
  ]}
  isPrivate={false}
  isEdited={false}
  onReply={() => handleReply('msg-123')}
  onMoreActions={() => showMenu('msg-123')}
/>

// Visual features:
// - Channel badge with icon and color
// - Colored left border (blue=email, green=whatsapp, yellow=private note)
// - Status indicators (✓ sent, ✓✓ delivered/read)
// - Private notes highlighted with yellow background
// - Direction-based avatar placement
```

### AttachmentCard

Professional file attachment display with previews, file type icons, and actions.

```tsx
<AttachmentCard
  name="Screenshot.png"
  size={1024000}               // in bytes
  mimeType="image/png"
  previewUrl="/preview.jpg"    // For image thumbnails
  url="/download/file.png"
  uploadedAt="2024-02-09T10:31:00Z"
  onPreview={() => window.open('/preview', '_blank')}
  onDownload={() => downloadFile('file.png')}
  onRemove={() => removeFile('file-id')}
  variant="default"            // default | compact
/>

// Features:
// - File type icons (PDF, DOC, Image, Code, etc.)
// - Image thumbnails for supported formats
// - File size formatting (KB, MB)
// - Date display
// - Hover actions (preview, download, remove)
// - Compact mode for inline display
```

### ConversationSidebar

Sidebar component for conversation lists with header actions.

```tsx
<ConversationSidebar
  title="Direct Messages"
  filter="active"              // active | archived | all
  onFilterChange={setFilter}
  onSearch={handleSearch}
  onNewConversation={handleNew}
  width={280}
  showArchiveFilter={true}
>
  <ConversationList conversations={conversations} />
</ConversationSidebar>
```

### QuickActionMenu

Dropdown menu for displaying grouped quick actions with icons, tooltips, and disabled states. Designed to work with QuickActionButton.

```tsx
import { QuickActionMenu, QuickActionItem } from '@/widgets/frontdesk/design-system';

// Define your actions
const actions: QuickActionItem[] = [
  {
    id: 'create_quote',
    label: 'Create Quote',
    icon: <DescriptionIcon fontSize="small" />,
    tooltip: 'Create a new quote for this customer',
    disabled: !hasCustomer,
    disabledReason: 'Customer must be linked first',
    group: 'sales',
  },
  {
    id: 'create_invoice',
    label: 'Create Invoice',
    icon: <ReceiptIcon fontSize="small" />,
    group: 'sales',
  },
  {
    id: 'export_conversation',
    label: 'Export Conversation',
    icon: <DownloadIcon fontSize="small" />,
    group: 'other',
  },
];

// Group labels for menu sections
const groupLabels = {
  sales: 'Sales Documents',
  purchase: 'Purchase Documents',
  other: 'Other Actions',
};

// Render menu
<QuickActionMenu
  anchorEl={anchorElement}
  open={isOpen}
  onClose={handleClose}
  actions={actions}
  groupLabels={groupLabels}
  onActionClick={(action) => executeAction(action.id)}
  loading={false}
/>

// Features:
// - Grouped actions with section labels
// - Icon + label layout
// - Automatic disabled state styling
// - Tooltip support (shows disabled reason or action tooltip)
// - Click-to-close behavior
// - Professional dropdown styling with shadows
// - Empty state handling
```

### Full Quick Actions Example

Complete implementation with button, menu, and action handling:

```tsx
import {
  QuickActionButton,
  QuickActionMenu,
  QuickActionItem
} from '@/widgets/frontdesk/design-system';

function TicketActions({ ticketId, customerId }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Define available actions
  const actions: QuickActionItem[] = [
    {
      id: 'create_quote',
      label: 'Create Quote',
      icon: <DescriptionIcon fontSize="small" />,
      tooltip: 'Create a new quote',
      disabled: !customerId,
      disabledReason: 'Customer must be linked to create a quote',
      group: 'sales',
    },
    {
      id: 'create_invoice',
      label: 'Create Invoice',
      icon: <ReceiptIcon fontSize="small" />,
      disabled: !customerId,
      disabledReason: 'Customer must be linked to create an invoice',
      group: 'sales',
    },
    {
      id: 'create_order',
      label: 'Create Order',
      icon: <ShoppingCartIcon fontSize="small" />,
      disabled: !customerId,
      group: 'sales',
    },
  ];

  const groupLabels = {
    sales: 'Sales Documents',
    other: 'Other Actions',
  };

  const handleActionClick = (action: QuickActionItem) => {
    console.log('Action selected:', action.id);
    // Navigate or perform action
    switch (action.id) {
      case 'create_quote':
        navigateToQuote(customerId);
        break;
      case 'create_invoice':
        navigateToInvoice(customerId);
        break;
      // ... handle other actions
    }
  };

  return (
    <>
      <QuickActionButton
        size="sm"
        isOpen={Boolean(anchorEl)}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />

      <QuickActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        actions={actions}
        groupLabels={groupLabels}
        onActionClick={handleActionClick}
      />
    </>
  );
}
```

### ConnectionStates

Pre-built full-page states for connection errors and loading.

```tsx
// Connection Error State
<ConnectionErrorState
  error="Network timeout"
  onRetry={handleRetry}
  isLoading={isRetrying}
  icon={<ChatIcon />}
  title="Connection Failed"
  description="Unable to connect. Please check your connection."
/>

// Connecting State
<ConnectingState
  icon={<ChatIcon />}
  title="Connecting..."
  description="Establishing secure connection"
  alertMessage="Connecting to service..."
/>
```

## 📐 Layout Components

### ThreeColumnLayout

Standardized layout for all FrontDesk providers.

```tsx
<ThreeColumnLayout
  navigationContent={
    <NavigationColumn
      header={<Logo />}
      footer={<UserMenu />}
    >
      <Navigation />
    </NavigationColumn>
  }
  listContent={
    <ListColumn
      title="Inbox"
      subtitle="23 conversations"
      headerActions={<SearchInput />}
      emptyState={<EmptyState title="No conversations" />}
    >
      {conversations.map(conv => (
        <ConversationListItem key={conv.id} {...conv} />
      ))}
    </ListColumn>
  }
  mainContent={
    <ContentColumn
      showHeader
      title="Conversation Details"
      headerActions={<ActionMenu />}
      footer={<MessageInput />}
    >
      <MessageViewer />
    </ContentColumn>
  }
  navigationWidth={220}
  listWidth={280}
  hideListColumn={false}
/>
```

## 🎭 Component Patterns

### List with Empty State

```tsx
<ListColumn
  title="Tickets"
  headerActions={<SearchInput />}
  emptyState={
    <EmptyState
      icon={<TicketIcon />}
      title="No tickets"
      description="Create your first ticket to get started"
      action={{ label: "New Ticket", onClick: handleCreate }}
    />
  }
>
  {tickets.map(ticket => (
    <TicketListItem key={ticket.id} {...ticket} />
  ))}
</ListColumn>
```

### Panel with Header and Actions

```tsx
<Panel elevation={1}>
  <PanelHeader
    title="Account Settings"
    actions={
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    }
  />
  <PanelContent padding="lg">
    {/* Form fields */}
  </PanelContent>
</Panel>
```

### Conversation List Item Variants

```tsx
// Email conversation
<ConversationListItem
  title="Email Subject"
  participants={["sender@email.com"]}
  snippet="Email preview..."
  timestamp="1 hour ago"
  hasAttachments
  isStarred
/>

// Direct Message
<ConversationListItem
  title="Alice Smith"
  participants={["Alice Smith"]}
  snippet="Hey, can we talk?"
  timestamp="Just now"
  presence="online"
  unreadCount={2}
/>

// Group Chat
<ConversationListItem
  title="Engineering Team"
  participants={["Alice", "Bob", "Charlie", "Dave"]}
  snippet="Alice: Great work everyone!"
  timestamp="5 min ago"
  unreadCount={12}
/>
```

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: AA-compliant color combinations
- **Touch Targets**: Minimum 44x44px touch areas

## 🎨 Customization

### Overriding Styles

```tsx
<Button
  variant="primary"
  sx={{
    borderRadius: 999, // Custom pill shape
    px: 4,             // Extra padding
  }}
>
  Custom Styled Button
</Button>
```

### Custom Theme

```tsx
import { ThemeProvider } from '@mui/material';
import themeConfig from '@/widgets/frontdesk/design-system/theme';

const customTheme = createTheme(themeConfig, {
  // Your customizations
});

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

## 📚 Migration Guide

### From Email Provider

**Before:**
```tsx
<EmailBadge count={unreadCount}>
  <div />
</EmailBadge>
```

**After:**
```tsx
<Badge variant="count" color="primary" badgeContent={unreadCount}>
  <MailIcon />
</Badge>
```

### From DM Provider

**Before:**
```tsx
<ConversationList
  conversations={conversations}
  selectedId={selectedId}
  onSelect={handleSelect}
/>
```

**After:**
```tsx
<ListColumn title="Conversations">
  {conversations.map(conv => (
    <ConversationListItem
      key={conv.id}
      {...conv}
      onClick={() => handleSelect(conv.id)}
    />
  ))}
</ListColumn>
```

## 🐛 Troubleshooting

### Component not rendering

Check that you've imported from the design system:
```tsx
// ✅ Correct
import { Avatar } from '@/widgets/frontdesk/design-system';

// ❌ Incorrect
import { Avatar } from '@mui/material';
```

### Styling conflicts

The design system uses CSS-in-JS with emotion. Ensure you're not mixing styling approaches:
```tsx
// ✅ Correct
<Button sx={{ mt: 2 }}>Click</Button>

// ❌ Avoid
<Button style={{ marginTop: '16px' }}>Click</Button>
```

## 💬 Multi-Channel Ticket Communication

The design system includes a complete multi-channel communication system for tickets, allowing unified display of messages across email, WhatsApp, SMS, phone calls, and internal notes.

### Building a Multi-Channel Timeline

```tsx
import { MessageCard } from '@/widgets/frontdesk/design-system';

// Example: Ticket with mixed communication channels
<Box sx={{ p: 3, backgroundColor: colorTokens.neutral[50] }}>
  {/* Initial email from customer */}
  <MessageCard
    id="msg-1"
    channel="email"
    direction="inbound"
    status="read"
    author={{ name: "Customer", email: "customer@email.com" }}
    content="I'm experiencing issues with the payment gateway..."
    timestamp="2024-02-09T10:31:00Z"
    attachments={[{ id: "1", name: "screenshot.png", size: 1024000 }]}
  />

  {/* Internal team note */}
  <MessageCard
    id="msg-2"
    channel="private_note"
    direction="outbound"
    status="sent"
    author={{ name: "Agent", email: "agent@company.com" }}
    content="Investigating the API logs. Looks like a configuration issue."
    timestamp="2024-02-09T11:15:00Z"
    isPrivate={true}
  />

  {/* WhatsApp quick update */}
  <MessageCard
    id="msg-3"
    channel="whatsapp"
    direction="outbound"
    status="read"
    author={{ name: "Agent", email: "agent@company.com" }}
    recipient={{ phoneNumber: "+1-555-0123" }}
    content="Fix is being deployed now. Should be resolved in 15 minutes 👍"
    timestamp="2024-02-09T14:45:00Z"
  />

  {/* Phone call log */}
  <MessageCard
    id="msg-4"
    channel="phone"
    direction="outbound"
    status="sent"
    author={{ name: "Agent", email: "agent@company.com" }}
    content="Phone call to verify fix. Customer confirmed working. Duration: 5 min."
    timestamp="2024-02-09T15:30:00Z"
  />
</Box>
```

### Visual Design Per Channel

**Email** (Blue):
- Left border: Blue (#2563EB)
- Icon: 📧
- Shows: From/To addresses
- Status: Sent ✓, Delivered ✓✓, Read ✓✓ (blue)

**WhatsApp** (Green):
- Left border: Green (#25D366)
- Icon: 💬
- Shows: Phone number
- Status: Real-time delivery/read receipts

**SMS** (Purple):
- Left border: Purple (#7C3AED)
- Icon: 📱
- Shows: Phone number
- Status: Sent/Delivered

**Phone** (Cyan):
- Left border: Cyan (#0891B2)
- Icon: 📞
- Shows: Call duration, recording link
- Layout: Call summary format

**Private Note** (Yellow):
- Background: Yellow (#FFFBEB)
- Left border: Amber (#F59E0B)
- Icon: 🔒
- Highlighted to indicate internal-only visibility

**Internal/System** (Gray):
- Left border: Gray (#6B7280)
- Icon: 💬
- Shows: System events, status changes

### Type System for Multi-Channel

```tsx
import { CommunicationChannel, MessageDirection, MessageStatus } from '@/widgets/frontdesk/providers/tickets/types/communication.types';

// Channel types
type CommunicationChannel =
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'phone'
  | 'private_note'
  | 'internal'
  | 'web_chat';

// Message direction
type MessageDirection = 'inbound' | 'outbound';

// Delivery status
type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

// Extended TicketComment interface
interface TicketComment {
  id: string;
  author: TicketParticipant;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  attachments?: TicketAttachment[];

  // Multi-channel fields
  channel?: CommunicationChannel;
  direction?: MessageDirection;
  status?: MessageStatus;
  channelMetadata?: Record<string, any>;
}
```

### Benefits

1. **Unified Timeline** - All customer interactions in one place
2. **Context Preservation** - Understand conversation flow across channels
3. **Professional Appearance** - Industry-standard design (Zendesk/Intercom level)
4. **Clear Distinction** - Visual hierarchy separates public/private communications
5. **Status Tracking** - Real-time delivery and read status
6. **Type Safety** - Full TypeScript support for all channel types

## ⚡ Ticket Quick Actions Integration

The design system provides a complete Quick Actions system for tickets that enables shortcuts to other system operations like creating quotes, invoices, and orders directly from ticket contexts.

### Quick Actions Pattern

This pattern uses `QuickActionButton` + `QuickActionMenu` + `useQuickActions` hook to provide context-aware shortcuts:

```tsx
import {
  QuickActionButton,
  QuickActionMenu,
  QuickActionItem,
} from '@/widgets/frontdesk/design-system';
import { useQuickActions } from '@/widgets/frontdesk/providers/tickets/hooks/use-quick-actions';

function TicketDetailView({ ticket }) {
  const [quickActionsAnchor, setQuickActionsAnchor] = useState(null);

  // Hook handles navigation, customer context, and validation
  const { availableActions, executeAction, getActionBlockReason } = useQuickActions({
    ticketId: ticket.id,
    customerId: ticket.customerId,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    customerPhone: ticket.customerPhone,
    onActionComplete: (actionType) => {
      console.log('Action completed:', actionType);
    },
    onActionError: (actionType, error) => {
      showNotification(`Cannot execute action: ${error}`, 'error');
    },
  });

  // Convert actions to menu items
  const menuItems: QuickActionItem[] = availableActions.map((action) => ({
    id: action.type,
    label: action.label,
    icon: action.icon,
    tooltip: action.tooltip,
    disabled: !!getActionBlockReason(action.type),
    disabledReason: getActionBlockReason(action.type) || undefined,
    group: action.group,
  }));

  return (
    <>
      {/* Quick Actions Button in Header */}
      <QuickActionButton
        size="sm"
        isOpen={Boolean(quickActionsAnchor)}
        onClick={(e) => setQuickActionsAnchor(e.currentTarget)}
      />

      {/* Quick Actions Menu */}
      <QuickActionMenu
        anchorEl={quickActionsAnchor}
        open={Boolean(quickActionsAnchor)}
        onClose={() => setQuickActionsAnchor(null)}
        actions={menuItems}
        groupLabels={{
          sales: 'Sales Documents',
          purchase: 'Purchase Documents',
          other: 'Other Actions',
        }}
        onActionClick={(action) => executeAction(action.id as any)}
      />
    </>
  );
}
```

### Pre-configured Actions

The system includes 8 pre-configured actions in `quick-actions-config.tsx`:

**Sales Documents:**
- Create Quote
- Create Invoice
- Create Order
- Create Receipt
- Create Delivery Note

**Purchase Documents:**
- Create Purchase Order
- Create Purchase Invoice

**Other:**
- Export Conversation (coming soon)

### Customer Context Handling

Actions automatically validate customer requirements:

```tsx
// If customer is linked (customerId exists)
✅ Navigate to /quote with customer pre-selected

// If customer is NOT linked but email/phone exists
⚠️ Show error: "Customer must be linked to ticket first"
   Option: "Link Customer" button

// If no customer data at all
❌ Action disabled with tooltip: "No customer information available"
```

### Customizing Actions

Add custom actions by extending the configuration:

```tsx
// src/widgets/frontdesk/providers/tickets/utils/quick-actions-config.tsx

export const QUICK_ACTIONS_CONFIG: Record<QuickActionType, QuickActionConfig> = {
  // ... existing actions

  // Add custom action
  create_task: {
    type: 'create_task',
    label: 'Create Task',
    icon: <TaskIcon fontSize="small" />,
    route: '/tasks/new',
    requiresCustomerId: false,
    group: 'other',
    tooltip: 'Create a new task',
    enabled: true,
  },
};
```

### Integration Benefits

1. **Context Preservation** - Customer data flows from ticket to document
2. **Smart Validation** - Automatically checks prerequisites (customer linked, etc.)
3. **Type-Safe** - Full TypeScript support throughout
4. **Reusable** - Can be used in ticket lists, detail views, etc.
5. **Extensible** - Easy to add new actions or customize existing ones
6. **Consistent UX** - Follows FrontDesk design system patterns

## 🤝 Contributing

When adding new components:

1. Follow the existing patterns
2. Use design tokens (never hardcode values)
3. Include TypeScript types
4. Add documentation with examples
5. Ensure accessibility compliance
6. For multi-channel features, extend `communication.types.ts`

## 📖 Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Material UI Documentation](https://mui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)