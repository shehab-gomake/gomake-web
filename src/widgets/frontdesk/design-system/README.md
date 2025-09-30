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
  Button,
  IconButton,
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

Specialized list item for tickets/tasks.

```tsx
<TicketListItem
  id="TICKET-1234"
  ticketNumber="TICKET-1234"
  title="Fix login bug"
  status="In Progress"
  priority="High"
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

## 🤝 Contributing

When adding new components:

1. Follow the existing patterns
2. Use design tokens (never hardcode values)
3. Include TypeScript types
4. Add documentation with examples
5. Ensure accessibility compliance

## 📖 Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Material UI Documentation](https://mui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)