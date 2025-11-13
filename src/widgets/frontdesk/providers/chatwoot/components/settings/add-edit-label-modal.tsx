/**
 * Add/Edit Label Modal
 *
 * Modal for creating and editing labels in Chatwoot.
 * Enhanced with live preview, better color picker, and modern design.
 * Supports title, description, color, and sidebar visibility.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LabelIcon from "@mui/icons-material/Label";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { CreateLabelPayload, UpdateLabelPayload } from "@/services/frontdesk/api/chatwoot";

interface AddEditLabelModalProps {
  open: boolean;
  label: ChatwootLabel | null; // null for create mode, label object for edit mode
  onClose: () => void;
  onCreate: (payload: CreateLabelPayload) => Promise<void>;
  onUpdate: (labelId: number, payload: UpdateLabelPayload) => Promise<void>;
  loading?: boolean;
}

// Enhanced color palette with organized categories
const COLOR_PALETTE = {
  reds: ["#DC2626", "#EF4444", "#F87171", "#FCA5A5"],
  oranges: ["#EA580C", "#F97316", "#FB923C", "#FDBA74"],
  yellows: ["#D97706", "#F59E0B", "#FBBF24", "#FCD34D"],
  greens: ["#059669", "#10B981", "#34D399", "#6EE7B7"],
  blues: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
  purples: ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"],
  pinks: ["#DB2777", "#EC4899", "#F472B6", "#F9A8D4"],
  grays: ["#374151", "#6B7280", "#9CA3AF", "#D1D5DB"],
};

const ALL_COLORS = Object.values(COLOR_PALETTE).flat();

export const AddEditLabelModal: React.FC<AddEditLabelModalProps> = ({
  open,
  label,
  onClose,
  onCreate,
  onUpdate,
  loading = false,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const isEditMode = !!label;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("#FF0000");
  const [showOnSidebar, setShowOnSidebar] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form values when label changes
  useEffect(() => {
    if (label) {
      setTitle(label.title || "");
      setDescription(label.description || "");
      setColor(label.color || "#FF0000");
      setShowOnSidebar(label.show_on_sidebar ?? true);
      setError(null);
    } else {
      // Reset form for create mode
      setTitle("");
      setDescription("");
      setColor("#FF0000");
      setShowOnSidebar(true);
      setError(null);
    }
  }, [label, open]);

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      setError("Label title is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditMode && label?.id) {
        await onUpdate(label.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          color,
          show_on_sidebar: showOnSidebar,
        });
      } else {
        await onCreate({
          title: title.trim(),
          description: description.trim() || undefined,
          color,
          show_on_sidebar: showOnSidebar,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? "update" : "create"} label`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setError(null);
      onClose();
    }
  };

  const canSubmit = !saving && !loading && title.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: `1px solid ${neutralColor(200)}`,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          pt: 3,
          px: 3,
          background: `linear-gradient(135deg, ${neutralColor(50)} 0%, ${neutralColor(100)} 100%)`,
          borderBottom: `1px solid ${neutralColor(200)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: primaryColor(100),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LabelIcon sx={{ color: primaryColor(600), fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem", color: neutralColor(900) }}>
            {isEditMode ? "Edit Label" : "Create New Label"}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={saving}
          sx={{
            color: neutralColor(600),
            "&:hover": {
              bgcolor: neutralColor(200),
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "10px",
              border: `1px solid #FEE2E2`,
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Column - Form */}
          <Stack spacing={3} sx={{ flex: 1 }}>
          {/* Label Title */}
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: neutralColor(800),
              }}
            >
              Label Title <span style={{ color: "#DC2626", fontSize: "1rem" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Urgent, Follow-up, VIP"
              disabled={saving || loading}
              error={!!error && !title.trim()}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  bgcolor: "#FFFFFF",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: primaryColor(400),
                  },
                  "&.Mui-focused": {
                    borderColor: primaryColor(600),
                    borderWidth: "2px",
                    boxShadow: `0 0 0 3px ${primaryColor(100)}`,
                  },
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: neutralColor(800),
              }}
            >
              Description <span style={{ fontSize: "0.75rem", color: neutralColor(500) }}>(Optional)</span>
            </Typography>
            <TextField
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description for this label..."
              multiline
              rows={3}
              disabled={saving || loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  bgcolor: "#FFFFFF",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: primaryColor(400),
                  },
                  "&.Mui-focused": {
                    borderColor: primaryColor(600),
                    borderWidth: "2px",
                    boxShadow: `0 0 0 3px ${primaryColor(100)}`,
                  },
                },
              }}
            />
          </Box>

          {/* Color Picker */}
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: neutralColor(800),
              }}
            >
              Label Color
            </Typography>

            {/* Color Palette Grid */}
            <Box 
              sx={{ 
                mb: 1.5,
                display: "grid",
                gridTemplateColumns: "repeat(16, 1fr)",
                gap: 0.375,
                p: 0.5,
                borderRadius: "8px",
                bgcolor: neutralColor(50),
                border: `1px solid ${neutralColor(200)}`,
              }}
            >
              {ALL_COLORS.map((c) => (
                <Tooltip key={c} title={c} arrow placement="top">
                  <Box
                    onClick={() => !saving && !loading && setColor(c)}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "6px",
                      bgcolor: c,
                      cursor: saving || loading ? "default" : "pointer",
                      border: color === c ? "2px solid" : "1px solid",
                      borderColor: color === c ? neutralColor(900) : neutralColor(300),
                      transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      flexShrink: 0,
                      "&:hover": {
                        transform: saving || loading ? "none" : "scale(1.15)",
                        borderColor: saving || loading ? neutralColor(300) : neutralColor(700),
                        boxShadow: saving || loading ? "none" : "0 2px 6px rgba(0,0,0,0.15)",
                        zIndex: 1,
                      },
                    }}
                  >
                    {color === c && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: 14,
                          color: "#FFFFFF",
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Show on Sidebar */}
          <Box
            sx={{
              p: 2,
              borderRadius: "10px",
              bgcolor: neutralColor(50),
              border: `1px solid ${neutralColor(200)}`,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnSidebar}
                  onChange={(e) => setShowOnSidebar(e.target.checked)}
                  disabled={saving || loading}
                  sx={{
                    color: primaryColor(600),
                    "&.Mui-checked": {
                      color: primaryColor(600),
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: neutralColor(800) }}>
                    Show on sidebar
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: neutralColor(600), mt: 0.25 }}>
                    Display this label in the conversation sidebar for quick access
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Stack>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Right Column - Live Preview */}
        <Box
          sx={{
            flex: "0 0 240px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                mb: 1.5,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: neutralColor(600),
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Live Preview
            </Typography>

            {/* Preview Card */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                bgcolor: neutralColor(50),
                border: `2px dashed ${neutralColor(300)}`,
              }}
            >
              {title.trim() ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    backgroundColor: `${color}15`,
                    borderRadius: "14px",
                    padding: "6px 12px",
                    border: `1.5px solid ${color}40`,
                    transition: "all 0.2s",
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: color,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${color}80`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 13,
                      color: neutralColor(900),
                      fontWeight: 600,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: neutralColor(500),
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  Enter a title to preview
                </Typography>
              )}

              {description.trim() && (
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: "0.75rem",
                    color: neutralColor(600),
                    lineHeight: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  &quot;{description}&quot;
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${neutralColor(200)}`,
          gap: 1.5,
          bgcolor: neutralColor(50),
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving || loading}
          size="large"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: neutralColor(700),
            px: 3,
            py: 1,
            borderRadius: "10px",
            "&:hover": {
              bgcolor: neutralColor(200),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!canSubmit}
          size="large"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderRadius: "10px",
            px: 4,
            py: 1,
            bgcolor: primaryColor(600),
            boxShadow: `0 4px 12px ${primaryColor(200)}`,
            "&:hover": {
              bgcolor: primaryColor(700),
              boxShadow: `0 6px 16px ${primaryColor(300)}`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&:disabled": {
              bgcolor: neutralColor(300),
              color: neutralColor(500),
              boxShadow: "none",
            },
            transition: "all 0.2s",
          }}
        >
          {saving ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Label" : "Create Label"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
