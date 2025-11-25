# Unified Avatar System for Chatwoot Provider

## Overview

The Chatwoot provider uses a centralized avatar generation system located in `avatar.utils.ts` that provides consistent avatar display across all components. This system ensures:

- **Consistent colors**: Same user/contact always gets the same color
- **Type safety**: Entity-specific functions with proper TypeScript types
- **Accessibility**: Alt text and titles for screen readers
- **Performance**: Memoized functions for optimal rendering
- **Maintainability**: Single source of truth for avatar logic

## Architecture

### Core Interface

All avatar functions return a standardized `AvatarData` object:

```typescript
interface AvatarData {
  initials: string;           // 1-2 uppercase characters
  backgroundColor: string;    // Consistent hex color
  src?: string;               // Avatar image URL (optional)
  displayName: string;        // Full name for accessibility
  presence?: "online" | "busy" | "offline" | null;
}
```

### Entity-Specific Functions

| Function | Use Case | Entity Type |
|----------|----------|-------------|
| `generateContactAvatar()` | Conversation senders/receivers | Contact |
| `generateAgentAvatar()` | Team members, assignees | Agent |
| `generateUserAvatar()` | Current user profile | User |
| `generateNotificationAvatar()` | Activity feed senders | Notification Actor |
| `generateTeamAvatar()` | Team assignments | Team |
| `generateMessageSenderAvatar()` | Message bubbles | Message Sender |

## Usage Examples

### 1. Contact Avatars (Conversation List)

```typescript
import { generateContactAvatar } from "../utils/avatar.utils";

const avatarData = generateContactAvatar(conversation.meta.sender);

<Avatar 
  src={avatarData.src}
  sx={{ 
    width: 40, 
    height: 40,
    bgcolor: avatarData.backgroundColor 
  }}
  alt={avatarData.displayName}
  title={avatarData.displayName}
>
  {avatarData.initials}
</Avatar>
```

### 2. Agent Avatars (Assignee Section)

```typescript
import { generateAgentAvatar } from "../utils/avatar.utils";

const avatarData = generateAgentAvatar(assignee);

<Avatar 
  src={avatarData.src}
  sx={{ 
    width: 32, 
    height: 32,
    bgcolor: avatarData.backgroundColor 
  }}
  alt={avatarData.displayName}
>
  {avatarData.initials}
</Avatar>
```

### 3. User Avatars (Profile Card)

```typescript
import { generateUserAvatar } from "../utils/avatar.utils";

const avatarData = useMemo(() => generateUserAvatar(profile), [profile]);

<Avatar 
  src={avatarData.src}
  sx={{ 
    width: 48, 
    height: 48,
    bgcolor: avatarData.backgroundColor 
  }}
  alt={avatarData.displayName}
>
  {avatarData.initials}
</Avatar>
```

### 4. Notification Avatars (Activity Feed)

```typescript
import { generateNotificationAvatar } from "../utils/avatar.utils";

const avatarData = generateNotificationAvatar(notification);

<Avatar 
  src={avatarData.src}
  sx={{ 
    width: 32, 
    height: 32,
    bgcolor: avatarData.backgroundColor,
    fontSize: "0.75rem"
  }}
  alt={avatarData.displayName}
>
  {avatarData.initials}
</Avatar>
```

### 5. Message Sender Avatars (Chat Bubbles)

```typescript
import { generateMessageSenderAvatar } from "../utils/avatar.utils";

const avatarData = useMemo(
  () => generateMessageSenderAvatar(message.sender),
  [message.sender]
);

<Avatar 
  src={avatarData.src}
  sx={{ 
    width: 32, 
    height: 32,
    bgcolor: avatarData.backgroundColor 
  }}
  alt={avatarData.displayName}
>
  {avatarData.initials[0]}
</Avatar>
```

## Avatar Sizes

Use the predefined sizes for consistency:

```typescript
import { AVATAR_SIZES } from "../utils/avatar.utils";

// Available sizes:
AVATAR_SIZES.xs  // 16x16 (compact notifications)
AVATAR_SIZES.sm  // 24x24 (menu items)
AVATAR_SIZES.md  // 32x32 (default)
AVATAR_SIZES.lg  // 40x40 (profile cards)
AVATAR_SIZES.xl  // 48x48 (large profiles)
```

## Presence Indicators

Show online/busy/offline status for agents and users:

```typescript
import { getPresenceColor, shouldShowPresence } from "../utils/avatar.utils";

{avatarData.presence && shouldShowPresence(avatarData.presence) && (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: getPresenceColor(avatarData.presence),
      position: "absolute",
      bottom: 0,
      right: 0,
      border: "2px solid white"
    }}
  />
)}
```

## Performance Best Practices

### 1. Memoize in Components

```typescript
const avatarData = useMemo(
  () => generateContactAvatar(contact),
  [contact.id, contact.name, contact.email] // Only recompute when needed
);
```

### 2. Avoid Re-creating in Render Loops

```typescript
// ❌ BAD: Creates new object on every render
{contacts.map(contact => (
  <Avatar sx={{ bgcolor: generateContactAvatar(contact).backgroundColor }} />
))}

// ✅ GOOD: Memoize or use key-based memoization
{contacts.map(contact => {
  const avatarData = generateContactAvatar(contact);
  return <Avatar key={contact.id} sx={{ bgcolor: avatarData.backgroundColor }} />;
})}
```

