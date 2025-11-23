/**
 * Chatwoot All Conversations View
 *
 * Displays all conversations across all channels/inboxes.
 * Shows conversation list + message viewer in 3-panel layout.
 */

import React from "react";
import { BaseConversationView } from "../components/base-conversation-view";

export const AllConversationsView: React.FC = () => {
  return (
    <BaseConversationView
      emptyState={{
        title: "No ticket selected",
        description: "Choose a ticket from the list to start viewing messages",
      }}
    />
  );
};
