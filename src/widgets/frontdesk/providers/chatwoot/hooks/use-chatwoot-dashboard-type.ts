/**
 * Chatwoot Dashboard Type Hook
 *
 * Determines the dashboard type (agent vs admin) based on user role and permissions.
 * Used to conditionally render role-specific dashboard components.
 */

import { useMemo } from 'react';
import { useChatwootPermissions } from './use-chatwoot-permissions';

export type DashboardType = 'agent' | 'admin';

/**
 * Hook to determine the dashboard type for the current user
 *
 * Returns 'admin' for administrators or users with management permissions,
 * otherwise returns 'agent'.
 *
 * @returns Dashboard type ('agent' | 'admin')
 *
 * @example
 * ```tsx
 * const dashboardType = useChatwootDashboardType();
 * if (dashboardType === 'admin') {
 *   return <AdminDashboard />;
 * }
 * return <AgentDashboard />;
 * ```
 */
export const useChatwootDashboardType = (): DashboardType => {
  const { isAdministrator, checkPermissions } = useChatwootPermissions();

  return useMemo(() => {
    // Administrators always get admin dashboard
    if (isAdministrator) {
      return 'admin';
    }

    // Users with management permissions also get admin dashboard
    // This includes managers with conversation_manage or report_manage permissions
    if (checkPermissions(['conversation_manage', 'report_manage'])) {
      return 'admin';
    }

    // Default to agent dashboard
    return 'agent';
  }, [isAdministrator, checkPermissions]);
};

