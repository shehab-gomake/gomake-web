/**
 * Kanban Board Component for Chatwoot Conversations
 * 
 * Main board layout with horizontal scrolling columns.
 * Uses unified design system components for consistent styling.
 */

import React, { memo, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Box, Stack, CircularProgress, Typography, alpha } from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';

// Design system - unified components and tokens
import { 
  colorTokens,
  radiusTokens,
  semanticTypography,
  EmptyState,
  Button,
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
  onAssign: (conversation: ChatwootConversation, agentId: number | null) => void;
  onPriorityChange: (conversation: ChatwootConversation, priority: ConversationPriority) => void;
}

// ============================================
// Loading State - Modern centered spinner
// ============================================

const LoadingState: React.FC = () => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      height: '100%',
      minHeight: 400,
      backgroundColor: colorTokens.neutral[50],
    }}
  >
    <CircularProgress 
      size={36} 
      thickness={3}
      sx={{ 
        color: colorTokens.primary[500],
        marginBottom: '12px',
      }} 
    />
    <Typography
      sx={{
        ...semanticTypography.body.medium,
        color: colorTokens.semantic.text.secondary,
      }}
    >
      Loading conversations...
    </Typography>
  </Stack>
);

// ============================================
// Error State - Using design system components
// ============================================

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <Box
    sx={{
      height: '100%',
      minHeight: 400,
      backgroundColor: colorTokens.neutral[50],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <EmptyState
      icon={<InboxIcon />}
      title="Failed to load board"
      description={error}
      action={{
        label: 'Try Again',
        onClick: onRetry,
      }}
      sx={{
        '& .MuiBox-root:first-of-type': {
          backgroundColor: colorTokens.error[50],
          color: colorTokens.error[500],
        },
      }}
    />
  </Box>
);

// ============================================
// Empty State - Using unified EmptyState component
// ============================================

const BoardEmptyState: React.FC = () => (
  <Box
    sx={{
      height: '100%',
      minHeight: 400,
      backgroundColor: colorTokens.neutral[50],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <EmptyState
      icon={<InboxIcon />}
      title="No conversations yet"
      description="Conversations will appear here when customers reach out. Check back soon or create a new conversation."
    />
  </Box>
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
  onAssign,
  onPriorityChange,
}) => {
  const { navigateToConversation } = useChatwootRouter();

  // Handle card click - navigate to conversation
  const handleCardClick = useCallback((conversation: ChatwootConversation) => {
    if (conversation.id) {
      navigateToConversation(conversation.id.toString());
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
    return <BoardEmptyState />;
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
              backgroundColor: alpha(colorTokens.semantic.background.primary, 0.8),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(3px)',
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <CircularProgress 
                size={32} 
                thickness={3}
                sx={{ color: colorTokens.primary[500] }} 
              />
              <Typography
                sx={{
                  ...semanticTypography.body.medium,
                  color: colorTokens.semantic.text.secondary,
                }}
              >
                Updating...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Columns container - unified spacing */}
        <Stack
          direction="row"
          spacing={2.5}
          sx={{
            padding: '20px 24px',
            height: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            alignItems: 'flex-start',
            backgroundColor: colorTokens.neutral[100],
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colorTokens.neutral[300],
              borderRadius: 3,
              '&:hover': {
                backgroundColor: colorTokens.neutral[400],
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
