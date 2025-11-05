import React from "react";
import { Box, Typography, Button, Stack, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";

interface NoConversationsEmptyStateProps {
  /**
   * Current filter context (e.g., "open", "resolved", "mine")
   */
  filterContext?: string;

  /**
   * Callback when refresh button is clicked
   */
  onRefresh?: () => void;

  /**
   * Callback when clear filters button is clicked
   */
  onClearFilters?: () => void;

  /**
   * Whether filters are currently applied
   */
  hasFilters?: boolean;
}

/**
 * Empty state component for when no conversations are found
 *
 * Displays context-aware messages based on current filters and provides
 * actions to help users find conversations or start fresh.
 *
 * @example
 * ```tsx
 * {conversations.length === 0 && !loading && (
 *   <NoConversationsEmptyState
 *     filterContext="open"
 *     hasFilters={true}
 *     onRefresh={handleRefresh}
 *     onClearFilters={handleClearFilters}
 *   />
 * )}
 * ```
 */
export const NoConversationsEmptyState: React.FC<NoConversationsEmptyStateProps> = ({
  filterContext,
  onRefresh,
  onClearFilters,
  hasFilters = false,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Context-aware messaging
  const getMessage = () => {
    if (hasFilters) {
      return {
        title: "No conversations match your filters",
        description: "Try adjusting your filters or clearing them to see all conversations.",
      };
    }

    switch (filterContext) {
      case "open":
      case "mine":
        return {
          title: "No open conversations",
          description: "Great job! You've resolved all your conversations. Take a break or check for new messages.",
        };
      case "resolved":
        return {
          title: "No resolved conversations",
          description: "You haven't resolved any conversations yet. Keep working on those open ones!",
        };
      case "pending":
        return {
          title: "No pending conversations",
          description: "All conversations are either open or resolved. Nothing is waiting for action.",
        };
      case "snoozed":
        return {
          title: "No snoozed conversations",
          description: "You haven't snoozed any conversations. Use snooze to temporarily hide conversations.",
        };
      case "unassigned":
        return {
          title: "No unassigned conversations",
          description: "All conversations have been assigned to team members. Great teamwork!",
        };
      case "mentions":
        return {
          title: "No mentions",
          description: "You haven't been mentioned in any conversations recently.",
        };
      default:
        return {
          title: "No conversations yet",
          description: "Start a conversation with a customer or wait for incoming messages.",
        };
    }
  };

  const { title, description } = getMessage();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 4,
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <InboxIcon
          sx={{
            fontSize: 64,
            color: alpha(theme.palette.primary.main, 0.4),
          }}
        />
      </Box>

      {/* Text Content */}
      <Stack spacing={1} sx={{ mb: 3, maxWidth: 400 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: neutralColor(900),
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: neutralColor(600),
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        {onRefresh && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{
              borderColor: neutralColor(300),
              color: neutralColor(700),
              fontWeight: 400,
              textTransform: "none",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Refresh
          </Button>
        )}

        {hasFilters && onClearFilters && (
          <Button
            variant="contained"
            size="small"
            onClick={onClearFilters}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Box>
  );
};
