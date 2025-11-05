/**
 * Chatwoot Unattended View
 *
 * Displays unassigned or unattended conversations that need attention.
 * Uses the same layout as All Conversations but filters for unassigned conversations.
 *
 * TODO: Add unattended filtering logic
 * Need to filter by assignee_type=none or unassigned status
 * This may require updating the useChatwootProvider hook to support different filter modes
 */

import React from "react";
import { BaseConversationView } from "../components/base-conversation-view";

export const UnattendedView: React.FC = () => {
  return (
    <BaseConversationView
      emptyState={{
        title: "No ticket selected",
        description: "Choose an unattended ticket to start responding",
      }}
    />
  );
};
