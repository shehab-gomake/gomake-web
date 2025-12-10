/**
 * Chatwoot All Conversations View
 *
 * Displays all conversations across all channels/inboxes.
 * Shows conversation list + message viewer in 3-panel layout.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { BaseConversationView } from "../components/base-conversation-view";

export const AllConversationsView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseConversationView
      emptyState={{
        title: t("frontdesk.emptyStates.noTicketSelected"),
        description: t("frontdesk.emptyStates.chooseTicketFromList"),
      }}
    />
  );
};
