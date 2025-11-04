/**
 * WhatsApp Template Card Component
 *
 * Displays a template in a card format with category badge, description,
 * and visual feedback for selection state.
 *
 * Features:
 * - Hover and selected states
 * - Category color coding
 * - Template metadata display
 * - Keyboard accessible
 * - Optimized performance with memo
 */

import React, { memo } from "react";
import { Box, Typography, Chip, Stack, alpha } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import type { WhatsAppTemplate } from "../../types/whatsapp-templates.types";
import { TEMPLATE_CATEGORY_COLORS } from "../../constants/whatsapp-templates.constants";
import { HeaderType } from "../../types/whatsapp-templates.types";

interface TemplateCardProps {
  /** Template to display */
  template: WhatsAppTemplate;
  /** Whether this template is selected */
  selected: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * Template Card Component
 */
export const TemplateCard = memo<TemplateCardProps>(({ template, selected, onClick }) => {
  const categoryColor = TEMPLATE_CATEGORY_COLORS[template.category] || "#3b82f6";

  // Get header icon
  const getHeaderIcon = () => {
    if (!template.components.header) return null;

    switch (template.components.header.type) {
      case HeaderType.IMAGE:
        return <ImageIcon sx={{ fontSize: 16, color: "#94a3b8" }} />;
      case HeaderType.VIDEO:
        return <VideoLibraryIcon sx={{ fontSize: 16, color: "#94a3b8" }} />;
      case HeaderType.DOCUMENT:
        return <AttachFileIcon sx={{ fontSize: 16, color: "#94a3b8" }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: "relative",
        p: 2,
        borderRadius: "12px",
        border: `2px solid ${selected ? categoryColor : "#334155"}`,
        backgroundColor: selected ? alpha(categoryColor, 0.1) : "#0f172a",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: selected ? alpha(categoryColor, 0.15) : "#1e293b",
          borderColor: selected ? categoryColor : "#475569",
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px ${alpha(categoryColor, 0.2)}`,
        },
        "&:focus": {
          outline: `2px solid ${categoryColor}`,
          outlineOffset: 2,
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      {/* Selected Indicator */}
      {selected && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 20, color: categoryColor }} />
        </Box>
      )}

      <Stack spacing={1}>
        {/* Header - Category & Meta */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Chip
            label={template.category.replace(/_/g, " ")}
            size="small"
            sx={{
              backgroundColor: categoryColor,
              color: "white",
              fontWeight: 600,
              fontSize: "0.688rem",
              height: 20,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          />
          {getHeaderIcon()}
        </Stack>

        {/* Template Name */}
        <Typography
          variant="subtitle1"
          sx={{
            color: "#f1f5f9",
            fontWeight: 600,
            fontSize: "0.938rem",
            lineHeight: 1.3,
            pr: selected ? 3 : 0,
          }}
        >
          {template.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Typography>

        {/* Description */}
        {template.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
              fontSize: "0.813rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {template.description}
          </Typography>
        )}

        {/* Template Preview (truncated) */}
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontSize: "0.75rem",
            fontStyle: "italic",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          "{template.components.body.text}"
        </Typography>

        {/* Footer - Tags & Meta */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {template.tags && template.tags.length > 0 && (
            <>
              {template.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#334155",
                    color: "#94a3b8",
                    fontSize: "0.688rem",
                    height: 18,
                  }}
                />
              ))}
              {template.tags.length > 3 && (
                <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.688rem" }}>
                  +{template.tags.length - 3} more
                </Typography>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
});

TemplateCard.displayName = "TemplateCard";
