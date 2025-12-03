/**
 * Add/Edit Label Modal
 *
 * Modal for creating and editing labels in Chatwoot.
 * Uses unified CompactModal system for consistency.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LabelIcon from "@mui/icons-material/Label";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { CreateLabelPayload, UpdateLabelPayload } from "@/services/frontdesk/api/chatwoot";
import { CompactModal } from "./CompactModal";
import {
  CompactFormSection,
  CompactTextField,
  CompactModalActions,
  CompactSwitch,
} from "./CompactFormFields";

interface AddEditLabelModalProps {
  open: boolean;
  label: ChatwootLabel | null;
  onClose: () => void;
  onCreate: (payload: CreateLabelPayload) => Promise<void>;
  onUpdate: (labelId: number, payload: UpdateLabelPayload) => Promise<void>;
  loading?: boolean;
}

// Simplified color palette
const LABEL_COLORS = [
  "#DC2626", "#EF4444", "#F87171", "#FCA5A5",
  "#EA580C", "#F97316", "#FB923C", "#FDBA74",
  "#D97706", "#F59E0B", "#FBBF24", "#FCD34D",
  "#059669", "#10B981", "#34D399", "#6EE7B7",
  "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD",
  "#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD",
  "#DB2777", "#EC4899", "#F472B6", "#F9A8D4",
  "#374151", "#6B7280", "#9CA3AF", "#D1D5DB",
];

export const AddEditLabelModal: React.FC<AddEditLabelModalProps> = ({
  open,
  label,
  onClose,
  onCreate,
  onUpdate,
  loading = false,
}) => {
  const isEditMode = !!label;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("#EF4444");
  const [showOnSidebar, setShowOnSidebar] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form values
  useEffect(() => {
    if (label) {
      setTitle(label.title || "");
      setDescription(label.description || "");
      setColor(label.color || "#EF4444");
      setShowOnSidebar(label.show_on_sidebar ?? true);
      setError(null);
    } else {
      setTitle("");
      setDescription("");
      setColor("#EF4444");
      setShowOnSidebar(true);
      setError(null);
    }
  }, [label, open]);

  const handleSave = async () => {
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

  const canSubmit = !saving && !loading && title.trim().length > 0;

  return (
    <CompactModal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Label" : "Create Label"}
      icon={<LabelIcon />}
      error={error}
      disabled={saving || loading}
      actions={
        <CompactModalActions
          onCancel={onClose}
          onSubmit={handleSave}
          submitLabel={isEditMode ? "Save Changes" : "Create Label"}
          isSubmitting={saving || loading}
          submitDisabled={!canSubmit}
        />
      }
    >
      <CompactFormSection>
        {/* Label Title */}
        <CompactTextField
          label="Label Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Urgent, Follow-up, VIP"
          disabled={saving || loading}
          error={!!error && !title.trim()}
          autoFocus
        />

        {/* Description */}
        <CompactTextField
          label="Description"
          optional
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a brief description..."
          multiline
          rows={2}
          disabled={saving || loading}
        />

        {/* Color Picker */}
        <Box>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#4b5563",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            Label Color
          </Typography>

          {/* Compact Color Grid */}
          <Box 
            sx={{ 
              display: "grid",
              gridTemplateColumns: "repeat(16, 1fr)",
              gap: 0.5,
              p: 1,
              borderRadius: "6px",
              bgcolor: "#f9fafb",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {LABEL_COLORS.map((c) => (
              <Tooltip key={c} title={c} arrow placement="top">
                <Box
                  onClick={() => !saving && !loading && setColor(c)}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                    bgcolor: c,
                    cursor: saving || loading ? "default" : "pointer",
                    border: color === c ? "2px solid #1f2937" : "1px solid rgba(0,0,0,0.1)",
                    transition: "all 0.15s",
                    position: "relative",
                    flexShrink: 0,
                    "&:hover": {
                      transform: saving || loading ? "none" : "scale(1.1)",
                      borderColor: saving || loading ? "rgba(0,0,0,0.1)" : "#1f2937",
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
                        fontSize: 12,
                        color: "#FFFFFF",
                        filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
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
            p: 1.5,
            borderRadius: "6px",
            bgcolor: "#f9fafb",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <CompactSwitch
            label="Show on sidebar"
            description="Display in conversation sidebar"
            checked={showOnSidebar}
            onChange={(e) => setShowOnSidebar(e.target.checked)}
            disabled={saving || loading}
          />
        </Box>

        {/* Preview */}
        {title.trim() && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: "6px",
              bgcolor: "#f9fafb",
              border: "1px dashed rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              sx={{
                mb: 0.75,
                fontSize: "0.688rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.025em",
              }}
            >
              Preview
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: `${color}15`,
                borderRadius: "12px",
                padding: "4px 10px",
                border: `1px solid ${color}40`,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: "#1f2937",
                  fontWeight: 500,
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
        )}
      </CompactFormSection>
    </CompactModal>
  );
};
