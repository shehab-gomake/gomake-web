/**
 * Add/Edit Label Modal
 *
 * Modal for creating and editing labels in Chatwoot.
 * Supports title, description, color, and sidebar visibility.
 * Matches Chatwoot design system styling.
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

// Common label colors matching Chatwoot's color picker
const DEFAULT_COLORS = [
  "#FF0000", // Red
  "#FF6B00", // Orange
  "#FFB800", // Yellow
  "#50C878", // Green
  "#0066FF", // Blue
  "#8B00FF", // Purple
  "#FF00FF", // Magenta/Pink
  "#000000", // Black
];

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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          border: `1px solid ${neutralColor(200)}`,
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
          pt: 2.5,
          px: 3,
          borderBottom: `1px solid ${neutralColor(200)}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem", color: neutralColor(900) }}>
          {isEditMode ? "Edit Label" : "Add Label"}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={saving}
          sx={{
            color: neutralColor(600),
            "&:hover": {
              bgcolor: neutralColor(100),
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, px: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "8px",
            }}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={2.5}>
          {/* Label Title */}
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Label Title <span style={{ color: "#DC2626" }}>*</span>
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
                  borderRadius: "8px",
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
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Description (Optional)
            </Typography>
            <TextField
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this label"
              multiline
              rows={3}
              disabled={saving || loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>

          {/* Color Picker */}
          <Box>
            <Typography
              sx={{
                mb: 1.5,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {DEFAULT_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => !saving && !loading && setColor(c)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    bgcolor: c,
                    cursor: saving || loading ? "default" : "pointer",
                    border: color === c ? "3px solid" : "2px solid",
                    borderColor: color === c ? primaryColor(600) : neutralColor(300),
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: saving || loading ? "none" : "scale(1.05)",
                      borderColor: saving || loading ? neutralColor(300) : primaryColor(600),
                    },
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#FF0000"
              disabled={saving || loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              inputProps={{
                pattern: "^#[0-9A-Fa-f]{6}$",
              }}
            />
          </Box>

          {/* Show on Sidebar */}
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
            label={<Typography sx={{ fontSize: "0.875rem", color: neutralColor(700) }}>Show on sidebar</Typography>}
          />
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${neutralColor(200)}`,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving || loading}
          sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            color: neutralColor(700),
            "&:hover": {
              bgcolor: neutralColor(100),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!canSubmit}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            bgcolor: primaryColor(600),
            "&:hover": {
              bgcolor: primaryColor(700),
            },
            "&:disabled": {
              bgcolor: neutralColor(300),
              color: neutralColor(500),
            },
          }}
        >
          {saving ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
