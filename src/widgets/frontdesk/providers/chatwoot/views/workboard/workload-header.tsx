/**
 * Workload Header Component
 * 
 * Displays agent workload summary cards at the top of the Kanban board.
 * Shows each agent's open conversations and total workload.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useMemo } from 'react';
import { Box, Typography, Stack, Avatar, Skeleton, Tooltip, alpha } from '@mui/material';
import { 
  Inbox as InboxIcon,
  CheckCircleOutline as ResolvedIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  shadowTokens, 
  radiusTokens, 
  semanticSpacing,
  layoutTokens,
  slaColors,
} from '@/widgets/frontdesk/design-system';

// Types
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { getWorkloadLevel, WORKLOAD_THRESHOLDS } from '../../types/kanban.types';

// ============================================
// Types
// ============================================

export interface WorkloadHeaderProps {
  agents: Agent[];
  conversations: ChatwootConversation[];
  loading?: boolean;
}

interface AgentWorkloadSummary {
  agent: Agent;
  openCount: number;
  pendingCount: number;
  totalCount: number;
  loadLevel: 'low' | 'medium' | 'high';
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

const getWorkloadBg = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low':
      return slaColors.onTrack.bg;
    case 'medium':
      return slaColors.warning.bg;
    case 'high':
      return slaColors.breached.bg;
    default:
      return colorTokens.neutral[100];
  }
};

// ============================================
// Loading Skeleton
// ============================================

const WorkloadSkeleton: React.FC = () => (
  <Stack
    direction="row"
    spacing={2}
    sx={{
      padding: `${semanticSpacing.component.md}px`,
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        height: 6,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: colorTokens.neutral[300],
        borderRadius: 3,
      },
    }}
  >
    {[1, 2, 3, 4].map((i) => (
      <Box
        key={i}
        sx={{
          minWidth: 180,
          padding: `${semanticSpacing.component.md}px`,
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={100} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width={60} />
        </Stack>
      </Box>
    ))}
  </Stack>
);

// ============================================
// Agent Card Component
// ============================================

interface AgentCardProps {
  summary: AgentWorkloadSummary;
}

const AgentCard: React.FC<AgentCardProps> = memo(({ summary }) => {
  const { agent, openCount, pendingCount, totalCount, loadLevel } = summary;
  
  return (
    <Tooltip 
      title={`${agent.name}: ${openCount} open, ${pendingCount} pending, ${totalCount} total`}
      placement="bottom"
    >
      <Box
        sx={{
          minWidth: 180,
          maxWidth: 200,
          padding: `${semanticSpacing.component.md}px`,
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${radiusTokens.md}px`,
          boxShadow: shadowTokens.xs,
          border: `1px solid ${colorTokens.neutral[200]}`,
          borderLeft: `3px solid ${getWorkloadColor(loadLevel)}`,
          transition: 'box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: shadowTokens.sm,
          },
        }}
      >
        {/* Agent Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Avatar
            src={agent.thumbnail}
            sx={{
              width: layoutTokens.avatar.sm,
              height: layoutTokens.avatar.sm,
              fontSize: '0.75rem',
              backgroundColor: colorTokens.primary[100],
              color: colorTokens.primary[700],
            }}
          >
            {agent.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colorTokens.semantic.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agent.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getWorkloadColor(loadLevel),
                fontWeight: 500,
                fontSize: '0.65rem',
              }}
            >
              {loadLevel === 'low' && 'Available'}
              {loadLevel === 'medium' && 'Moderate'}
              {loadLevel === 'high' && 'Heavy Load'}
            </Typography>
          </Box>
        </Stack>

        {/* Stats */}
        <Stack direction="row" spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <InboxIcon sx={{ fontSize: 14, color: conversationStatusColors.open.main }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: colorTokens.semantic.text.primary,
              }}
            >
              {openCount}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: '0.65rem',
              }}
            >
              open
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <PendingIcon sx={{ fontSize: 14, color: conversationStatusColors.pending.main }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: colorTokens.semantic.text.primary,
              }}
            >
              {pendingCount}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: '0.65rem',
              }}
            >
              pending
            </Typography>
          </Stack>
        </Stack>

        {/* Workload Bar */}
        <Box sx={{ mt: 1.5 }}>
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
                width: `${Math.min((openCount / WORKLOAD_THRESHOLDS.medium) * 100, 100)}%`,
                backgroundColor: getWorkloadColor(loadLevel),
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
});

// Import conversation status colors
const conversationStatusColors = {
  open: { main: colorTokens.success[500] },
  pending: { main: colorTokens.warning[500] },
  resolved: { main: colorTokens.neutral[500] },
};

// ============================================
// Main Component
// ============================================

const WorkloadHeaderComponent: React.FC<WorkloadHeaderProps> = ({
  agents,
  conversations,
  loading,
}) => {
  // Calculate workload for each agent
  const agentWorkloads = useMemo<AgentWorkloadSummary[]>(() => {
    return agents.map(agent => {
      const agentConvs = conversations.filter(c => c.meta?.assignee?.id === agent.id);
      const openCount = agentConvs.filter(c => c.status === 'open').length;
      const pendingCount = agentConvs.filter(c => c.status === 'pending').length;
      
      return {
        agent,
        openCount,
        pendingCount,
        totalCount: agentConvs.length,
        loadLevel: getWorkloadLevel(openCount),
      };
    }).sort((a, b) => b.openCount - a.openCount); // Sort by open count descending
  }, [agents, conversations]);

  // Calculate totals
  const totals = useMemo(() => {
    const unassigned = conversations.filter(c => !c.meta?.assignee?.id);
    return {
      total: conversations.length,
      unassigned: unassigned.length,
      unassignedOpen: unassigned.filter(c => c.status === 'open').length,
    };
  }, [conversations]);

  if (loading) {
    return <WorkloadSkeleton />;
  }

  if (agents.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: `${semanticSpacing.component.md}px`,
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: colorTokens.semantic.text.primary,
          }}
        >
          Team Workload
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.secondary,
            }}
          >
            Total: <strong>{totals.total}</strong>
          </Typography>
          {totals.unassigned > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: colorTokens.warning[600],
              }}
            >
              Unassigned: <strong>{totals.unassignedOpen}</strong> open
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Agent Cards */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto',
          paddingBottom: 1,
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
        {agentWorkloads.map((summary) => (
          <AgentCard key={summary.agent.id} summary={summary} />
        ))}
      </Stack>
    </Box>
  );
};

export const WorkloadHeader = memo(WorkloadHeaderComponent);
