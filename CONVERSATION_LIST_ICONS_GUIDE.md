# Conversation List Icons & Visual Elements Guide

**Purpose**: This guide documents all icons and visual indicators displayed in each conversation item in the conversation list, including their locations, conditions, and data sources.

**Target Audience**: Frontend developers working on the conversation list UI.

---

## Quick Reference: Component Structure

**Main Component**: `app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue`

**Key Sub-Components**:
- `CardPriorityIcon.vue` - Priority indicator
- `CardMessagePreview.vue` - Message preview (simple)
- `CardMessagePreviewWithMeta.vue` - Message preview with labels/SLA
- `CardLabels.vue` - Conversation labels
- `SLACardLabel.vue` - SLA status indicator

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Avatar]  Contact Name                    [Priority]    │
│           [Status]                        [Inbox Icon]   │
│                                       [Timestamp]        │
│                                                          │
│           Last message preview...      [Unread Badge]   │
│                                                          │
│           [SLA Label] | [Labels...]    [Assignee]       │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Contact Avatar

### Location
Left side of conversation card (circular avatar, 24px size)

### What It Shows
- Contact's profile picture (if available)
- Contact's initials (if no picture)
- **Status badge**: Small colored dot on avatar border indicating availability

### Status Badge Colors
- `online` → Teal (`bg-n-teal-10`)
- `busy` → Amber (`bg-n-amber-10`)
- `offline` → Gray (`bg-n-slate-10`) - shown unless `hideOfflineStatus` is true

### Code Reference
```87:99:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
<template>
  <div
    role="button"
    class="flex w-full gap-3 px-3 py-4 transition-all duration-300 ease-in-out cursor-pointer"
    @click="onCardClick"
  >
    <Avatar
      :name="currentContactName"
      :src="currentContactThumbnail"
      :size="24"
      :status="currentContactStatus"
      rounded-full
    />
```

### Data Source
```javascript
// From ConversationCard.vue props
contact.thumbnail        // Avatar image URL
contact.name             // Contact name (for initials)
contact.availabilityStatus  // 'online' | 'busy' | 'offline'
```

### Component
`dashboard/components-next/avatar/Avatar.vue`

---

## 2. Inbox Channel Icon

### Location
Top-right area, in a small circular gray background (`bg-n-alpha-2`, size `5`)

### What It Shows
Icon representing the conversation's channel/inbox type.

### Icon Mapping Table

| Channel Type | Medium | Icon | Notes |
|-------------|--------|------|-------|
| `Channel::WebWidget` | - | `i-ri-global-fill` | Web widget chat |
| `Channel::FacebookPage` | - | `i-ri-messenger-fill` | Facebook Messenger |
| `Channel::TwitterProfile` | - | `i-ri-twitter-x-fill` | Twitter/X |
| `Channel::Whatsapp` | - | `i-ri-whatsapp-fill` | WhatsApp |
| `Channel::TwilioSms` | `whatsapp` | `i-ri-whatsapp-fill` | Twilio WhatsApp |
| `Channel::TwilioSms` | `sms` | `i-ri-chat-1-fill` | Twilio SMS (default) |
| `Channel::Email` | - | `i-ri-mail-fill` | Email |
| `Channel::Telegram` | - | `i-ri-telegram-fill` | Telegram |
| `Channel::Line` | - | `i-ri-line-fill` | LINE |
| `Channel::Instagram` | - | `i-ri-instagram-fill` | Instagram |
| `Channel::Voice` | - | `i-ri-phone-fill` | Voice calls |
| `Channel::Api` | - | `i-ri-cloudy-fill` | API channel |
| Unknown/Other | - | `i-ri-chat-1-fill` | Default fallback |

### Code Reference
```50:53:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
const inboxIcon = computed(() => {
  const { channelType, medium } = inbox.value;
  return getInboxIconByType(channelType, medium);
});
```

```107:115:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
          <div
            v-tooltip.left="inboxName"
            class="flex items-center justify-center flex-shrink-0 rounded-full bg-n-alpha-2 size-5"
          >
            <Icon
              :icon="inboxIcon"
              class="flex-shrink-0 text-n-slate-11 size-3"
            />
          </div>
```

