/**
 * Conversation Teams Filter Component
 *
 * Button with dropdown menu that displays teams and allows filtering conversations by team.
 * Uses the unified list system for consistent UI.
 *
 * @deprecated Use TeamSelect from unified-list directly for new implementations.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useChatwootTeams } from '../../hooks/resources/use-chatwoot-teams';
import { useChatwootPermissions } from '../../hooks/use-chatwoot-permissions';
import { SETTINGS_PERMISSIONS } from '../../constants/permissions.constants';
import { AddEditTeamModal, type AddEditTeamData } from '../settings';
import { chatwootService } from '@/services/frontdesk';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { TeamSelect } from '../unified-list';
import type { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Team } from '@/services/frontdesk/api/chatwoot/types/teams.types';

interface ConversationTeamsFilterProps {
  accountId: number | null;
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onTeamClick?: () => void;
  /** @deprecated No longer used - colors are now from design tokens */
  primaryColor?: (shade: number) => string;
  /** @deprecated No longer used - colors are now from design tokens */
  neutralColor?: (shade: number) => string;
}

export const ConversationTeamsFilter: React.FC<ConversationTeamsFilterProps> = ({
  accountId,
  filters,
  onFiltersChange,
  onTeamClick,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const effectiveAccountId = accountId ?? selectedAccountId;

  const { teams = [], loading: teamsLoading, refresh: refreshTeams } = useChatwootTeams(
    effectiveAccountId ?? undefined,
    !!effectiveAccountId
  );
  const { canAccess } = useChatwootPermissions();

  // Check if user can manage teams (admin only)
  const canManageTeams = canAccess(SETTINGS_PERMISSIONS.teams);

  // Get currently selected team from filters
  const selectedTeamId = filters.team_id;
  const selectedTeam = useMemo(
    () => teams.find((t) => t.id === selectedTeamId) || null,
    [teams, selectedTeamId]
  );

  // Handle team selection
  const handleTeamSelect = useCallback(
    (teamId: number | null, _team: Team | null) => {
      onTeamClick?.();
      onFiltersChange({
        ...filters,
        team_id: teamId ?? undefined,
        page: 1, // Reset to first page when filters change
      });
    },
    [filters, onFiltersChange, onTeamClick]
  );

  // Handle create team
  const handleCreateTeam = async (data: AddEditTeamData) => {
    if (!effectiveAccountId) {
      throw new Error('No account selected');
    }

    setIsCreating(true);
    try {
      // Note: GoMake always disables auto-assignment for teams
      const newTeam = await chatwootService.teams.createTeam(effectiveAccountId, {
        name: data.name,
        description: data.description,
        allow_auto_assign: false,
      });

      // Add members if provided
      if (data.member_ids && data.member_ids.length > 0 && newTeam.id) {
        await chatwootService.teams.addTeamMembers(
          effectiveAccountId,
          newTeam.id,
          data.member_ids
        );
      }

      // Refresh teams list
      await refreshTeams();

      // Auto-select the newly created team
      if (newTeam.id) {
        onFiltersChange({
          ...filters,
          team_id: newTeam.id,
          page: 1,
        });
      }

      setCreateModalOpen(false);
    } catch (error) {
      console.error('[ConversationTeamsFilter] Failed to create team:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Don't render if no teams and user can't create new ones
  if (teams.length === 0 && !canManageTeams) {
    return null;
  }

  return (
    <>
      <TeamSelect
        selectedTeam={selectedTeam}
        teams={teams}
        onSelect={handleTeamSelect}
        loading={teamsLoading}
        variant="filter"
        showAllOption
        allOptionLabel="All Teams"
        canCreate={canManageTeams}
        onCreateClick={() => setCreateModalOpen(true)}
        emptyText={canManageTeams ? 'Create a team to get started' : 'No teams available'}
      />

      {/* Create Team Modal - Admin Only */}
      {canManageTeams && effectiveAccountId && (
        <AddEditTeamModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateTeam}
          isSubmitting={isCreating}
          accountId={effectiveAccountId}
          editingTeam={null}
        />
      )}
    </>
  );
};
