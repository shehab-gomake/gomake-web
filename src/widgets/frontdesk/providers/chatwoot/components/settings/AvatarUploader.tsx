/**
 * AvatarUploader Component
 *
 * Upload, preview, and delete avatar images.
 * Used for inbox channel avatars and user profile pictures.
 */

import React, { useState, useRef } from "react";
import {
  Box,
  Avatar,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface AvatarUploaderProps {
  /** Current avatar URL */
  currentAvatar?: string;
  /** Fallback text for avatar (initials) */
  fallbackText?: string;
  /** Upload handler - receives File object */
  onUpload: (file: File) => Promise<void>;
  /** Delete handler */
  onDelete?: () => Promise<void>;
  /** Size of avatar in pixels */
  size?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Optional label */
  label?: string;
  /** Helper text */
  helpText?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  fallbackText,
  onUpload,
  onDelete,
  size = 80,
  isLoading = false,
  disabled = false,
  label,
  helpText = "Recommended: Square image, at least 200x200px",
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    onUpload(file);

    // Reset input
    event.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (onDelete) {
      setPreview(null);
      await onDelete();
    }
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {label}
        </Typography>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Avatar Preview */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={displayAvatar}
            sx={{
              width: size,
              height: size,
              fontSize: size / 3,
              bgcolor: theme.palette.primary.main,
              border: `2px solid ${theme.palette.divider}`,
            }}
          >
            {!displayAvatar && (fallbackText || <CameraIcon />)}
          </Avatar>

          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "white" }} />
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            disabled={disabled || isLoading}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              disabled={disabled || isLoading}
            >
              {displayAvatar ? "Change" : "Upload"}
            </Button>

            {displayAvatar && onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                disabled={disabled || isLoading}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>

          {helpText && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                color: theme.palette.text.secondary,
              }}
            >
              {helpText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
