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
import { useTranslation } from "react-i18next";
import { BaseConversationView } from "../components/base-conversation-view";

export const MentionsView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseConversationView
      emptyState={{
        title: t("frontdesk.emptyStates.noTicketSelected"),
        description: t("frontdesk.emptyStates.chooseMentionedTicket"),
      }}
    />
  );
};
