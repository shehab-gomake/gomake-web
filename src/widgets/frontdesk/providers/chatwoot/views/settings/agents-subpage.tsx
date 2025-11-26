/**
 * Agents Subpage
 *
 * Displays and manages Chatwoot agents including their roles,
 * availability, and assigned conversations.
 *
 * RBAC: Only administrators can add, edit, or delete agents.
 * Business Logic: Can't edit/delete self, can't delete last verified admin.
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { BaseSettingsSubpage, SettingsSection, EditAgentModal } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { useChatwootAgents } from "../../hooks/resources/use-chatwoot-agents";
import type { Agent, AgentUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { generateAvatarData } from "@/widgets/frontdesk/utils/avatar.utils";
import { chatwootService } from "@/services/frontdesk";
import { ACTION_PERMISSIONS } from "../../constants/permissions.constants";

export const AgentsSubpage: React.FC = () => {
  const { selectedAccountId, profile } = useChatwootProvider();
  const { agents, loading, error, refresh } = useChatwootAgents(selectedAccountId);

  // Get permission checking functions
  const { canPerformAction } = useChatwootPermissions();

  // Check specific action permissions (RBAC only)
  const canEditAgent = canPerformAction(ACTION_PERMISSIONS.editAgent);
  const canDeleteAgent = canPerformAction(ACTION_PERMISSIONS.deleteAgent);

  // Get current user ID for business logic checks
  const currentUserId = profile?.id;

  // Count verified administrators (business logic requirement)
  // Following Chatwoot's pattern: can't delete the last verified administrator
  const verifiedAdministrators = useMemo(() => {
    return agents.filter(
      (agent) =>
        (agent.role === 'administrator' || agent.role === 'admin') &&
        agent.confirmed
    );
  }, [agents]);

  /**
   * Check if a specific agent can be edited
   * Business Rule: Users cannot edit themselves
   *
   * @see /Users/omarsabbah/Desktop/messaging/chatwoot/.../agents/Index.vue (showEditAction)
   */
  const canEditSpecificAgent = (agent: Agent): boolean => {
    if (!canEditAgent) return false;
    // Can't edit yourself
    return currentUserId !== agent.id;
  };

  /**
   * Check if a specific agent can be deleted
   * Business Rules:
   * 1. Users cannot delete themselves
   * 2. Cannot delete the last verified administrator
   * 3. Can always delete unconfirmed agents
   *
   * @see /Users/omarsabbah/Desktop/messaging/chatwoot/.../agents/Index.vue (showDeleteAction)
   */
  const canDeleteSpecificAgent = (agent: Agent): boolean => {
    if (!canDeleteAgent) return false;

    // Can't delete yourself
    if (currentUserId === agent.id) return false;

    // Can always delete unconfirmed agents
    if (!agent.confirmed) return true;

    // Can't delete the last verified administrator
    if (agent.role === 'administrator' || agent.role === 'admin') {
      return verifiedAdministrators.length > 1;
    }

    return true;
  };

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Open edit modal
  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  // Save agent updates
  const handleSave = async (agentId: number, updates: AgentUpdatePayload) => {
    if (!selectedAccountId) return;

    // Defense-in-depth: Re-check permissions before API call
    if (!canEditAgent) {
      console.error('[AgentsSubpage] Permission denied: Cannot edit agent');
      throw new Error('You do not have permission to edit agents');
    }

    try {
      await chatwootService.agents.updateAgent(selectedAccountId, agentId, updates);
      await refresh(); // Refresh the agent list
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update agent:", error);
      throw error; // Re-throw so modal can handle error display
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  // Confirm and execute delete
  const handleDeleteConfirm = async () => {
    // Prevent duplicate API calls if already deleting
    if (!selectedAccountId || !agentToDelete?.id || deleting) return;

    // Defense-in-depth: Re-check permissions before API call
    if (!canDeleteAgent) {
      console.error('[AgentsSubpage] Permission denied: Cannot delete agent');
      alert('You do not have permission to delete agents');
      return;
    }

    setDeleting(true);
    try {
      await chatwootService.agents.deleteAgent(selectedAccountId, agentToDelete.id);
      await refresh(); // Refresh the agent list
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete agent:", error);
      alert(error.message || "Failed to delete agent");
    } finally {
      setDeleting(false);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  return (
    <>
      <BaseSettingsSubpage
        title="Agents"
        description="Manage team members, roles, and permissions"
        isLoading={loading}
        headerActions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={refresh}
              size="small"
              disabled={loading}
              aria-label="Refresh agents list"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        }
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || "Failed to load agents"}
          </Alert>
        ) : agents.length === 0 ? (
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
            <PeopleIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
            <Typography variant="h6" color="text.primary" fontWeight={600}>
              No Agents Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Start by inviting team members to join your account. Agents can handle
              conversations, manage inboxes, and collaborate with teams.
            </Typography>
          </Box>
        ) : (
          /* Agents List */
          <SettingsSection
            title={`Agents (${agents.length})`}
            description="Team members with access to this account"
          >
            <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
              {agents.map((agent, index) => {
                const agentName = agent.name || agent.available_name || "Unknown Agent";
                const avatarData = generateAvatarData({
                  name: agent.name || agent.available_name,
                  email: agent.email,
                  displayName: agent.available_name,
                });

                const isOnline = agent.availability_status === "online" || agent.availability_status === "available";

                return (
                  <React.Fragment key={agent.id || index}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        borderBottom: index < agents.length - 1 ? "1px solid" : "none",
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ListItemAvatar>
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={agent.thumbnail}
                            sx={{
                              bgcolor: avatarData.backgroundColor,
                              width: 40,
                              height: 40,
                              fontSize: "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {avatarData.initials}
                          </Avatar>
                          {/* Online indicator */}
                          {isOnline && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                width: 14,
                                height: 14,
                                bgcolor: "success.main",
                                borderRadius: "50%",
                                border: "2.5px solid",
                                borderColor: "background.paper",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          )}
                        </Box>
                      </ListItemAvatar>

                      <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {agentName}
                          </Typography>
                          {agent.confirmed && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 14,
                                  color: "success.main",
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "success.main",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Verified
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Edit/Delete actions - Only visible based on RBAC + business logic */}
                      {(canEditSpecificAgent(agent) || canDeleteSpecificAgent(agent)) && (
                        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0, mr: 2 }}>
                          {canEditSpecificAgent(agent) && (
                            <IconButton
                              onClick={() => handleEdit(agent)}
                              size="small"
                              aria-label={`Edit agent ${agentName}`}
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {canDeleteSpecificAgent(agent) && (
                            <IconButton
                              onClick={() => handleDeleteClick(agent)}
                              size="small"
                              aria-label={`Delete agent ${agentName}`}
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  color: "error.main",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      )}

                      <Chip
                        label={
                          agent.role === "administrator" || agent.role === "admin"
                            ? "Administrator"
                            : "Agent"
                        }
                        size="small"
                        sx={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          height: 24,
                          flexShrink: 0,
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </SettingsSection>
        )}
      </BaseSettingsSubpage>

      {/* Edit Agent Modal */}
      <EditAgentModal
        open={editModalOpen}
        agent={selectedAgent}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedAgent(null);
        }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Agent
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>
              {agentToDelete?.name || agentToDelete?.available_name || agentToDelete?.email}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} disabled={deleting} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
