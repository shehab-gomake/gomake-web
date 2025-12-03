/**
 * Statistics Panel Component
 * 
 * Displays key metrics for the Control Station overview.
 * Shows total conversations, open count, pending count, SLA status, etc.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useMemo } from 'react';
import { Box, Typography, Stack, Skeleton, Tooltip, alpha } from '@mui/material';
import { 
  Inbox as InboxIcon,
  PendingActions as PendingIcon,
  CheckCircle as ResolvedIcon,
  Schedule as SnoozedIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  shadowTokens, 
  radiusTokens, 
  semanticSpacing,
} from '@/widgets/frontdesk/design-system';

// Types
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// ============================================
// Types
// ============================================

export interface StatisticsPanelProps {
  conversations: ChatwootConversation[];
  agents: Agent[];
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: number;
  loading?: boolean;
}

// ============================================
// Stat Card Component
// ============================================

const StatCard: React.FC<StatCardProps> = memo(({
  title,
  value,
  icon,
  color,
  bgColor,
  subtitle,
  trend,
  loading,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: 140,
          maxWidth: 200,
          padding: `${semanticSpacing.component.md}px`,
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${radiusTokens.lg}px`,
          boxShadow: shadowTokens.sm,
          border: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Skeleton variant="circular" width={36} height={36} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="80%" height={16} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: '1 1 0',
        minWidth: 140,
        maxWidth: 200,
        padding: `${semanticSpacing.component.md}px`,
        backgroundColor: colorTokens.semantic.background.primary,
        borderRadius: `${radiusTokens.lg}px`,
        boxShadow: shadowTokens.sm,
        border: `1px solid ${colorTokens.neutral[200]}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: shadowTokens.md,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: `${radiusTokens.md}px`,
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          {icon}
        </Box>
        {trend !== undefined && (
          <Tooltip title={`${trend > 0 ? '+' : ''}${trend}% from yesterday`}>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <TrendingUpIcon 
                sx={{ 
                  fontSize: 14, 
                  color: trend >= 0 ? colorTokens.success[500] : colorTokens.error[500],
                  transform: trend < 0 ? 'rotate(180deg)' : 'none',
                }} 
              />
              <Typography
                variant="caption"
                sx={{
                  color: trend >= 0 ? colorTokens.success[600] : colorTokens.error[600],
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Stack>
          </Tooltip>
        )}
      </Stack>
      
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: colorTokens.semantic.text.primary,
          mt: 1.5,
          mb: 0.25,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: colorTokens.semantic.text.secondary,
          fontWeight: 500,
          fontSize: '0.8rem',
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.semantic.text.tertiary,
            fontSize: '0.7rem',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
});

// ============================================
// Main Component
// ============================================

const StatisticsPanelComponent: React.FC<StatisticsPanelProps> = ({
  conversations,
  agents,
  loading,
}) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter(c => c.status === 'open').length;
    const pending = conversations.filter(c => c.status === 'pending').length;
    const snoozed = conversations.filter(c => c.status === 'snoozed').length;
    const resolved = conversations.filter(c => c.status === 'resolved').length;
    const unassigned = conversations.filter(c => !c.meta?.assignee?.id).length;
    
    // Calculate high priority (urgent + high)
    const highPriority = conversations.filter(c => 
      c.priority === 'urgent' || c.priority === 'high'
    ).length;
    
    // Calculate unread (conversations with unread messages)
    const withUnread = conversations.filter(c => (c.unread_count || 0) > 0).length;
    
    // Calculate average response time (placeholder - would need real data)
    const avgResponseTime = 'N/A';
    
    // Active agents (agents with at least one open conversation)
    const activeAgentIds = new Set(
      conversations
        .filter(c => c.status === 'open' && c.meta?.assignee?.id)
        .map(c => c.meta?.assignee?.id)
    );
    const activeAgents = activeAgentIds.size;

    return {
      total,
      open,
      pending,
      snoozed,
      resolved,
      unassigned,
      highPriority,
      withUnread,
      avgResponseTime,
      activeAgents,
      totalAgents: agents.length,
    };
  }, [conversations, agents]);

  return (
    <Box
      sx={{
        padding: `${semanticSpacing.component.md}px ${semanticSpacing.component.lg}px`,
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto',
          paddingBottom: 0.5,
          '&::-webkit-scrollbar': {
            height: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colorTokens.neutral[300],
            borderRadius: 2,
          },
        }}
      >
        {/* Open Conversations */}
        <StatCard
          title="Open"
          value={stats.open}
          icon={<InboxIcon sx={{ fontSize: 20 }} />}
          color={colorTokens.success[600]}
          bgColor={colorTokens.success[50]}
          subtitle={`${stats.withUnread} with unread`}
          loading={loading}
        />

        {/* Pending Conversations */}
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<PendingIcon sx={{ fontSize: 20 }} />}
          color={colorTokens.warning[600]}
          bgColor={colorTokens.warning[50]}
          subtitle="Awaiting response"
          loading={loading}
        />

        {/* Snoozed */}
        <StatCard
          title="Snoozed"
          value={stats.snoozed}
          icon={<SnoozedIcon sx={{ fontSize: 20 }} />}
          color={colorTokens.info[600]}
          bgColor={colorTokens.info[50]}
          subtitle="Temporarily hidden"
          loading={loading}
        />

        {/* Unassigned */}
        <StatCard
          title="Unassigned"
          value={stats.unassigned}
          icon={<WarningIcon sx={{ fontSize: 20 }} />}
          color={stats.unassigned > 0 ? colorTokens.error[600] : colorTokens.neutral[500]}
          bgColor={stats.unassigned > 0 ? colorTokens.error[50] : colorTokens.neutral[100]}
          subtitle="Needs attention"
          loading={loading}
        />

        {/* High Priority */}
        <StatCard
          title="High Priority"
          value={stats.highPriority}
          icon={<SpeedIcon sx={{ fontSize: 20 }} />}
          color={stats.highPriority > 0 ? colorTokens.error[600] : colorTokens.neutral[500]}
          bgColor={stats.highPriority > 0 ? colorTokens.error[50] : colorTokens.neutral[100]}
          subtitle="Urgent + High"
          loading={loading}
        />

        {/* Active Agents */}
        <StatCard
          title="Active Agents"
          value={`${stats.activeAgents}/${stats.totalAgents}`}
          icon={<PeopleIcon sx={{ fontSize: 20 }} />}
          color={colorTokens.primary[600]}
          bgColor={colorTokens.primary[50]}
          subtitle="Handling conversations"
          loading={loading}
        />

        {/* Resolved Today */}
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<ResolvedIcon sx={{ fontSize: 20 }} />}
          color={colorTokens.neutral[600]}
          bgColor={colorTokens.neutral[100]}
          subtitle="Completed"
          loading={loading}
        />
      </Stack>
    </Box>
  );
};

export const StatisticsPanel = memo(StatisticsPanelComponent);

