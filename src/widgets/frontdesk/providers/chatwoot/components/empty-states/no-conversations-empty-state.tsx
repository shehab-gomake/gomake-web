import React from "react";
import { Box, Typography, Button, Stack, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
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
export const NoConversationsEmptyState: React.FC<
  NoConversationsEmptyStateProps
> = ({ filterContext, onRefresh, onClearFilters, hasFilters = false }) => {
  const { t } = useTranslation();

  // Context-aware messaging
  const getMessage = () => {
    if (hasFilters) {
      return {
        title: t("frontdesk.emptyStates.noTicketsMatchFilters"),
        description: t("frontdesk.emptyStates.adjustFilters"),
      };
    }

    switch (filterContext) {
      case "open":
      case "mine":
        return {
          title: t("frontdesk.emptyStates.noOpenTickets"),
          description: t("frontdesk.emptyStates.allTicketsClosed"),
        };
      case "resolved":
        return {
          title: t("frontdesk.emptyStates.noClosedTickets"),
          description: t("frontdesk.emptyStates.noClosedTicketsDescription"),
        };
      case "pending":
        return {
          title: t("frontdesk.emptyStates.noPendingTickets"),
          description: t("frontdesk.emptyStates.noPendingTicketsDescription"),
        };
      case "snoozed":
        return {
          title: t("frontdesk.emptyStates.noSnoozedTickets"),
          description: t("frontdesk.emptyStates.noSnoozedTicketsDescription"),
        };
      case "unassigned":
        return {
          title: t("frontdesk.emptyStates.noUnassignedTickets"),
          description: t(
            "frontdesk.emptyStates.noUnassignedTicketsDescription"
          ),
        };
      case "mentions":
        return {
          title: t("frontdesk.emptyStates.noMentions"),
          description: t("frontdesk.emptyStates.noMentionsDescription"),
        };
      default:
        return {
          title: t("frontdesk.emptyStates.noTicketsYet"),
          description: t("frontdesk.emptyStates.startTicketOrWait"),
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
      <Stack
        sx={{
          gap: 1,
          mb: 3,
          maxWidth: 400,
        }}
      >
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
      <Stack
        direction="row"
        sx={{
          gap: 2,
        }}
      >
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
            {t("frontdesk.refresh")}
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
            {t("frontdesk.clearFilters")}
          </Button>
        )}
      </Stack>
    </Box>
  );
};
