# Chatwoot Frontend RBAC Implementation

**Status:** ✅ Complete
**Date:** 2025-01-12
**Architecture Reference:** `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissionsHelper.js`

## Overview

This document describes the complete Role-Based Access Control (RBAC) system implemented for the Chatwoot FrontDesk provider. The implementation follows the reference Chatwoot architecture, adapted for React/Recoil instead of Vue/Vuex.

## Architecture

### 1. Core Components

```
src/widgets/frontdesk/providers/chatwoot/
├── utils/permissions.utils.ts        # Permission checking utilities
├── constants/permissions.constants.ts # Permission definitions & mappings
└── hooks/use-chatwoot-permissions.ts # React hook for permission checks
```

### 2. Permission Flow

```
User Login → Profile API
  ↓
Store in Recoil (chatwootProfileAtom)
  ↓
useChatwootPermissions() Hook
  ↓
Component-Level Permission Checks (canAccess, checkPermissions)
  ↓
Conditional Rendering (JSX conditionals)
```

---

## Roles & Permissions

### Available Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `administrator` | Full access to all features | All permissions |
| `agent` | Basic conversation handling | Limited to assigned conversations |
| `custom_role` | Fine-grained permissions | Based on `custom_role.permissions` array |

### Available Permissions

| Permission | Description |
|-----------|-------------|
| `conversation_manage` | Manage all conversations |
| `conversation_unassigned_manage` | Manage unassigned conversations |
| `conversation_participating_manage` | Manage participating conversations |
| `contact_manage` | Manage contacts |
| `report_manage` | View reports |
| `knowledge_base_manage` | Manage help center/knowledge base |

---

## Implementation Details

### 1. Permission Utilities (`utils/permissions.utils.ts`)

**Core Functions:**

```typescript
// Check if user has at least one required permission
hasPermissions(requiredPermissions: string[], availablePermissions: string[]): boolean

// Get current account object
getCurrentAccount(user: ChatwootUser | null, accountId: number | null): ChatwootUserAccount | null

// Get permissions for current account
getUserPermissions(user: ChatwootUser | null, accountId: number | null): string[]

// Get role for current account (administrator/agent/custom_role)
getUserRole(user: ChatwootUser | null, accountId: number | null): string

// Role checking helpers
isAdministrator(user: ChatwootUser | null, accountId: number | null): boolean
isAgent(user: ChatwootUser | null, accountId: number | null): boolean
hasCustomRole(user: ChatwootUser | null, accountId: number | null): boolean
```

**Usage Example:**

```typescript
import { getUserPermissions, hasPermissions } from '../utils/permissions.utils';

const userPermissions = getUserPermissions(profile, accountId);
const canManage = hasPermissions(['conversation_manage'], userPermissions);
```

---

### 2. Permission Constants (`constants/permissions.constants.ts`)

**Defines:**

- **ROLES**: Role name constants
- **PERMISSIONS**: Permission type constants
- **ASSIGNEE_TAB_PERMISSIONS**: Tab visibility rules
- **VIEW_PERMISSIONS**: View access rules
- **SETTINGS_PERMISSIONS**: Settings page access rules
- **ACTION_PERMISSIONS**: Action button visibility rules

**Example - Assignee Tab Permissions:**

```typescript
export const ASSIGNEE_TAB_PERMISSIONS = {
  me: {
    permissions: ['agent', 'administrator', 'conversation_manage'],
  },
  unassigned: {
    permissions: ['administrator', 'conversation_manage', 'conversation_unassigned_manage'],
  },
  all: {
    permissions: ['administrator', 'conversation_manage', 'conversation_participating_manage'],
  },
};
```

---

### 3. Permission Hook (`hooks/use-chatwoot-permissions.ts`)

**Primary React hook for permission checking.**

**Returns:**

```typescript
{
  // User info
  userRole: string,
  userPermissions: string[],

  // Role checks
  isAdministrator: boolean,
  isAgent: boolean,
  hasCustomRole: boolean,

  // Permission checks
  checkPermissions: (requiredPermissions: string[]) => boolean,
  canAccess: (config: PermissionConfig) => boolean,

  // Semantic helpers
  shouldShowView: (config: PermissionConfig) => boolean,
  canPerformAction: (config: PermissionConfig) => boolean,

  // Filtering utilities
  filterByPermissions: <T>(items: T[], getPermissions: (item: T) => PermissionConfig) => T[],
}
```

**Usage Example:**

```typescript
const { isAdministrator, checkPermissions, canPerformAction } = useChatwootPermissions();

// Simple role check
{isAdministrator && <AdminButton />}

// Permission check
{checkPermissions(['conversation_manage']) && <ManageButton />}

// Action permission check
{canPerformAction(ACTION_PERMISSIONS.addAgent) && <AddAgentButton />}
```

---

## Protected Features

### 1. Route-Level Protection

**File:** `chatwoot-provider-view.tsx`

**Implementation:**
- Checks view permissions before rendering
- Redirects unauthorized users to "My Inbox" (safe default)
- Displays warning in console for debugging

