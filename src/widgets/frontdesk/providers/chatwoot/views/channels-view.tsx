/**
 * Chatwoot Channels View
 *
 * Displays conversations filtered by a specific channel/inbox.
 * When a specific channel is selected from the sidebar, shows only that channel's conversations.
 * The provider hook automatically filters by selectedInboxId when set.
 */

import React from "react";
import { BaseConversationView } from "../components/base-conversation-view";

export const ChannelsView: React.FC = () => {
  return (
    <BaseConversationView
      emptyState={{
        title: "No conversation selected",
        description: "Choose a conversation from this channel to start messaging",
      }}
    />
  );
};
