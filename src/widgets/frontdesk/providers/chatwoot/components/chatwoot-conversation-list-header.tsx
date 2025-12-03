import React, { useMemo, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { colorTokens, radiusTokens, semanticSpacing } from "@/widgets/frontdesk/design-system";
import { useChatwootTeams } from "../hooks/resources/use-chatwoot-teams";
import { useChatwootLabels } from "../hooks/use-chatwoot-labels";
import { useChatwootInboxes } from "../hooks/use-chatwoot-inboxes";
import { ConversationStatus, ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ConversationFilterMenu, ConversationSortMenu, ConversationSearchBar, ConversationTabs, ConversationLabelsFilter, ConversationTeamsFilter, ActiveFilterChips } from "./conversation-list";

// =============================================================================
// Types
// =============================================================================

interface ChatwootConversationListHeaderProps {
  status?: ConversationStatus;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onClearFilters?: () => void;
  conversations?: any[];
  mineCount?: number;
  unassignedCount?: number;
  allCount?: number;
}

// =============================================================================
// Constants
// =============================================================================

const HEADER_ICON_SIZE = 16;

// =============================================================================
// Component
// =============================================================================

export const ChatwootConversationListHeader: React.FC<ChatwootConversationListHeaderProps> = ({
  status,
  filters = {},
  onFiltersChange = () => {},
  onFilterClick,
  onSortClick,
  onClearFilters,
  mineCount,
  unassignedCount,
  allCount,
}) => {

  // Get counts from API response (stored in atom)
  const apiCounts = useRecoilValue(chatwootConversationCountsAtom);
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  // Fetch teams for team filter
  const { teams } = useChatwootTeams(accountId);

  // Fetch labels for label filter chips
  const { labels } = useChatwootLabels(accountId);

  // Fetch inboxes for inbox filter chips
  const { inboxes } = useChatwootInboxes();

  // Use provided counts if available, otherwise use counts from API
  const counts = useMemo(() => {
    if (mineCount !== undefined && unassignedCount !== undefined && allCount !== undefined) {
      return { mine: mineCount, unassigned: unassignedCount, all: allCount };
    }
    return apiCounts;
  }, [mineCount, unassignedCount, allCount, apiCounts]);

  // Check if any non-default filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.q || // search query
        filters.team_id || // team filter
        filters.labels || // labels filter
        (filters.sort_by && filters.sort_by !== "latest_activity") // non-default sort
    );
  }, [filters]);

  // Handler for removing individual filters
  const handleRemoveFilter = useCallback(
    (filterType: "status" | "team_id" | "labels" | "inbox_id" | "label", value?: string) => {
      if (filterType === "status") {
        const newFilters = { ...filters, status: undefined, page: 1 };
        onFiltersChange(newFilters);
      } else if (filterType === "team_id") {
        const newFilters = { ...filters, team_id: undefined, page: 1 };
        onFiltersChange(newFilters);
      } else if (filterType === "inbox_id") {
        const newFilters = { ...filters, inbox_id: undefined, page: 1 };
        onFiltersChange(newFilters);
      } else if (filterType === "label" && value) {
        const currentLabels = Array.isArray(filters.labels)
          ? filters.labels
          : filters.labels
          ? [filters.labels]
          : [];
        const newLabels = currentLabels.filter((l) => l !== value);
        const newFilters = {
          ...filters,
          labels: newLabels.length > 0 ? newLabels : undefined,
          page: 1,
        };
        onFiltersChange(newFilters);
      } else if (filterType === "labels") {
        const newFilters = { ...filters, labels: undefined, page: 1 };
        onFiltersChange(newFilters);
      }
    },
    [filters, onFiltersChange]
  );

  return (
    <Box
      sx={{
        backgroundColor: colorTokens.semantic.background.primary,
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      {/* Top Section: Title + Action Icons */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 1.25,
          minHeight: 48,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: colorTokens.neutral[900],
            letterSpacing: "-0.01em",
          }}
        >
          Tickets
        </Typography>

        {/* Action Icons - consistent 16px size, equal spacing */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <ConversationLabelsFilter
            accountId={accountId}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />

          <ConversationTeamsFilter
            accountId={accountId}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />

          <ConversationFilterMenu
            filters={filters}
            onFiltersChange={onFiltersChange}
            teams={teams}
            onFilterClick={onFilterClick}
          />

          <ConversationSortMenu
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSortClick={onSortClick}
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && onClearFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={onClearFilters}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  color: colorTokens.neutral[500],
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: colorTokens.error[50],
                    color: colorTokens.error[600],
                  },
                }}
              >
                <ClearIcon sx={{ fontSize: HEADER_ICON_SIZE }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/* Tabs Section */}
      <ConversationTabs
        filters={filters}
        onFiltersChange={onFiltersChange}
        counts={counts}
      />

      {/* Active Filter Chips - only shown when filters are active */}
      <ActiveFilterChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        teams={teams}
        labels={labels}
        inboxes={inboxes}
      />

      {/* Search Bar */}
      <ConversationSearchBar filters={filters} onFiltersChange={onFiltersChange} />
    </Box>
  );
};
