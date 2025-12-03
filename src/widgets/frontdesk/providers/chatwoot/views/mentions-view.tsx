/**
 * Chatwoot Mentions View
 *
 * Displays conversations where the current user has been explicitly mentioned
 * by another agent (e.g., using @your-name).
 *
 * Uses conversation_type=mention parameter which filters conversations through
 * the mentions table. The filter is automatically set by useChatwootProvider based on the current view.
 */

import React from "react";
import { BaseConversationView } from "../components/base-conversation-view";

export const MentionsView: React.FC = () => {
  return (
    <BaseConversationView
      emptyState={{
        title: "No ticket selected",
        description: "Choose a ticket where you've been mentioned",
      }}
    />
  );
};
