/**
 * Kanban Column Component for Chatwoot Conversations
 * 
 * Droppable column for the Kanban board.
 * Displays column header with count and contains conversation cards.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Typography, Stack, Avatar, Badge, Tooltip, alpha } from '@mui/material';
import { 
  Person as PersonIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';

// Design system - import from centralized location
import { 
  colorTokens, 
  shadowTokens, 
  radiusTokens, 
  semanticSpacing,
  layoutTokens,
  conversationStatusColors,
  slaColors,
} from '@/widgets/frontdesk/design-system';

// Components
import { KanbanConversationCard } from './kanban-card';

// Types
import { KanbanConversationColumn as KanbanColumnType } from '../../types/kanban.types';
import { ChatwootConversation, ConversationStatus, ConversationPriority } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// ============================================
// Types
// ============================================

export interface KanbanColumnProps {
  column: KanbanColumnType;
  agents?: Agent[];
  onCardClick?: (conversation: ChatwootConversation) => void;
  onResolve?: (conversation: ChatwootConversation) => void;
  onSnooze?: (conversation: ChatwootConversation) => void;
  onAssign?: (conversation: ChatwootConversation, agentId: number | null) => void;
  onPriorityChange?: (conversation: ChatwootConversation, priority: ConversationPriority) => void;
}

// ============================================
// Helper Functions
// ============================================

const getWorkloadColor = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low':
      return slaColors.onTrack.main;
    case 'medium':
      return slaColors.warning.main;
    case 'high':
      return slaColors.breached.main;
    default:
      return colorTokens.neutral[400];
  }
};

const getStatusColor = (status?: ConversationStatus): string => {
  switch (status) {
    case ConversationStatus.OPEN:
      return conversationStatusColors.open.main;
    case ConversationStatus.PENDING:
      return conversationStatusColors.pending.main;
    case ConversationStatus.SNOOZED:
      return colorTokens.warning[500];
    case ConversationStatus.RESOLVED:
      return conversationStatusColors.resolved.main;
    default:
      return colorTokens.primary[600];
  }
};

const getStatusBgColor = (status?: ConversationStatus): string => {
  switch (status) {
    case ConversationStatus.OPEN:
      return conversationStatusColors.open.bg;
    case ConversationStatus.PENDING:
      return conversationStatusColors.pending.bg;
    case ConversationStatus.SNOOZED:
      return colorTokens.warning[50];
    case ConversationStatus.RESOLVED:
      return conversationStatusColors.resolved.bg;
    default:
      return colorTokens.primary[50];
  }
};

// ============================================
// Component
// ============================================

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  agents = [],
  onCardClick,
  onResolve,
  onSnooze,
  onAssign,
  onPriorityChange,
}) => {
  const hasAssignee = column.assignee && column.assignee.id !== null;
  const columnColor = column.status ? getStatusColor(column.status) : colorTokens.primary[600];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 320,
        minWidth: 320,
        maxWidth: 320,
        height: '100%',
        backgroundColor: colorTokens.neutral[50],
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${colorTokens.neutral[200]}`,
        overflow: 'hidden',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          padding: `${semanticSpacing.component.md}px`,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: column.status 
            ? getStatusBgColor(column.status)
            : colorTokens.semantic.background.primary,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Status Color Indicator or Avatar */}
            {column.status ? (
              // Status view - show color dot
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: columnColor,
                  flexShrink: 0,
                  boxShadow: `0 0 0 3px ${alpha(columnColor, 0.2)}`,
                }}
              />
            ) : hasAssignee ? (
              // Assignee view - show avatar with workload indicator
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  column.workload && (
                    <DotIcon
                      sx={{
                        fontSize: 14,
                        color: getWorkloadColor(column.workload.loadLevel),
                        backgroundColor: colorTokens.semantic.background.primary,
                        borderRadius: '50%',
                      }}
                    />
                  )
                }
              >
                <Avatar
                  src={column.assignee?.thumbnail}
                  sx={{
                    width: layoutTokens.avatar.sm,
                    height: layoutTokens.avatar.sm,
                    fontSize: '0.75rem',
                    backgroundColor: colorTokens.primary[100],
                    color: colorTokens.primary[700],
                  }}
                >
                  {column.assignee?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
            ) : (
              // Unassigned - show person icon
              <Avatar
                sx={{
                  width: layoutTokens.avatar.sm,
                  height: layoutTokens.avatar.sm,
                  backgroundColor: colorTokens.neutral[200],
                  color: colorTokens.neutral[500],
                }}
              >
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
            )}

            {/* Column Title */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: colorTokens.semantic.text.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 180,
                }}
              >
                {column.title}
              </Typography>
              {column.assignee?.email && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    maxWidth: 180,
                    fontSize: '0.65rem',
                  }}
                >
                  {column.assignee.email}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Conversation Count Badge */}
          <Tooltip 
            title={column.workload 
              ? `${column.workload.openCount} open / ${column.workload.totalCount} total`
              : `${column.count} conversations`
            }
          >
            <Box
              sx={{
                minWidth: 32,
                height: 32,
                borderRadius: `${radiusTokens.full}px`,
                backgroundColor: column.count > 0 
                  ? alpha(columnColor, 0.15)
                  : colorTokens.neutral[100],
                color: column.count > 0 
                  ? columnColor
                  : colorTokens.semantic.text.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {column.count}
            </Box>
          </Tooltip>
        </Stack>

        {/* Workload indicator for assignee columns */}
        {column.workload && (
          <Box sx={{ mt: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: colorTokens.semantic.text.secondary,
                }}
              >
                Workload
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: getWorkloadColor(column.workload.loadLevel),
                  fontWeight: 500,
                }}
              >
                {column.workload.openCount} open
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: colorTokens.neutral[200],
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.min((column.workload.openCount / 15) * 100, 100)}%`,
                  backgroundColor: getWorkloadColor(column.workload.loadLevel),
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              padding: `${semanticSpacing.component.sm}px`,
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: snapshot.isDraggingOver 
                ? alpha(columnColor, 0.05)
                : 'transparent',
              transition: 'background-color 0.2s ease',
              minHeight: 200,
              '&::-webkit-scrollbar': {
                width: 6,
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
            {/* Conversation Cards */}
            {column.conversations.map((conversation, index) => (
              <KanbanConversationCard
                key={conversation.id}
                conversation={conversation}
                index={index}
                agents={agents}
                onClick={onCardClick}
                onResolve={onResolve}
                onSnooze={onSnooze}
                onAssign={onAssign}
                onPriorityChange={onPriorityChange}
              />
            ))}
            {provided.placeholder}

            {/* Empty State */}
            {column.conversations.length === 0 && !snapshot.isDraggingOver && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 120,
                  color: colorTokens.semantic.text.disabled,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                  No conversations
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                  Drag here or create new
                </Typography>
              </Box>
            )}

            {/* Drop hint when dragging over */}
            {snapshot.isDraggingOver && column.conversations.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  border: `2px dashed ${colorTokens.primary[300]}`,
                  borderRadius: `${radiusTokens.md}px`,
                  color: colorTokens.primary[500],
                  backgroundColor: alpha(colorTokens.primary[50], 0.5),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Drop here
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export const KanbanColumn = memo(KanbanColumnComponent);
