/**
 * Chatwoot Provider View - Main Router
 *
 * Routes to appropriate Chatwoot view based on current route.
 * Acts as a view router that delegates to specific view components.
 */

import React from "react";
import { useChatwootProvider } from "./hooks/use-chatwoot-provider";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { ChatwootErrorBoundary } from "./components/ChatwootErrorBoundary";
import { ProfileErrorModal } from "./components/profile-error-modal";

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

  // Render appropriate view based on current route
  const renderView = () => {
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
        // Fallback to My Inbox
        console.warn("[ChatwootProviderView] Unknown view, falling back to My Inbox:", currentView);
        return <MyInboxView />;
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
