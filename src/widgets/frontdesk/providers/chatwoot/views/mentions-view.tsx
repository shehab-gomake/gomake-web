/**
 * Chatwoot Mentions View
 *
 * Displays conversations where the current user has been mentioned.
 * Uses the same layout as All Conversations but with mention filtering.
 *
 * TODO: Add mention filtering logic when Chatwoot API supports it
 * For now, showing all conversations - will need to filter by mentions
 */

import React from "react";
import { BaseConversationView } from "../components/base-conversation-view";

export const MentionsView: React.FC = () => {
  return (
    <BaseConversationView
      emptyState={{
        title: "No conversation selected",
        description: "Choose a conversation where you've been mentioned",
      }}
    />
  );
};
