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

// Import view components
import { DashboardView } from "./views/dashboard-view";
import { MyInboxView } from "./views/my-inbox-view";
import { AllConversationsView } from "./views/all-conversations-view";
import { MentionsView } from "./views/mentions-view";
import { UnattendedView } from "./views/unattended-view";
import { ChannelsView } from "./views/channels-view";
import { WebhookTestView } from "./views/webhook-test-view";
import { SettingsView } from "./views/settings-view";

const ChatwootProviderViewInternal: React.FC = () => {
  // Profile loading is handled by useChatwootProvider (via useChatwootProfile hook internally)
  const { router: chatwootRouter } = useChatwootProvider();

  // Route to appropriate view based on current route
  const currentView = chatwootRouter.currentView;

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

    default:
      // Fallback to My Inbox
      console.warn("[ChatwootProviderView] Unknown view, falling back to My Inbox:", currentView);
      return <MyInboxView />;
  }
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
