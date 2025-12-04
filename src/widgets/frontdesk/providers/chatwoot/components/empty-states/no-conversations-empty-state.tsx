import React from "react";
import { Box, Typography, Button, Stack, alpha } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import { colorTokens } from "@/widgets/frontdesk/design-system";

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

  // Context-aware messaging
  const getMessage = () => {
    if (hasFilters) {
      return {
        title: "No tickets match your filters",
        description: "Try adjusting your filters or clearing them to see all tickets.",
      };
    }

    switch (filterContext) {
      case "open":
      case "mine":
        return {
          title: "No open tickets",
          description: "Great job! You've closed all your tickets. Take a break or check for new messages.",
        };
      case "resolved":
        return {
          title: "No closed tickets",
          description: "You haven't closed any tickets yet. Keep working on those open ones!",
        };
      case "pending":
        return {
          title: "No pending tickets",
          description: "All tickets are either open or closed. Nothing is waiting for action.",
        };
      case "snoozed":
        return {
          title: "No snoozed tickets",
          description: "You haven't snoozed any tickets. Use snooze to temporarily hide tickets.",
        };
      case "unassigned":
        return {
          title: "No unassigned tickets",
          description: "All tickets have been assigned to team members. Great teamwork!",
        };
      case "mentions":
        return {
          title: "No mentions",
          description: "You haven't been mentioned in any tickets recently.",
        };
      default:
        return {
          title: "No tickets yet",
          description: "Start a ticket with a customer or wait for incoming messages.",
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
          backgroundColor: alpha(colorTokens.primary[500], 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <InboxIcon
          sx={{
            fontSize: 64,
            color: alpha(colorTokens.primary[500], 0.4),
          }}
        />
      </Box>

      {/* Text Content */}
      <Stack spacing={1} sx={{ mb: 3, maxWidth: 400 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colorTokens.neutral[900],
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
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
              borderColor: colorTokens.neutral[300],
              color: colorTokens.neutral[700],
              fontWeight: 400,
              textTransform: "none",
              "&:hover": {
                borderColor: colorTokens.primary[500],
                backgroundColor: alpha(colorTokens.primary[500], 0.04),
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
              backgroundColor: colorTokens.primary[600],
              color: "white",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: colorTokens.primary[700],
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