### Helper Function
`dashboard/helper/inbox.js` → `getInboxIconByType(channelType, medium, variant = 'fill')`

### Data Source
```javascript
inbox.channelType  // e.g., 'Channel::Email'
inbox.medium       // e.g., 'whatsapp' for Twilio
```

---

## 3. Priority Icon

### Location
Top-right area, before inbox icon

### What It Shows
Vertical bars indicating conversation priority level.

### Priority Levels & Visual Design

| Priority | Bars Highlighted | Color | SVG Reference |
|----------|------------------|-------|---------------|
| `low` | 1 of 3 bars | Amber (`fill-n-amber-9`) | ```17:61:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardPriorityIcon.vue``` |
| `medium` | 2 of 3 bars | Amber (`fill-n-amber-9`) | ```65:109:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardPriorityIcon.vue``` |
| `high` | 3 of 3 bars | Amber (`fill-n-amber-9`) | ```113:157:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardPriorityIcon.vue``` |
| `urgent` | 3 of 3 bars | Ruby/Red (`fill-n-ruby-9`) | ```161:205:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardPriorityIcon.vue``` |

### Display Condition
Only shown if `conversation.priority` is set (not `null`, `undefined`, or empty string)

### Code Reference
```106:106:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
          <CardPriorityIcon :priority="conversation.priority || null" />
```

### Constants
```23:28:app/javascript/shared/constants/messages.js
export const CONVERSATION_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  LOW: 'low',
  MEDIUM: 'medium',
};
```

### Data Source
```javascript
conversation.priority  // 'urgent' | 'high' | 'medium' | 'low' | null
```

---

## 4. Unread Count Badge

### Location
Bottom-right of message preview area (when shown in `CardMessagePreview.vue` or `CardMessagePreviewWithMeta.vue`)

### What It Shows
Circular badge with unread message count.

### Visual Appearance
- Background: Brand color (`bg-n-brand`)
- Text: White (`text-white`)
- Size: `size-5` (20px)
- Font: `text-xs font-semibold`
- Display: Shows count, or "9+" if count > 9 (though current implementation shows exact count)

### Display Condition
Only shown if `conversation.unreadCount > 0`

### Code Reference
```57:64:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardMessagePreview.vue
      <div
        v-if="unreadMessagesCount > 0"
        class="inline-flex items-center justify-center rounded-full size-5 bg-n-brand"
      >
        <span class="text-xs font-semibold text-white">
          {{ unreadMessagesCount }}
        </span>
      </div>
```

### Data Source
```javascript
conversation.unreadCount  // Number (0 or positive)
```

---

## 5. Assignee Avatar

### Location
Bottom-right of message preview area (in `CardMessagePreview.vue` and `CardMessagePreviewWithMeta.vue`)

### What It Shows
Small avatar (20px) of the agent assigned to the conversation, with availability status badge.

### Display Condition
Only shown if `conversation.meta.assignee.name` exists

### Code Reference
```49:56:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardMessagePreview.vue
      <Avatar
        v-if="assignee.name"
        :name="assignee.name"
        :src="assignee.thumbnail"
        :size="20"
        :status="assignee.status"
        rounded-full
      />
```

### Data Source
```javascript
conversation.meta.assignee.name             // Agent name
conversation.meta.assignee.thumbnail        // Agent avatar URL
conversation.meta.assignee.availabilityStatus // Agent status (online/busy/offline)
```

**Note**: In `CardMessagePreviewWithMeta.vue`, the assignee is shown in a grid layout at the far right:
```98:105:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardMessagePreviewWithMeta.vue
      <Avatar
        v-if="assignee.name"
        :name="assignee.name"
        :src="assignee.thumbnail"
        :size="20"
        :status="assignee.status"
        rounded-full
      />
```

---

## 6. SLA Label

### Location
Bottom of conversation card, before regular labels

### What It Shows
Clock icon + SLA status text (e.g., "FIRST_RESPONSE_TIME: 5m")

### Visual Appearance
- **Icon**: Small clock SVG (10x13px)
- **Icon Color**: 
  - Red (`fill-n-ruby-10`) if SLA is missed
  - Gray (`fill-n-slate-9`) if within SLA
