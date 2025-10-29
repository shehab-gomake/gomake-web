# FrontDesk V2 Implementation Guide

**Version:** 2.0
**Last Updated:** 2025-10-29
**Status:** Implementation Blueprint

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Component Inventory](#component-inventory)
3. [Layout Architecture](#layout-architecture)
4. [Component Descriptions](#component-descriptions)
5. [Folder Structure](#folder-structure)
6. [Implementation Phases](#implementation-phases)
7. [Technical Specifications](#technical-specifications)
8. [State Management Strategy](#state-management-strategy)
9. [Development Workflow](#development-workflow)

---

## 🎯 Overview

This guide provides a complete blueprint for implementing the FrontDesk V2 unified inbox interface. The design follows a **3-column layout** pattern commonly used in modern communication platforms (Linear, Intercom, Front).

### Design Goals
- **Performance**: Handle 1000+ conversations with virtualization
- **Scalability**: Support multiple providers (Email, WhatsApp, SMS, Tickets, DMs)
- **Maintainability**: Feature-based architecture with clear separation of concerns
- **Accessibility**: WCAG 2.1 AA compliant
- **Real-time**: WebSocket integration for live updates

### Tech Stack
- **Framework**: React 18+ with TypeScript
- **State**: Recoil for global state
- **Styling**: MUI (Material-UI) + Emotion
- **Virtualization**: @tanstack/react-virtual
- **Real-time**: WebSocket services

---

## 📦 Component Inventory

### Total Components: 50

#### **Layout Components (5)**
| # | Component | Purpose |
|---|-----------|---------|
| 1 | AppShell | Root 3-column flex container |
| 2 | LeftSidebar | Workspace + navigation tree (240px) |
| 3 | MiddlePanel | Conversation list (380px) |
| 4 | CenterPanel | Message thread viewer (flex-1) |
| 5 | RightSidebar | Contact details (340px) |

#### **Navigation Components (8)**
| # | Component | Purpose |
|---|-----------|---------|
| 6 | WorkspaceSelector | Org dropdown with logo/name |
| 7 | SearchBar | Global search with shortcuts |
| 8 | NavTree | Collapsible navigation hierarchy |
| 9 | NavItem | Individual nav item with badge |
| 10 | TeamsList | Expandable teams section |
| 11 | ChannelsList | Channel subscriptions with status |
| 12 | UserProfileCard | Bottom user info + status |

#### **Conversation List Components (10)**
| # | Component | Purpose |
|---|-----------|---------|
| 13 | ConversationsHeader | Title + action buttons |
| 14 | ConversationTabs | Mine/Unassigned/All with counts |
| 15 | ConversationCard | Individual conversation preview |
| 16 | ConversationAvatar | Avatar with platform badge |
| 17 | ConversationMeta | Name, timestamp, preview |
| 18 | PriorityIndicator | Visual priority marker |
| 19 | TagsList | Colored tag chips |
| 20 | UnreadBadge | Unread counter |

#### **Message Thread Components (12)**
| # | Component | Purpose |
|---|-----------|---------|
| 21 | ThreadHeader | Contact name + actions |
| 22 | MessageList | Virtualized message container |
| 23 | MessageBubble | Individual message (in/out) |
| 24 | MessageMeta | Timestamp + delivery status |
| 25 | SystemMessage | Activity log entries |
| 26 | MessageComposer | Rich text input area |
| 27 | ComposerToolbar | Formatting buttons |
| 28 | ComposerActions | Attachment/emoji/voice buttons |
| 29 | ReplyPrivateToggle | Reply vs Private Note |
| 30 | SendButton | Primary send with keyboard hint |
| 31 | MentionDropdown | @mention autocomplete |
| 32 | CannedResponseHint | '/' shortcut helper |

#### **Contact Detail Components (11)**
| # | Component | Purpose |
|---|-----------|---------|
| 33 | ContactDetailHeader | Contact/Copilot tab switcher |
| 34 | ContactCard | Avatar, name, title, badge |
| 35 | ContactInfoList | Email, phone, company, location |
| 36 | SocialLinks | Social media icon buttons |
| 37 | QuickActions | Call, SMS, download, delete |
| 38 | AccordionSection | Expandable section container |
| 39 | ConversationActions | Action list with add button |
| 40 | ParticipantsList | Conversation participants |
| 41 | MacrosList | Saved macros/workflows |
| 42 | AttributesEditor | Custom field editor |
| 43 | ConversationTimeline | Historical conversation list |

#### **Shared/Utility Components (7)**
| # | Component | Purpose |
|---|-----------|---------|
| 44 | IconButton | Reusable icon button |
| 45 | Badge | Notification/count badge |
| 46 | Tooltip | Hover tooltip wrapper |
| 47 | Dropdown | Generic dropdown menu |
| 48 | Avatar | User/contact avatar |
| 49 | Tag | Colored label chip |
| 50 | Divider | Visual separator |

---

## 🏗️ Layout Architecture

### Visual Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ AppShell (display: flex, height: 100vh)                             │
├───────────────┬─────────────────────┬───────────────────────────────┤
│ LeftSidebar   │ MiddlePanel         │ CenterPanel                   │
│ width: 240px  │ width: 380px        │ flex: 1                       │
│ bg: #1a1a1a   │ bg: #0d0d0d         │ bg: #000000                   │
│               │                     │                               │
│ ┌───────────┐ │ ┌─────────────────┐ │ ┌───────────────────────────┐ │
│ │Workspace  │ │ │Conversations    │ │ │ThreadHeader               │ │
│ │Selector   │ │ │Header           │ │ │(sticky top)               │ │
│ │(h: 48px)  │ │ │(h: 56px)        │ │ │(h: 64px)                  │ │
│ └───────────┘ │ └─────────────────┘ │ └───────────────────────────┘ │
│ ┌───────────┐ │ ┌─────────────────┐ │ ┌───────────────────────────┐ │
│ │SearchBar  │ │ │Conversation     │ │ │MessageList                │ │
│ │(h: 40px)  │ │ │Tabs             │ │ │(overflow-y: auto)         │ │
│ │(m: 12px)  │ │ │(h: 48px)        │ │ │(flex: 1)                  │ │
│ └───────────┘ │ └─────────────────┘ │ │                           │ │
│               │                     │ │ [Virtualized Messages]    │ │
│ ┌───────────┐ │ ┌─────────────────┐ │ │                           │ │
│ │NavTree    │ │ │ConversationCard │ │ │                           │ │
│ │(overflow) │ │ │(h: 88px)        │ │ │                           │ │
│ │  My Inbox │ │ ├─────────────────┤ │ │                           │ │
│ │▾ Conversn │ │ │ConversationCard │ │ │                           │ │
│ │  All Cons │ │ ├─────────────────┤ │ │                           │ │
│ │  Mentions │ │ │ConversationCard │ │ │                           │ │
│ │  Unattend │ │ ├─────────────────┤ │ │                           │ │
│ │▾ Folders  │ │ │ConversationCard │ │ │                           │ │
│ │  Priority │ │ │(virtualized)    │ │ │                           │ │
│ │▾ Teams    │ │ │                 │ │ │                           │ │
│ │  sales    │ │ │                 │ │ │                           │ │
│ │  support  │ │ │                 │ │ │                           │ │
│ │▾ Channels │ │ │                 │ │ │                           │ │
│ │  • Email  │ │ │                 │ │ │                           │ │
│ │  • WhatsA │ │ │                 │ │ │                           │ │
│ └───────────┘ │ └─────────────────┘ │ └───────────────────────────┘ │
│               │                     │ ┌───────────────────────────┐ │
│ ┌───────────┐ │                     │ │MessageComposer            │ │
│ │UserProf   │ │                     │ │(min-h: 120px)             │ │
│ │Card       │ │                     │ │(border-top)               │ │
│ │(h: 60px)  │ │                     │ │                           │ │
│ └───────────┘ │                     │ └───────────────────────────┘ │
├───────────────┴─────────────────────┴───────────────────────────────┤
│                                     │ RightSidebar                  │
│                                     │ width: 340px                  │
│                                     │ bg: #0d0d0d                   │
│                                     │ ┌───────────────────────────┐ │
│                                     │ │ContactDetailHeader        │ │
│                                     │ │(h: 48px, tabs)            │ │
│                                     │ └───────────────────────────┘ │
│                                     │ ┌───────────────────────────┐ │
│                                     │ │ContactCard                │ │
│                                     │ │  Avatar (80px)            │ │
│                                     │ │  Name + Title             │ │
│                                     │ │  Contact Info             │ │
│                                     │ │  Social Links             │ │
│                                     │ │  Quick Actions            │ │
│                                     │ │(p: 20px)                  │ │
│                                     │ └───────────────────────────┘ │
│                                     │ ┌───────────────────────────┐ │
│                                     │ │AccordionSections          │ │
│                                     │ │(overflow-y: auto)         │ │
│                                     │ │  ▾ Conversation Actions   │ │
│                                     │ │  ▾ Participants           │ │
│                                     │ │  ▾ Macros                 │ │
│                                     │ │  ▾ Contact Attributes     │ │
│                                     │ │  ▾ Conversation Info      │ │
│                                     │ │  ▾ Previous Conversations │ │
│                                     │ └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  // Hide RightSidebar
  tablet: '1280px',

  // Collapse LeftSidebar to icons only
  mobile: '768px',

  // Stack all panels vertically
  compact: '480px'
};
```

---

## 📝 Component Descriptions

### **Layout Components**

#### 1. AppShell
**Purpose**: Root container managing the 3-column flex layout with dark theme provider.

**Props**:
```typescript
interface AppShellProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}
```

**Key Features**:
- Flex container with `height: 100vh`
- Theme context provider
- Keyboard shortcut listeners
- WebSocket connection manager

---

#### 2. LeftSidebar
**Purpose**: Fixed-width navigation panel (240px) containing workspace selector, search, and hierarchical navigation.

**Props**:
```typescript
interface LeftSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

**Key Features**:
- Collapsible to icon-only mode
- Sticky workspace selector
- Scrollable nav tree
- Bottom user profile card

---

#### 3. MiddlePanel
**Purpose**: Conversation list panel (380px) with filterable, virtualized conversation cards.

**Props**:
```typescript
interface MiddlePanelProps {
  onConversationSelect: (id: string) => void;
  selectedConversationId?: string;
}
```

**Key Features**:
- Virtualized list (react-virtual)
- Filter tabs (Mine/Unassigned/All)
- Search within conversations
- Infinite scroll pagination

---

#### 4. CenterPanel
**Purpose**: Flexible main content area displaying active message thread and composer.

**Props**:
```typescript
interface CenterPanelProps {
  conversationId: string;
}
```

**Key Features**:
- Sticky thread header
- Virtualized message list
- Fixed composer at bottom
- Auto-scroll to new messages

---

#### 5. RightSidebar
**Purpose**: Context panel (340px) showing contact details and conversation metadata.

**Props**:
```typescript
interface RightSidebarProps {
  contactId: string;
  conversationId: string;
  isVisible?: boolean;
}
```

**Key Features**:
- Tabbed interface (Contact/Copilot)
- Accordion sections
- Collapsible/expandable
- Scrollable content

---

### **Navigation Components**

#### 6. WorkspaceSelector
**Purpose**: Dropdown button with organization logo, name, and expansion indicator.

**Props**:
```typescript
interface WorkspaceSelectorProps {
  workspace: {
    id: string;
    name: string;
    logo?: string;
  };
  workspaces: Workspace[];
  onWorkspaceChange: (id: string) => void;
}
```

---

#### 7. SearchBar
**Purpose**: Input field with search icon, placeholder text, and keyboard shortcut indicator (Cmd+K).

**Props**:
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  shortcut?: string;
}
```

---

#### 8. NavTree
**Purpose**: Recursive collapsible tree structure for hierarchical navigation (Inbox, Folders, Teams).

**Props**:
```typescript
interface NavTreeProps {
  items: NavTreeItem[];
  selectedId?: string;
  onItemSelect: (id: string) => void;
}

interface NavTreeItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: NavTreeItem[];
  isCollapsed?: boolean;
}
```

---

#### 9. NavItem
**Purpose**: Individual navigation list item with icon, label, optional badge, and active state styling.

**Props**:
```typescript
interface NavItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  isActive?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
  onToggleCollapse?: () => void;
}
```

---

#### 10. TeamsList
**Purpose**: Expandable section showing team channels with member count indicators.

**Props**:
```typescript
interface TeamsListProps {
  teams: Team[];
  onTeamSelect: (teamId: string) => void;
}
```

---

#### 11. ChannelsList
**Purpose**: List of communication channels (Email, WhatsApp, SMS) with platform-specific icons and online status dots.

**Props**:
```typescript
interface ChannelsListProps {
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
}
```

---

#### 12. UserProfileCard
**Purpose**: Compact user info with avatar, name, email, and online status indicator.

**Props**:
```typescript
interface UserProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
  };
  onProfileClick?: () => void;
}
```

---

### **Conversation List Components**

#### 13. ConversationsHeader
**Purpose**: Panel title with status text ("Open"), sort button, filter button, and expand/collapse controls.

**Props**:
```typescript
interface ConversationsHeaderProps {
  title: string;
  status?: string;
  onSort: () => void;
  onFilter: () => void;
  onToggleExpand: () => void;
}
```

---

#### 14. ConversationTabs
**Purpose**: Segmented control for filtering conversations: Mine (with badge), Unassigned (with badge), All (with badge).

**Props**:
```typescript
interface ConversationTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    count: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

---

#### 15. ConversationCard
**Purpose**: Clickable preview card displaying conversation metadata (avatar, name, timestamp, message snippet, tags, unread badge).

**Props**:
```typescript
interface ConversationCardProps {
  conversation: {
    id: string;
    contact: Contact;
    lastMessage: Message;
    platform: 'email' | 'whatsapp' | 'facebook' | 'sms';
    tags: Tag[];
    unreadCount: number;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  };
  isSelected: boolean;
  onClick: () => void;
}
```

---

#### 16. ConversationAvatar
**Purpose**: Circular avatar image with platform badge overlay positioned at bottom-right (WhatsApp/Email/Facebook icon).

**Props**:
```typescript
interface ConversationAvatarProps {
  src?: string;
  alt: string;
  platform: 'email' | 'whatsapp' | 'facebook' | 'sms';
  size?: number;
}
```

---

#### 17. ConversationMeta
**Purpose**: Displays sender name (bold), timestamp (top-right), and truncated message preview (gray text).

**Props**:
```typescript
interface ConversationMetaProps {
  name: string;
  timestamp: Date;
  preview: string;
  maxPreviewLength?: number;
}
```

---

#### 18. PriorityIndicator
**Purpose**: Visual marker (colored vertical bar or dot) indicating conversation urgency level.

**Props**:
```typescript
interface PriorityIndicatorProps {
  priority: 'low' | 'normal' | 'high' | 'urgent';
  variant?: 'bar' | 'dot';
}
```

---

#### 19. TagsList
**Purpose**: Horizontal list of colored rounded chips for categorization (e.g., "billing", "lead", "device-setup").

**Props**:
```typescript
interface TagsListProps {
  tags: Array<{
    id: string;
    label: string;
    color: string;
  }>;
  maxVisible?: number;
}
```

---

#### 20. UnreadBadge
**Purpose**: Circular badge displaying unread message count (red background, white text).

**Props**:
```typescript
interface UnreadBadgeProps {
  count: number;
  max?: number; // e.g., 99+
}
```

---

### **Message Thread Components**

#### 21. ThreadHeader
**Purpose**: Sticky top bar with contact name, platform badge, and action buttons (mute, share, resolve).

**Props**:
```typescript
interface ThreadHeaderProps {
  contact: Contact;
  platform: string;
  onMute: () => void;
  onShare: () => void;
  onResolve: () => void;
}
```

---

#### 22. MessageList
**Purpose**: Virtualized scrollable container for efficiently rendering large message histories (1000+ messages).

**Props**:
```typescript
interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onLoadMore?: () => void;
}
```

**Implementation**:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

#### 23. MessageBubble
**Purpose**: Chat bubble styled for incoming (gray, left-aligned) or outgoing (blue, right-aligned) with rounded corners and tail indicator.

**Props**:
```typescript
interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    type: 'incoming' | 'outgoing';
    timestamp: Date;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
  };
  showAvatar?: boolean;
}
```

---

#### 24. MessageMeta
**Purpose**: Timestamp and delivery status icons (checkmarks for sent/delivered/read).

**Props**:
```typescript
interface MessageMetaProps {
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}
```

---

#### 25. SystemMessage
**Purpose**: Centered gray text for activity events (e.g., "Assigned to support m2 by Mathew M", "Mathew M set priority to high").

**Props**:
```typescript
interface SystemMessageProps {
  message: {
    id: string;
    type: 'assignment' | 'priority_change' | 'tag_added' | 'status_change';
    content: string;
    timestamp: Date;
  };
}
```

---

#### 26. MessageComposer
**Purpose**: Rich text editor with multi-line support, auto-resize, and formatting capabilities.

**Props**:
```typescript
interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttach?: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}
```

---

#### 27. ComposerToolbar
**Purpose**: Formatting controls (Bold, Italic, Strikethrough, Bulleted List, Numbered List, Code Block, Link).

**Props**:
```typescript
interface ComposerToolbarProps {
  onFormat: (format: FormatType) => void;
  activeFormats: FormatType[];
}

type FormatType = 'bold' | 'italic' | 'strikethrough' | 'ul' | 'ol' | 'code' | 'link';
```

---

#### 28. ComposerActions
**Purpose**: Bottom row icon buttons (Emoji Picker, Attach File, Voice Recording, Canned Responses).

**Props**:
```typescript
interface ComposerActionsProps {
  onEmojiSelect: (emoji: string) => void;
  onAttach: (files: File[]) => void;
  onVoiceRecord: () => void;
  onCannedResponse: () => void;
}
```

---

#### 29. ReplyPrivateToggle
**Purpose**: Tab switcher between "Reply" (public) and "Private Note" (internal team communication).

**Props**:
```typescript
interface ReplyPrivateToggleProps {
  value: 'reply' | 'private';
  onChange: (value: 'reply' | 'private') => void;
}
```

---

#### 30. SendButton
**Purpose**: Primary action button with keyboard shortcut hint ("Shift + ↵ for new line" or "⏎ to send").

**Props**:
```typescript
interface SendButtonProps {
  onSend: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

---

#### 31. MentionDropdown
**Purpose**: Autocomplete overlay triggered by "@" character, showing team members with avatars and names.

**Props**:
```typescript
interface MentionDropdownProps {
  query: string;
  users: User[];
  onSelect: (user: User) => void;
  position: { top: number; left: number };
}
```

---

#### 32. CannedResponseHint
**Purpose**: Helper text below composer: "Shift + enter for new line. Start with '/' to select a Canned Response."

**Props**:
```typescript
interface CannedResponseHintProps {
  text?: string;
}
```

---

### **Contact Detail Components**

#### 33. ContactDetailHeader
**Purpose**: Segmented control with "Contact" and "Copilot" tabs for switching between views.

**Props**:
```typescript
interface ContactDetailHeaderProps {
  activeTab: 'contact' | 'copilot';
  onTabChange: (tab: 'contact' | 'copilot') => void;
}
```

---

#### 34. ContactCard
**Purpose**: Profile section with large circular avatar (80px), name, title, and verification badge.

**Props**:
```typescript
interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    title: string;
    avatar?: string;
    isVerified?: boolean;
  };
}
```

---

#### 35. ContactInfoList
**Purpose**: Structured list displaying email (clickable, copyable), phone, company, location with icons.

**Props**:
```typescript
interface ContactInfoListProps {
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
}
```

---

#### 36. SocialLinks
**Purpose**: Horizontal row of icon buttons for social media profiles (Facebook, Twitter, LinkedIn).

**Props**:
```typescript
interface SocialLinksProps {
  links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}