**Protected Views:**

| View | Required Permission | Behavior for Non-Authorized |
|------|---------------------|---------------------------|
| Settings | `administrator` only | Redirect to My Inbox |
| All Conversations | `administrator` or `conversation_participating_manage` | Redirect to My Inbox |
| Unattended | `administrator` or `conversation_unassigned_manage` | Redirect to My Inbox |

**Code:**

```typescript
const { canAccess } = useChatwootPermissions();

useEffect(() => {
  const requiredPermissions = viewPermissionMap[currentView];

  if (requiredPermissions && !canAccess(requiredPermissions)) {
    console.warn(`User lacks permissions for view: ${currentView}`);
    chatwootRouter.navigateToView(ChatwootView.MY_INBOX);
  }
}, [currentView, canAccess]);
```

---

### 2. Component-Level Protection

#### A. Agent Management (`views/settings/agents-subpage.tsx`)

**Protected Actions:**

| Action | Required Permission | Implementation |
|--------|---------------------|----------------|
| Add Agent | `administrator` | Button hidden for non-admins |
| Edit Agent | `administrator` | Button hidden for non-admins |
| Delete Agent | `administrator` | Button hidden for non-admins |

**Code:**

```typescript
const { canPerformAction } = useChatwootPermissions();

const canAddAgent = canPerformAction(ACTION_PERMISSIONS.addAgent);
const canEditAgent = canPerformAction(ACTION_PERMISSIONS.editAgent);
const canDeleteAgent = canPerformAction(ACTION_PERMISSIONS.deleteAgent);

// In JSX
{canAddAgent && <Button onClick={handleAdd}>Add Agent</Button>}
{canEditAgent && <IconButton onClick={handleEdit}><EditIcon /></IconButton>}
{canDeleteAgent && <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>}
```

---

#### B. Conversation Tabs (`components/conversation-list/ConversationTabs.tsx`)

**Tab Filtering:**

| Tab | Visible To | Permission Required |
|-----|-----------|---------------------|
| Mine | All users | `agent`, `administrator`, `conversation_manage` |
| Unassigned | Admins & Custom Roles | `administrator`, `conversation_unassigned_manage` |
| All | Admins & Custom Roles | `administrator`, `conversation_participating_manage` |

**Code:**

```typescript
const { canAccess } = useChatwootPermissions();

const visibleTabs = useMemo(() => ({
  mine: canAccess(ASSIGNEE_TAB_PERMISSIONS.me),
  unassigned: canAccess(ASSIGNEE_TAB_PERMISSIONS.unassigned),
  all: canAccess(ASSIGNEE_TAB_PERMISSIONS.all),
}), [canAccess]);

// In JSX
{visibleTabs.mine && <Tab label="Mine" value="mine" />}
{visibleTabs.unassigned && <Tab label="Unassigned" value="unassigned" />}
{visibleTabs.all && <Tab label="All" value="all" />}
```

**Effect on Agents:**
- Agents see only the "Mine" tab
- Admins see all three tabs (Mine/Unassigned/All)
- Custom roles see tabs based on their permissions

---

## Usage Guide

### For New Components

When adding a new component that requires permission checks:

1. **Import the hook:**
   ```typescript
   import { useChatwootPermissions } from '../../hooks/use-chatwoot-permissions';
   ```

2. **Use permission checks:**
   ```typescript
   const { isAdministrator, checkPermissions, canPerformAction } = useChatwootPermissions();
   ```

3. **Conditionally render UI:**
   ```typescript
   {isAdministrator && <AdminOnlyFeature />}
   {checkPermissions(['contact_manage']) && <ContactEditButton />}
   ```

### For New Views

When adding a new view that requires protection:

1. **Add permission config to constants:**
   ```typescript
   // constants/permissions.constants.ts
   export const VIEW_PERMISSIONS = {
     myNewView: {
       permissions: ['administrator', 'conversation_manage'],
     },
   };
   ```

2. **Add to route map in provider view:**
   ```typescript
   // chatwoot-provider-view.tsx
   const viewPermissionMap: Record<ChatwootView, ...> = {
     [ChatwootView.MY_NEW_VIEW]: VIEW_PERMISSIONS.myNewView,
   };
   ```

### For New Actions

When adding a new action that requires protection:

1. **Add action permission config:**
   ```typescript
   // constants/permissions.constants.ts
   export const ACTION_PERMISSIONS = {
     myNewAction: {
       permissions: ['administrator'],
     },
   };
   ```

2. **Check permission in component:**
   ```typescript
   const { canPerformAction } = useChatwootPermissions();
   const canPerformMyAction = canPerformAction(ACTION_PERMISSIONS.myNewAction);

   {canPerformMyAction && <MyActionButton />}
   ```

---

## Testing Guidelines

### Test Cases

1. **Administrator Role:**
   - ✅ Can access Settings view
   - ✅ Can see all conversation tabs (Mine/Unassigned/All)
   - ✅ Can add/edit/delete agents
   - ✅ Can access all views

