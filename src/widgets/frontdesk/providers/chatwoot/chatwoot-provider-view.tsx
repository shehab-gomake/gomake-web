/**
 * Chatwoot Provider View - Main Router
 *
 * Routes to appropriate Chatwoot view based on current route.
 * Acts as a view router that delegates to specific view components.
 */

import React from "react";
import { useChatwootProvider } from "./hooks/use-chatwoot-provider";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";

// Import view components
import { MyInboxView } from "./views/my-inbox-view";
import { AllConversationsView } from "./views/all-conversations-view";
import { MentionsView } from "./views/mentions-view";
import { UnattendedView } from "./views/unattended-view";
import { ChannelsView } from "./views/channels-view";

export const ChatwootProviderView: React.FC = () => {
  // Profile loading is handled by useChatwootProvider (via useChatwootProfile hook internally)
  const { router: chatwootRouter } = useChatwootProvider();

  // Route to appropriate view based on current route
  const currentView = chatwootRouter.currentView;

  console.log("[ChatwootProviderView] Current view:", currentView);

  switch (currentView) {
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

    default:
      // Fallback to My Inbox
      console.warn("[ChatwootProviderView] Unknown view, falling back to My Inbox:", currentView);
      return <MyInboxView />;
  }
};
