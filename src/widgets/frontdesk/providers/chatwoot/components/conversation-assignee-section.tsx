/**
 * Conversation Assignee Section
 *
 * Displays the assigned agent for a Chatwoot conversation
 * and provides options to reassign.
 */

import React, { useState } from 'react';
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

interface Agent {
  id?: number;
  name?: string;
  email?: string;
  avatar_url?: string;
  available_name?: string;
  [key: string]: any;
}

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
          onClick={(e) => !updating && setMenuAnchor(e.currentTarget)}
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
                src={assignee.avatar_url}
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
          onClick={(e) => !updating && setMenuAnchor(e.currentTarget)}
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
        {/* TODO: Fetch and display available agents */}
        <MenuItem disabled>
          <Typography variant="caption" sx={{ fontSize: 11, color: colorTokens.semantic.text.secondary }}>
            (Agent list not yet implemented)
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
