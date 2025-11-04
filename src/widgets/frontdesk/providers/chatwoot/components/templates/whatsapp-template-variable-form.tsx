/**
 * WhatsApp Template Variable Form Component
 *
 * Dynamic form for collecting template variable values.
 * Automatically generates input fields based on template structure.
 *
 * Features:
 * - Auto-generated fields from template variables
 * - Smart labels based on example values
 * - Media upload for header components
 * - URL input for dynamic buttons
 * - Real-time validation
 * - Placeholder examples
 * - Dark theme styling
 */

import React, { memo, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  Alert,
  alpha,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import type {
  WhatsAppTemplate,
  TemplateHeaderMedia,
} from "../../types/whatsapp-templates.types";
import { HeaderType, ButtonType } from "../../types/whatsapp-templates.types";
import { extractVariables, getVariableLabels } from "../../utils/whatsapp-template.utils";

interface TemplateVariableFormProps {
  /** Template being configured */
  template: WhatsAppTemplate;
  /** Current body variable values */
  bodyVariables: Record<string, string>;
  /** Current button variable values */
  buttonVariables: Record<string, string>;
  /** Current header media */
  headerMedia?: TemplateHeaderMedia;
  /** Body variable change handler */
  onBodyVariableChange: (key: string, value: string, type: "body") => void;
  /** Button variable change handler */
  onButtonVariableChange: (key: string, value: string, type: "button") => void;
  /** Header media change handler */
  onHeaderMediaChange: (media: TemplateHeaderMedia | undefined) => void;
}

/**
 * Template Variable Form Component
 */
export const TemplateVariableForm = memo<TemplateVariableFormProps>(
  ({
    template,
    bodyVariables,
    buttonVariables,
    headerMedia,
    onBodyVariableChange,
    onButtonVariableChange,
    onHeaderMediaChange,
  }) => {
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Extract body variables
    const bodyVars = extractVariables(template.components.body.text);
    const variableLabels = getVariableLabels(template);

    // Handle file upload
    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);

        // Validate file type
        const headerType = template.components.header?.type;
        if (!headerType || headerType === HeaderType.TEXT) return;

        const validTypes: Record<string, string[]> = {
          [HeaderType.IMAGE]: ["image/jpeg", "image/png", "image/jpg"],
          [HeaderType.VIDEO]: ["video/mp4", "video/3gpp"],
          [HeaderType.DOCUMENT]: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
        };

        const allowedTypes = validTypes[headerType] || [];
        if (!allowedTypes.includes(file.type)) {
          setUploadError(
            `Invalid file type. Please upload a ${headerType.toLowerCase()} file.`
          );
          return;
        }

        // Validate file size (max 5MB for images, 16MB for videos, 100MB for documents)
        const maxSizes: Record<string, number> = {
          [HeaderType.IMAGE]: 5 * 1024 * 1024, // 5MB
          [HeaderType.VIDEO]: 16 * 1024 * 1024, // 16MB
          [HeaderType.DOCUMENT]: 100 * 1024 * 1024, // 100MB
        };

        const maxSize = maxSizes[headerType] || 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setUploadError(
            `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
          );
          return;
        }

        // Create object URL for preview
        const url = URL.createObjectURL(file);

        onHeaderMediaChange({
          url,
          type: headerType.toLowerCase() as "image" | "video" | "document",
          file,
        });
      },
      [template.components.header, onHeaderMediaChange]
    );

    // Handle media URL input
    const handleMediaUrlChange = useCallback(
      (url: string) => {
        const headerType = template.components.header?.type;
        if (!headerType || headerType === HeaderType.TEXT) return;

        if (url.trim()) {
          onHeaderMediaChange({
            url: url.trim(),
            type: headerType.toLowerCase() as "image" | "video" | "document",
          });
        } else {
          onHeaderMediaChange(undefined);
        }
      },
      [template.components.header, onHeaderMediaChange]
    );

    // Get media icon
    const getMediaIcon = () => {
      const headerType = template.components.header?.type;
      switch (headerType) {
        case HeaderType.IMAGE:
          return <ImageIcon />;
        case HeaderType.VIDEO:
          return <VideoLibraryIcon />;
        case HeaderType.DOCUMENT:
          return <InsertDriveFileIcon />;
        default:
          return <CloudUploadIcon />;
      }
    };

    // Get file accept attribute
    const getAcceptType = () => {
      const headerType = template.components.header?.type;
      switch (headerType) {
        case HeaderType.IMAGE:
          return "image/jpeg,image/png,image/jpg";
        case HeaderType.VIDEO:
          return "video/mp4,video/3gpp";
        case HeaderType.DOCUMENT:
          return ".pdf,.doc,.docx";
        default:
          return "*/*";
      }
    };

    return (
      <Stack spacing={3}>
        {/* Info Alert */}
        <Alert
          severity="info"
          sx={{
            backgroundColor: alpha("#3b82f6", 0.1),
            color: "#93c5fd",
            border: "1px solid #1e40af",
            "& .MuiAlert-icon": {
              color: "#60a5fa",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.813rem" }}>
            Fill in the variables below. You can see a live preview on the right.
          </Typography>
        </Alert>

        {/* Header Media Upload */}
        {template.components.header && template.components.header.type !== HeaderType.TEXT && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f1f5f9",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.875rem",
              }}
            >
              Header {template.components.header.type}{" "}
              <Typography component="span" sx={{ color: "#ef4444" }}>
                *
              </Typography>
            </Typography>

            <Stack spacing={2}>
              {/* URL Input */}
              <TextField
                fullWidth
                placeholder={`Enter ${template.components.header.type.toLowerCase()} URL (must be HTTPS)`}
                value={headerMedia?.url || ""}
                onChange={(e) => handleMediaUrlChange(e.target.value)}
                error={!!uploadError}
                helperText={
                  uploadError ||
                  `Public HTTPS URL to your ${template.components.header.type.toLowerCase()}`
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{getMediaIcon()}</InputAdornment>
                  ),
                  endAdornment: headerMedia && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => onHeaderMediaChange(undefined)}
                        sx={{ color: "#94a3b8" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    backgroundColor: "#0f172a",
                    "& fieldset": {
                      borderColor: uploadError ? "#ef4444" : "#334155",
                    },
                    "&:hover fieldset": {
                      borderColor: uploadError ? "#ef4444" : "#475569",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: uploadError ? "#ef4444" : "#3b82f6",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: uploadError ? "#fca5a5" : "#94a3b8",
                  },
                }}
              />

              {/* File Upload */}
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", textAlign: "center", fontSize: "0.75rem" }}
              >
                - OR -
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: "none",
                  borderColor: "#334155",
                  color: "#94a3b8",
                  "&:hover": {
                    borderColor: "#475569",
                    backgroundColor: alpha("#3b82f6", 0.05),
                  },
                }}
              >
                Upload {template.components.header.type}
                <input type="file" hidden accept={getAcceptType()} onChange={handleFileUpload} />
              </Button>

              {headerMedia?.file && (
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  Selected: {headerMedia.file.name}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Body Variables */}
        {bodyVars.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f1f5f9",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.875rem",
              }}
            >
              Message Variables
            </Typography>

            <Stack spacing={2}>
              {bodyVars.map((variable) => {
                const example = template.components.body.examples[0]?.[parseInt(variable.key) - 1];
                const label = variableLabels[variable.key] || `Variable ${variable.key}`;

                return (
                  <TextField
                    key={variable.key}
                    fullWidth
                    label={
                      <span>
                        {label}{" "}
                        <Typography component="span" sx={{ color: "#ef4444" }}>
                          *
                        </Typography>
                      </span>
                    }
                    placeholder={example || `Enter value for {{${variable.key}}}`}
                    value={bodyVariables[variable.key] || ""}
                    onChange={(e) => onBodyVariableChange(variable.key, e.target.value, "body")}
                    helperText={example ? `Example: ${example}` : undefined}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#e2e8f0",
                        backgroundColor: "#0f172a",
                        "& fieldset": {
                          borderColor: "#334155",
                        },
                        "&:hover fieldset": {
                          borderColor: "#475569",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#94a3b8",
                        "&.Mui-focused": {
                          color: "#3b82f6",
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#94a3b8",
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        )}

        {/* Button Variables (Dynamic URLs) */}
        {template.components.buttons?.some((b) => b.type === ButtonType.URL && b.url?.includes("{{1}}")) && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#f1f5f9",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.875rem",
              }}
            >
              Button Parameters
            </Typography>

            <Stack spacing={2}>
              {template.components.buttons.map((button, index) => {
                if (button.type !== ButtonType.URL || !button.url?.includes("{{1}}")) {
                  return null;
                }

                const example = button.example?.[0];

                return (
                  <TextField
                    key={index}
                    fullWidth
                    label={
                      <span>
                        {button.text} - URL Parameter{" "}
                        <Typography component="span" sx={{ color: "#ef4444" }}>
                          *
                        </Typography>
                      </span>
                    }
                    placeholder={example || "Enter URL parameter"}
                    value={buttonVariables[index.toString()] || ""}
                    onChange={(e) =>
                      onButtonVariableChange(index.toString(), e.target.value, "button")
                    }
                    helperText={
                      example
                        ? `Example: ${example}. This will be appended to: ${button.url.split("{{1}}")[0]}`
                        : "This value will be appended to the button URL"
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#e2e8f0",
                        backgroundColor: "#0f172a",
                        "& fieldset": {
                          borderColor: "#334155",
                        },
                        "&:hover fieldset": {
                          borderColor: "#475569",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#94a3b8",
                        "&.Mui-focused": {
                          color: "#3b82f6",
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#94a3b8",
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        )}

        {/* No Variables Message */}
        {bodyVars.length === 0 &&
          (!template.components.header || template.components.header.type === HeaderType.TEXT) &&
          !template.components.buttons?.some(
            (b) => b.type === ButtonType.URL && b.url?.includes("{{1}}")
          ) && (
            <Alert
              severity="success"
              sx={{
                backgroundColor: alpha("#10b981", 0.1),
                color: "#6ee7b7",
                border: "1px solid #047857",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.813rem" }}>
                This template doesn't require any variables. You can send it as-is!
              </Typography>
            </Alert>
          )}
      </Stack>
    );
  }
);

TemplateVariableForm.displayName = "TemplateVariableForm";
