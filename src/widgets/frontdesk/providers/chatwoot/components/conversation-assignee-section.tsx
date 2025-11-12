/**
 * Conversation Assignee Section
 *
 * Displays the assigned agent or team for a Chatwoot conversation
 * and provides options to reassign.
 *
 * Now uses inbox-specific agents and provides "Self Assign" quick action.
 * Pattern from Chatwoot: Shows only verified agents assigned to the inbox.
 */

import React, { useState, useMemo } from "react";
import { Box, Typography, Avatar, Button, Menu, MenuItem, CircularProgress, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import { useChatwootInboxAgents, useChatwootTeams } from "../hooks/resources";
import { useChatwootProfile } from "../hooks/use-chatwoot-profile";
import { useConversationAssignmentActions } from "../hooks/actions/use-conversation-assignment-actions";
import { useRecoilValue } from "recoil";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { prepareAgentsForAssignment } from "../utils/agent-helpers";
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
  updateConversation?: (updates: Partial<ChatwootConversation>) => void;
}

export const ConversationAssigneeSection: React.FC<ConversationAssigneeSectionProps> = ({
  type = "agent",
  assignee,
  team,
  accountId,
  conversation,
  inboxId,
  updateConversation = () => {},
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
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
  const { teams, loading: loadingTeams } = useChatwootTeams(type === "team" ? effectiveAccountId : undefined);

  // Use the centralized assignment actions hook
  const { handleAssignAgent, handleAssignTeam, isAssigning, isAssigningTeam } = useConversationAssignmentActions({
    accountId: accountId ?? null,
    conversation: conversation ?? null,
    updateConversation,
  });

  const isLoading = type === "agent" ? loadingAgents : loadingTeams;
  const isAssigningState = type === "agent" ? isAssigning : isAssigningTeam;

  // Process agents with Chatwoot's pattern: update presence + sort by availability + add "None" option
  const processedAgents = useMemo(() => {
    if (type !== "agent" || !effectiveAccountId) return verifiedAgents;

    // Apply Chatwoot's agent processing:
    // 1. Update current user's presence dynamically
    // 2. Sort by availability (online → busy → offline)
    // 3. Add "None" option at the beginning for unassignment
    return prepareAgentsForAssignment(
      verifiedAgents,
      profile,
      effectiveAccountId,
      !!assignee // Only include "None" when someone is assigned
    );
  }, [type, verifiedAgents, profile, effectiveAccountId, assignee]);

  // Check if current user can self-assign (agents only)
  const canSelfAssign = useMemo(() => {
    if (type !== "agent" || !currentUserId || assignee?.id === currentUserId) return false;
    // Check if current user is in the inbox agents list
    return verifiedAgents.some((agent) => agent.id === currentUserId);
  }, [type, currentUserId, assignee, verifiedAgents]);

  const handleAssign = async (id: number | null) => {
    setMenuAnchor(null);

    if (type === "agent") {
      // Chatwoot pattern: If clicking the same agent, unassign (toggle behavior)
      if (assignee && id === assignee.id) {
        await handleAssignAgent(null);
        return;
      }

      // Special handling for "None" option (id: 0)
      if (id === 0) {
        await handleAssignAgent(0);
        return;
      }

      // Find the agent data to pass for optimistic update
      const agentData = id ? verifiedAgents.find((a) => a.id === id) : undefined;

      // Use the hook's handler with proper agent data
      await handleAssignAgent(
        id,
        agentData
          ? {
              id: agentData.id!,
              name: agentData.name,
              email: agentData.email,
              thumbnail: agentData.thumbnail,
            }
          : undefined
      );
    } else {
      // Team assignment
      if (team && id === team.id) {
        await handleAssignTeam(0);
        return;
      }

      // Special handling for unassign (id: null) - send 0 for teams
      if (id === null) {
        await handleAssignTeam(0);
        return;
      }

      const teamData = id ? teams.find((t) => t.id === id) : undefined;
      await handleAssignTeam(
        id,
        teamData
          ? {
              id: teamData.id!,
              name: teamData.name,
              description: teamData.description,
            }
          : undefined
      );
    }
  };

  const handleSelfAssign = () => {
    if (type === "agent" && currentUserId) {
      handleAssign(currentUserId);
    }
  };

  const currentItem = type === "agent" ? assignee : team;
  const label = type === "agent" ? "Assigned To" : "Assigned Team";
  const buttonText = type === "agent" ? "Assign to someone" : "Assign to team";
  const emptyText = type === "agent" ? "No agents assigned to this inbox" : "No teams available";

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.semantic.text.secondary,
          mb: 1,
          display: "block",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: 10,
        }}
      >
        {label}
      </Typography>

      {currentItem ? (
        <Box
          onClick={(e) => {
            if (!isAssigningState) {
              setMenuAnchor(e.currentTarget);
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: "6px",
            border: `1px solid ${colorTokens.semantic.border.default}`,
            cursor: isAssigningState ? "not-allowed" : "pointer",
            opacity: isAssigningState ? 0.6 : 1,
            "&:hover": {
              backgroundColor: isAssigningState ? colorTokens.neutral[50] : colorTokens.neutral[100],
            },
          }}
        >
          {isAssigningState ? (
            <CircularProgress size={32} />
          ) : (
            <>
              {type === "agent" && assignee ? (
                <Avatar src={assignee.thumbnail} sx={{ width: 32, height: 32 }}>
                  {assignee.name?.charAt(0) || assignee.available_name?.charAt(0) || "A"}
                </Avatar>
              ) : (
                <GroupIcon sx={{ width: 32, height: 32, color: colorTokens.semantic.text.secondary }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {type === "agent" && assignee ? assignee.name || assignee.available_name || "Agent" : team?.name || "Team"}
                </Typography>
                {type === "team" && team?.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 11,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {team.description}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={isAssigningState ? <CircularProgress size={16} /> : type === "agent" ? <PersonIcon /> : <GroupIcon />}
          onClick={(e) => {
            if (!isAssigningState) {
              setMenuAnchor(e.currentTarget);
            }
          }}
          disabled={isAssigningState}
          sx={{
            textTransform: "none",
            justifyContent: "flex-start",
          }}
        >
          {buttonText}
        </Button>
      )}

      {/* Assignment Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        {/* Self Assign - Quick Action (Chatwoot pattern) */}
        {canSelfAssign && (
          <>
            <MenuItem onClick={handleSelfAssign} sx={{ fontWeight: 600 }}>
              <PersonAddIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                Self Assign
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <MenuItem disabled>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Loading {type === "agent" ? "agents" : "teams"}...
            </Typography>
          </MenuItem>
        )}

        {/* Agent list - Includes "None" option, sorted by availability (online → busy → offline) */}
        {type === "agent" &&
          !isLoading &&
          processedAgents.map((agent) => (
            <MenuItem
              key={agent.id}
              onClick={() => handleAssign(agent.id!)}
              selected={agent.id === assignee?.id}
              sx={{
                // Highlight "None" option slightly differently
                fontWeight: agent.id === 0 ? 500 : 400,
              }}
            >
              {agent.id === 0 ? (
                // "None" option - no avatar
                <Typography variant="body2" sx={{ fontSize: 13, ml: 4.5 }}>
                  {agent.name}
                </Typography>
              ) : (
                // Regular agent with avatar and availability indicator
                <>
                  <Avatar src={agent.thumbnail} sx={{ width: 24, height: 24, mr: 1.5 }}>
                    {agent.name?.charAt(0) || agent.available_name?.charAt(0) || "A"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {agent.name || agent.available_name || "Agent"}
                      </Typography>
                      {/* Availability indicator (matches Chatwoot) */}
                      {agent.availability_status && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor:
                              agent.availability_status === "online"
                                ? "#22c55e" // green
                                : agent.availability_status === "busy"
                                ? "#f59e0b" // amber
                                : "#6b7280", // gray
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </MenuItem>
          ))}

        {/* Team list */}
        {type === "team" &&
          !isLoading &&
          teams.map((teamOption) => (
            <MenuItem key={teamOption.id} onClick={() => handleAssign(teamOption.id!)} selected={teamOption.id === team?.id}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  {teamOption.name || "Team"}
                </Typography>
                {teamOption.description && (
                  <Typography variant="caption" sx={{ fontSize: 10, color: colorTokens.semantic.text.secondary }}>
                    {teamOption.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}

        {/* Unassign option for teams - only show if a team is assigned */}
        {type === "team" && !isLoading && team && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => handleAssign(null)}>
              <Typography variant="body2" sx={{ fontSize: 13, color: colorTokens.semantic.text.secondary }}>
                Unassign
              </Typography>
            </MenuItem>
          </>
        )}

        {/* Empty state */}
        {!isLoading && ((type === "agent" && processedAgents.length === 0) || (type === "team" && teams.length === 0)) && (
          <MenuItem disabled>
            <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              {emptyText}
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
