import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { AvatarGroup } from "../../primitives/Avatar";
import { Chip } from "../../primitives/Chip";
import { PriorityBadge } from "../../primitives/Badge/PriorityBadge";
import { PriorityLevel } from "../../types";
import { colorTokens } from "../../tokens";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TagList } from "../../components/TagChip";

export interface TicketListItemProps {
  /** Ticket ID */
  id: string;
  /** Ticket number (e.g., TICKET-1234) */
  ticketNumber: string;
  /** Ticket title */
  title: string;
  /** Status (raw backend format: OPEN, REOPENED, etc. for color logic) */
  status: string;
  /** Status label (optional friendly display: "Open", "Reopened", etc.) */
  statusLabel?: string;
  /** Priority */
  priority: "Urgent" | "High" | "Medium" | "Low";
  /** Ticket type */
  type?: "Bug" | "Feature" | "Task" | "Support";
  /** Last updated timestamp */
  updatedAt: string;
  /** Is selected */
  isSelected?: boolean;
  /** Has unread updates */
  isUnread?: boolean;
  /** Participants */
  participants?: Array<{ userId: string; name: string; avatarUrl?: string }>;
  /** Tags */
  tags?: Array<{
    id: string;
    name: string;
    displayName: string;
    color?: string | null;
    category: string;
    usageCount: number;
    isSystem: boolean;
  }>;
  /** SLA breach status */
  slaBreached?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Tag click handler - called when a tag is clicked */
  onTagClick?: (tag: {
    id: string;
    name: string;
    displayName: string;
    color?: string | null;
    category: string;
    usageCount: number;
    isSystem: boolean;
  }) => void;
  /** Enable quick actions menu on hover */
  enableQuickActions?: boolean;
  /** Quick reply handler */
  onQuickReply?: () => void;
  /** Quick status toggle handler */
  onQuickToggleStatus?: () => void;
  /** Quick add tag handler */
  onQuickAddTag?: () => void;
  /** Quick assign handler */
  onQuickAssign?: () => void;
  /** Quick more options handler */
  onQuickMore?: () => void;
}

/**
 * Map backend ticket statuses to design system chip colors
 * Backend statuses: OPEN, IN_PROGRESS, PENDING, RESOLVED, CLOSED, REOPENED
 */
const getStatusColor = (status: string): "primary" | "warning" | "success" | "error" | "neutral" => {
  switch (status.toUpperCase()) {
    case "OPEN":
    case "NEW":
      return "primary"; // Blue - new/needs attention
    case "IN_PROGRESS":
    case "ACTIVE":
      return "warning"; // Orange - actively worked
    case "PENDING":
    case "ON HOLD":
      return "warning"; // Yellow/Orange - waiting
    case "RESOLVED":
      return "success"; // Green - fixed
    case "CLOSED":
      return "neutral"; // Gray - done
    case "REOPENED":
      return "error"; // Red - needs re-attention
    default:
      return "primary";
  }
};

/**
 * Get subtle background color for ticket row based on status
 * Used to visually distinguish ticket states at a glance
 */
const getStatusBackgroundTint = (status: string, isSelected: boolean): string => {
  if (isSelected) return "transparent"; // Don't override selection color

  switch (status.toUpperCase()) {
    case "REOPENED":
      return "rgba(244, 67, 54, 0.03)"; // Subtle red tint
    case "PENDING":
    case "ON HOLD":
      return "rgba(255, 152, 0, 0.03)"; // Subtle orange tint
    default:
      return "transparent";
  }
};

/**
 * TicketListItem Component
 *
 * Redesigned ticket list item with better visual hierarchy:
 * - Priority badge with background (more visible)
 * - Ticket number integrated with title
 * - Status chip prominent on right
 * - Metadata (time, participants, tags) clearly separated
 * - Unread indicator integrated with title
 */
export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  ticketNumber,
  title,
  status,
  statusLabel,
  priority,
  type,
  updatedAt,
  isSelected = false,
  isUnread = false,
  participants = [],
  tags = [],
  slaBreached = false,
  onClick,
  onTagClick,
}) => {
  // Build custom content with better layout
  const customContent = (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.75,
        py: 1.25,
        cursor: "pointer",
        backgroundColor: isSelected ? colorTokens.primary[100] : getStatusBackgroundTint(status, isSelected),
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        // Add left border for unread tickets for extra visibility
        borderLeft: isUnread ? `3px solid ${colorTokens.primary[600]}` : "3px solid transparent",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: isSelected ? colorTokens.primary[100] : colorTokens.primary[50],
        },
      }}
    >
      {/* Left: Priority Badge with background */}
      <Box sx={{ flexShrink: 0 }}>
        <PriorityBadge priority={priority as PriorityLevel} mode="icon" size="sm" showBackground />
      </Box>

      {/* Center: Title and Metadata */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {/* Title Row: Ticket number + Title + Unread indicator */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: colorTokens.semantic.text.tertiary,
              flexShrink: 0,
              letterSpacing: "0.01em",
            }}
          >
            {ticketNumber}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              fontWeight: 600, // Always semibold for consistency
              color: colorTokens.semantic.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              opacity: isUnread ? 1 : 0.9, // Subtle difference for read items
            }}
          >
            {title}
          </Typography>
          {isUnread && (
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: colorTokens.primary[600],
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        {/* Metadata Row: Time + SLA Breach + Participants + Tags */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: colorTokens.semantic.text.secondary,
            }}
          >
            {updatedAt}
          </Typography>

          {/* SLA Breach Indicator - Icon only for compact display */}
          {slaBreached && (
            <>
              <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: colorTokens.semantic.text.tertiary }} />
              <Tooltip title="SLA breached - ticket overdue" arrow placement="top">
                <AccessTimeIcon
                  sx={{
                    fontSize: 14,
                    color: "#EF4444", // Error red color for SLA breach
                    cursor: "help",
                  }}
                />
              </Tooltip>
            </>
          )}

          {participants.length > 0 && (
            <>
              <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: colorTokens.semantic.text.tertiary }} />
              <AvatarGroup users={participants} size="xs" max={2} />
            </>
          )}

          {tags && tags.length > 0 && (
            <>
              <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: colorTokens.semantic.text.tertiary }} />
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <TagList
                  tags={tags as any}
                  size="small"
                  variant="outlined"
                  maxDisplay={1}
                  onClickTag={
                    onTagClick
                      ? (tag) => {
                          // Stop propagation to prevent ticket selection when clicking tag
                          onTagClick(tag);
                        }
                      : undefined
                  }
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Right: Status Chip */}
      <Box sx={{ flexShrink: 0, ml: "auto", pl: 1.5 }}>
        <Chip
          label={statusLabel || status} // Use friendly label if provided, else raw status
          color={getStatusColor(status)} // Use raw status for color determination
          variant="soft"
          size="small"
          sx={{ fontSize: 11, fontWeight: 600, minWidth: 75 }}
        />
      </Box>
    </Box>
  );

  return customContent;
};
