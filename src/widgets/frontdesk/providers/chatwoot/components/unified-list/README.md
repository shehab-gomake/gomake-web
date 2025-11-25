# Unified List System

Production-ready, reusable list/dropdown components for FrontDesk Chatwoot.
Unified styling based on use case for consistent UI.

## Architecture

```
unified-list/
├── types.ts                 # Type definitions
├── styles.ts                # Unified style presets by use case
├── UnifiedListDropdown.tsx  # Base dropdown component
├── triggers/                # Trigger components by use case
│   ├── FilterIconButton.tsx     # Toolbar filter buttons
│   ├── AssignmentTrigger.tsx    # Detail panel assignments
│   └── QuickSelectorTrigger.tsx # Inline pill selectors
├── list-items/              # Specialized item renderers
│   ├── AgentListItemRenderer.tsx
│   ├── TeamListItemRenderer.tsx
│   ├── LabelListItemRenderer.tsx
│   ├── StatusListItemRenderer.tsx
│   └── PriorityListItemRenderer.tsx
└── selects/                 # Complete select components
    ├── AgentSelect.tsx
    ├── TeamSelect.tsx
    ├── LabelSelect.tsx
    ├── StatusSelect.tsx
    └── PrioritySelect.tsx
```

## Style Presets by Use Case

### 1. Filter Style (Toolbar icon buttons)
Used for: Teams filter, Labels filter, Sort, Status filter

```tsx
import { FilterIconButton, filterStyles } from './unified-list';

// Consistent 28x28 icon button with badge
<FilterIconButton
  icon={<GroupsIcon />}
  tooltip="Filter by Team"
  isActive={hasSelection}
  badgeCount={1}
  onClick={handleOpen}
/>
```

### 2. Assignment Style (Detail panel)
Used for: Agent assignment, Team assignment

```tsx
import { AssignmentTrigger, assignmentStyles } from './unified-list';

// Inline display with avatar/icon and name
<AssignmentTrigger
  type="agent"
  label="Assigned To"
  valueName="John Doe"
  avatarUrl="/avatar.jpg"
  hasValue={true}
  placeholder="Assign to someone"
  onClick={handleOpen}
/>
```

### 3. Quick Selector Style (Inline pills)
Used for: Status selector, Priority selector

```tsx
import { QuickSelectorTrigger, quickSelectorStyles } from './unified-list';

// Compact pill with icon and label
<QuickSelectorTrigger
  icon={<FlagIcon sx={{ color: '#EF4444' }} />}
  label="High"
  onClick={handleOpen}
/>
```

## Complete Components

### TeamSelect
```tsx
<TeamSelect
  selectedTeam={team}
  teams={teams}
  onSelect={(id, team) => handleSelect(team)}
  variant="filter"  // or "inline"
  showAllOption     // For filters
  canCreate={isAdmin}
/>
```

### AgentSelect
```tsx
<AgentSelect
  selectedAgent={agent}
  agents={agents}
  onSelect={(id, agent) => handleAssign(agent)}
  currentUserId={myId}  // Enables "Self Assign"
  variant="inline"      // or "filter"
/>
```

### LabelSelect (Multi-select)
```tsx
<LabelSelect
  selectedLabels={['bug', 'urgent']}
  labels={labels}
  onSelect={(titles, labels) => updateFilters({ labels: titles })}
  sidebarOnly
  canCreate={isAdmin}
/>
```

### StatusSelect
```tsx
<StatusSelect
  status={conversation.status}
  onStatusChange={updateStatus}
  updating={isUpdating}
/>
```

### PrioritySelect
```tsx
<PrioritySelect
  priority={conversation.priority}
  onPriorityChange={updatePriority}
  updating={isUpdating}
/>
```

## Style Constants

```typescript
import { 
  filterStyles,        // Filter button & menu styles
  assignmentStyles,    // Assignment section styles
  quickSelectorStyles, // Pill selector styles
  listItemStyles,      // Menu item styles
  actionStyles,        // Footer action styles
  availabilityColors,  // Agent availability
  priorityColors,      // Priority levels
  statusColors,        // Conversation status
} from './unified-list';
```

## Helper Functions

```typescript
import {
  getFilterIconButtonSx,    // (isActive) => styles
  getAssignmentValueBoxSx,  // (disabled) => styles
  getQuickSelectorPillSx,   // (disabled) => styles
  getListItemSx,            // (isSelected, color?) => styles
  getActionItemSx,          // (variant) => styles
} from './unified-list';
```

## Benefits

1. **Consistent UI** - Same trigger style for all filters, same assignment style for agents/teams
2. **Single Source of Truth** - All styles defined in `styles.ts`
3. **Easy to Update** - Change style in one place, updates everywhere
4. **Type-Safe** - Full TypeScript support
5. **Composable** - Mix triggers and dropdowns as needed
