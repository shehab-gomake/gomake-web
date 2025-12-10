/**
 * Chatwoot Channels View
 *
 * Displays conversations filtered by a specific channel/inbox.
 * When a specific channel is selected from the sidebar, shows only that channel's conversations.
 * The provider hook automatically filters by selectedInboxId when set.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { BaseConversationView } from "../components/base-conversation-view";

export const ChannelsView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseConversationView
      emptyState={{
        title: t("frontdesk.emptyStates.noTicketSelected"),
        description: t("frontdesk.emptyStates.chooseTicketFromChannel"),
      }}
    />
  );
};
