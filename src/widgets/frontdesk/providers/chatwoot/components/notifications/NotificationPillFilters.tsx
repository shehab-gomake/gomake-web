/**
 * NotificationPillFilters Component
 * Pill-style toggle buttons for UNREAD | ALL filter
 */

import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { NotificationListParams } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { buildNotificationFilters } from "../../utils/notification-filter-utils";
import { NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { colorTokens, radiusTokens } from "@/widgets/frontdesk/design-system";

interface NotificationPillFiltersProps {
  filters: Partial<NotificationListParams>;
  onFiltersChange: (filters: Partial<NotificationListParams>) => void;
}

export const NotificationPillFilters: React.FC<NotificationPillFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const hasRead = filters.includes?.includes("read") || false;
  const currentFilter = hasRead ? "all" : "unread";

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null
  ) => {
    if (newFilter === null) return; // Prevent deselection

    const updatedFilters = buildNotificationFilters({
      snoozed: filters.includes?.includes("snoozed") || false,
      read: newFilter === "all",
      sortOrder: (filters.sort_order as NotificationSortOrder) || NotificationSortOrder.DESC,
    });
    onFiltersChange(updatedFilters);
  };

  return (
    <ToggleButtonGroup
      value={currentFilter}
      exclusive
      onChange={handleFilterChange}
      size="small"
      sx={{
        height: 28,
        "& .MuiToggleButton-root": {
          px: 1.5,
          py: 0.5,
          fontSize: "0.8125rem",
          fontWeight: 500,
          border: `1px solid ${colorTokens.neutral[300]}`,
          color: colorTokens.neutral[700],
          textTransform: "none",
          borderRadius: `${radiusTokens.lg}px !important`,
          "&.Mui-selected": {
            backgroundColor: colorTokens.primary[600],
            color: colorTokens.semantic.text.inverse,
            borderColor: colorTokens.primary[600],
            "&:hover": {
              backgroundColor: colorTokens.primary[700],
            },
          },
          "&:hover": {
            backgroundColor: colorTokens.neutral[50],
          },
          "&:first-of-type": {
            borderTopRightRadius: "0 !important",
            borderBottomRightRadius: "0 !important",
            borderRight: "none",
          },
          "&:last-of-type": {
            borderTopLeftRadius: "0 !important",
            borderBottomLeftRadius: "0 !important",
            borderLeft: "none",
          },
        },
      }}
    >
      <ToggleButton value="unread" aria-label="unread only">
        UNREAD
      </ToggleButton>
      <ToggleButton value="all" aria-label="all notifications">
        ALL
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

