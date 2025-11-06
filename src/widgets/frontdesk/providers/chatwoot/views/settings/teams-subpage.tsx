/**
 * Teams Subpage
 *
 * Full CRUD interface for managing Chatwoot teams, including team members
 * and team-assigned conversations.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  IconButton,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  BaseSettingsSubpage,
  SettingsSection,
  AddEditTeamModal,
  ConfirmDialog,
  type AddEditTeamData,
} from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootTeams } from "../../hooks/resources/use-chatwoot-teams";
import { chatwootService } from "@/services/frontdesk";
import type { Team } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";
import type { Agent } from "@/services/frontdesk/api/chatwoot/services/chatwoot-agents.service";

export const TeamsSubpage: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { teams, loading, error, refresh } = useChatwootTeams(selectedAccountId);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingTeamMembers, setEditingTeamMembers] = useState<Agent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Handle Create Team
  const handleCreateTeam = () => {
    setEditingTeam(null);
    setEditingTeamMembers([]);
    setShowAddEditModal(true);
  };

  // Handle Edit Team
  const handleEditTeam = async (team: Team) => {
    if (!selectedAccountId || !team.id) return;

    try {
      // Fetch current team members
      const members = await chatwootService.teams.getTeamMembers(
        selectedAccountId,
        team.id
      );
      setEditingTeam(team);
      setEditingTeamMembers(members || []);
      setShowAddEditModal(true);
    } catch (error) {
      console.error("Failed to load team members:", error);
      setNotification({
        message: "Failed to load team members. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (data: AddEditTeamData, teamId?: number) => {
    if (!selectedAccountId) return;

    setIsSubmitting(true);
    try {
      if (teamId) {
        // Update existing team
        await chatwootService.teams.updateTeam(selectedAccountId, teamId, {
          name: data.name,
          description: data.description,
          allow_auto_assign: data.allow_auto_assign,
        });

        // Update team members if provided
        if (data.member_ids !== undefined) {
          // Get current members
          const currentMembers = await chatwootService.teams.getTeamMembers(
            selectedAccountId,
            teamId
          );
          const currentMemberIds = currentMembers.map((m) => m.id);

          // Add new members
          const toAdd = data.member_ids.filter(
            (id) => !currentMemberIds.includes(id)
          );
          if (toAdd.length > 0) {
            await chatwootService.teams.addTeamMembers(
              selectedAccountId,
              teamId,
              toAdd
            );
          }

          // Remove members no longer in list
          const toRemove = currentMemberIds.filter(
            (id) => !data.member_ids!.includes(id)
          );
          for (const agentId of toRemove) {
            await chatwootService.teams.removeTeamMember(
              selectedAccountId,
              teamId,
              agentId
            );
          }
        }

        setNotification({
          message: "Team updated successfully",
          severity: "success",
        });
      } else {
        // Create new team
        const newTeam = await chatwootService.teams.createTeam(
          selectedAccountId,
          {
            name: data.name,
            description: data.description,
            allow_auto_assign: data.allow_auto_assign,
          }
        );

        // Add members if provided
        if (data.member_ids && data.member_ids.length > 0 && newTeam.id) {
          await chatwootService.teams.addTeamMembers(
            selectedAccountId,
            newTeam.id,
            data.member_ids
          );
        }

        setNotification({
          message: "Team created successfully",
          severity: "success",
        });
      }

      // Close modal and refresh
      setShowAddEditModal(false);
      setEditingTeam(null);
      setEditingTeamMembers([]);
      await refresh();
    } catch (error: any) {
      console.error("Failed to save team:", error);
      throw new Error(error.message || "Failed to save team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Team
  const handleDeleteTeam = async () => {
    if (!selectedAccountId || !deletingTeam?.id) return;

    setIsDeleting(true);
    try {
      await chatwootService.teams.deleteTeam(selectedAccountId, deletingTeam.id);
      setNotification({
        message: "Team deleted successfully",
        severity: "success",
      });
      setDeletingTeam(null);
      await refresh();
    } catch (error) {
      console.error("Failed to delete team:", error);
      setNotification({
        message: "Failed to delete team. Please try again.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <BaseSettingsSubpage
        title="Teams"
        description="Manage teams and their members"
        isLoading={loading}
        headerActions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh teams">
              <IconButton onClick={refresh} size="small" disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTeam}
              disabled={loading || !selectedAccountId}
              size="small"
            >
              Create Team
            </Button>
          </Box>
        }
      >
        {/* Notifications */}
        {notification && (
          <Alert
            severity={notification.severity}
            onClose={() => setNotification(null)}
            sx={{ mb: 2 }}
          >
            {notification.message}
          </Alert>
        )}

        {/* Error State */}
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || "Failed to load teams"}
          </Alert>
        ) : teams.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              textAlign: "center",
              gap: 2,
            }}
          >
            <GroupsIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
            <Typography variant="h6" color="text.primary" fontWeight={600}>
              No Teams Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Create teams to organize agents and route conversations efficiently.
              Teams help distribute workload and maintain accountability.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTeam}
              sx={{ mt: 2 }}
            >
              Create Your First Team
            </Button>
          </Box>
        ) : (
          /* Teams Table */
          <SettingsSection
            title={`Teams (${teams.length})`}
            description="Organize agents into teams for better collaboration"
          >
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Auto-Assign
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <GroupsIcon color="action" fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {team.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {team.description || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={team.allow_auto_assign ? "Enabled" : "Disabled"}
                          size="small"
                          color={team.allow_auto_assign ? "success" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                          <Tooltip title="Edit team">
                            <IconButton
                              size="small"
                              onClick={() => handleEditTeam(team)}
                              disabled={loading}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete team">
                            <IconButton
                              size="small"
                              onClick={() => setDeletingTeam(team)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SettingsSection>
        )}
      </BaseSettingsSubpage>

      {/* Add/Edit Team Modal */}
      {selectedAccountId && (
        <AddEditTeamModal
          open={showAddEditModal}
          onClose={() => {
            setShowAddEditModal(false);
            setEditingTeam(null);
            setEditingTeamMembers([]);
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          accountId={selectedAccountId}
          editingTeam={editingTeam}
          initialMembers={editingTeamMembers}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingTeam}
        onClose={() => !isDeleting && setDeletingTeam(null)}
        onConfirm={handleDeleteTeam}
        title="Delete Team?"
        message={`Are you sure you want to delete "${deletingTeam?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        requireValue={deletingTeam?.name}
        isLoading={isDeleting}
      />
    </>
  );
};
