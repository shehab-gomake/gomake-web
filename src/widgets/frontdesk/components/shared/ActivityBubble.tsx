import React from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";

interface ActivityBubbleProps {
  /**
   * The activity message content (HTML or plain text)
   * Examples:
   * - "Conversation was marked resolved by John Doe"
   * - "Priority changed from low to high by Jane Smith"
   * - "Conversation was assigned to Support Team"
   */
  content: string;

  /**
   * Timestamp for tooltip (optional)
   */
  timestamp?: string;

  /**
   * Whether the content contains HTML
   */
  isHtml?: boolean;
}

/**
 * ActivityBubble Component
 *
 * Renders system activity messages (status changes, priority changes, assignments, etc.)
 * as centered, rounded chips with a subtle background.
 *
 * Design inspired by Chatwoot's activity message rendering:
 * - Centered orientation
 * - Light gray background (bg-n-alpha-1)
 * - Dark text (text-n-slate-11)
 * - Small font size
 * - Rounded corners
 * - Minimal padding
 *
 * Used for:
 * - Conversation status changes (resolved, reopened, pending, snoozed)
 * - Priority changes (added, updated, removed)
 * - Assignment changes
 * - Label changes
 * - SLA policy changes
 * - Team changes
 * - Any other system-generated activity messages
 *
 * @example
 * ```tsx
 * <ActivityBubble
 *   content="Conversation was marked resolved by omar sabbah"
 *   timestamp="2024-01-01T12:00:00Z"
 * />
 * ```
 */
export const ActivityBubble: React.FC<ActivityBubbleProps> = ({
  content,
  timestamp,
  isHtml = false,
}) => {
  const { neutralColor } = useGomakeTheme();

  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const bubbleContent = (
    <Paper
      elevation={0}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 0.75,
        borderRadius: "12px",
        backgroundColor: alpha(neutralColor(200), 0.3), // Light gray background
        border: `1px solid ${alpha(neutralColor(300), 0.4)}`,
        maxWidth: "80%",
      }}
      data-bubble-name="activity"
    >
      {isHtml ? (
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            fontSize: "0.875rem", // 14px
            color: neutralColor(700), // Dark gray text
            lineHeight: 1.5,
            "& p": {
              margin: 0,
              display: "inline",
            },
            "& a": {
              color: "inherit",
              textDecoration: "underline",
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem", // 14px
            color: neutralColor(700), // Dark gray text
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {content}
        </Typography>
      )}
    </Paper>
  );

  // Wrap in tooltip if timestamp is provided
  if (timestamp) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
          px: 2,
        }}
      >
        <Tooltip title={formatTime(timestamp)} placement="top" arrow>
          {bubbleContent}
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 1,
        px: 2,
      }}
    >
      {bubbleContent}
    </Box>
  );
};
