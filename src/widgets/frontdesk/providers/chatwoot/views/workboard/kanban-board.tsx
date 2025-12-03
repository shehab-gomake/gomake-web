/**
 * Kanban Board Component for Chatwoot Conversations
 * 
 * Main board layout with horizontal scrolling columns.
 * Wraps columns in DragDropContext for drag-and-drop functionality.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Box, Stack, CircularProgress, Typography, Button, alpha } from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  semanticSpacing,
  radiusTokens,
} from '@/widgets/frontdesk/design-system';

// Components
import { KanbanColumn } from './kanban-column';

// Types
import { KanbanConversationColumn } from '../../types/kanban.types';
import { ChatwootConversation, ConversationPriority } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// Hooks
import { useChatwootRouter } from '../../hooks/use-chatwoot-router';

// ============================================
// Types
// ============================================

export interface KanbanBoardProps {
  columns: KanbanConversationColumn[];
  agents: Agent[];
  isLoading: boolean;
  isOperationLoading: boolean;
  error: string | null;
  onDragEnd: (result: DropResult) => void;
  onRefresh: () => void;
  onResolve: (conversation: ChatwootConversation) => void;
  onSnooze: (conversation: ChatwootConversation) => void;
  onAssign: (conversation: ChatwootConversation, agentId: number | null) => void;
  onPriorityChange: (conversation: ChatwootConversation, priority: ConversationPriority) => void;
}

// ============================================
// Loading State
// ============================================

const LoadingState: React.FC = () => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      height: '100%',
      minHeight: 400,
    }}
  >
    <CircularProgress size={48} sx={{ color: colorTokens.primary[500] }} />
    <Typography
      variant="body1"
      sx={{
        mt: 2,
        color: colorTokens.semantic.text.secondary,
        fontWeight: 500,
      }}
    >
      Loading conversations...
    </Typography>
  </Stack>
);

// ============================================
// Error State
// ============================================

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      height: '100%',
      minHeight: 400,
      padding: 4,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: colorTokens.error[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <InboxIcon sx={{ fontSize: 32, color: colorTokens.error[500] }} />
    </Box>
    <Typography
      variant="h6"
      sx={{
        color: colorTokens.error[600],
        fontWeight: 600,
        mb: 1,
      }}
    >
      Failed to load board
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: colorTokens.semantic.text.secondary,
        mb: 3,
        textAlign: 'center',
        maxWidth: 400,
      }}
    >
      {error}
    </Typography>
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={onRetry}
      sx={{
        backgroundColor: colorTokens.primary[600],
        '&:hover': {
          backgroundColor: colorTokens.primary[700],
        },
      }}
    >
      Try Again
    </Button>
  </Stack>
);

// ============================================
// Empty State
// ============================================

const EmptyState: React.FC = () => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      height: '100%',
      minHeight: 400,
      padding: 4,
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: colorTokens.neutral[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <InboxIcon sx={{ fontSize: 40, color: colorTokens.neutral[400] }} />
    </Box>
    <Typography
      variant="h6"
      sx={{
        color: colorTokens.semantic.text.secondary,
        fontWeight: 600,
        mb: 1,
      }}
    >
      No conversations yet
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: colorTokens.semantic.text.tertiary,
        textAlign: 'center',
        maxWidth: 400,
      }}
    >
      Conversations will appear here when customers reach out. Check back soon or create a new conversation.
    </Typography>
  </Stack>
);

// ============================================
// Main Component
// ============================================

const KanbanBoardComponent: React.FC<KanbanBoardProps> = ({
  columns,
  agents,
  isLoading,
  isOperationLoading,
  error,
  onDragEnd,
  onRefresh,
  onResolve,
  onSnooze,
  onAssign,
  onPriorityChange,
}) => {
  const { navigateToConversation } = useChatwootRouter();

  // Handle card click - navigate to conversation
  const handleCardClick = useCallback((conversation: ChatwootConversation) => {
    if (conversation.id) {
      navigateToConversation(conversation.id);
    }
  }, [navigateToConversation]);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Calculate total conversations
  const totalConversations = columns.reduce((sum, col) => sum + col.count, 0);

  // Show empty state
  if (totalConversations === 0) {
    return <EmptyState />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Operation loading overlay */}
        {isOperationLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha(colorTokens.semantic.background.primary, 0.7),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(2px)',
            }}
          >
            <Stack alignItems="center" spacing={1}>
              <CircularProgress size={36} sx={{ color: colorTokens.primary[500] }} />
              <Typography
                variant="body2"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontWeight: 500,
                }}
              >
                Updating...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Columns container */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            padding: `${semanticSpacing.component.lg}px`,
            height: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            alignItems: 'flex-start',
            backgroundColor: colorTokens.neutral[100],
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: colorTokens.neutral[200],
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colorTokens.neutral[400],
              borderRadius: 4,
              '&:hover': {
                backgroundColor: colorTokens.neutral[500],
              },
            },
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              agents={agents}
              onCardClick={handleCardClick}
              onResolve={onResolve}
              onSnooze={onSnooze}
              onAssign={onAssign}
              onPriorityChange={onPriorityChange}
            />
          ))}
        </Stack>
      </Box>
    </DragDropContext>
  );
};

export const KanbanBoard = memo(KanbanBoardComponent);