```

---

#### 37. QuickActions
**Purpose**: Icon button row for quick actions (Call, SMS, Download conversation, Delete).

**Props**:
```typescript
interface QuickActionsProps {
  onCall?: () => void;
  onSms?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}
```

---

#### 38. AccordionSection
**Purpose**: Reusable collapsible container with header, chevron expand icon, and content area with smooth animation.

**Props**:
```typescript
interface AccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}
```

---

#### 39. ConversationActions
**Purpose**: List of available workflow actions with "+" button to add custom actions.

**Props**:
```typescript
interface ConversationActionsProps {
  actions: Action[];
  onActionExecute: (actionId: string) => void;
  onAddAction: () => void;
}
```

---

#### 40. ParticipantsList
**Purpose**: List of users involved in conversation with avatars and "+" button to add participants.

**Props**:
```typescript
interface ParticipantsListProps {
  participants: User[];
  onAddParticipant: () => void;
  onRemoveParticipant: (userId: string) => void;
}
```

---

#### 41. MacrosList
**Purpose**: Saved workflow templates/macros with "+" button to create new macros.

**Props**:
```typescript
interface MacrosListProps {
  macros: Macro[];
  onMacroSelect: (macroId: string) => void;
  onAddMacro: () => void;
}
```

---

#### 42. AttributesEditor
**Purpose**: Editable key-value pair list for custom contact/conversation fields (e.g., "Order ID: #12345").

**Props**:
```typescript
interface AttributesEditorProps {
  attributes: Record<string, string>;
  onChange: (attributes: Record<string, string>) => void;
  onAdd: () => void;
}
```

---

#### 43. ConversationTimeline
**Purpose**: Chronological list of previous interactions with timestamps and "View all" expand button.

**Props**:
```typescript
interface ConversationTimelineProps {
  conversations: Conversation[];
  maxVisible?: number;
  onViewAll: () => void;
}
```

---

### **Shared/Utility Components**

#### 44. IconButton
**Purpose**: Reusable circular button with icon, hover states, and optional tooltip.

**Props**:
```typescript
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'danger';
}
```

---

#### 45. Badge
**Purpose**: Small circular or pill-shaped indicator for counts/notifications (e.g., "5", "99+").

**Props**:
```typescript
interface BadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'primary' | 'error';
  size?: 'small' | 'medium';
}
```

---

#### 46. Tooltip
**Purpose**: Hoverable overlay displaying contextual help text with configurable placement.

**Props**:
```typescript
interface TooltipProps {
  title: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
}
```

---

#### 47. Dropdown
**Purpose**: Generic menu component with trigger button and popover list of actions.

**Props**:
```typescript
interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
  placement?: 'bottom-start' | 'bottom-end';
}
```

---

#### 48. Avatar
**Purpose**: Circular profile image with fallback initials, size variants, and online status indicator.

**Props**:
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  status?: 'online' | 'away' | 'offline';
  badge?: React.ReactNode; // Platform badge overlay
}
```

