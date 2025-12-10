/**
 * Conversation Assignee Section
 *
 * Displays the assigned agent or team for a Chatwoot conversation
 * and provides options to reassign.
 * Uses the unified list system for consistent UI.
 *
 * @deprecated Use AgentSelect or TeamSelect from unified-list directly for new implementations.
 */

import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChatwootInboxAgents, useChatwootTeams } from "../hooks/resources";
import { useChatwootProfile } from "../hooks/use-chatwoot-profile";
import { useConversationAssignmentActions } from "../hooks/actions/use-conversation-assignment-actions";
import { useRecoilValue } from "recoil";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { AgentSelect, TeamSelect } from "./unified-list";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ConversationAssigneeSectionProps {
  /** Type of assignment: "agent" or "team" */
  type?: "agent" | "team";
  /** Current assignee (for agent type) */
  assignee?: Agent | null;
  /** Current team (for team type) */
  team?: Team | null;
  /** Account ID for API calls */
  accountId?: number;
  /** Conversation object for updates */
  conversation?: ChatwootConversation | null;
  /** Inbox ID for fetching inbox-specific agents */
  inboxId?: number;
  /** Callback to update the conversation in parent state */
  updateConversation?: (
    conversationId: number,
    updates: Partial<ChatwootConversation>
  ) => void;
}

export const ConversationAssigneeSection: React.FC<
  ConversationAssigneeSectionProps
> = ({
  type = "agent",
  assignee,
  team,
  accountId,
  conversation,
  inboxId,
  updateConversation = (_id, _updates) => {},
}) => {
  const { t } = useTranslation();
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const effectiveAccountId = accountId ?? selectedAccountId;

  // Get current user profile for "Self Assign" feature (agents only)
  const { profile } = useChatwootProfile();
  const currentUserId = profile?.id;

  // Fetch agents or teams based on type
  const { verifiedAgents, loading: loadingAgents } = useChatwootInboxAgents(
    type === "agent" ? accountId : undefined,
    type === "agent" ? inboxId : undefined,
    type === "agent" ? conversation?.id : undefined
  );
  const { teams, loading: loadingTeams } = useChatwootTeams(
    type === "team" ? effectiveAccountId : undefined
  );

  // Use the centralized assignment actions hook
  const { handleAssignAgent, handleAssignTeam, isAssigning, isAssigningTeam } =
    useConversationAssignmentActions({
      accountId: accountId ?? null,
      conversation: conversation ?? null,
      updateConversation,
    });

  // Handle agent selection
  const handleAgentSelect = useCallback(
    async (agentId: number | null, agent: Agent | null) => {
      if (agentId === null || agentId === 0) {
        await handleAssignAgent(0);
      } else {
        await handleAssignAgent(
          agentId,
          agent
            ? {
                id: agent.id!,
                name: agent.name,
                email: agent.email,
                thumbnail: agent.thumbnail,
              }
            : undefined
        );
      }
    },
    [handleAssignAgent]
  );

  // Handle team selection
  const handleTeamSelect = useCallback(
    async (teamId: number | null, selectedTeam: Team | null) => {
      if (teamId === null) {
        await handleAssignTeam(0);
      } else {
        await handleAssignTeam(
          teamId,
          selectedTeam
            ? {
                id: selectedTeam.id!,
                name: selectedTeam.name,
                description: selectedTeam.description,
              }
            : undefined
        );
      }
    },
    [handleAssignTeam]
  );

  if (type === "agent") {
    return (
      <AgentSelect
        selectedAgent={assignee ?? null}
        agents={verifiedAgents}
        onSelect={handleAgentSelect}
        currentUserId={currentUserId}
        loading={loadingAgents}
        updating={isAssigning}
        variant="inline"
        label={t("frontdesk.detailPanel.assignedTo")}
        placeholder={t("frontdesk.detailPanel.assignToSomeone")}
        emptyText={t("frontdesk.detailPanel.noAgentsAssignedToInbox")}
      />
    );
  }

  return (
    <TeamSelect
      selectedTeam={team ?? null}
      teams={teams}
      onSelect={handleTeamSelect}
      loading={loadingTeams}
      updating={isAssigningTeam}
      variant="inline"
      label={t("frontdesk.detailPanel.assignedTeam")}
      placeholder={t("frontdesk.detailPanel.assignToTeam")}
      emptyText={t("frontdesk.teams.noTeamsAvailable")}
    />
  );
};
