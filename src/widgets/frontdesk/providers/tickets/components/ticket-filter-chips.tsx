import React from "react";
import { Box, Chip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { TicketFilters, TicketStatus, TicketPriority } from "../types/api.types";
import { formatTicketStatus } from "../types/transformers";
import { colorTokens } from "@/widgets/frontdesk/design-system";

interface TicketFilterChipsProps {
  filters: TicketFilters;
  onRemoveFilter: (filterKey: keyof TicketFilters, value?: any) => void;
  onClearAll: () => void;
}

// Status colors matching the filter menu
const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: colorTokens.info[600],
  IN_PROGRESS: colorTokens.warning[600],
  PENDING: colorTokens.warning[600],
  RESOLVED: colorTokens.success[600],
  CLOSED: colorTokens.neutral[600],
  REOPENED: colorTokens.error[600],
};

// Priority colors matching the filter menu
const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: colorTokens.neutral[600],
  MEDIUM: colorTokens.info[600],
  HIGH: colorTokens.warning[600],
  URGENT: colorTokens.error[600],
};

export const TicketFilterChips: React.FC<TicketFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  // Build array of active filters
  // Use useMemo to avoid recreating on every render
  const activeFilters = React.useMemo(() => {
    const filtersList: Array<{ key: keyof TicketFilters; label: string; value: any; color?: string }> = [];

    // Status filter
    if (filters.status) {
      filtersList.push({
        key: "status",
        label: formatTicketStatus(filters.status),
        value: filters.status,
        color: STATUS_COLORS[filters.status],
      });
    }

    // Priority filter
    if (filters.priority) {
      filtersList.push({
        key: "priority",
        label: filters.priority,
        value: filters.priority,
        color: PRIORITY_COLORS[filters.priority],
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach((tag) => {
        filtersList.push({
          key: "tags",
          label: tag,
          value: tag,
        });
      });
    }

    // Assignee filter
    if (filters.assigneeId) {
      filtersList.push({
        key: "assigneeId",
        label: `Assignee: ${filters.assigneeId}`,
        value: filters.assigneeId,
      });
    }

    // Manager filter
    if (filters.managerId) {
      filtersList.push({
        key: "managerId",
        label: `Manager: ${filters.managerId}`,
        value: filters.managerId,
      });
    }

    // Category filter
    if (filters.categoryId) {
      filtersList.push({
        key: "categoryId",
        label: `Category: ${filters.categoryId}`,
        value: filters.categoryId,
      });
    }

    // Channel filter
    if (filters.providerChannel) {
      filtersList.push({
        key: "providerChannel",
        label: `Channel: ${filters.providerChannel}`,
        value: filters.providerChannel,
      });
    }

    // Customer email filter
    if (filters.customerEmail) {
      filtersList.push({
        key: "customerEmail",
        label: `Email: ${filters.customerEmail}`,
        value: filters.customerEmail,
      });
    }

    // Customer phone filter
    if (filters.customerPhone) {
      filtersList.push({
        key: "customerPhone",
        label: `Phone: ${filters.customerPhone}`,
        value: filters.customerPhone,
      });
    }

    // Created by filter
    if (filters.createdBy) {
      filtersList.push({
        key: "createdBy",
        label: `Created by: ${filters.createdBy}`,
        value: filters.createdBy,
      });
    }

    return filtersList;
  }, [filters]);

  // Debug: Log filters to see what we're receiving
  React.useEffect(() => {
    console.log("[TicketFilterChips] Component rendered");
    console.log("[TicketFilterChips] Filters received:", JSON.stringify(filters, null, 2));
    console.log("[TicketFilterChips] Active filters count:", activeFilters.length);
    console.log("[TicketFilterChips] Active filters:", activeFilters);
  }, [filters, activeFilters]);

  // Always render the container, even if empty (for debugging)
  // In production, return null if no filters
  if (activeFilters.length === 0) {
    // For debugging: render empty container to verify component is being called
    // Remove this in production and return null instead
    return (
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "none", // Hidden when empty, but still in DOM for debugging
        }}
        data-testid="ticket-filter-chips-empty"
      />
    );
  }

  const handleRemoveFilter = (filter: typeof activeFilters[0]) => {
    if (filter.key === "tags") {
      // For tags, pass the specific tag value to remove
      onRemoveFilter("tags", filter.value);
    } else {
      onRemoveFilter(filter.key);
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 0.75,
        alignItems: "center",
      }}
    >
      {activeFilters.map((filter, index) => (
        <Chip
          key={`${filter.key}-${index}`}
          label={filter.label}
          size="small"
          onDelete={() => handleRemoveFilter(filter)}
          deleteIcon={<CancelIcon sx={{ fontSize: 16 }} />}
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: filter.color ? `${filter.color}15` : colorTokens.neutral[100],
            color: filter.color || colorTokens.neutral[700],
            border: filter.color ? `1px solid ${filter.color}40` : `1px solid ${colorTokens.neutral[300]}`,
            "& .MuiChip-label": {
              px: 1,
              py: 0,
            },
            "& .MuiChip-deleteIcon": {
              color: filter.color || colorTokens.neutral[500],
              fontSize: 16,
              "&:hover": {
                color: filter.color || colorTokens.neutral[700],
              },
            },
            "&:hover": {
              backgroundColor: filter.color ? `${filter.color}25` : colorTokens.neutral[200],
            },
          }}
        />
      ))}
      {activeFilters.length > 1 && (
        <Chip
          label="Clear all"
          size="small"
          onClick={onClearAll}
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: "transparent",
            color: colorTokens.neutral[600],
            border: `1px solid ${colorTokens.neutral[300]}`,
            cursor: "pointer",
            "& .MuiChip-label": {
              px: 1,
              py: 0,
            },
            "&:hover": {
              backgroundColor: colorTokens.neutral[100],
              borderColor: colorTokens.neutral[400],
            },
          }}
        />
      )}
    </Box>
  );
};

