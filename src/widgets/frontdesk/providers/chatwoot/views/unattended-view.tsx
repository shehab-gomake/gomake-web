/**
 * Chatwoot Unattended View
 *
 * Displays conversations that require attention:
 * - Brand new conversations that have never been replied to
 * - Conversations where the last reply was from an agent and waiting for contact response
 *
 * Uses conversation_type=unattended parameter which translates to backend .unattended scope.
 * The filter is automatically set by useChatwootProvider based on the current view.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { BaseConversationView } from "../components/base-conversation-view";

export const UnattendedView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseConversationView
      emptyState={{
        title: t("frontdesk.emptyStates.noTicketSelected"),
        description: t("frontdesk.emptyStates.chooseUnattendedTicket"),
      }}
    />
  );
};