---

#### 49. Tag
**Purpose**: Colored rounded rectangle chip for categorization (e.g., "billing", "lead").

**Props**:
```typescript
interface TagProps {
  label: string;
  color: string;
  onRemove?: () => void;
  size?: 'small' | 'medium';
}
```

---

#### 50. Divider
**Purpose**: Horizontal or vertical line for visual separation between sections.

**Props**:
```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
}
```

---

## 📁 Folder Structure

```
src/widgets/frontdesk/
├── layouts/
│   ├── three-column/
│   │   ├── three-column-layout.tsx           # Main layout wrapper
│   │   ├── left-sidebar.tsx                  # Left navigation panel
│   │   ├── middle-panel.tsx                  # Conversation list panel
│   │   ├── center-panel.tsx                  # Message thread panel
│   │   ├── right-sidebar.tsx                 # Contact details panel
│   │   └── types.ts
│   └── index.ts
│
├── navigation/
│   ├── workspace-selector/
│   │   ├── workspace-selector.tsx            # Main component
│   │   ├── workspace-dropdown.tsx            # Dropdown menu
│   │   ├── types.ts
│   │   └── index.ts
│   ├── search-bar/
│   │   ├── search-bar.tsx
│   │   ├── search-results.tsx
│   │   ├── hooks/
│   │   │   └── use-search.ts
│   │   └── index.ts
│   ├── nav-tree/
│   │   ├── nav-tree.tsx                      # Tree container
│   │   ├── nav-item.tsx                      # Individual item
│   │   ├── nav-section.tsx                   # Collapsible section
│   │   ├── types.ts
│   │   └── index.ts
│   ├── teams-list/
│   │   ├── teams-list.tsx
│   │   ├── team-item.tsx
│   │   └── index.ts
│   ├── channels-list/
│   │   ├── channels-list.tsx
│   │   ├── channel-item.tsx
│   │   └── index.ts
│   ├── user-profile-card/
│   │   ├── user-profile-card.tsx
│   │   └── index.ts
│   └── index.ts
│
├── conversations/
│   ├── list/
│   │   ├── conversations-header.tsx          # Header with actions
│   │   ├── conversation-tabs.tsx             # Filter tabs
│   │   ├── conversation-list.tsx             # Virtualized list
│   │   ├── conversation-card/
│   │   │   ├── conversation-card.tsx
│   │   │   ├── conversation-avatar.tsx
│   │   │   ├── conversation-meta.tsx
│   │   │   ├── priority-indicator.tsx
│   │   │   ├── tags-list.tsx
│   │   │   ├── unread-badge.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-conversations.ts
│   │   │   ├── use-conversation-filters.ts
│   │   │   └── use-virtualized-list.ts
│   │   └── index.ts
│   │
│   ├── thread/
│   │   ├── thread-header.tsx                 # Header with actions
│   │   ├── message-list/
│   │   │   ├── message-list.tsx              # Virtualized container
│   │   │   ├── message-bubble.tsx
│   │   │   ├── system-message.tsx
│   │   │   ├── message-meta.tsx
│   │   │   └── index.ts
│   │   ├── message-composer/
│   │   │   ├── message-composer.tsx          # Main composer
│   │   │   ├── composer-toolbar.tsx
│   │   │   ├── composer-actions.tsx
│   │   │   ├── reply-private-toggle.tsx
│   │   │   ├── send-button.tsx
│   │   │   ├── mention-dropdown.tsx
│   │   │   ├── canned-response-hint.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-messages.ts
│   │   │   ├── use-composer.ts
│   │   │   ├── use-mentions.ts
│   │   │   └── use-virtualized-messages.ts
│   │   └── index.ts
│   └── index.ts
│
├── contact-details/
│   ├── contact-detail-header.tsx             # Contact/Copilot tabs
│   ├── contact-card/
│   │   ├── contact-card.tsx
│   │   ├── contact-info-list.tsx
│   │   ├── social-links.tsx
│   │   ├── quick-actions.tsx
│   │   └── index.ts
│   ├── accordion-sections/
│   │   ├── accordion-section.tsx             # Reusable accordion
│   │   ├── conversation-actions.tsx
│   │   ├── participants-list.tsx
│   │   ├── macros-list.tsx
│   │   ├── attributes-editor.tsx
│   │   ├── conversation-timeline.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-contact-details.ts
│   │   └── use-accordion-state.ts
│   └── index.ts
│
├── components/                               # Shared FrontDesk components
│   ├── ui/
│   │   ├── icon-button.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   ├── dropdown.tsx
│   │   ├── avatar.tsx
│   │   ├── tag.tsx
│   │   ├── divider.tsx
│   │   └── index.ts
│   └── index.ts
│
├── hooks/                                    # Global FrontDesk hooks
│   ├── use-frontdesk-theme.ts
│   ├── use-keyboard-shortcuts.ts
│   ├── use-realtime-updates.ts
│   └── index.ts
│
├── types/
│   ├── conversation.types.ts
│   ├── message.types.ts
│   ├── contact.types.ts
│   ├── user.types.ts
│   └── index.ts
│
├── styles/
│   ├── theme.ts                              # Dark theme configuration
│   └── global.css
│
└── frontdesk-widget.tsx                      # Main router/entry point
```

