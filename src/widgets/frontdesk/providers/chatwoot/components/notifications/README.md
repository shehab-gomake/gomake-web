# Notification Components

This directory contains the refactored notification components for the Chatwoot provider.

## Overview

The notification view has been decomposed from a monolithic 892-line component into focused, reusable components with shared utilities.

## Component Structure

### Main Components

- **NotificationFilters** - Filter and sort controls for notifications
- **NotificationSettingsMenu** - Bulk actions menu (mark all read, delete, etc.)
- **NotificationList** - List container with loading/error/empty states
- **NotificationListItem** - Individual notification item with all metadata

### Utilities

Located in `../../utils/`:

- **notification-formatters.ts** - Data extraction and formatting functions
- **date-utils.ts** - Date formatting utilities

## Refactoring Results

### Before
- **chatwoot-notifications-view.tsx**: 892 lines
- 15+ inline helper functions
- Mixed concerns (data, presentation, state)
- Difficult to test
- Hard to maintain

### After
- **chatwoot-notifications-view.tsx**: 166 lines (81% reduction!)
- **NotificationFilters.tsx**: 170 lines
- **NotificationSettingsMenu.tsx**: 80 lines
- **NotificationList.tsx**: 70 lines
- **NotificationListItem.tsx**: 280 lines
- **notification-formatters.ts**: 235 lines
- **date-utils.ts**: 45 lines

**Total**: ~1,046 lines across 7 focused files vs 892 lines in 1 monolithic file

### Benefits

1. **Separation of Concerns**: Each component has a single, clear responsibility
2. **Reusability**: Components can be reused in other views
3. **Testability**: Each component and utility can be unit tested independently
4. **Maintainability**: Easier to understand, modify, and debug
5. **Type Safety**: Proper TypeScript types throughout
6. **Performance**: Smaller components re-render less frequently

## Component Usage

```tsx
import {
  NotificationFilters,
  NotificationSettingsMenu,
  NotificationList,
} from "./notifications";

// In your component
<NotificationFilters
  filters={filters}
  onFiltersChange={updateFilters}
  neutralColor={neutralColor}
/>

<NotificationSettingsMenu
  onMarkAllAsRead={markAllAsRead}
  onDeleteAll={deleteAll}
  onDeleteAllRead={deleteAllRead}
  neutralColor={neutralColor}
/>

<NotificationList
  notifications={notifications}
  loading={loading}
  error={error}
  onNotificationClick={handleClick}
  onNotificationContextMenu={handleContextMenu}
  primaryColor={primaryColor}
  neutralColor={neutralColor}
/>
```

## Future Improvements

1. **Virtual Scrolling**: Add `react-window` for large lists (100+ items)
2. **Memoization**: Wrap components with `React.memo` for performance
3. **Unit Tests**: Add comprehensive test coverage
4. **Accessibility**: Enhance ARIA labels and keyboard navigation
5. **Animation**: Add transitions for list updates

## Related Files

- Main view: `../chatwoot-notifications-view.tsx`
- Hook: `../../hooks/use-chatwoot-notifications.ts`
- Context menu hook: `../../hooks/use-chatwoot-notification-context-menu.ts`
- Filter utils: `../../utils/notification-filter-utils.ts`