- **Text Color**:
  - Red (`text-n-ruby-11`) if SLA is missed
  - Gray (`text-n-slate-11`) if within SLA

### SLA Types
- `FIRST_RESPONSE_TIME`
- `NEXT_RESPONSE_TIME`
- `RESOLUTION_TIME`

### Display Condition
Only shown if `conversation.appliedSla?.id` exists AND `slaStatus.threshold` is calculated

### Code Reference
```86:108:app/javascript/dashboard/components-next/Conversation/ConversationCard/SLACardLabel.vue
  <div class="flex items-center min-w-fit gap-0.5 h-6">
    <div class="flex items-center justify-center size-4">
      <svg
        width="10"
        height="13"
        viewBox="0 0 10 13"
        fill="none"
        :class="isSlaMissed ? 'fill-n-ruby-10' : 'fill-n-slate-9'"
        xmlns="http://www.w3.org/2000/svg"
      >
```

### Update Frequency
SLA status refreshes every 60 seconds (see `REFRESH_INTERVAL` in `SLACardLabel.vue`)

### Data Source
```javascript
conversation.appliedSla.id              // SLA policy ID
conversation.appliedSla                  // Full SLA object (converted to snake_case for evaluation)
conversation.timestamp                   // Used for SLA calculations
conversation.lastActivityAt              // Used for SLA calculations
```

### Helper Function
Uses `@chatwoot/utils` → `evaluateSLAStatus()` to calculate status

---

## 7. Conversation Labels

### Location
Bottom of conversation card, after SLA label (if present)

### What It Shows
Colored dot + label title for each conversation label

### Visual Appearance
- Colored dot (`size-1.5 rounded-full`) - color from `label.color`
- Label text (`text-sm text-n-slate-10`)
- Truncated if too many labels to fit

### Display Condition
Only shown if `conversation.labels.length > 0`

### Code Reference
```73:93:app/javascript/dashboard/components-next/Conversation/ConversationCard/CardLabels.vue
    <template v-for="(label, index) in visibleLabels" :key="label.id">
      <div
        class="flex items-center gap-1.5 min-w-0"
        :class="[
          index !== visibleLabels.length - 1
            ? 'flex-shrink-0 text-ellipsis'
            : 'flex-shrink',
        ]"
      >
        <div
          :style="{ backgroundColor: label.color }"
          class="size-1.5 rounded-full flex-shrink-0"
        />
        <span
          class="text-sm text-n-slate-10 whitespace-nowrap"
          :class="{ truncate: index === visibleLabels.length - 1 }"
        >
          {{ label.title }}
        </span>
      </div>
    </template>
```

### Smart Truncation
Labels are dynamically truncated based on container width using:
- Average label width calculation
- Character-based width estimation
- Responsive resizing

### Data Source
```javascript
conversation.labels          // Array of label titles (strings)
accountLabels                // Array of full label objects with { id, title, color }
```

**Label Matching**: Component filters `accountLabels` to show only labels whose `title` matches items in `conversation.labels` array.

---

## 8. Timestamp

### Location
Top-right corner, after inbox icon

### What It Shows
Relative time display (e.g., "2h ago", "Yesterday", "3d ago")

### Format
Uses `shortTimestamp(dynamicTime(timestamp))` helper

### Code Reference
```55:58:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
const lastActivityAt = computed(() => {
  const timestamp = props.conversation?.timestamp;
  return timestamp ? shortTimestamp(dynamicTime(timestamp)) : '';
});
```

```116:118:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
          <span class="text-sm text-n-slate-10">
            {{ lastActivityAt }}
          </span>
```

### Data Source
```javascript
conversation.timestamp  // Unix timestamp or ISO date string
```

---

## 9. Contact Name

### Location
Top-left, next to avatar

### What It Shows
Contact's name (truncated if too long)

### Code Reference
```102:104:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
        <h4 class="text-base font-medium truncate text-n-slate-12">
          {{ currentContactName }}
        </h4>
```

### Data Source
```javascript
contact.name  // Contact's display name
```

---

## 10. Message Preview

### Location
Below contact name, above labels

### What It Shows
Preview of last non-activity message, or email subject, or fallback text