---

## 🚀 Implementation Phases

### **Phase 1: Foundation & Layout (Week 1)**

#### **Day 1-2: Project Setup**
1. Create folder structure as specified above
2. Set up TypeScript types in `types/` directory
3. Configure dark theme in `styles/theme.ts`
4. Create base layout components:
   - `three-column-layout.tsx`
   - `left-sidebar.tsx`
   - `middle-panel.tsx`
   - `center-panel.tsx`
   - `right-sidebar.tsx`

**Deliverable**: Empty 3-column layout rendering correctly

---

#### **Day 3-4: Shared UI Components**
5. Build utility components in `components/ui/`:
   - `icon-button.tsx`
   - `badge.tsx`
   - `tooltip.tsx`
   - `dropdown.tsx`
   - `avatar.tsx`
   - `tag.tsx`
   - `divider.tsx`
6. Create Storybook stories for each component
7. Unit tests for utility components

**Deliverable**: Reusable UI component library

---

#### **Day 5: Navigation Foundation**
8. Build `workspace-selector.tsx`
9. Build `search-bar.tsx`
10. Build `user-profile-card.tsx`
11. Integrate into `left-sidebar.tsx`

**Deliverable**: Left sidebar header/footer complete

---

### **Phase 2: Navigation Tree (Week 2)**

