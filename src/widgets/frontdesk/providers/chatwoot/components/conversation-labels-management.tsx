/**
 * Conversation Labels Management
 *
 * Component for managing conversation labels (tags) in Chatwoot.
 * Allows adding and removing labels from a conversation.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { colorTokens, Chip } from '@/widgets/frontdesk/design-system';
import { chatwootService } from '@/services/frontdesk';
import { extractErrorMessage } from '../utils/api-response-extractors';

interface ConversationLabelsManagementProps {
  /** Current labels */
  labels?: string[];
  /** Account ID for API calls */
  accountId?: number;
  /** Conversation ID for API calls */
  conversationId?: number;
  /** Callback when labels are updated */
  onLabelsChanged?: (newLabels: string[]) => void;
}

export const ConversationLabelsManagement: React.FC<ConversationLabelsManagementProps> = ({
  labels = [],
  accountId,
  conversationId,
  onLabelsChanged,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleAddLabel = async () => {
    const newLabel = inputValue.trim();
    if (!newLabel || !accountId || !conversationId) return;

    // Prevent duplicate labels
    if (labels.includes(newLabel)) {
      setInputValue('');
      return;
    }

    // Optimistic update
    const updatedLabels = [...labels, newLabel];
    onLabelsChanged?.(updatedLabels);
    setInputValue('');
    setUpdating(true);

    try {
      await chatwootService.conversations.addConversationLabels(
        accountId,
        conversationId,
        [newLabel]
      );
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error('[handleAddLabel] Failed to add label:', errorMessage);
      // Revert optimistic update on error
      onLabelsChanged?.(labels);
      // TODO: Show error toast with message: errorMessage
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveLabel = async (labelToRemove: string) => {
    if (!accountId || !conversationId) return;

    // Optimistic update
    const remainingLabels = labels.filter(l => l !== labelToRemove);
    onLabelsChanged?.(remainingLabels);
    setUpdating(true);

    try {
      // Chatwoot API: Remove by posting the remaining labels
      // Update by setting all labels (workaround since there's no direct remove endpoint)
      await chatwootService.conversations.updateConversation(
        accountId,
        conversationId,
        { labels: remainingLabels }
      );
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error('[handleRemoveLabel] Failed to remove label:', errorMessage);
      // Revert optimistic update on error
      onLabelsChanged?.(labels);
      // TODO: Show error toast with message: errorMessage
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabel();
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
        Labels
      </Typography>

      <Box
        sx={{
          p: 1.5,
          backgroundColor: colorTokens.neutral[50],
          borderRadius: '6px',
          border: `1px solid ${colorTokens.semantic.border.default}`,
          minHeight: 60,
        }}
      >
        {/* Existing Labels */}
        {labels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {labels.map((label, index) => (
              <Chip
                key={index}
                label={label}
                size="small"
                variant="soft"
                color="primary"
                onDelete={() => !updating && handleRemoveLabel(label)}
                deleteIcon={
                  updating ? (
                    <CircularProgress size={14} />
                  ) : (
                    <CloseIcon fontSize="small" />
                  )
                }
                sx={{
                  fontSize: 11,
                  height: 24,
                }}
              />
            ))}
          </Box>
        )}

        {/* Add Label Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Add label..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={updating}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {updating ? (
                  <CircularProgress size={16} />
                ) : (
                  <IconButton
                    size="small"
                    onClick={handleAddLabel}
                    disabled={!inputValue.trim()}
                    sx={{ p: 0.5 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: {
              fontSize: 12,
              '& input': {
                py: 0.75,
              },
            },
          }}
        />

        {labels.length === 0 && !inputValue && (
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
              fontSize: 11,
              display: 'block',
              textAlign: 'center',
              mt: 1,
            }}
          >
            No labels yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};