2. **Agent Role:**
   - ✅ Cannot access Settings view (redirected to My Inbox)
   - ✅ Can only see "Mine" tab
   - ✅ Cannot see Add/Edit/Delete agent buttons
   - ✅ Can access My Inbox, Dashboard, Mentions, Channels views

3. **Custom Role:**
   - ✅ Permissions checked against `permissions` array
   - ✅ With `conversation_unassigned_manage`: Can see "Unassigned" tab
   - ✅ With `conversation_participating_manage`: Can see "All" tab
   - ✅ Without admin permissions: Cannot access Settings

### Manual Testing Steps

1. **Login as Administrator:**
   - Navigate to Settings → Should work
   - Check conversation tabs → Should see Mine/Unassigned/All
   - Go to Settings > Agents → Should see Add/Edit/Delete buttons

2. **Login as Agent:**
   - Navigate to Settings → Should redirect to My Inbox
   - Check conversation tabs → Should only see "Mine"
   - If accessing Settings via URL → Should redirect

3. **Login with Custom Role:**
   - Grant `conversation_unassigned_manage` → Should see "Unassigned" tab
   - Grant `conversation_participating_manage` → Should see "All" tab
   - Verify Settings access denied unless admin

---

## Security Notes

### ⚠️ Important

1. **Frontend permissions are UI-only** - Always enforce permissions on the backend API
2. **Backend returns 403 Forbidden** if user tries to access unauthorized resources
3. **Frontend checks prevent UI clutter** and improve UX by hiding unavailable features
4. **Do not rely on frontend checks for security** - They can be bypassed by a determined user

### Backend Integration

All permission-protected actions should be validated on the backend:

```typescript
// Frontend (UI protection)
{canDeleteAgent && <DeleteButton onClick={deleteAgent} />}

// Backend (real security)
DELETE /api/v1/accounts/:accountId/agents/:id
→ 403 Forbidden (if not administrator)
```

---

## Migration Notes

### Differences from Reference Implementation

| Feature | Chatwoot (Vue) | Our Implementation (React) |
|---------|---------------|---------------------------|
| State Management | Vuex getters | Recoil atoms |
| Permission Hook | `usePolicy()` composable | `useChatwootPermissions()` hook |
| Helper Module | `permissionsHelper.js` | `permissions.utils.ts` |
| Constants | `permissions.js` | `permissions.constants.ts` |
| Route Guards | Vue Router `beforeEach` | React `useEffect` + redirect |
| Conditional Rendering | `v-if="shouldShow()"` | JSX `{canAccess() && <Component />}` |

### Key Similarities

- ✅ Same permission names and structure
- ✅ Same role hierarchy (administrator > custom_role > agent)
- ✅ Same permission checking logic (`hasPermissions()`)
- ✅ Same tab permission mappings
- ✅ Same view protection strategy

---

## Future Enhancements

### Potential Improvements

1. **Permission Caching:**
   - Cache permission check results to reduce recalculations
   - Invalidate cache when account/user changes

2. **Permission Debugging:**
   - Add `?debugPermissions=true` query param to log all permission checks
   - Display permission info in dev tools

3. **Permission Preloading:**
   - Preload permissions during app initialization
   - Reduce permission check latency

4. **Visual Indicators:**
   - Add tooltips for disabled features: "This feature requires administrator role"
   - Show "Upgrade" prompts for custom roles

5. **Audit Logging:**
   - Log permission denials for security auditing
   - Track unauthorized access attempts

---

## References

### Internal Documentation
- [FRONTDESK_CHATWOOT_ARCHITECTURE.md](./FRONTDESK_CHATWOOT_ARCHITECTURE.md) - Complete architecture guide
- [src/widgets/frontdesk/providers/chatwoot/README.md](./README.md) - Code organization
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance patterns

### Chatwoot Reference Implementation
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissionsHelper.js` - Permission utilities
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissions.js` - Permission constants
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/composables/usePolicy.js` - Permission composable
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/store/modules/auth.js` - Role getters

---

## Changelog

### 2025-01-12 - Initial Implementation
- ✅ Created permission utilities (`permissions.utils.ts`)
- ✅ Created permission constants (`permissions.constants.ts`)
- ✅ Created permission hook (`use-chatwoot-permissions.ts`)
- ✅ Added route-level protection in `chatwoot-provider-view.tsx`
- ✅ Protected agent management actions in `agents-subpage.tsx`
- ✅ Implemented conversation tab filtering in `ConversationTabs.tsx`
- ✅ Documented implementation in this file

---

## Support

For questions or issues related to RBAC:
1. Check this documentation first
2. Review the reference Chatwoot implementation
3. Consult [CLAUDE.md](../../../../../../CLAUDE.md) for development guidelines
4. Check [FRONTDESK_CHATWOOT_ARCHITECTURE.md](./FRONTDESK_CHATWOOT_ARCHITECTURE.md) for architecture details