#### **Day 1-2: Nav Tree Implementation**
12. Build `nav-tree.tsx` with recursive rendering
13. Build `nav-item.tsx` with expand/collapse logic
14. Build `nav-section.tsx` wrapper
15. Implement state management for tree (Recoil atoms)
16. Add keyboard navigation (arrow keys, Enter)

**Deliverable**: Fully functional navigation tree

---

#### **Day 3-4: Teams & Channels**
17. Build `teams-list.tsx` and `team-item.tsx`
18. Build `channels-list.tsx` and `channel-item.tsx`
19. Integrate WebSocket for real-time channel status
20. Add online/offline indicators

**Deliverable**: Complete left sidebar navigation

---

#### **Day 5: Polish & Testing**
21. Add hover states and animations
22. Implement collapse-to-icons mode (mobile)
23. Unit tests for navigation components
24. Integration tests for left sidebar

---

### **Phase 3: Conversation List (Week 3)**

#### **Day 1-2: List Foundation**
25. Build `conversations-header.tsx`
26. Build `conversation-tabs.tsx` with filter logic
27. Set up virtualized list with `@tanstack/react-virtual`
28. Create Recoil atoms for conversations state

**Deliverable**: Empty conversation list with tabs

---

#### **Day 3-4: Conversation Cards**
29. Build `conversation-card.tsx`
30. Build `conversation-avatar.tsx` with platform badges
31. Build `conversation-meta.tsx`
32. Build `priority-indicator.tsx`
33. Build `tags-list.tsx`
34. Build `unread-badge.tsx`
35. Implement hover/active states

**Deliverable**: Styled conversation cards

---

