import { useState, useEffect, useCallback, useRef } from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { Box, Stack, Typography, CircularProgress, Paper, Button, TextField } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { getGraphicsApprovalByBoardMissionIdApi, updateGraphicsApprovalFileApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { GraphicsApprovalUploadModal } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/graphics-approval-upload-modal";
import { NoteInput } from "./note-input-component";

interface GraphicsApprovalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  description: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  note: string;
  approvedDate?: string;
  rejectedDate?: string;
}

interface GraphicsApproval {
  id: string;
  boardMissionId: string;
  contactEmail: string;
  createdDate: string;
  sentDate?: string;
  jobNumber?: string;
  orderNumber?: string;
  clientLang?: string;
  files: GraphicsApprovalFile[];
}

interface GraphicsApprovalViewModalProps {
  open: boolean;
  onClose: () => void;
  boardMissionId: string;
  orderItemId?: string;
  orderId?: string;
  productType?: string;
  onStatusUpdate?: () => void;
}

const GraphicsApprovalViewModal = ({
  open,
  onClose,
  boardMissionId,
  orderItemId,
  orderId,
  productType,
  onStatusUpdate,
}: GraphicsApprovalViewModalProps) => {
  const { callApi } = useGomakeAxios();
  const containerRef = useRef<HTMLDivElement>(null);
  const { successColor, errorColor, neutralColor } = useGomakeTheme();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approval, setApproval] = useState<GraphicsApproval | null>(null);
  const [fileNotes, setFileNotes] = useState<Record<string, string>>({});
  const [updatingFiles, setUpdatingFiles] = useState<Set<string>>(new Set());
  const [updatingNotes, setUpdatingNotes] = useState<Set<string>>(new Set());
  const [editingFiles, setEditingFiles] = useState<Set<string>>(new Set());
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Load graphics approval data
  const loadGraphicsApproval = useCallback(async () => {
    if (!boardMissionId) {
      setError(t("graphicsApproval.missingParameter") || "Missing board mission ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const callBack = (res: any) => {
      setIsLoading(false);
      if (res?.success && res?.data) {
        const data = res.data.data || res.data;
        setApproval(data);
        // Initialize notes from existing file notes
        const notes: Record<string, string> = {};
        data.files?.forEach((file: GraphicsApprovalFile) => {
          if (file.note) {
            notes[file.id] = file.note;
          }
        });
        setFileNotes(notes);
      } else {
        setError(res?.message || t("graphicsApproval.loadFailed") || "Failed to load graphics approval");
      }
    };

    await getGraphicsApprovalByBoardMissionIdApi(callApi, callBack, { boardMissionId });
  }, [boardMissionId, callApi, t]);

  useEffect(() => {
    if (open && boardMissionId) {
      loadGraphicsApproval();
    }
  }, [open, boardMissionId, loadGraphicsApproval]);

  // Update file approval status
  const handleFileStatusUpdate = async (fileId: string, status: number) => {
    if (updatingFiles.has(fileId)) return;

    setUpdatingFiles((prev) => new Set(prev).add(fileId));

    const callBack = (res: any) => {
      setUpdatingFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });

      if (res?.success) {
        // Exit edit mode
        setEditingFiles((prev) => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
        // Reload approval data to get updated status
        loadGraphicsApproval();
        // Notify parent to refresh status
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        setError(res?.message || t("graphicsApproval.updateFailed") || "Failed to update file status");
      }
    };

    await updateGraphicsApprovalFileApi(callApi, callBack, {
      fileId,
      status,
    });
  };

  // Update file note only (debounced)
  const handleNoteUpdate = useCallback(async (fileId: string, note: string) => {
    if (updatingNotes.has(fileId)) return;

    setUpdatingNotes((prev) => new Set(prev).add(fileId));

    const callBack = (res: any) => {
      setUpdatingNotes((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });

      if (!res?.success) {
        setError(res?.message || t("graphicsApproval.noteUpdateFailed") || "Failed to update note");
      }
    };

    await updateGraphicsApprovalFileApi(callApi, callBack, {
      fileId,
      note,
    });
  }, [callApi, t]);

  const handleChangeStatusClick = (fileId: string) => {
    setEditingFiles((prev) => new Set(prev).add(fileId));
  };

  const handleCancelChangeStatus = (fileId: string) => {
    setEditingFiles((prev) => {
      const next = new Set(prev);
      next.delete(fileId);
      return next;
    });
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return t("graphicsApproval.approved") || "Approved";
      case 2:
        return t("graphicsApproval.rejected") || "Rejected";
      default:
        return t("graphicsApproval.pending") || "Pending";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return successColor(500);
      case 2:
        return errorColor(500);
      default:
        return neutralColor(500);
    }
  };

  const handleUploadSuccess = () => {
    setOpenUploadModal(false);
    loadGraphicsApproval();
    if (onStatusUpdate) {
      onStatusUpdate();
    }
  };

  return (
    <>
      <GoMakeDialog
        open={open}
        onClose={onClose}
        title={t("graphicsApproval.title") || "Graphics Approval"}
        maxWidth="lg"
        showFooter={false}
        slotProps={{
          backdrop: {
            sx: {
              zIndex: 9999998,
            },
          },
        }}
        customStyles={{
          paper: {
            zIndex: 9999999,
          },
        }}
        sx={{
          zIndex: 9999999,
        }}
      >
        <Box sx={{ padding: "24px", maxHeight: "80vh", overflow: "auto" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", padding: "24px" }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : approval ? (
            <Stack spacing={3}>
              {/* Header Info */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {t("graphicsApproval.subtitle") || "Review and approve or reject the graphics files"}
                </Typography>
                {approval.jobNumber && approval.orderNumber && (
                  <Typography variant="body2" sx={{ color: neutralColor(600) }}>
                    {t("graphicsApproval.jobNumber") || "Job"}: {approval.jobNumber}
                    {", "}
                    {t("graphicsApproval.orderNumber") || "Order"}: {approval.orderNumber}
                  </Typography>
                )}
              </Box>

              {/* Add Files Button */}
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setOpenUploadModal(true)}
                  sx={{ marginBottom: "16px" }}
                >
                  {t("graphicsApproval.addFiles") || "Add Files"}
                </Button>
              </Box>

              {/* Files List */}
              {approval.files && approval.files.length > 0 ? (
                <Stack spacing={2}>
                  {approval.files.map((file) => {
                    const isUpdating = updatingFiles.has(file.id);
                    const isPending = file.status === 0;
                    const isEditing = editingFiles.has(file.id);
                    const showActionButtons = isPending || isEditing;

                    return (
                      <Paper key={file.id} elevation={2} sx={{ padding: "16px" }}>
                        <Stack spacing={2}>
                          {/* File Header */}
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                                {file.fileName}
                              </Typography>
                              {file.description && (
                                <Typography variant="body2" sx={{ color: neutralColor(600), marginBottom: "8px" }}>
                                  {file.description}
                                </Typography>
                              )}
                              {!isEditing && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: getStatusColor(file.status),
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getStatusLabel(file.status)}
                                </Typography>
                              )}
                            </Box>
                            <Box>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                              >
                                <Button variant="outlined" size="small">
                                  {t("graphicsApproval.viewFile") || "View File"}
                                </Button>
                              </a>
                            </Box>
                          </Stack>

                          {/* Note Input */}
                          <NoteInput
                            fileId={file.id}
                            value={fileNotes[file.id] || ""}
                            onChange={(value) =>
                              setFileNotes((prev) => ({
                                ...prev,
                                [file.id]: value,
                              }))
                            }
                            onSave={(note) => handleNoteUpdate(file.id, note)}
                            isUpdating={updatingNotes.has(file.id)}
                            disabled={isUpdating}
                            placeholder={t("graphicsApproval.notePlaceholder") || "Add a note (optional)"}
                            label={t("graphicsApproval.note") || "Note"}
                          />

                          {/* Action Buttons */}
                          {showActionButtons ? (
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              {isEditing && (
                                <Button
                                  variant="outlined"
                                  onClick={() => handleCancelChangeStatus(file.id)}
                                  disabled={isUpdating}
                                  size="small"
                                >
                                  {t("graphicsApproval.cancel") || "Cancel"}
                                </Button>
                              )}
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleFileStatusUpdate(file.id, 2)}
                                disabled={isUpdating}
                                size="small"
                              >
                                {isUpdating ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  t("graphicsApproval.reject") || "Reject"
                                )}
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleFileStatusUpdate(file.id, 1)}
                                disabled={isUpdating}
                                size="small"
                              >
                                {isUpdating ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  t("graphicsApproval.approve") || "Approve"
                                )}
                              </Button>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                onClick={() => handleChangeStatusClick(file.id)}
                                disabled={isUpdating}
                                size="small"
                              >
                                {t("graphicsApproval.changeStatus") || "Change Status"}
                              </Button>
                            </Stack>
                          )}
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Paper sx={{ padding: "24px", textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: neutralColor(600) }}>
                    {t("graphicsApproval.noFiles") || "No files found"}
                  </Typography>
                </Paper>
              )}
            </Stack>
          ) : null}
        </Box>
      </GoMakeDialog>

      {/* Upload Modal */}
      <GraphicsApprovalUploadModal
        openModal={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        boardMissionId={boardMissionId}
        orderItemId={orderItemId}
        orderId={orderId}
        productType={productType}
        jobGraphicApprovalId={approval?.id}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export { GraphicsApprovalViewModal };
