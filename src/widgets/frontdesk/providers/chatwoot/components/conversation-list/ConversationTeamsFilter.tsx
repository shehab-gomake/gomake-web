/**
 * Conversation Teams Filter Component
 *
 * Button with dropdown menu that displays teams and allows filtering conversations by team.
 * Selected team is shown in ActiveFilterChips below the tabs.
 * Allows creating new teams if user is admin (similar to labels).
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { useChatwootTeams } from '../../hooks/resources/use-chatwoot-teams';
import { useChatwootPermissions } from '../../hooks/use-chatwoot-permissions';
import { SETTINGS_PERMISSIONS } from '../../constants/permissions.constants';
import { AddEditTeamModal, type AddEditTeamData } from '../settings';
import { chatwootService } from '@/services/frontdesk';
import { useRecoilValue } from 'recoil';
import { chatwootSelectedAccountAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import type { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Team } from '@/services/frontdesk/api/chatwoot/types/teams.types';

interface ConversationTeamsFilterProps {
  accountId: number | null;
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onTeamClick?: () => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

export const ConversationTeamsFilter: React.FC<ConversationTeamsFilterProps> = ({
  accountId,
  filters,
  onFiltersChange,
  onTeamClick,
  primaryColor,
  neutralColor,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
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
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  // Toggle team selection
  const handleTeamToggle = (teamId: number | undefined) => {
    // Update filters
    onFiltersChange({
      ...filters,
      team_id: teamId,
      page: 1, // Reset to first page when filters change
    });

    // Don't close menu - allow user to see selection
  };

  // Handle create team
  const handleCreateTeam = async (data: AddEditTeamData) => {
    if (!effectiveAccountId) {
      throw new Error('No account selected');
    }

    setIsCreating(true);
    try {
      const newTeam = await chatwootService.teams.createTeam(effectiveAccountId, {
        name: data.name,
        description: data.description,
        allow_auto_assign: data.allow_auto_assign,
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
      {/* Teams Button */}
      <Tooltip title={selectedTeam ? `Team: ${selectedTeam.name}` : 'Filter by Team'}>
        <IconButton
          size="small"
          onClick={(e) => {
            setMenuAnchor(e.currentTarget);
            onTeamClick?.();
          }}
          sx={{
            color: selectedTeam ? primaryColor(600) : neutralColor(600),
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: selectedTeam ? primaryColor(700) : neutralColor(900),
            },
            width: 28,
            height: 28,
            padding: 0.5,
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Badge
            badgeContent={selectedTeam ? 1 : 0}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 14,
                minWidth: 14,
                backgroundColor: primaryColor(600),
              },
            }}
          >
            <GroupsIcon sx={{ fontSize: 16 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Teams Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 260,
            maxWidth: 320,
            backgroundColor: neutralColor(0),
            border: `1px solid ${neutralColor(200)}`,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            maxHeight: 320,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(500),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Filter by Team
          </Typography>
        </Box>

        {/* Scrollable Teams List */}
        <Box sx={{ overflowY: "auto", maxHeight: 240, flex: 1 }}>
          {/* All Teams Option */}
          <MenuItem
            onClick={() => {
              handleTeamToggle(undefined);
              setMenuAnchor(null);
            }}
            sx={{
              px: 2,
              py: 1,
              backgroundColor: !selectedTeamId ? `${primaryColor(600)}08` : 'transparent',
              '&:hover': {
                backgroundColor: !selectedTeamId ? `${primaryColor(600)}15` : neutralColor(50),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <GroupsIcon
                sx={{
                  fontSize: 18,
                  color: !selectedTeamId ? primaryColor(600) : neutralColor(400),
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="All Teams"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: !selectedTeamId ? 600 : 400,
                color: neutralColor(900),
              }}
            />
            {!selectedTeamId && (
              <CheckIcon
                sx={{
                  fontSize: 18,
                  color: primaryColor(600),
                  ml: 1,
                }}
              />
            )}
          </MenuItem>

          {/* Team Items */}
          {teamsLoading ? (
            <MenuItem disabled>
              <Typography variant="caption" sx={{ color: neutralColor(500), fontSize: '0.75rem' }}>
                Loading teams...
              </Typography>
            </MenuItem>
          ) : teams.length > 0 ? (
            teams.map((team) => {
              const isSelected = selectedTeamId === team.id;

              return (
                <MenuItem
                  key={team.id}
                  onClick={() => handleTeamToggle(team.id)}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: isSelected ? `${primaryColor(600)}08` : 'transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? `${primaryColor(600)}15` : neutralColor(50),
                    },
                  }}
                >
                  {/* Team Icon */}
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <GroupsIcon
                      sx={{
                        fontSize: 18,
                        color: isSelected ? primaryColor(600) : neutralColor(400),
                      }}
                    />
                  </ListItemIcon>

                  {/* Team Name */}
                  <ListItemText
                    primary={team.name || "Unknown Team"}
                    secondary={team.description}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 400,
                      color: neutralColor(900),
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      color: neutralColor(600),
                      noWrap: true,
                    }}
                  />

                  {/* Selected Indicator */}
                  {isSelected && (
                    <CheckIcon
                      sx={{
                        fontSize: 18,
                        color: primaryColor(600),
                        ml: 1,
                      }}
                    />
                  )}
                </MenuItem>
              );
            })
          ) : (
            /* Empty State - No Teams */
            <Box
              sx={{
                px: 3,
                py: 3,
                textAlign: 'center',
              }}
            >
              <GroupsIcon
                sx={{
                  fontSize: 48,
                  color: neutralColor(300),
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: neutralColor(600),
                  fontSize: '0.875rem',
                  mb: 0.5,
                }}
              >
                No teams available
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: neutralColor(500),
                  fontSize: '0.75rem',
                }}
              >
                {canManageTeams
                  ? 'Create a team to get started'
                  : 'Ask an admin to create teams'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Clear Selection Option */}
        {selectedTeamId && (
          <>
            <Divider sx={{ my: 1, flexShrink: 0 }} />
            <Box sx={{ flexShrink: 0 }}>
              <MenuItem
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    team_id: undefined,
                    page: 1,
                  });
                  setMenuAnchor(null);
                }}
                sx={{
                  px: 2,
                  py: 1.5,
                  color: primaryColor(600),
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  justifyContent: "center",
                }}
              >
                Clear Team Filter
              </MenuItem>
            </Box>
          </>
        )}

        {/* Add Team Option - Admin Only */}
        {canManageTeams && (
          <>
            <Divider sx={{ my: 1, flexShrink: 0 }} />
            <Box sx={{ flexShrink: 0 }}>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  setCreateModalOpen(true);
                }}
                sx={{
                  px: 2,
                  py: 1.5,
                  color: primaryColor(600),
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  '&:hover': {
                    backgroundColor: primaryColor(50),
                  },
                }}
              >
                <AddIcon fontSize="small" />
                Add New Team
              </MenuItem>
            </Box>
          </>
        )}
      </Menu>

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