#### **Day 5: Data Integration**
36. Connect to REST API (`conversationsService`)
37. Implement WebSocket real-time updates
38. Add optimistic updates for read status
39. Implement infinite scroll pagination
40. Add loading skeletons

**Deliverable**: Functional conversation list with real data

---

### **Phase 4: Message Thread (Week 4)**

#### **Day 1-2: Thread Foundation**
41. Build `thread-header.tsx` with action buttons
42. Set up virtualized `message-list.tsx`
43. Build `message-bubble.tsx` (incoming/outgoing)
44. Build `message-meta.tsx` with delivery status
45. Build `system-message.tsx`

**Deliverable**: Message thread displaying messages

---

#### **Day 3-4: Message Composer**
46. Build `message-composer.tsx` with auto-resize
47. Build `composer-toolbar.tsx` with formatting
48. Build `composer-actions.tsx` (emoji, attachments)
49. Build `reply-private-toggle.tsx`
50. Build `send-button.tsx`
51. Implement keyboard shortcuts (Cmd+B for bold, etc.)

**Deliverable**: Functional message composer

---

#### **Day 5: Advanced Features**
52. Build `mention-dropdown.tsx` with autocomplete
53. Build `canned-response-hint.tsx`
54. Implement draft auto-save (localStorage)
55. Add file upload with drag-and-drop
56. Implement optimistic message sending

**Deliverable**: Complete message thread with composer

---

### **Phase 5: Contact Details (Week 5)**

#### **Day 1-2: Contact Card**
57. Build `contact-detail-header.tsx` (Contact/Copilot tabs)
58. Build `contact-card.tsx`
59. Build `contact-info-list.tsx` with copy-on-click
60. Build `social-links.tsx`
61. Build `quick-actions.tsx`

**Deliverable**: Contact card section complete

---

#### **Day 3-4: Accordion Sections**
62. Build reusable `accordion-section.tsx`
63. Build `conversation-actions.tsx`
64. Build `participants-list.tsx`
65. Build `macros-list.tsx`
66. Build `attributes-editor.tsx`
67. Build `conversation-timeline.tsx`
68. Implement expand/collapse animations

**Deliverable**: All accordion sections functional

---

#### **Day 5: Integration**
69. Connect to contact API
70. Implement edit mode for attributes
71. Add validation for custom fields
72. Unit tests for contact detail components

**Deliverable**: Complete right sidebar

---

### **Phase 6: Integration & Polish (Week 6)**

#### **Day 1-2: State Management**
73. Create comprehensive Recoil atom structure
74. Implement selectors for derived state
75. Add persistence for user preferences
76. Optimize re-renders with `React.memo`

---

#### **Day 3: Real-time Features**
77. Integrate WebSocket for all providers
78. Handle connection/disconnection gracefully
79. Implement typing indicators
80. Add presence (online/offline) tracking

---

#### **Day 4: Keyboard Shortcuts**
81. Implement global shortcuts:
    - `Cmd+K`: Search
    - `Cmd+Shift+M`: Mute conversation
    - `Cmd+Enter`: Send message
    - `Cmd+/`: Toggle shortcuts help
82. Add shortcut hints in tooltips
83. Create shortcuts help modal

---

#### **Day 5: Performance Optimization**
84. Code splitting with React.lazy
85. Image lazy loading
86. Debounce search inputs
87. Optimize WebSocket message handling
88. Add error boundaries

---

### **Phase 7: Testing & Documentation (Week 7)**

#### **Day 1-2: Testing**
89. Unit tests (Jest + React Testing Library) - 80%+ coverage
90. Integration tests for critical flows
91. E2E tests with Playwright
92. Accessibility testing (axe-core)

---

#### **Day 3-4: Documentation**
93. Component documentation (JSDoc)
94. Storybook stories for all components
95. Update DEVELOPER_GUIDE.md
96. Create troubleshooting guide

---

#### **Day 5: Launch Prep**
97. Performance audit (Lighthouse)
98. Security audit (OWASP)
99. Browser compatibility testing
100. Final QA pass

---

## 🔧 Technical Specifications

### **State Management (Recoil)**

#### **Atom Structure**

```typescript
// src/store/frontdesk/atoms/conversations.atoms.ts
export const conversationsAtom = atom<Conversation[]>({
  key: 'frontdesk.conversations.list',
  default: [],
});

export const selectedConversationIdAtom = atom<string | null>({
  key: 'frontdesk.conversations.selectedId',
  default: null,
});

export const conversationFiltersAtom = atom<ConversationFilters>({
  key: 'frontdesk.conversations.filters',
  default: {
    tab: 'mine', // 'mine' | 'unassigned' | 'all'
    search: '',
    tags: [],
    platforms: [],
  },
});

// Selector for filtered conversations
export const filteredConversationsSelector = selector<Conversation[]>({
  key: 'frontdesk.conversations.filtered',
  get: ({ get }) => {
    const conversations = get(conversationsAtom);
    const filters = get(conversationFiltersAtom);

    return conversations.filter(conv => {
      // Apply filters logic
      if (filters.tab === 'mine' && !conv.assignedToMe) return false;
      if (filters.tab === 'unassigned' && conv.assignedTo) return false;
      if (filters.search && !matchesSearch(conv, filters.search)) return false;
      // ... more filters
      return true;
    });
  },
});
```

```typescript
// src/store/frontdesk/atoms/messages.atoms.ts
export const messagesAtom = atomFamily<Message[], string>({
  key: 'frontdesk.messages.byConversationId',
  default: [],
});

export const messageComposerAtom = atom<{
  content: string;
  type: 'reply' | 'private';
}>({
  key: 'frontdesk.messageComposer',
  default: {
    content: '',
    type: 'reply',
  },
});
```

```typescript
// src/store/frontdesk/atoms/ui.atoms.ts
export const leftSidebarCollapsedAtom = atom<boolean>({
  key: 'frontdesk.ui.leftSidebarCollapsed',
  default: false,
  effects: [
    localStorageEffect('frontdesk_leftSidebarCollapsed'),
  ],
});

export const rightSidebarVisibleAtom = atom<boolean>({
  key: 'frontdesk.ui.rightSidebarVisible',
  default: true,
  effects: [
    localStorageEffect('frontdesk_rightSidebarVisible'),
  ],
});
```

---

### **Services Architecture**

