# Chatwoot Frontend RBAC Implementation

**Status:** ✅ Complete & Corrected
**Date:** 2025-01-12 (Updated)
**Architecture Reference:** `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

## 🎯 Core Philosophy - CRITICAL UNDERSTANDING

### **"Show the UI, Let Backend Filter Data"**

This is the most important principle in Chatwoot's RBAC implementation:

- ✅ **Frontend shows menu items based on permissions**
- ✅ **Backend pre-filters data based on user access**
- ✅ **Same UI for agents/admins, different data returned**

**Example:**
- Agent clicks "All Conversations" → Frontend shows the menu item
- Backend returns only conversations from agent's assigned inboxes
- Agent sees "All Conversations" but with filtered data
- Admin sees "All Conversations" with ALL account conversations

**DO NOT hide UI elements that backend already filters!**

---

## 🔑 Permission Logic - OR NOT AND

**CRITICAL:** Chatwoot uses **OR logic** for permissions, not AND logic.

```typescript
// Permission array: ['administrator', 'agent', 'conversation_manage']
// Evaluation: Does user have ANY ONE of these permissions?
// Uses: requiredPermissions.some(p => userPermissions.includes(p))
```

**Example:**
- Permission required: `['administrator', 'agent']`
- Agent has: `['agent']`
- Result: ✅ **ACCESS GRANTED** (has 'agent')

**Only ONE permission from the list is needed!**

---

## Overview

This document describes the complete Role-Based Access Control (RBAC) system implemented for the Chatwoot FrontDesk provider. The implementation follows the reference Chatwoot architecture (Vue → React/Recoil adaptation).

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
| `agent` | Basic conversation handling | Sees all UI, backend filters data |
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
// Check if user has at least one required permission (OR logic)
hasPermissions(requiredPermissions: string[], availablePermissions: string[]): boolean

// Filter items by permission requirements
filterItemsByPermission<T>(
  items: T[],
  userPermissions: string[],
  getPermissions: (item: T) => readonly string[] | string[] | undefined
): T[]

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
import { getUserPermissions, hasPermissions, filterItemsByPermission } from '../utils/permissions.utils';

const userPermissions = getUserPermissions(profile, accountId);
const canManage = hasPermissions(['conversation_manage'], userPermissions);

// Filter tabs based on permissions
const visibleTabs = filterItemsByPermission(
  allTabs,
  userPermissions,
  tab => ASSIGNEE_TAB_PERMISSIONS[tab.key]?.permissions
);
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

**Example - View Permissions (CORRECTED):**

```typescript
export const VIEW_PERMISSIONS = {
  myInbox: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },
  allConversations: {
    // AGENTS CAN ACCESS - Backend filters data
    permissions: [
      ROLES.ADMINISTRATOR,
      ROLES.AGENT, // ← Agents can see this
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
  },
  unattended: {
    // AGENTS CAN ACCESS - Backend filters data
    permissions: [
      ROLES.ADMINISTRATOR,
      ROLES.AGENT, // ← Agents can see this
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
    ],
  },
  mentions: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },
  channels: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },
  settings: {
    // PARENT visible to all, individual pages permission-controlled
    permissions: [ROLES.ADMINISTRATOR, ROLES.AGENT],
  },
};
```

**Example - Assignee Tab Permissions:**

```typescript
export const ASSIGNEE_TAB_PERMISSIONS = {
  me: {
    // ALL users can see "Mine" tab
    permissions: [
      ROLES.AGENT,
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
  },
  unassigned: {
    // Only admins or users with unassigned permission
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
    ],
  },
  all: {
    // Only admins or users with manage/participating permission
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
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

// Permission check (OR logic)
{checkPermissions(['administrator', 'agent']) && <FeatureButton />}

// Action permission check
{canPerformAction(ACTION_PERMISSIONS.addAgent) && <AddAgentButton />}
```

---

## What Agents Can and Cannot Access

### ✅ Agents CAN See (Backend Filters Data):

| Feature | Access | Backend Behavior |
|---------|--------|------------------|
| **My Inbox** | ✅ Full | Returns conversations assigned to agent |
| **All Conversations** | ✅ Full | Returns conversations from agent's assigned inboxes |
| **Mentions** | ✅ Full | Returns conversations where agent is mentioned |
| **Unattended** | ✅ Full | Returns unattended conversations from agent's assigned inboxes |
| **Channels** | ✅ View | Returns only channels agent is assigned to |
| **Settings (Parent)** | ✅ View | Menu item visible, but pages inside are restricted |
| **Settings → Canned Responses** | ✅ Full | Can create/edit own canned responses |
| **Settings → Macros** | ✅ Full | Can create/edit macros |
| **Contacts** | ✅ Full | Can manage contacts |
| **Help Center** | ✅ Full | Can edit help articles (if `knowledge_base_manage`) |

### ❌ Agents CANNOT See:

| Feature | Access | Behavior |
|---------|--------|----------|
| **Reports** | ❌ No | Menu section hidden (requires `report_manage` or `administrator`) |
| **Campaigns** | ❌ No | Menu section hidden (requires `administrator`) |
| **Settings → Agents** | ❌ No | Page redirects to Canned Responses |
| **Settings → Inboxes** | ❌ No | Page redirects to Canned Responses |
| **Settings → Teams** | ❌ No | Page redirects to Canned Responses |
| **Settings → Labels** | ❌ No | Page redirects to Canned Responses |
| **Settings → Integrations** | ❌ No | Page redirects to Canned Responses |
| **Settings → Automation** | ❌ No | Page redirects to Canned Responses |
| **Settings → Custom Attributes** | ❌ No | Page redirects to Canned Responses |
| **"Add Channel" Button** | ❌ No | Button hidden (requires `administrator`) |

---

## Protected Features

### 1. Route-Level Protection

**File:** `chatwoot-provider-view.tsx`

**Implementation:**
- Checks view permissions before rendering
- Redirects unauthorized users to "My Inbox" (safe default)
- Displays warning in console for debugging

**Protected Views:**

| View | Required Permission | Agent Access? |
|------|---------------------|---------------|
| My Inbox | `agent` or `administrator` | ✅ Yes |
| All Conversations | `agent` or `administrator` | ✅ Yes (backend filters) |
| Unattended | `agent` or `administrator` | ✅ Yes (backend filters) |
| Mentions | `agent` or `administrator` | ✅ Yes |
| Channels | `agent` or `administrator` | ✅ Yes |
| Settings | `agent` or `administrator` | ✅ Yes (parent only) |
| Settings → Agents | `administrator` only | ❌ No (redirects) |
| Settings → Inboxes | `administrator` only | ❌ No (redirects) |
| Settings → Teams | `administrator` only | ❌ No (redirects) |

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
| Mine | All users | `agent`, `administrator` (any) |
| Unassigned | Admins & Custom Roles | `administrator`, `conversation_unassigned_manage` |
| All | Admins & Custom Roles | `administrator`, `conversation_manage`, `conversation_participating_manage` |

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

#### C. Navigation Sidebar (`layouts/components/NavigationSidebar/NavigationSidebar.tsx`)

**What's Always Visible:**
- My Inbox
- All Conversations (backend filters)
- Mentions
- Unattended (backend filters)
- Channels (shows assigned channels only)
- Settings (parent menu item)

**What's Conditionally Hidden:**
- "Add Channel" button (requires `administrator`)

**Code:**

```typescript
const { canPerformAction } = useChatwootPermissions();
const canCreateInbox = canPerformAction(ACTION_PERMISSIONS.createInbox);

// In JSX
{canCreateInbox && (
  <IconButton onClick={() => setShowAddChannelModal(true)}>
    <AddIcon />
  </IconButton>
)}
```

**Settings Section - Always Visible:**

```typescript
{/* Settings - Visible to all users */}
<ListItemButton
  selected={selectedSection === "settings"}
  onClick={() => onSectionSelect("settings")}
>
  <SettingsIcon /> Settings
</ListItemButton>
```

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
       permissions: ['administrator', 'agent', 'conversation_manage'],
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
   - ✅ Sees "Add Channel" button

2. **Agent Role:**
   - ✅ Can access Settings parent menu item
   - ✅ Inside Settings, redirected to Canned Responses
   - ✅ Can only see "Mine" tab in conversations
   - ✅ Cannot see Add/Edit/Delete agent buttons
   - ✅ Can access All Conversations view (backend filters data)
   - ✅ Can access Unattended view (backend filters data)
   - ✅ Cannot see "Add Channel" button

3. **Custom Role:**
   - ✅ Permissions checked against `permissions` array
   - ✅ With `conversation_unassigned_manage`: Can see "Unassigned" tab
   - ✅ With `conversation_participating_manage`: Can see "All" tab
   - ✅ Without admin permissions: Cannot access Settings pages

### Manual Testing Steps

1. **Login as Administrator:**
   - Navigate to Settings → Should work
   - Check conversation tabs → Should see Mine/Unassigned/All
   - Go to Settings > Agents → Should see Add/Edit/Delete buttons
   - Check sidebar → Should see "Add Channel" button

2. **Login as Agent:**
   - Navigate to Settings → Should show Settings page
   - Inside Settings → Should redirect to Canned Responses
   - Check conversation tabs → Should only see "Mine"
   - Click "All Conversations" → Should work, shows filtered data
   - Click "Unattended" → Should work, shows filtered data
   - Check sidebar → Should NOT see "Add Channel" button

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
5. **Backend pre-filters data** for agents (conversations, inboxes, teams, labels)

### Backend Integration

All permission-protected actions should be validated on the backend:

```typescript
// Frontend (UI protection)
{canDeleteAgent && <DeleteButton onClick={deleteAgent} />}

// Backend (real security)
DELETE /api/v1/accounts/:accountId/agents/:id
→ 403 Forbidden (if not administrator)
```

### Backend Filtering Examples

```typescript
// Frontend: Agent clicks "All Conversations"
GET /api/v1/accounts/:accountId/conversations?status=open

// Backend: Returns only conversations from agent's assigned inboxes
// Admin sees: 500 conversations
// Agent sees: 50 conversations (from their 3 assigned inboxes)
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
| Policy Component | `<Policy :permissions="...">` | Direct permission checks in hooks |

### Key Similarities

- ✅ Same permission names and structure
- ✅ Same role hierarchy (administrator > custom_role > agent)
- ✅ Same permission checking logic (`hasPermissions()` with OR logic)
- ✅ Same tab permission mappings
- ✅ Same view protection strategy
- ✅ **Same philosophy: Show UI, let backend filter data**

---

## Common Mistakes to Avoid

### ❌ WRONG: Hiding UI that backend already filters

```typescript
// DON'T DO THIS - Agents should see "All Conversations"
{isAdministrator && (
  <MenuItem onClick={() => navigate('all-conversations')}>
    All Conversations
  </MenuItem>
)}
```

### ✅ CORRECT: Show UI, backend filters data

```typescript
// DO THIS - Show to everyone, backend returns filtered data
<MenuItem onClick={() => navigate('all-conversations')}>
  All Conversations
</MenuItem>
```

### ❌ WRONG: Using AND logic for permissions

```typescript
// DON'T DO THIS - This checks if user has ALL permissions
const canAccess = requiredPermissions.every(p => userPermissions.includes(p));
```

### ✅ CORRECT: Using OR logic for permissions

```typescript
// DO THIS - This checks if user has ANY ONE permission
const canAccess = requiredPermissions.some(p => userPermissions.includes(p));
```

### ❌ WRONG: Missing ROLES.AGENT in permission array

```typescript
// DON'T DO THIS - Agents won't be able to access
allConversations: {
  permissions: [ROLES.ADMINISTRATOR, PERMISSIONS.CONVERSATION_MANAGE],
},
```

### ✅ CORRECT: Including ROLES.AGENT when appropriate

```typescript
// DO THIS - Agents can access, backend filters data
allConversations: {
  permissions: [
    ROLES.ADMINISTRATOR,
    ROLES.AGENT, // ← Include this!
    PERMISSIONS.CONVERSATION_MANAGE,
  ],
},
```

---

## References

### Internal Documentation
- [FRONTDESK_CHATWOOT_ARCHITECTURE.md](/Users/omarsabbah/Desktop/gomake-services/gomake-web/docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md) - Complete architecture guide
- [src/widgets/frontdesk/providers/chatwoot/README.md](./README.md) - Code organization
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance patterns

### Chatwoot Reference Implementation
**Frontend (Vue):**
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissionsHelper.js` - Permission utilities
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/constants/permissions.js` - Permission constants
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/composables/usePolicy.js` - Permission composable
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components/policy.vue` - Policy component
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components-next/sidebar/Sidebar.vue` - Sidebar structure
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components-next/sidebar/SidebarGroup.vue` - Permission filtering

**Backend (Rails):**
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/services/conversations/permission_filter_service.rb` - Conversation filtering
- `/Users/omarsabbah/Desktop/messaging/chatwoot/app/finders/conversation_finder.rb` - Inbox assignment filtering
- `/Users/omarsabbah/Desktop/messaging/chatwoot/enterprise/app/services/enterprise/conversations/permission_filter_service.rb` - Custom role filtering

---

## Changelog

### 2025-01-12 - Major Correction & Update
- 🔧 **CORRECTED** understanding of Chatwoot's RBAC philosophy
- ✅ Added "Show UI, let backend filter data" principle
- ✅ Added OR logic explanation for permissions
- ✅ **FIXED** VIEW_PERMISSIONS to include ROLES.AGENT where appropriate
- ✅ Updated NavigationSidebar to show All Conversations and Unattended to agents
- ✅ Added "What Agents Can/Cannot Access" comprehensive table
- ✅ Added "Common Mistakes to Avoid" section
- ✅ Updated all examples to reflect correct implementation
- ✅ Added backend filtering documentation
- ✅ Added references to actual Chatwoot source code

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
1. **Read this document FIRST** - It now contains the correct understanding
2. Review the reference Chatwoot implementation in `/Users/omarsabbah/Desktop/messaging/chatwoot/`
3. Remember: **Show UI, let backend filter data**
4. Remember: **Permission logic uses OR, not AND**
5. Consult [CLAUDE.md](/Users/omarsabbah/Desktop/gomake-services/gomake-web/CLAUDE.md) for development guidelines
6. Check [FRONTDESK_CHATWOOT_ARCHITECTURE.md](/Users/omarsabbah/Desktop/gomake-services/gomake-web/docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md) for architecture details
