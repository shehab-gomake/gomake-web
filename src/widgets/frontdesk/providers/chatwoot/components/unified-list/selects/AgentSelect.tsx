/**
 * AgentSelect Component
 *
 * Complete agent selection component with trigger and dropdown.
 * Uses unified triggers for consistent styling across variants.
 *
 * @module unified-list/selects/AgentSelect
 */

import React, { useState, useCallback, useMemo } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { UnifiedListDropdown } from '../UnifiedListDropdown';
import { AgentListItemRenderer } from '../list-items';
import { FilterIconButton, AssignmentTrigger } from '../triggers';
import type { AgentListItem, ActionItem } from '../types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// =============================================================================
// TYPES
// =============================================================================

export interface AgentSelectProps {
  /** Current selected agent */
  selectedAgent: Agent | null;
  /** Available agents */
  agents: Agent[];
  /** Selection handler */
  onSelect: (agentId: number | null, agent: Agent | null) => void;
  /** Current user ID (for self-assign) */
  currentUserId?: number;
  /** Whether agents are loading */
  loading?: boolean;
  /** Whether selection is in progress */
  updating?: boolean;
  /** Trigger variant */
  variant?: 'inline' | 'filter';
  /** Label text (for inline variant) */
  label?: string;
  /** Empty state text */
  emptyText?: string;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

const agentToListItem = (agent: Agent, currentUserId?: number): AgentListItem => ({
  type: 'agent',
  id: agent.id!,
  label: agent.name || agent.available_name || agent.email || `Agent ${agent.id}`,
  email: agent.email,
  role: agent.role,
  avatarUrl: agent.thumbnail,
  availability: agent.availability_status as AgentListItem['availability'],
  isCurrentUser: agent.id === currentUserId,
});

const getInitials = (name?: string): string => {
  if (!name) return '??';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];
  return colors[Math.abs(hash) % colors.length];
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AgentSelect: React.FC<AgentSelectProps> = ({
  selectedAgent,
  agents,
  onSelect,
  currentUserId,
  loading = false,
  updating = false,
  variant = 'inline',
  label = 'Assigned To',
  emptyText = 'No agents available',
  placeholder = 'Assign to someone',
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Convert agents to list items
  const agentItems = useMemo(
    () => agents.map((agent) => agentToListItem(agent, currentUserId)),
    [agents, currentUserId]
  );

  // Check if current user can self-assign
  const canSelfAssign = useMemo(() => {
    if (!currentUserId || selectedAgent?.id === currentUserId) return false;
    return agents.some((agent) => agent.id === currentUserId);
  }, [currentUserId, selectedAgent, agents]);

  // Header actions (Self Assign)
  const headerActions = useMemo<ActionItem[]>(() => {
    if (!canSelfAssign) return [];
    return [
      {
        type: 'action',
        id: 'self-assign',
        label: 'Self Assign',
        icon: <PersonAddIcon sx={{ fontSize: 18 }} />,
        variant: 'primary',
        onClick: () => {
          const currentUser = agents.find((a) => a.id === currentUserId);
          if (currentUser) {
            onSelect(currentUserId!, currentUser);
          }
        },
      },
    ];
  }, [canSelfAssign, agents, currentUserId, onSelect]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !updating) {
      setAnchorEl(event.currentTarget);
    }
  }, [disabled, updating]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelect = useCallback(
    (id: string | number | null) => {
      if (id === null) {
        onSelect(null, null);
      } else {
        const agent = agents.find((a) => a.id === id);
        onSelect(Number(id), agent || null);
      }
      handleClose();
    },
    [agents, onSelect, handleClose]
  );

  const renderItem = useCallback(
    (item: AgentListItem, isSelected: boolean, onClick: () => void) => (
      <AgentListItemRenderer
        item={item}
        isSelected={isSelected}
        onClick={onClick}
        showAvailability
        highlightCurrentUser
      />
    ),
    []
  );

  // Agent display info
  const agentName = selectedAgent?.name || selectedAgent?.available_name || 'Agent';
  const agentInitials = getInitials(agentName);
  const avatarColor = selectedAgent ? stringToColor(agentName) : undefined;
  const hasSelection = !!selectedAgent;

  return (
    <>
      {/* Filter Trigger */}
      {variant === 'filter' && (
        <FilterIconButton
          icon={<PersonIcon />}
          tooltip={selectedAgent ? `Assigned to: ${agentName}` : placeholder}
          isActive={hasSelection}
          badgeCount={hasSelection ? 1 : 0}
          onClick={handleOpen}
          disabled={disabled || updating}
        />
      )}

      {/* Inline Assignment Trigger */}
      {variant === 'inline' && (
        <AssignmentTrigger
          type="agent"
          label={label}
          valueName={agentName}
          avatarUrl={selectedAgent?.thumbnail}
          avatarInitials={agentInitials}
          avatarColor={avatarColor}
          hasValue={hasSelection}
          placeholder={placeholder}
          onClick={handleOpen}
          loading={updating}
          disabled={disabled}
        />
      )}

      {/* Dropdown */}
      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={agentItems}
        selectionMode="single"
        selectedValue={selectedAgent?.id ?? null}
        onSelect={handleSelect}
        renderItem={renderItem}
        showNoneOption={!!selectedAgent}
        noneOptionLabel="Unassign"
        headerActions={headerActions}
        headerText="Assign Agent"
        loading={loading}
        emptyMessage={emptyText}
        searchable={agents.length > 5}
        searchPlaceholder="Search agents..."
      />
    </>
  );
};

export default AgentSelect;
