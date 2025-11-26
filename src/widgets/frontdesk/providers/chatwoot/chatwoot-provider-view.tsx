/**
 * Chatwoot Provider View - Main Router
 *
 * Routes to appropriate Chatwoot view based on current route.
 * Acts as a view router that delegates to specific view components.
 * Includes RBAC protection to ensure users can only access authorized views.
 */

import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useChatwootProvider } from "./hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "./hooks/use-chatwoot-permissions";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { ChatwootErrorBoundary } from "./components/ChatwootErrorBoundary";
import { ProfileErrorModal } from "./components/profile-error-modal";
import { VIEW_PERMISSIONS } from "./constants/permissions.constants";

// Import view components
import { DashboardView } from "./views/dashboard-view";
import { MyInboxView } from "./views/my-inbox-view";
import { AllConversationsView } from "./views/all-conversations-view";
import { MentionsView } from "./views/mentions-view";
import { UnattendedView } from "./views/unattended-view";
import { ChannelsView } from "./views/channels-view";
import { WebhookTestView } from "./views/webhook-test-view";
import { SettingsView } from "./views/settings-view";
import { OAuthCallbackView } from "./views/oauth-callback-view";

const ChatwootProviderViewInternal: React.FC = () => {
  // Profile loading is handled by useChatwootProvider (via useChatwootProfile hook internally)
  const { router: chatwootRouter, profileError, profileLoading, profile, fetchProfile } = useChatwootProvider();

  // Get permission checking functions and user role for logging
  const { canAccess, userRole, userPermissions } = useChatwootPermissions();

  // Show modal if profile failed to load (only after loading is complete and no profile)
  const showProfileErrorModal = !profileLoading && !profile && !!profileError;

  // Retry handler - calls fetchProfile to retry loading the profile
  const handleRetryProfile = React.useCallback(() => {
    if (fetchProfile) {
      fetchProfile();
    }
  }, [fetchProfile]);

  // Route to appropriate view based on current route
  const currentView = chatwootRouter.currentView;

  /**
   * Check if user has permission to access the current view
   * If not, redirect to a safe default view (My Inbox or Dashboard)
   *
   * IMPORTANT: This is defense-in-depth. Backend API endpoints MUST also enforce permissions.
   */
  const checkViewPermissions = React.useCallback(() => {
    // Skip check during loading or if profile error modal is shown
    if (profileLoading || showProfileErrorModal) return;

    // CRITICAL: Skip check if profile hasn't loaded yet (prevents premature redirects)
    if (!profile) {
      console.warn('[ChatwootProviderView] Profile not loaded yet, skipping permission check');
      return;
    }

    // Map views to their permission configs
    const viewPermissionMap: Record<ChatwootView, typeof VIEW_PERMISSIONS[keyof typeof VIEW_PERMISSIONS] | null> = {
      [ChatwootView.DASHBOARD]: VIEW_PERMISSIONS.dashboard,
      [ChatwootView.MY_INBOX]: VIEW_PERMISSIONS.myInbox,
      [ChatwootView.ALL_CONVERSATIONS]: VIEW_PERMISSIONS.allConversations,
      [ChatwootView.MENTIONS]: VIEW_PERMISSIONS.mentions,
      [ChatwootView.UNATTENDED]: VIEW_PERMISSIONS.unattended,
      [ChatwootView.CHANNELS]: VIEW_PERMISSIONS.channels,
      [ChatwootView.SETTINGS]: VIEW_PERMISSIONS.settings,
      [ChatwootView.WEBHOOK_TEST]: null, // No restrictions on test view
      [ChatwootView.OAUTH_CALLBACK]: null, // No restrictions on OAuth callback
    };

    const requiredPermissions = viewPermissionMap[currentView];

    // If view has permission requirements, check them
    if (requiredPermissions && !canAccess(requiredPermissions)) {
      // Log RBAC violation for debugging and security monitoring
      console.error(
        `[ChatwootProviderView] RBAC Violation: User lacks permissions for ${currentView}`,
        {
          view: currentView,
          userRole,
          userPermissions,
          requiredPermissions: requiredPermissions.permissions,
        }
      );

      // Redirect to safe default view with fallback
      // Defense-in-depth: Check if user can access My Inbox, else fallback to Dashboard
      if (canAccess(VIEW_PERMISSIONS.myInbox)) {
        console.warn(`[ChatwootProviderView] Redirecting to My Inbox`);
        chatwootRouter.navigateToMyInbox({ replace: true });
      } else if (canAccess(VIEW_PERMISSIONS.dashboard)) {
        console.warn(`[ChatwootProviderView] Redirecting to Dashboard (fallback)`);
        chatwootRouter.navigateToDashboard({ replace: true });
      } else {
        // Should never happen, but log if it does
        console.error('[ChatwootProviderView] User lacks access to all default views!');
      }
    }
  }, [currentView, profile, canAccess, profileLoading, showProfileErrorModal, chatwootRouter, userRole, userPermissions]);

  // Check permissions whenever the view changes
  useEffect(() => {
    checkViewPermissions();
  }, [checkViewPermissions]);

  // Render appropriate view based on current route
  const renderView = () => {
    // Show loading state while determining permissions (prevents content flash)
    if (profileLoading || (!profile && !showProfileErrorModal)) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    switch (currentView) {
      case ChatwootView.DASHBOARD:
        return <DashboardView />;
      case ChatwootView.MY_INBOX:
        return <MyInboxView />;
      case ChatwootView.ALL_CONVERSATIONS:
        return <AllConversationsView />;
      case ChatwootView.MENTIONS:
        return <MentionsView />;
      case ChatwootView.UNATTENDED:
        return <UnattendedView />;
      case ChatwootView.CHANNELS:
        return <ChannelsView />;
      case ChatwootView.WEBHOOK_TEST:
        return <WebhookTestView />;
      case ChatwootView.SETTINGS:
        return <SettingsView />;
      case ChatwootView.OAUTH_CALLBACK:
        return <OAuthCallbackView />;
      default:
        // Fallback to Dashboard
        console.warn("[ChatwootProviderView] Unknown view, falling back to Dashboard:", currentView);
        return <DashboardView />;
    }
  };

  return (
    <>
      {/* Show error modal when profile fails to load */}
      <ProfileErrorModal
        open={showProfileErrorModal}
        error={profileError}
        onRetry={handleRetryProfile}
      />
      {/* Render view content only if profile is loaded or still loading */}
      {!showProfileErrorModal && renderView()}
    </>
  );
};

/**
 * ChatwootProviderView with Error Boundary
 * Wraps the internal view with error handling for production safety
 */
export const ChatwootProviderView: React.FC = () => {
  return (
    <ChatwootErrorBoundary>
      <ChatwootProviderViewInternal />
    </ChatwootErrorBoundary>
  );
};