```typescript
// src/services/frontdesk/api/conversations.service.ts
export class ConversationsService {
  async getConversations(filters: ConversationFilters): Promise<Conversation[]> {
    const response = await apiClient.get('/conversations', { params: filters });
    return response.data;
  }

  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get(`/conversations/${id}`);
    return response.data;
  }

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(`/conversations/${conversationId}/read`);
  }

  // ... more methods
}

export const conversationsService = new ConversationsService();
```

```typescript
// src/services/frontdesk/websocket/conversations.socket.ts
export class ConversationsSocketService {
  private socket: WebSocket | null = null;

  connect(token: string): void {
    this.socket = new WebSocket(`${WS_URL}/conversations?token=${token}`);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'conversation.new':
        // Update Recoil atom
        break;
      case 'conversation.updated':
        // Update Recoil atom
        break;
      case 'message.new':
        // Update messages atom
        break;
    }
  }

  // ... more methods
}

export const conversationsSocketService = new ConversationsSocketService();
```

---

### **Performance Optimization**

#### **Virtualization**

```typescript
// src/widgets/frontdesk/conversations/list/conversation-list.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const ConversationList: React.FC = () => {
  const conversations = useRecoilValue(filteredConversationsSelector);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: conversations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // Average card height
    overscan: 5, // Render 5 extra items for smooth scrolling
  });

  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ConversationCard conversation={conversations[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

#### **Code Splitting**

```typescript
// src/widgets/frontdesk/frontdesk-widget.tsx
import { lazy, Suspense } from 'react';

const ContactDetails = lazy(() => import('./contact-details'));
const MessageComposer = lazy(() => import('./conversations/thread/message-composer'));

export const FrontdeskWidget: React.FC = () => {
  return (
    <ThreeColumnLayout>
      <Suspense fallback={<Skeleton />}>
        <ContactDetails />
      </Suspense>
      <Suspense fallback={<div>Loading composer...</div>}>
        <MessageComposer />
      </Suspense>
    </ThreeColumnLayout>
  );
};
```

---

### **Keyboard Shortcuts**

```typescript
// src/widgets/frontdesk/hooks/use-keyboard-shortcuts.ts
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }

      // Cmd/Ctrl + Enter: Send message
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // Arrow Up/Down: Navigate conversations
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          navigateConversations(e.key === 'ArrowUp' ? -1 : 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

---

## 📊 State Management Strategy

### **Atom Organization**

```
src/store/frontdesk/atoms/
├── conversations.atoms.ts      # Conversation list, filters, selected ID
├── messages.atoms.ts           # Messages by conversation ID (atomFamily)
├── contacts.atoms.ts           # Contact details cache
├── ui.atoms.ts                 # UI state (sidebar collapsed, modals)
├── composer.atoms.ts           # Message composer state
└── realtime.atoms.ts           # WebSocket connection state
```

### **Data Flow**

```
┌─────────────────────────────────────────────────────────────┐
│ Component Layer                                             │
├─────────────────────────────────────────────────────────────┤
│ ConversationCard → useRecoilValue(conversationsAtom)        │
│ MessageBubble → useRecoilValue(messagesAtom(convId))       │
│ MessageComposer → useRecoilState(composerAtom)             │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │
┌─────────────────────────────────────────────────────────────┐
│ Recoil Atoms (Global State)                                │
├─────────────────────────────────────────────────────────────┤
│ • conversationsAtom                                         │
│ • messagesAtom (atomFamily)                                │
│ • selectedConversationIdAtom                               │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │
┌─────────────────────────────────────────────────────────────┐
│ Services Layer                                              │
├─────────────────────────────────────────────────────────────┤
│ • conversationsService.getConversations()                   │
│ • messagesService.sendMessage()                            │
│ • conversationsSocketService.connect()                      │
└─────────────────────────────────────────────────────────────┘
                              ↑
                              │
┌─────────────────────────────────────────────────────────────┐
│ Backend APIs                                                │
├─────────────────────────────────────────────────────────────┤
│ REST: GET /conversations, POST /messages                    │
│ WebSocket: /ws/conversations (real-time updates)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Development Workflow

### **Getting Started**

1. **Clone and setup**:
```bash
cd /Users/omarsabbah/Desktop/gomake-services/gomake-web
npm install
```

2. **Create feature branch**:
```bash
git checkout -b frontdesk/v2-three-column-layout
```

3. **Start development server**:
```bash
npm run dev
# Navigate to: http://localhost:3004/frontdesk-v2
```

---

### **Component Development Process**

#### **Step 1: Create Types**
```typescript
// src/widgets/frontdesk/types/conversation.types.ts
export interface Conversation {
  id: string;
  contact: Contact;
  lastMessage: Message;
  platform: Platform;
  unreadCount: number;
  priority: Priority;
  tags: Tag[];
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
}
```

---

#### **Step 2: Build Component**
```typescript
// src/widgets/frontdesk/conversations/list/conversation-card/conversation-card.tsx
import React from 'react';
import { ConversationAvatar } from './conversation-avatar';
import { ConversationMeta } from './conversation-meta';
import { TagsList } from './tags-list';
import { UnreadBadge } from './unread-badge';
import type { Conversation } from '@/widgets/frontdesk/types';

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        backgroundColor: isSelected ? '#1a1a1a' : '#0d0d0d',
        borderLeft: isSelected ? '3px solid #2e3092' : 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <ConversationAvatar
          src={conversation.contact.avatar}
          alt={conversation.contact.name}
          platform={conversation.platform}
        />
        <div style={{ flex: 1 }}>
          <ConversationMeta
            name={conversation.contact.name}
            timestamp={conversation.lastMessage.timestamp}
            preview={conversation.lastMessage.content}
          />
          <TagsList tags={conversation.tags} maxVisible={2} />
        </div>
        {conversation.unreadCount > 0 && (
          <UnreadBadge count={conversation.unreadCount} />
        )}
      </div>
    </div>
  );
};
```

---

#### **Step 3: Create Hook**
```typescript
// src/widgets/frontdesk/conversations/list/hooks/use-conversations.ts
import { useRecoilValue, useRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationIdAtom } from '@/store/frontdesk/atoms';
import { conversationsService } from '@/services/frontdesk';