### Display Logic
- Uses `CardMessagePreview.vue` if no labels and no SLA threshold
- Uses `CardMessagePreviewWithMeta.vue` if labels exist or SLA threshold is set

### Code Reference
```60:65:app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue
const showMessagePreviewWithoutMeta = computed(() => {
  const { labels = [] } = props.conversation;
  return (
    !cardMessagePreviewWithMetaRef.value?.hasSlaThreshold && labels.length === 0
  );
});
```

### Data Source
```javascript
conversation.lastNonActivityMessage.content  // Last message text
conversation.customAttributes.email.subject  // Email subject (if email conversation)
```

---

## Complete Display Matrix

| Element | Always Visible | Conditional Display | Data Source | Component |
|---------|---------------|---------------------|-------------|-----------|
| **Contact Avatar** | ✅ Yes | Status badge if available | `contact.thumbnail`, `contact.availabilityStatus` | `Avatar.vue` |
| **Contact Name** | ✅ Yes | - | `contact.name` | `ConversationCard.vue` |
| **Inbox Icon** | ✅ Yes | - | `inbox.channelType`, `inbox.medium` | `ConversationCard.vue` |
| **Timestamp** | ✅ Yes | - | `conversation.timestamp` | `ConversationCard.vue` |
| **Priority Icon** | ❌ No | `conversation.priority !== null` | `conversation.priority` | `CardPriorityIcon.vue` |
| **Unread Badge** | ❌ No | `conversation.unreadCount > 0` | `conversation.unreadCount` | `CardMessagePreview.vue` |
| **Assignee Avatar** | ❌ No | `conversation.meta.assignee.name` | `conversation.meta.assignee` | `Avatar.vue` |
| **SLA Label** | ❌ No | `conversation.appliedSla?.id` + threshold | `conversation.appliedSla` | `SLACardLabel.vue` |
| **Labels** | ❌ No | `conversation.labels.length > 0` | `conversation.labels`, `accountLabels` | `CardLabels.vue` |
| **Message Preview** | ⚠️ Conditional | Has messages or email subject | `conversation.lastNonActivityMessage` | `CardMessagePreview*.vue` |

---

## Implementation Checklist

When implementing or modifying conversation list items, ensure:

- [ ] Contact avatar displays with status badge
- [ ] Inbox icon uses `getInboxIconByType()` helper
- [ ] Priority icon only shows when priority is set
- [ ] Unread badge only shows when `unreadCount > 0`
- [ ] Assignee avatar only shows when assignee exists
- [ ] SLA label refreshes every 60 seconds
- [ ] Labels are properly truncated to fit container
- [ ] All conditional elements have proper v-if/v-show directives
- [ ] Icons use correct Tailwind color classes
- [ ] Components are imported from `components-next/` (not deprecated `components/`)

---

## Related Files

- **Main Component**: `app/javascript/dashboard/components-next/Conversation/ConversationCard/ConversationCard.vue`
- **Helper**: `app/javascript/dashboard/helper/inbox.js`
- **Constants**: `app/javascript/shared/constants/messages.js`
- **Sub-Components**:
  - `CardPriorityIcon.vue`
  - `CardMessagePreview.vue`
  - `CardMessagePreviewWithMeta.vue`
  - `CardLabels.vue`
  - `SLACardLabel.vue`
  - `Avatar.vue`

---

## Notes for Frontend Team

1. **Use `components-next/`**: The new component architecture is in `components-next/`, not the deprecated `components/` folder.

2. **Tailwind Only**: All styling uses Tailwind utility classes. No custom CSS or scoped styles.

3. **Icon System**: Icons use RemixIcon classes (e.g., `i-ri-mail-fill`). See `dashboard/components-next/icon/Icon.vue`.

4. **Data Structure**: Conversation objects come from the Vuex store or API. Structure may vary slightly between old and new components.

5. **Conditional Rendering**: Use `v-if` for elements that should not be in the DOM when hidden. Use `v-show` for frequently toggled elements.

6. **Accessibility**: Ensure proper ARIA labels and keyboard navigation support.

---

**Last Updated**: Based on codebase as of current state
**Maintainer**: Frontend team

