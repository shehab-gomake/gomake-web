/**
 * Labels Subpage
 *
 * Displays and manages Chatwoot labels for organizing and categorizing
 * conversations with color-coded tags.
 * Matches the Chatwoot labels page design but uses FrontDesk styling (no black background).
 *
 * RBAC: Only administrators can access this page.
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { SETTINGS_PERMISSIONS } from "../../constants/permissions.constants";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";

export const LabelsSubpage: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { selectedAccountId, router: chatwootRouter } = useChatwootProvider();
  const {
    labels,
    loading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    refresh,
  } = useChatwootLabels(selectedAccountId, true);

  // Defense-in-depth: Check if user has permission to access Labels settings
  const { canAccess } = useChatwootPermissions();
  const canAccessLabels = canAccess(SETTINGS_PERMISSIONS.labels);

  // Redirect unauthorized users to My Inbox
  useEffect(() => {
    if (!canAccessLabels) {
      console.warn(
        "[LabelsSubpage] Unauthorized access attempt - redirecting to My Inbox"
      );
      chatwootRouter.navigateToMyInbox();
    }
  }, [canAccessLabels, chatwootRouter]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<ChatwootLabel | null>(
    null
  );
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

  const handleCreateLabel = async (
    payload: Parameters<typeof createLabel>[0]
  ) => {
    await createLabel(payload);
    setAddModalOpen(false);
  };

  const handleUpdateLabel = async (
    labelId: number,
    payload: Parameters<typeof updateLabel>[1]
  ) => {
    await updateLabel(labelId, payload);
    setEditModalOpen(false);
    setSelectedLabel(null);
  };

  const headerActions = (
    <Button
      variant="contained"
      startIcon={<AddIcon sx={{ fontSize: 16 }} />}
      onClick={handleAddClick}
      disabled={loading || !selectedAccountId}
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
        direction: dir,
      }}
    >
      {t("frontdesk.settings.labelsAddLabel")}
    </Button>
  );

  return (
    <>
      <BaseSettingsSubpage
        title={t("frontdesk.settings.labels")}
        description={t("frontdesk.settings.labelsDescription")}
        headerActions={headerActions}
        isLoading={loading && labels.length === 0}
      >
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "6px", direction: dir }}
          >
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
              minHeight: 260,
              textAlign: "center",
              direction: dir,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.875rem" }}
            >
              {t("frontdesk.settings.labelsEmptyMessage")}
            </Typography>
          </Box>
        )}

        {/* Labels Table - Compact High-Density Design */}
        {labels.length > 0 && (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "6px",
              boxShadow: "none",
              direction: dir,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell
                    align={dir === "rtl" ? "right" : "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      py: 1.25,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      direction: dir,
                    }}
                  >
                    {t("frontdesk.settings.labelsTableName")}
                  </TableCell>
                  <TableCell
                    align={dir === "rtl" ? "right" : "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      py: 1.25,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      direction: dir,
                    }}
                  >
                    {t("frontdesk.settings.labelsTableDescription")}
                  </TableCell>
                  <TableCell
                    align={dir === "rtl" ? "right" : "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      py: 1.25,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      direction: dir,
                    }}
                  >
                    {t("frontdesk.settings.labelsTableColor")}
                  </TableCell>
                  <TableCell
                    align={dir === "rtl" ? "right" : "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      py: 1.25,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      direction: dir,
                    }}
                  >
                    {t("frontdesk.settings.labelsTableShowOnSidebar")}
                  </TableCell>
                  <TableCell
                    align={dir === "rtl" ? "left" : "right"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#4b5563",
                      py: 1.25,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      direction: dir,
                    }}
                  >
                    {t("frontdesk.settings.labelsTableActions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labels.map((label) => (
                  <TableRow
                    key={label.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.02)",
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell
                      align={dir === "rtl" ? "right" : "left"}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        direction: dir,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.813rem",
                          color: "#1f2937",
                          direction: dir,
                        }}
                      >
                        {label.title}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align={dir === "rtl" ? "right" : "left"}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        direction: dir,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.813rem",
                          direction: dir,
                        }}
                      >
                        {label.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align={dir === "rtl" ? "right" : "left"}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        direction: dir,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          direction: dir,
                        }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "3px",
                            bgcolor: label.color,
                            border: "1px solid rgba(0,0,0,0.1)",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6b7280",
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            direction: dir,
                          }}
                        >
                          {label.color}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align={dir === "rtl" ? "right" : "left"}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        direction: dir,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.813rem",
                          direction: dir,
                        }}
                      >
                        {label.show_on_sidebar
                          ? t("frontdesk.settings.labelsYes")
                          : t("frontdesk.settings.labelsNo")}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align={dir === "rtl" ? "left" : "right"}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        direction: dir,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.25,
                          justifyContent:
                            dir === "rtl" ? "flex-start" : "flex-end",
                          direction: dir,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(label)}
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
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(label)}
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
            <CircularProgress size={20} sx={{ color: "#6366f1" }} />
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            direction: dir,
          },
        }}
      >
        <DialogTitle sx={{ direction: dir }}>
          {t("frontdesk.settings.labelsDeleteTitle")}
        </DialogTitle>
        <DialogContent sx={{ direction: dir }}>
          <DialogContentText>
            {t("frontdesk.settings.labelsDeleteMessage", {
              title: selectedLabel?.title || "",
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ direction: dir }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            {t("frontdesk.common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            {deleting
              ? t("frontdesk.settings.labelsDeleting")
              : t("frontdesk.settings.labelsDeleteButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
