/**
 * Chatwoot Permissions Hook
 *
 * This hook provides a React-friendly interface for checking user permissions
 * and roles in the Chatwoot provider. It integrates with Recoil state and
 * provides memoized permission checking functions.
 *
 * @see /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/composables/usePolicy.js
 */

import { useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { chatwootProfileAtom, chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import {
  hasPermissions,
  getUserPermissions,
  getUserRole,
  isAdministrator as checkIsAdministrator,
  isAgent as checkIsAgent,
  hasCustomRole as checkHasCustomRole,
} from '../utils/permissions.utils';
import type { PermissionConfig, ChatwootPermission, ChatwootRole } from '../constants/permissions.constants';

/**
 * Union type for all valid permission strings (roles + fine-grained permissions)
 * This provides compile-time type safety for permission checks
 */
type PermissionOrRole = ChatwootPermission | ChatwootRole;

/**
 * Hook for checking Chatwoot permissions
 *
 * @returns Object containing permission checking functions and user role information
 *
 * @example
 * const { isAdministrator, checkPermissions, canAccess } = useChatwootPermissions();
 *
 * // Check if user is admin
 * if (isAdministrator) {
 *   // Show admin features
 * }
 *
 * // Check specific permissions
 * if (checkPermissions(['conversation_manage'])) {
 *   // Show conversation management features
 * }
 *
 * // Check if user can access a view
 * if (canAccess(VIEW_PERMISSIONS.settings)) {
 *   // Show settings view
 * }
 */
export const useChatwootPermissions = () => {
  // Get current user profile and selected account from Recoil
  const profile = useRecoilValue(chatwootProfileAtom);
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  /**
   * Get the current user's permissions array
   * Memoized to prevent unnecessary recalculations
   */
  const userPermissions = useMemo(() => {
    return getUserPermissions(profile, accountId);
  }, [profile, accountId]);

  /**
   * Get the current user's role
   * Memoized to prevent unnecessary recalculations
   */
  const userRole = useMemo(() => {
    return getUserRole(profile, accountId);
  }, [profile, accountId]);

  /**
   * Check if the current user is an administrator
   * Memoized to prevent unnecessary recalculations
   */
  const isAdministrator = useMemo(() => {
    return checkIsAdministrator(profile, accountId);
  }, [profile, accountId]);

  /**
   * Check if the current user is an agent
   * Memoized to prevent unnecessary recalculations
   */
  const isAgent = useMemo(() => {
    return checkIsAgent(profile, accountId);
  }, [profile, accountId]);

  /**
   * Check if the current user has a custom role
   * Memoized to prevent unnecessary recalculations
   */
  const hasCustomRole = useMemo(() => {
    return checkHasCustomRole(profile, accountId);
  }, [profile, accountId]);

  /**
   * Check if the user has at least one of the required permissions
   *
   * @param requiredPermissions - Array of permissions to check (type-safe)
   * @returns true if user has at least one required permission
   *
   * @example
   * checkPermissions(['administrator', 'conversation_manage'])
   */
  const checkPermissions = useCallback(
    (requiredPermissions: PermissionOrRole[]): boolean => {
      return hasPermissions(requiredPermissions, userPermissions);
    },
    [userPermissions]
  );

  /**
   * Check if the user can access a specific view or perform an action
   * based on a permission configuration object
   *
   * @param config - Permission config with permissions array
   * @returns true if user has access
   *
   * @example
   * canAccess(VIEW_PERMISSIONS.settings) // true for admins
   * canAccess(ACTION_PERMISSIONS.addAgent) // true for admins
   */
  const canAccess = useCallback(
    (config: PermissionConfig): boolean => {
      // Cast to string[] since hasPermissions expects string[]
      // The config.permissions are readonly, so we cast without copying
      return hasPermissions(config.permissions as string[], userPermissions);
    },
    [userPermissions]
  );

  /**
   * Check if a specific view should be shown to the user
   * Alias for canAccess for better semantic clarity
   *
   * @param config - Permission config with permissions array
   * @returns true if view should be shown
   *
   * @example
   * shouldShowView(VIEW_PERMISSIONS.allConversations)
   */
  const shouldShowView = useCallback(
    (config: PermissionConfig): boolean => {
      return canAccess(config);
    },
    [canAccess]
  );

  /**
   * Check if a specific action should be enabled for the user
   * Alias for canAccess for better semantic clarity
   *
   * @param config - Permission config with permissions array
   * @returns true if action should be enabled
   *
   * @example
   * canPerformAction(ACTION_PERMISSIONS.deleteAgent)
   */
  const canPerformAction = useCallback(
    (config: PermissionConfig): boolean => {
      return canAccess(config);
    },
    [canAccess]
  );

  /**
   * Filter an array of items based on permissions
   * Useful for filtering tabs, menu items, etc.
   *
   * @param items - Array of items with permission configs
   * @param getPermissions - Function to extract permission config from item
   * @returns Filtered array of items user has access to
   *
   * @example
   * const visibleTabs = filterByPermissions(
   *   allTabs,
   *   tab => tab.permissionConfig
   * );
   */
  const filterByPermissions = useCallback(
    <T>(
      items: T[],
      getPermissions: (item: T) => PermissionConfig
    ): T[] => {
      return items.filter(item => {
        const config = getPermissions(item);
        return canAccess(config);
      });
    },
    [canAccess]
  );

  return {
    // User info
    userRole,
    userPermissions,

    // Role checks
    isAdministrator,
    isAgent,
    hasCustomRole,

    // Permission checks
    checkPermissions,
    canAccess,

    // Semantic helpers
    shouldShowView,
    canPerformAction,

    // Filtering utilities
    filterByPermissions,
  };
};

/**
 * Type for the return value of useChatwootPermissions hook
 * Useful for passing permission checker to child components
 */
export type ChatwootPermissions = ReturnType<typeof useChatwootPermissions>;
