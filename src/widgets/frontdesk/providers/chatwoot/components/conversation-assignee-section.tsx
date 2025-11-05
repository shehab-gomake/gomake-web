/**
 * Conversation Assignee Section
 *
 * Displays the assigned agent for a Chatwoot conversation
 * and provides options to reassign.
 *
 * Now uses inbox-specific agents and provides "Self Assign" quick action.
 * Pattern from Chatwoot: Shows only verified agents assigned to the inbox.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { chatwootService } from '@/services/frontdesk';
import { extractConversation, extractErrorMessage } from '../utils/api-response-extractors';
import { useChatwootInboxAgents } from '../hooks/resources';
import { useChatwootProfile } from '../hooks/use-chatwoot-profile';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

interface ConversationAssigneeSectionProps {
  /** Current assignee */
  assignee?: Agent | null;
  /** Account ID for API calls */
  accountId?: number;
  /** Conversation ID for API calls */
  conversationId?: number;
  /** Inbox ID for fetching inbox-specific agents */
  inboxId?: number;
  /** Callback when assignee is changed */
  onAssigneeChanged?: (newAssignee: Agent | null) => void;
}

export const ConversationAssigneeSection: React.FC<ConversationAssigneeSectionProps> = ({
  assignee,
  accountId,
  conversationId,
  inboxId,
  onAssigneeChanged,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [updating, setUpdating] = useState(false);

  // Get current user profile for "Self Assign" feature
  const { profile } = useChatwootProfile();
  const currentUserId = profile?.id;

  // Use inbox-specific agents hook - shows only agents assigned to this inbox
  // Automatically filters to verified agents only
  const { verifiedAgents, loading: loadingAgents } = useChatwootInboxAgents(accountId, inboxId);

  // Check if current user can self-assign
  const canSelfAssign = useMemo(() => {
    if (!currentUserId || assignee?.id === currentUserId) return false;
    // Check if current user is in the inbox agents list
    return verifiedAgents.some((agent) => agent.id === currentUserId);
  }, [currentUserId, assignee, verifiedAgents]);

  const handleAssign = async (agentId: number | null) => {
    setMenuAnchor(null);
    if (!accountId || !conversationId) return;

    // Optimistic update
    const previousAssignee = assignee;
    if (onAssigneeChanged) {
      onAssigneeChanged(agentId === null ? null : assignee);
    }

    setUpdating(true);
    try {
      const response = await chatwootService.conversations.updateConversation(
        accountId,
        conversationId,
        { assignee_id: agentId }
      );

      // Extract updated assignee from response
      const fallbackConversation = { id: conversationId, meta: { assignee: null } } as any;
      const updatedConversation = extractConversation(response, fallbackConversation);
      const newAssignee = updatedConversation?.meta?.assignee || null;

      // Update with actual data from server
      onAssigneeChanged?.(newAssignee);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error('[handleAssign] Failed to update assignee:', errorMessage);
      // Revert optimistic update on error
      onAssigneeChanged?.(previousAssignee || null);
      // TODO: Show error toast with message: errorMessage
    } finally {
      setUpdating(false);
    }
  };

  const handleUnassign = () => {
    handleAssign(null);
  };

  const handleSelfAssign = () => {
    if (currentUserId) {
      handleAssign(currentUserId);
    }
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.semantic.text.secondary,
          mb: 1,
          display: 'block',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: 10,
        }}
      >
        Assigned To
      </Typography>

      {assignee ? (
        <Box
          onClick={(e) => {
            if (!updating) {
              setMenuAnchor(e.currentTarget);
              // Agents are automatically fetched by useChatwootAgents hook
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            backgroundColor: colorTokens.neutral[50],
            borderRadius: '6px',
            border: `1px solid ${colorTokens.semantic.border.default}`,
            cursor: updating ? 'not-allowed' : 'pointer',
            opacity: updating ? 0.6 : 1,
            '&:hover': {
              backgroundColor: updating ? colorTokens.neutral[50] : colorTokens.neutral[100],
            },
          }}
        >
          {updating ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <Avatar
                src={assignee.thumbnail}
                sx={{ width: 32, height: 32 }}
              >
                {assignee.name?.charAt(0) || assignee.available_name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {assignee.name || assignee.available_name || 'Agent'}
                </Typography>
                {assignee.email && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 11,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {assignee.email}
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
          startIcon={updating ? <CircularProgress size={16} /> : <PersonIcon />}
          onClick={(e) => {
            if (!updating) {
              setMenuAnchor(e.currentTarget);
              // Agents are automatically fetched by useChatwootAgents hook
            }
          }}
          disabled={updating}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Assign to someone
        </Button>
      )}

      {/* Assignment Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
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

        {/* Unassign Option */}
        {assignee && (
          <>
            <MenuItem onClick={handleUnassign}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Unassign
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
          </>
        )}

        {/* Loading state */}
        {loadingAgents && (
          <MenuItem disabled>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Loading agents...
            </Typography>
          </MenuItem>
        )}

        {/* Agent list - Only verified agents assigned to this inbox */}
        {!loadingAgents && verifiedAgents.map((agent) => (
          <MenuItem
            key={agent.id}
            onClick={() => handleAssign(agent.id!)}
            selected={agent.id === assignee?.id}
          >
            <Avatar
              src={agent.thumbnail}
              sx={{ width: 24, height: 24, mr: 1.5 }}
            >
              {agent.name?.charAt(0) || agent.available_name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                {agent.name || agent.available_name || 'Agent'}
              </Typography>
              {agent.email && (
                <Typography variant="caption" sx={{ fontSize: 10, color: colorTokens.semantic.text.secondary }}>
                  {agent.email}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}

        {/* Empty state */}
        {!loadingAgents && verifiedAgents.length === 0 && (
          <MenuItem disabled>
            <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              No agents assigned to this inbox
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
