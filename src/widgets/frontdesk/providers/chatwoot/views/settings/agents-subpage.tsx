/**
 * Agents Subpage
 *
 * Displays and manages Chatwoot agents including their roles,
 * availability, and assigned conversations.
 */

import React, { useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import { BaseSettingsSubpage, SettingsSection, EditAgentModal, AddAgentModal, type AddAgentData } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootAgents } from "../../hooks/resources/use-chatwoot-agents";
import type { Agent, AgentUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { generateAvatarData } from "@/widgets/frontdesk/utils/avatar.utils";
import { chatwootService } from "@/services/frontdesk";

export const AgentsSubpage: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { agents, loading, error, refresh } = useChatwootAgents(selectedAccountId);

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Add agent handler
  const handleAddAgent = async (data: AddAgentData) => {
    if (!selectedAccountId) return;

    try {
      // TODO: Implement createAgent API call
      // await chatwootService.agents.createAgent(selectedAccountId, data);
      console.log("Add agent:", data);
      alert("Add Agent API endpoint not yet implemented in backend");
      await refresh();
      setAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add agent:", error);
      throw error;
    }
  };

  // Open edit modal
  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  // Save agent updates
  const handleSave = async (agentId: number, updates: AgentUpdatePayload) => {
    if (!selectedAccountId) return;

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
    if (!selectedAccountId || !agentToDelete?.id) return;

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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              size="small"
            >
              Add Agent
            </Button>
            <IconButton onClick={refresh} size="small" disabled={loading}>
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
                          mr: 2,
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                          onClick={() => handleEdit(agent)}
                          size="small"
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(agent)}
                          size="small"
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "error.main",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </SettingsSection>
        )}
      </BaseSettingsSubpage>

      {/* Add Agent Modal */}
      <AddAgentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddAgent}
      />

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