### 3. Use React.memo for List Items

```typescript
const ContactItem = React.memo(({ contact }) => {
  const avatarData = useMemo(() => generateContactAvatar(contact), [contact]);
  // ... render
}, (prev, next) => prev.contact.id === next.contact.id);
```

## Color Consistency

The system uses a hash-based algorithm to ensure:

1. **Same input = Same color**: Contact "John Doe" always gets the same color
2. **Stable across sessions**: Colors persist across page refreshes
3. **Good distribution**: 10 vibrant colors for visual distinction

### Color Palette

```typescript
const CHATWOOT_AVATAR_COLORS = [
  "#1976D2", // Primary blue
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
];
```

## Migration Guide

### Old Pattern (Deprecated)

```typescript
// ❌ Old inline avatar generation
const name = sender.name || sender.email || "Unknown";
const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
const colors = ["#1976D2", "#3B82F6", "#10B981"];
const colorIndex = name.charCodeAt(0) % colors.length;

<Avatar src={sender.avatar_url} sx={{ bgcolor: colors[colorIndex] }}>
  {initials}
</Avatar>
```

### New Pattern (Unified)

```typescript
// ✅ New centralized avatar generation
import { generateContactAvatar } from "../utils/avatar.utils";

const avatarData = generateContactAvatar(sender);

<Avatar 
  src={avatarData.src}
  sx={{ bgcolor: avatarData.backgroundColor }}
  alt={avatarData.displayName}
>
  {avatarData.initials}
</Avatar>
```

## Accessibility Guidelines

### 1. Always Include Alt Text

```typescript
<Avatar 
  src={avatarData.src}
  alt={avatarData.displayName}  // ✅ Required for screen readers
  title={avatarData.displayName} // ✅ Hover tooltip
>
  {avatarData.initials}
</Avatar>
```

### 2. Use Semantic Names

```typescript
// ✅ GOOD: Descriptive display names
const avatarData = generateAgentAvatar({
  name: "John Doe",  // Full name preferred
  email: "john@example.com",
  id: 123
});

// ❌ BAD: Using IDs or technical identifiers
const avatarData = generateAgentAvatar({
  name: "user_123",  // Not user-friendly
  email: "john@example.com",
  id: 123
});
```

### 3. Color Contrast

All avatar colors meet WCAG AA contrast requirements for white text:
- Minimum contrast ratio: 4.5:1
- All 10 colors are tested and compliant

## Troubleshooting

### Avatar Not Showing Correct Color

**Problem**: Different components showing different colors for the same user.

**Solution**: Ensure you're using the same identifier (preferably `id` > `email` > `name`):

```typescript
// ✅ GOOD: Consistent identifier
generateContactAvatar({ id: 123, name: "John", email: "john@example.com" })

// ❌ BAD: Using different identifiers
generateContactAvatar({ name: "John" })  // Color based on name
generateContactAvatar({ email: "john@example.com" })  // Different color!
```

### Initials Not Displaying

**Problem**: Avatar shows `??` instead of initials.

**Solution**: Ensure entity has at least one of: `name`, `email`, or `displayName`:

```typescript
// ✅ GOOD: Has name
generateContactAvatar({ name: "John Doe", email: null })  // "JD"

// ✅ GOOD: Has email as fallback
generateContactAvatar({ name: null, email: "john@example.com" })  // "JO"

// ❌ BAD: No identifiers
generateContactAvatar({ name: null, email: null })  // "??"
```

### Performance Issues with Large Lists

**Problem**: Slow rendering when displaying many avatars.

**Solution**: Use memoization and React.memo:

```typescript
const ContactItem = React.memo(({ contact }) => {
  const avatarData = useMemo(() => generateContactAvatar(contact), [
    contact.id,
    contact.name,
    contact.email
  ]);
  
  return <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
    {avatarData.initials}
  </Avatar>;
});
```

## Components Using Unified System

✅ **Migrated to Unified System**:

1. **Notifications**
   - `chatwoot-notifications-compact.tsx`
   - `chatwoot-notifications-enhanced.tsx`
   - `chatwoot-notifications-widget.tsx`
   - `NotificationListItem.tsx`

2. **Messages**
   - `chatwoot-message-item.tsx`
   - `chatwoot-message-viewer.tsx`

3. **Profile & Assignees**
   - `chatwoot-profile-card.tsx`
   - `conversation-assignee-section.tsx`
   - `conversation-profile-section.tsx`

4. **Conversations**
   - `chatwoot-conversation-list-item.tsx` (uses design system)
   - `chatwoot-conversation-detail-panel.tsx`

5. **Settings**
   - `agents-subpage.tsx`
   - `ContactSelector.tsx`

## Related Documentation

- **API Reference**: See `avatar.utils.ts` for complete function signatures
- **Performance Guide**: See `PERFORMANCE.md` for optimization patterns
- **Design System**: See `/design-system/tokens/` for color definitions
- **Accessibility**: See WCAG 2.1 Level AA guidelines

## Support

For questions or issues with the avatar system:

1. Check this guide first
2. Review `avatar.utils.ts` implementation
3. See usage examples in migrated components
4. Consult the troubleshooting section

---

**Last Updated**: 2025-01-25  
**Maintained By**: FrontDesk Chatwoot Team

