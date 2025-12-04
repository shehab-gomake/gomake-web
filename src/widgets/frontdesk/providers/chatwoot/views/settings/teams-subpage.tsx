/**
 * Teams Subpage
 *
 * Full CRUD interface for managing Chatwoot teams, including team members
 * and team-assigned conversations.
 *
 * RBAC: Only administrators can access this page.
 */

import React, { useState, useEffect } from "react";
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
  Tooltip,
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
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { SETTINGS_PERMISSIONS } from "../../constants/permissions.constants";
import { useChatwootTeams } from "../../hooks/resources/use-chatwoot-teams";
import { chatwootService } from "@/services/frontdesk";
import type { Team } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";
import type { Agent } from "@/services/frontdesk/api/chatwoot/services/chatwoot-agents.service";

export const TeamsSubpage: React.FC = () => {
  const { selectedAccountId, router: chatwootRouter } = useChatwootProvider();
  const { teams, loading, error, refresh } = useChatwootTeams(selectedAccountId);

  // Defense-in-depth: Check if user has permission to access Teams settings
  const { canAccess } = useChatwootPermissions();
  const canAccessTeams = canAccess(SETTINGS_PERMISSIONS.teams);

  // Redirect unauthorized users to My Inbox
  useEffect(() => {
    if (!canAccessTeams) {
      console.warn("[TeamsSubpage] Unauthorized access attempt - redirecting to My Inbox");
      chatwootRouter.navigateToMyInbox();
    }
  }, [canAccessTeams, chatwootRouter]);

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
      const members = await chatwootService.teams.getTeamMembers(selectedAccountId, team.id);
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
        // Note: GoMake always disables auto-assignment for teams
        await chatwootService.teams.updateTeam(selectedAccountId, teamId, {
          name: data.name,
          description: data.description,
          allow_auto_assign: false,
        });

        // Update team members if provided
        if (data.member_ids !== undefined) {
          // Get current members
          const currentMembers = await chatwootService.teams.getTeamMembers(selectedAccountId, teamId);
          const currentMemberIds = currentMembers.map((m) => m.id);

          // Add new members
          const toAdd = data.member_ids.filter((id) => !currentMemberIds.includes(id));
          if (toAdd.length > 0) {
            await chatwootService.teams.addTeamMembers(selectedAccountId, teamId, toAdd);
          }

          // Remove members no longer in list
          const toRemove = currentMemberIds.filter((id) => !data.member_ids!.includes(id));
          for (const agentId of toRemove) {
            await chatwootService.teams.removeTeamMember(selectedAccountId, teamId, agentId);
          }
        }

        setNotification({
          message: "Team updated successfully",
          severity: "success",
        });
      } else {
        // Create new team
        // Note: GoMake always disables auto-assignment for teams
        const newTeam = await chatwootService.teams.createTeam(selectedAccountId, {
          name: data.name,
          description: data.description,
          allow_auto_assign: false,
        });

        // Add members if provided
        if (data.member_ids && data.member_ids.length > 0 && newTeam.id) {
          await chatwootService.teams.addTeamMembers(selectedAccountId, newTeam.id, data.member_ids);
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
          <Box sx={{ display: "flex", gap: 0.75 }}>
            <Tooltip title="Refresh teams">
              <IconButton
                onClick={refresh}
                size="small"
                disabled={loading}
                sx={{
                  color: "#6b7280",
                  p: 0.75,
                  "&:hover": {
                    color: "#6366f1",
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                  },
                }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={handleCreateTeam}
              disabled={loading || !selectedAccountId}
              size="small"
              sx={{
                fontSize: "0.813rem",
                fontWeight: 500,
                textTransform: "none",
                px: 1.5,
                py: 0.5,
                height: 30,
                backgroundColor: "#6366f1",
                "&:hover": {
                  backgroundColor: "#4f46e5",
                },
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Create Team
            </Button>
          </Box>
        }
      >
        {/* Notifications */}
        {notification && (
          <Alert severity={notification.severity} onClose={() => setNotification(null)} sx={{ mb: 2, borderRadius: "6px" }}>
            {notification.message}
          </Alert>
        )}

        {/* Error State */}
        {error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "6px" }}>
            {error.message || "Failed to load teams"}
          </Alert>
        ) : teams.length === 0 ? (
          /* Empty State - Compact */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              textAlign: "center",
              gap: 1.5,
            }}
          >
            <GroupsIcon sx={{ fontSize: 48, color: "#9ca3af", opacity: 0.6 }} />
            <Typography variant="subtitle1" sx={{ color: "#1f2937", fontWeight: 600, fontSize: "0.938rem" }}>
              No Teams Found
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 360, fontSize: "0.813rem", lineHeight: 1.5 }}>
              Create teams to organize agents and route conversations efficiently. Teams help distribute workload and maintain
              accountability.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTeam}
              sx={{
                mt: 2,
                fontSize: "0.813rem",
                fontWeight: 500,
                textTransform: "none",
                px: 2,
                py: 0.75,
                backgroundColor: "#6366f1",
                "&:hover": {
                  backgroundColor: "#4f46e5",
                },
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Create Your First Team
            </Button>
          </Box>
        ) : (
          /* Teams Table - Compact High-Density Design */
          <SettingsSection title={`Teams (${teams.length})`} description="Organize agents into teams for better collaboration">
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "6px",
                boxShadow: "none",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#4b5563",
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#4b5563",
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#4b5563",
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                      align="right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow
                      key={team.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.02)",
                        },
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.25, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <GroupsIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.813rem", color: "#1f2937" }}>
                            {team.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.25, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            fontSize: "0.813rem",
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {team.description || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.25, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                          <Tooltip title="Edit team">
                            <IconButton
                              size="small"
                              onClick={() => handleEditTeam(team)}
                              disabled={loading}
                              sx={{
                                color: "#6b7280",
                                p: 0.5,
                                "&:hover": {
                                  color: "#6366f1",
                                  bgcolor: "rgba(99, 102, 241, 0.08)",
                                },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete team">
                            <IconButton
                              size="small"
                              onClick={() => setDeletingTeam(team)}
                              disabled={loading}
                              sx={{
                                color: "#6b7280",
                                p: 0.5,
                                "&:hover": {
                                  color: "#ef4444",
                                  bgcolor: "rgba(239, 68, 68, 0.08)",
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
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
