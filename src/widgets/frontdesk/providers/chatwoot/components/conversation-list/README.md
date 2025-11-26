# Conversation List Components

This directory contains the refactored conversation list header components for the Chatwoot provider.

## Overview

The conversation list header has been decomposed from a monolithic 647-line component into focused, reusable components.

## Component Structure

### Main Components

- **ConversationFilterMenu** - Team and status filter dropdown
- **ConversationSortMenu** - Sort options dropdown
- **ConversationSearchBar** - Search input with debouncing
- **ConversationTabs** - Mine/Unassigned/All tabs with counts

## Refactoring Results

### Before
- **chatwoot-conversation-list-header.tsx**: 647 lines
- Heavy prop drilling (9+ props)
- Inline menu construction (200+ lines)
- Debounce logic mixed with UI
- Hard to test

### After
- **chatwoot-conversation-list-header.tsx**: 176 lines (73% reduction!)
- **ConversationFilterMenu.tsx**: 255 lines
- **ConversationSortMenu.tsx**: 110 lines
- **ConversationSearchBar.tsx**: 75 lines
- **ConversationTabs.tsx**: 140 lines

**Total**: ~756 lines across 5 focused files vs 647 lines in 1 monolithic file

### Benefits

1. **Separation of Concerns**: Each component manages its own state
2. **No Prop Drilling**: Components receive only what they need
3. **Testability**: Each component can be unit tested independently
4. **Maintainability**: Easier to modify individual pieces
5. **Reusability**: Components can be used in other views

## Component Usage

```tsx
import {
  ConversationFilterMenu,
  ConversationSortMenu,
  ConversationSearchBar,
  ConversationTabs,
} from "./conversation-list";

// In your component
<ConversationFilterMenu
  filters={filters}
  onFiltersChange={onFiltersChange}
  teams={teams}
  onFilterClick={onFilterClick}
  primaryColor={primaryColor}
  neutralColor={neutralColor}
/>

<ConversationSortMenu
  filters={filters}
  onFiltersChange={onFiltersChange}
  onSortClick={onSortClick}
  primaryColor={primaryColor}
  neutralColor={neutralColor}
/>

<ConversationSearchBar
  filters={filters}
  onFiltersChange={onFiltersChange}
  neutralColor={neutralColor}
/>

<ConversationTabs
  filters={filters}
  onFiltersChange={onFiltersChange}
  counts={counts}
  primaryColor={primaryColor}
  neutralColor={neutralColor}
/>
```

## Key Improvements

### 1. State Management
Each component manages its own internal state (menu anchors, search input), eliminating prop drilling.

### 2. Debouncing Encapsulated
The search bar component encapsulates debouncing logic, making it reusable and testable.

### 3. Filter Logic Separation
Filter and sort logic are cleanly separated into their own components with clear responsibilities.

### 4. Type Safety
All components use proper TypeScript types from the shared types directory.

## Future Improvements

1. **Custom Hooks**: Extract filter/sort logic into custom hooks
2. **Unit Tests**: Add comprehensive test coverage
3. **Keyboard Navigation**: Enhance accessibility
4. **Filter Presets**: Add ability to save filter combinations

## Related Files

- Main header: `../chatwoot-conversation-list-header.tsx`
- Teams hook: `../../hooks/resources/use-chatwoot-teams.ts`
- Debounce hook: `../../hooks/use-debounced-value.ts`
