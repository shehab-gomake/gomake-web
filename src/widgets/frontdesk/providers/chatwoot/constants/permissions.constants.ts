/**
 * Permission Constants for Chatwoot RBAC
 *
 * These constants define the available roles, permissions, and permission mappings
 * used throughout the Chatwoot provider for access control.
 *
 * @see /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissions.js
 */

/**
 * Available user roles in Chatwoot
 */
export const ROLES = {
  ADMINISTRATOR: 'administrator',
  AGENT: 'agent',
  CUSTOM_ROLE: 'custom_role',
} as const;

export type ChatwootRole = typeof ROLES[keyof typeof ROLES];

/**
 * Available custom role permissions
 *
 * These are fine-grained permissions that can be assigned to custom roles.
 * Administrators have all permissions by default.
 */
export const PERMISSIONS = {
  // Conversation Management
  CONVERSATION_MANAGE: 'conversation_manage', // Manage all conversations
  CONVERSATION_UNASSIGNED_MANAGE: 'conversation_unassigned_manage', // Manage unassigned conversations
  CONVERSATION_PARTICIPATING_MANAGE: 'conversation_participating_manage', // Manage participating conversations

  // Contact Management
  CONTACT_MANAGE: 'contact_manage', // Manage contacts

  // Reporting
  REPORT_MANAGE: 'report_manage', // View reports

  // Knowledge Base
  KNOWLEDGE_BASE_MANAGE: 'knowledge_base_manage', // Manage help center/knowledge base
} as const;

export type ChatwootPermission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * All available custom role permissions as an array
 */
export const AVAILABLE_CUSTOM_ROLE_PERMISSIONS: ChatwootPermission[] = [
  PERMISSIONS.CONVERSATION_MANAGE,
  PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
  PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
  PERMISSIONS.CONTACT_MANAGE,
  PERMISSIONS.REPORT_MANAGE,
  PERMISSIONS.KNOWLEDGE_BASE_MANAGE,
];

/**
 * Permission mappings for conversation assignee type tabs
 *
 * This defines which roles/permissions can see which assignee tabs
 * in the conversation list views.
 *
 * @see /Users/omarsabbah/Desktop/messaging/chatwoot/.../permissions.js (ASSIGNEE_TYPE_TAB_PERMISSIONS)
 */
export const ASSIGNEE_TAB_PERMISSIONS = {
  me: {
    // "Mine" tab - visible to all roles and ALL conversation permissions
    // Following Chatwoot: Users with ANY conversation permission can see their own conversations
    permissions: [
      ROLES.AGENT,
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
  },
  unassigned: {
    // "Unassigned" tab - only admins and users with unassigned conversation permission
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
    ],
  },
  all: {
    // "All" tab - only admins and users with participating conversation permission
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
  },
} as const;

/**
 * Permission mappings for different views
 *
 * This defines which roles/permissions can access which views
 */
export const VIEW_PERMISSIONS = {
  // Dashboard view - accessible to all
  dashboard: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },

  // My Inbox - accessible to all
  myInbox: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },

  // All Conversations - requires appropriate permission
  allConversations: {
    permissions: [
      ROLES.ADMINISTRATOR,
      ROLES.AGENT,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
    ],
  },

  // Unattended - requires unassigned conversation permission
  unattended: {
    permissions: [
      ROLES.ADMINISTRATOR,
      ROLES.AGENT,
      PERMISSIONS.CONVERSATION_MANAGE,
      PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
    ],
  },

  // Mentions - accessible to all
  mentions: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },

  // Channels - accessible to all
  channels: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },

  // Settings - visible to all, individual pages permission-controlled
  settings: {
    permissions: [ROLES.ADMINISTRATOR, ROLES.AGENT],
  },
} as const;

/**
 * Permission mappings for settings sub-pages
 *
 * This defines which roles/permissions can access which settings pages
 */
export const SETTINGS_PERMISSIONS = {
  // Agent Management - administrator only
  agents: {
    permissions: [ROLES.ADMINISTRATOR],
  },

  // Team Management - administrator only
  teams: {
    permissions: [ROLES.ADMINISTRATOR],
  },

  // Inbox Management - administrator only
  inboxes: {
    permissions: [ROLES.ADMINISTRATOR],
  },

  // Labels Management - administrator only
  labels: {
    permissions: [ROLES.ADMINISTRATOR],
  },

  // Canned Responses - accessible to all
  cannedResponses: {
    permissions: [ROLES.AGENT, ROLES.ADMINISTRATOR, ROLES.CUSTOM_ROLE],
  },

  // Integrations - administrator only
  integrations: {
    permissions: [ROLES.ADMINISTRATOR],
  },
} as const;

/**
 * Permission mappings for specific actions
 *
 * This defines which roles/permissions can perform which actions
 */
export const ACTION_PERMISSIONS = {
  // Agent Management Actions
  addAgent: {
    permissions: [ROLES.ADMINISTRATOR],
  },
  editAgent: {
    permissions: [ROLES.ADMINISTRATOR],
  },
  deleteAgent: {
    permissions: [ROLES.ADMINISTRATOR],
  },

  // Conversation Actions
  assignConversation: {
    permissions: [
      ROLES.AGENT,
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
    ],
  },
  resolveConversation: {
    permissions: [
      ROLES.AGENT,
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONVERSATION_MANAGE,
    ],
  },

  // Contact Actions
  editContact: {
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONTACT_MANAGE,
    ],
  },
  deleteContact: {
    permissions: [
      ROLES.ADMINISTRATOR,
      PERMISSIONS.CONTACT_MANAGE,
    ],
  },

  // Inbox Actions
  createInbox: {
    permissions: [ROLES.ADMINISTRATOR],
  },
  editInbox: {
    permissions: [ROLES.ADMINISTRATOR],
  },
  deleteInbox: {
    permissions: [ROLES.ADMINISTRATOR],
  },
} as const;

/**
 * Helper type for permission config objects
 */
export type PermissionConfig = {
  permissions: readonly string[];
};

/**
 * Helper function to check if a permission config requires admin-only access
 */
export const isAdminOnly = (config: PermissionConfig): boolean => {
  return config.permissions.length === 1 && config.permissions[0] === ROLES.ADMINISTRATOR;
};
