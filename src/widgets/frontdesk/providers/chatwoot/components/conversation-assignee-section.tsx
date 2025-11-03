/**
 * Conversation Assignee Section
 *
 * Displays the assigned agent for a Chatwoot conversation
 * and provides options to reassign.
 *
 * Now uses centralized useChatwootAgents hook to eliminate duplicate API calls.
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { chatwootService } from '@/services/frontdesk';
import { extractConversation, extractErrorMessage } from '../utils/api-response-extractors';
import { useChatwootAgents } from '../hooks/resources';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

interface ConversationAssigneeSectionProps {
  /** Current assignee */
  assignee?: Agent | null;
  /** Account ID for API calls */
  accountId?: number;
  /** Conversation ID for API calls */
  conversationId?: number;
  /** Callback when assignee is changed */
  onAssigneeChanged?: (newAssignee: Agent | null) => void;
}

export const ConversationAssigneeSection: React.FC<ConversationAssigneeSectionProps> = ({
  assignee,
  accountId,
  conversationId,
  onAssigneeChanged,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [updating, setUpdating] = useState(false);

  // Use centralized agents hook - no more duplicate fetching!
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

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
        {assignee && (
          <MenuItem onClick={handleUnassign}>
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              Unassign
            </Typography>
          </MenuItem>
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

        {/* Agent list */}
        {!loadingAgents && agents.map((agent) => (
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
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {agent.name || agent.available_name || 'Agent'}
            </Typography>
          </MenuItem>
        ))}

        {/* Empty state */}
        {!loadingAgents && agents.length === 0 && (
          <MenuItem disabled>
            <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              No agents available
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
