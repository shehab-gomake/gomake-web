/**
 * Labels Subpage
 *
 * Displays and manages Chatwoot labels for organizing and categorizing
 * conversations with color-coded tags.
 * Matches the Chatwoot labels page design but uses FrontDesk styling (no black background).
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BaseSettingsSubpage } from "../../components/settings";
import { AddEditLabelModal } from "../../components/settings/add-edit-label-modal";
import { useChatwootLabels } from "../../hooks/use-chatwoot-labels";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";

export const LabelsSubpage: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { labels, loading, error, createLabel, updateLabel, deleteLabel, refresh } = useChatwootLabels(selectedAccountId, true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<ChatwootLabel | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleEditClick = (label: ChatwootLabel) => {
    setSelectedLabel(label);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (label: ChatwootLabel) => {
    setSelectedLabel(label);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLabel?.id) return;

    setDeleting(true);
    try {
      await deleteLabel(selectedLabel.id);
      setDeleteDialogOpen(false);
      setSelectedLabel(null);
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateLabel = async (payload: Parameters<typeof createLabel>[0]) => {
    await createLabel(payload);
    setAddModalOpen(false);
  };

  const handleUpdateLabel = async (labelId: number, payload: Parameters<typeof updateLabel>[1]) => {
    await updateLabel(labelId, payload);
    setEditModalOpen(false);
    setSelectedLabel(null);
  };

  const headerActions = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick} disabled={loading || !selectedAccountId}>
      Add label
    </Button>
  );

  return (
    <>
      <BaseSettingsSubpage
        title="Labels"
        description="Labels help you categorize and prioritize conversations and leads. You can assign a label to a conversation or contact using the side panel."
        headerActions={headerActions}
        isLoading={loading && labels.length === 0}
      >
        {/* Learn More Link */}
        <Box sx={{ mb: 3 }}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Open help documentation or modal
            }}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Learn more about labels &gt;
          </Link>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && labels.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem" }}>
              There are no labels available in this account.
            </Typography>
          </Box>
        )}

        {/* Labels Table */}
        {labels.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Show on Sidebar</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labels.map((label) => (
                  <TableRow key={label.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {label.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {label.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "4px",
                            bgcolor: label.color,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {label.color}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {label.show_on_sidebar ? "Yes" : "No"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(label)}
                          disabled={loading}
                          sx={{ color: "text.secondary" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(label)}
                          disabled={loading}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Loading State (when refreshing with existing data) */}
        {loading && labels.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </BaseSettingsSubpage>

      {/* Add Label Modal */}
      <AddEditLabelModal
        open={addModalOpen}
        label={null}
        onClose={() => setAddModalOpen(false)}
        onCreate={handleCreateLabel}
        onUpdate={handleUpdateLabel}
        loading={loading}
      />

      {/* Edit Label Modal */}
      <AddEditLabelModal
        open={editModalOpen}
        label={selectedLabel}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedLabel(null);
        }}
        onCreate={handleCreateLabel}
        onUpdate={handleUpdateLabel}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Label</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the label &quot;{selectedLabel?.title}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
