/**
 * Permission Utilities for Chatwoot RBAC
 *
 * These utilities provide helper functions for checking user permissions and roles
 * in the Chatwoot provider. They follow the same pattern as the reference Chatwoot
 * implementation but adapted for TypeScript and React.
 *
 * @see /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissionsHelper.js
 */

import type { ChatwootUser, ChatwootUserAccount } from '@/services/frontdesk/api/chatwoot/types/profile.types';

/**
 * Check if a user has at least one of the required permissions
 *
 * @param requiredPermissions - Array of permissions to check for
 * @param availablePermissions - Array of permissions the user has
 * @returns true if user has at least one required permission, false otherwise
 *
 * @example
 * hasPermissions(['conversation_manage'], ['agent', 'conversation_manage']) // true
 * hasPermissions(['administrator'], ['agent']) // false
 */
export const hasPermissions = (
  requiredPermissions: string[] = [],
  availablePermissions: string[] = []
): boolean => {
  // If no permissions are required, access is granted
  if (requiredPermissions.length === 0) return true;

  // Check if user has at least one of the required permissions
  return requiredPermissions.some(permission =>
    availablePermissions.includes(permission)
  );
};

/**
 * Get the current account object for a user
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account to get
 * @returns The ChatwootUserAccount object or null if not found
 *
 * @example
 * getCurrentAccount(user, 1) // { id: 1, role: 'administrator', ... }
 */
export const getCurrentAccount = (
  user: ChatwootUser | null,
  accountId: number | null
): ChatwootUserAccount | null => {
  if (!user?.accounts || !accountId) return null;
  return user.accounts.find(account => account.id === accountId) || null;
};

/**
 * Get the permissions array for the current account
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account
 * @returns Array of permission strings for the current account
 *
 * @example
 * getUserPermissions(user, 1) // ['agent', 'conversation_manage']
 */
export const getUserPermissions = (
  user: ChatwootUser | null,
  accountId: number | null
): string[] => {
  const currentAccount = getCurrentAccount(user, accountId);
  return currentAccount?.permissions || [];
};

/**
 * Get the role for the current account
 *
 * Returns 'custom_role' if the account has a custom_role_id,
 * otherwise returns the account's role property (administrator/agent)
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account
 * @returns The role string ('administrator', 'agent', or 'custom_role')
 *
 * @example
 * getUserRole(user, 1) // 'administrator'
 * getUserRole(customRoleUser, 1) // 'custom_role'
 */
export const getUserRole = (
  user: ChatwootUser | null,
  accountId: number | null
): string => {
  const currentAccount = getCurrentAccount(user, accountId);

  // If account has a custom role, return 'custom_role'
  if (currentAccount?.custom_role_id) {
    return 'custom_role';
  }

  // Otherwise return the role (defaults to 'agent' if not specified)
  return currentAccount?.role || 'agent';
};

/**
 * Check if a user is an administrator for the current account
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account
 * @returns true if user is an administrator, false otherwise
 *
 * @example
 * isAdministrator(user, 1) // true
 */
export const isAdministrator = (
  user: ChatwootUser | null,
  accountId: number | null
): boolean => {
  return getUserRole(user, accountId) === 'administrator';
};

/**
 * Check if a user is an agent for the current account
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account
 * @returns true if user is an agent, false otherwise
 *
 * @example
 * isAgent(user, 1) // true
 */
export const isAgent = (
  user: ChatwootUser | null,
  accountId: number | null
): boolean => {
  return getUserRole(user, accountId) === 'agent';
};

/**
 * Check if a user has a custom role for the current account
 *
 * @param user - The ChatwootUser object
 * @param accountId - The ID of the account
 * @returns true if user has a custom role, false otherwise
 *
 * @example
 * hasCustomRole(user, 1) // false
 */
export const hasCustomRole = (
  user: ChatwootUser | null,
  accountId: number | null
): boolean => {
  return getUserRole(user, accountId) === 'custom_role';
};

/**
 * Filter an array of items based on permission requirements
 *
 * This function matches Chatwoot's filterItemsByPermission helper.
 * It filters items by checking if the user has the required permissions
 * for each item.
 *
 * @param items - Array of items to filter
 * @param userPermissions - Array of user's permission strings
 * @param getPermissions - Function to extract permissions from an item
 * @returns Filtered array of items the user has permission to access
 *
 * @example
 * const tabs = [
 *   { key: 'me', permissions: ['agent', 'administrator'] },
 *   { key: 'all', permissions: ['administrator'] }
 * ];
 * filterItemsByPermission(tabs, ['agent'], item => item.permissions)
 * // Returns: [{ key: 'me', permissions: ['agent', 'administrator'] }]
 *
 * @see /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/helper/permissionsHelper.js
 */
export function filterItemsByPermission<T>(
  items: T[],
  userPermissions: string[],
  getPermissions: (item: T) => readonly string[] | string[] | undefined
): T[] {
  return items.filter(item => {
    const requiredPermissions = getPermissions(item);

    // If item has no permission requirements, include it
    if (!requiredPermissions) return true;

    // Check if user has at least one required permission
    return hasPermissions(
      Array.from(requiredPermissions), // Convert readonly array to regular array
      userPermissions
    );
  });
}
