/**
 * WhatsApp Template Preview Component
 *
 * Displays a realistic WhatsApp message preview showing how the template
 * will appear to recipients.
 *
 * Features:
 * - WhatsApp-style message bubble design
 * - Header media preview (image/video/document)
 * - Interpolated body text
 * - Footer display
 * - Button previews
 * - Responsive design
 * - Loading states for media
 */

import React, { memo, useState } from "react";
import { Box, Typography, Stack, Button, CircularProgress, alpha } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import PhoneIcon from "@mui/icons-material/Phone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type {
  WhatsAppTemplate,
  TemplateHeaderMedia,
} from "../../types/whatsapp-templates.types";
import { HeaderType, ButtonType } from "../../types/whatsapp-templates.types";
import { interpolateTemplate } from "../../utils/whatsapp-template.utils";

interface TemplatePreviewProps {
  /** Template to preview */
  template: WhatsAppTemplate;
  /** Body variable values */
  bodyVariables: Record<string, string>;
  /** Button variable values */
  buttonVariables: Record<string, string>;
  /** Header media */
  headerMedia?: TemplateHeaderMedia;
}

/**
 * Template Preview Component
 */
export const TemplatePreview = memo<TemplatePreviewProps>(
  ({ template, bodyVariables, buttonVariables, headerMedia }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Interpolate body text
    const bodyText = interpolateTemplate(template.components.body.text, bodyVariables);

    // Get button icon
    const getButtonIcon = (type: ButtonType) => {
      switch (type) {
        case ButtonType.URL:
          return <LinkIcon sx={{ fontSize: 14 }} />;
        case ButtonType.PHONE_NUMBER:
          return <PhoneIcon sx={{ fontSize: 14 }} />;
        case ButtonType.COPY_CODE:
          return <ContentCopyIcon sx={{ fontSize: 14 }} />;
        default:
          return null;
      }
    };

    return (
      <Box
        sx={{
          maxWidth: 380,
          mx: "auto",
          p: 2,
          backgroundColor: "#E5DDD5", // WhatsApp chat background
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNkMWQxZDEiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Message Bubble */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header Media */}
          {template.components.header && template.components.header.type !== HeaderType.TEXT && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                backgroundColor: "#f3f4f6",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {template.components.header.type === HeaderType.IMAGE && (
                <>
                  {imageLoading && !imageError && (
                    <CircularProgress size={32} sx={{ color: "#94a3b8" }} />
                  )}
                  {!imageError && (
                    <img
                      src={headerMedia?.url || template.components.header.example || ""}
                      alt="Header"
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: imageLoading ? "none" : "block",
                        maxHeight: 250,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {imageError && (
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      <InsertDriveFileIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        Image preview unavailable
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              {template.components.header.type === HeaderType.VIDEO && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 180,
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlayCircleOutlineIcon sx={{ fontSize: 64, color: "white", opacity: 0.8 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      px: 1,
                      py: 0.5,
                      borderRadius: "4px",
                    }}
                  >
                    Video Preview
                  </Typography>
                </Box>
              )}
              {template.components.header.type === HeaderType.DOCUMENT && (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Document Attachment
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Header Text */}
          {template.components.header?.type === HeaderType.TEXT &&
            template.components.header.text && (
              <Box sx={{ px: 2, pt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: "0.938rem",
                  }}
                >
                  {template.components.header.text}
                </Typography>
              </Box>
            )}

          {/* Body */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#111827",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {bodyText || (
                <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                  {template.components.body.text}
                </span>
              )}
            </Typography>
          </Box>

          {/* Footer */}
          {template.components.footer && (
            <Box sx={{ px: 2, pb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                {template.components.footer.text}
              </Typography>
            </Box>
          )}

          {/* Buttons */}
          {template.components.buttons && template.components.buttons.length > 0 && (
            <Box
              sx={{
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {template.components.buttons.map((button, index) => (
                <Button
                  key={index}
                  fullWidth
                  startIcon={getButtonIcon(button.type)}
                  sx={{
                    justifyContent: "center",
                    textTransform: "none",
                    color: "#3b82f6",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    py: 1.5,
                    borderTop: index > 0 ? "1px solid #e5e7eb" : "none",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: alpha("#3b82f6", 0.05),
                    },
                  }}
                >
                  {button.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Timestamp */}
          <Box sx={{ px: 2, pb: 1, textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                fontSize: "0.688rem",
              }}
            >
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </Box>
        </Box>

        {/* Helper Text */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#64748b",
            mt: 2,
            fontSize: "0.75rem",
          }}
        >
          Preview of how recipients will see this message
        </Typography>
      </Box>
    );
  }
);

TemplatePreview.displayName = "TemplatePreview";