export const useConversations = () => {
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedId, setSelectedId] = useRecoilState(selectedConversationIdAtom);

  const loadConversations = async () => {
    const data = await conversationsService.getConversations();
    setConversations(data);
  };

  const selectConversation = (id: string) => {
    setSelectedId(id);
  };

  return {
    conversations,
    selectedId,
    loadConversations,
    selectConversation,
  };
};
```

---

#### **Step 4: Write Tests**
```typescript
// src/widgets/frontdesk/conversations/list/conversation-card/__tests__/conversation-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationCard } from '../conversation-card';

describe('ConversationCard', () => {
  const mockConversation = {
    id: '1',
    contact: { name: 'John Doe', avatar: 'avatar.jpg' },
    lastMessage: { content: 'Hello', timestamp: new Date() },
    platform: 'email' as const,
    unreadCount: 3,
    priority: 'normal' as const,
    tags: [{ id: '1', label: 'billing', color: '#ff0000' }],
  };

  it('should render conversation details', () => {
    render(
      <ConversationCard
        conversation={mockConversation}
        isSelected={false}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Unread badge
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <ConversationCard
        conversation={mockConversation}
        isSelected={false}
        onClick={onClick}
      />
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

#### **Step 5: Create Storybook Story**
```typescript
// src/widgets/frontdesk/conversations/list/conversation-card/conversation-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ConversationCard } from './conversation-card';

const meta: Meta<typeof ConversationCard> = {
  title: 'FrontDesk/Conversations/ConversationCard',
  component: ConversationCard,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConversationCard>;

export const Default: Story = {
  args: {
    conversation: {
      id: '1',
      contact: { name: 'Klaus Crawley', avatar: '/avatar.jpg' },
      lastMessage: {
        content: 'Hi, I need some help setting up my new device.',
        timestamp: new Date(),
      },
      platform: 'email',
      unreadCount: 0,
      priority: 'normal',
      tags: [{ id: '1', label: 'device-setup', color: '#00ff00' }],
    },
    isSelected: false,
    onClick: () => console.log('Clicked'),
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const WithUnread: Story = {
  args: {
    ...Default.args,
    conversation: {
      ...Default.args.conversation!,
      unreadCount: 5,
    },
  },
};

export const HighPriority: Story = {
  args: {
    ...Default.args,
    conversation: {
      ...Default.args.conversation!,
      priority: 'urgent',
    },
  },
};
```

---

### **Git Workflow**

```bash
# 1. Create feature branch
git checkout -b frontdesk/conversation-card-component

# 2. Make changes and commit frequently
git add .
git commit -m "feat(frontdesk): add ConversationCard component"

# 3. Push to remote
git push origin frontdesk/conversation-card-component

# 4. Create Pull Request
gh pr create --title "feat(frontdesk): Add ConversationCard component" \
  --body "Implements conversation card with avatar, meta, tags, and unread badge"
```

---

### **Testing Strategy**

#### **Unit Tests (Jest + React Testing Library)**
```bash
npm test -- conversation-card.test.tsx
```

#### **Integration Tests**
```bash
npm test -- conversation-list.integration.test.tsx
```

#### **E2E Tests (Playwright)**
```bash
npx playwright test frontdesk-conversation-flow.spec.ts
```

#### **Accessibility Tests**
```bash
npm run test:a11y
```

---

### **Code Quality Checks**

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code
npm run format
```

---

## 🎨 Design System

### **Colors (Dark Theme)**

```typescript
export const colors = {
  background: {
    primary: '#000000',    // CenterPanel
    secondary: '#0d0d0d',  // MiddlePanel, RightSidebar
    tertiary: '#1a1a1a',   // LeftSidebar
    hover: '#262626',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    tertiary: '#666666',
  },
  brand: {
    primary: '#2e3092',    // Blue (selected states)
    secondary: '#5a5fc7',
  },
  status: {
    online: '#10b981',
    away: '#f59e0b',
    offline: '#6b7280',
  },
  priority: {
    low: '#6b7280',
    normal: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  },
  platform: {
    email: '#ea4335',
    whatsapp: '#25d366',
    facebook: '#1877f2',
    sms: '#8b5cf6',
  },
};
```

---

### **Typography**

```typescript
export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: '"SF Mono", Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

---

### **Spacing**

```typescript
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
};
```

---

### **Shadows**

```typescript
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
};
```

---

## 📈 Success Metrics

### **Performance Targets**
- **Initial Load**: < 2s (3G network)
- **Time to Interactive**: < 3s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### **Functional Requirements**
- ✅ Support 1000+ conversations without lag
- ✅ Real-time message updates < 200ms latency
- ✅ Keyboard navigation for all actions
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ 80%+ unit test coverage

---

## 🚨 Common Pitfalls & Solutions

### **Pitfall 1: Poor Virtualization Performance**
**Problem**: List stutters when scrolling
**Solution**: Use `estimateSize` accurately, increase `overscan` value

### **Pitfall 2: WebSocket Reconnection Loops**
**Problem**: Infinite reconnection attempts
**Solution**: Implement exponential backoff with max retries

### **Pitfall 3: Memory Leaks from Recoil Atoms**
**Problem**: Old conversation data never cleaned up
**Solution**: Use `atomFamily` effects to clean up on unmount

### **Pitfall 4: Flickering on State Updates**
**Problem**: Components re-render unnecessarily
**Solution**: Use `React.memo` and selector dependencies carefully

---

## 📖 Additional Resources

- **Recoil Docs**: https://recoiljs.org/
- **TanStack Virtual**: https://tanstack.com/virtual/latest
- **MUI Components**: https://mui.com/material-ui/
- **WebSocket Best Practices**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## ✅ Checklist

### **Before Starting Development**
- [ ] Read this document thoroughly
- [ ] Review backend API docs (`/Users/omarsabbah/Desktop/Messaging-Hub/docs/`)
- [ ] Set up development environment
- [ ] Create feature branch (`frontdesk/v2-*`)

### **During Development**
- [ ] Follow folder structure exactly
- [ ] Write TypeScript types first
- [ ] Build components incrementally
- [ ] Write tests alongside code
- [ ] Create Storybook stories
- [ ] Test keyboard navigation
- [ ] Test responsiveness (mobile/tablet/desktop)

### **Before PR**
- [ ] All tests passing
- [ ] Linting errors resolved
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Code reviewed by peer

---

**End of Implementation Guide**
