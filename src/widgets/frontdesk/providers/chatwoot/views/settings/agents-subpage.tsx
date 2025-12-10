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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
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
        title={t("frontdesk.settings.agents")}
        description={t("frontdesk.settings.agentsDescription")}
        isLoading={loading}
        headerActions={
          <Box sx={{ display: "flex", gap: 0.75, direction: dir }}>
            <IconButton
              onClick={refresh}
              size="small"
              disabled={loading}
              aria-label={t("frontdesk.settings.agentsRefresh")}
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
          </Box>
        }
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "6px", direction: dir }}>
            {error.message || t("frontdesk.settings.agentsFailedToLoad")}
          </Alert>
        ) : agents.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              textAlign: "center",
              gap: 1.5,
              direction: dir,
            }}
          >
            <PeopleIcon sx={{ fontSize: 48, color: "#9ca3af", opacity: 0.6 }} />
            <Typography variant="subtitle1" sx={{ color: "#1f2937", fontWeight: 600, fontSize: "0.938rem" }}>
              {t("frontdesk.settings.agentsEmptyTitle")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 360, fontSize: "0.813rem", lineHeight: 1.5 }}>
              {t("frontdesk.settings.agentsEmptyDescription")}
            </Typography>
          </Box>
        ) : (
          /* Agents List - Compact High-Density Design */
          <SettingsSection
            title={t("frontdesk.settings.agentsSectionTitle", { count: agents.length })}
            description={t("frontdesk.settings.agentsSectionDescription")}
          >
            <List sx={{ width: "100%", bgcolor: "transparent", p: 0, m: 0, direction: dir }}>
              {agents.map((agent, index) => {
                const agentName = agent.name || agent.available_name || t("frontdesk.settings.agentsUnknown");
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
                        py: 1.25, // More compact
                        px: 1.5,
                        borderBottom: index < agents.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                        "&:hover": {
                          bgcolor: "rgba(99, 102, 241, 0.02)", // Subtle purple tint
                        },
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "4px",
                        transition: "background-color 0.15s ease",
                        direction: dir,
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 44 }}>
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={agent.thumbnail}
                            sx={{
                              bgcolor: avatarData.backgroundColor,
                              width: 34, // Smaller avatar
                              height: 34,
                              fontSize: "0.875rem",
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
                                bottom: -1,
                                right: -1,
                                width: 10,
                                height: 10,
                                bgcolor: "#10b981", // Green
                                borderRadius: "50%",
                                border: "2px solid",
                                borderColor: "#ffffff",
                              }}
                            />
                          )}
                        </Box>
                      </ListItemAvatar>

                      <Box sx={{ flex: 1, minWidth: 0, [dir === "rtl" ? "ml" : "mr"]: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, direction: dir }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500, 
                              fontSize: "0.813rem",
                              color: "#1f2937",
                              lineHeight: 1.3,
                            }}
                          >
                            {agentName}
                          </Typography>
                          {agent.confirmed && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, direction: dir }}>
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 12,
                                  color: "#10b981",
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#10b981",
                                  fontSize: "0.688rem",
                                  fontWeight: 500,
                                }}
                              >
                                {t("frontdesk.settings.agentsVerified")}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Edit/Delete actions - Compact buttons */}
                      {(canEditSpecificAgent(agent) || canDeleteSpecificAgent(agent)) && (
                        <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0, [dir === "rtl" ? "ml" : "mr"]: 1.5, direction: dir }}>
                          {canEditSpecificAgent(agent) && (
                            <IconButton
                              onClick={() => handleEdit(agent)}
                              size="small"
                              aria-label={t("frontdesk.settings.agentsEdit", { name: agentName })}
                              sx={{
                                color: "#6b7280",
                                p: 0.5,
                                "&:hover": {
                                  color: "#6366f1", // Purple
                                  bgcolor: "rgba(99, 102, 241, 0.08)",
                                },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                          {canDeleteSpecificAgent(agent) && (
                            <IconButton
                              onClick={() => handleDeleteClick(agent)}
                              size="small"
                              aria-label={t("frontdesk.settings.agentsDelete", { name: agentName })}
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
                          )}
                        </Box>
                      )}

                      <Chip
                        label={
                          agent.role === "administrator" || agent.role === "admin"
                            ? t("frontdesk.settings.agentsRoleAdmin")
                            : t("frontdesk.settings.agentsRoleAgent")
                        }
                        size="small"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          height: 22,
                          flexShrink: 0,
                          backgroundColor: agent.role === "administrator" || agent.role === "admin" 
                            ? "rgba(99, 102, 241, 0.1)" 
                            : "rgba(107, 114, 128, 0.1)",
                          color: agent.role === "administrator" || agent.role === "admin" 
                            ? "#6366f1" 
                            : "#4b5563",
                          border: "none",
                          "& .MuiChip-label": {
                            px: 1,
                          },
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
            direction: dir,
          },
        }}
      >
        <DialogTitle sx={{ direction: dir }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("frontdesk.settings.agentsDeleteTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ direction: dir }}>
          <Typography variant="body2" color="text.secondary">
            {t("frontdesk.settings.agentsDeleteMessage", {
              name: agentToDelete?.name || agentToDelete?.available_name || agentToDelete?.email || ""
            })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, direction: dir }}>
          <Button onClick={handleDeleteCancel} disabled={deleting} sx={{ textTransform: "none" }}>
            {t("frontdesk.common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {deleting ? t("frontdesk.settings.agentsDeleting") : t("frontdesk.settings.agentsDeleteButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
