import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootTeams } from "../hooks/resources/use-chatwoot-teams";
import { ConversationStatus, ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ConversationFilterMenu, ConversationSortMenu, ConversationSearchBar, ConversationTabs, ConversationLabelsFilter } from "./conversation-list";

interface ChatwootConversationListHeaderProps {
  status?: ConversationStatus;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onNextClick?: () => void;
  onClearFilters?: () => void;
  conversations?: any[];
  mineCount?: number;
  unassignedCount?: number;
  allCount?: number;
}

export const ChatwootConversationListHeader: React.FC<ChatwootConversationListHeaderProps> = ({
  status,
  filters = {},
  onFiltersChange = () => {},
  onFilterClick,
  onSortClick,
  onNextClick,
  onClearFilters,
  mineCount,
  unassignedCount,
  allCount,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Get counts from API response (stored in atom)
  const apiCounts = useRecoilValue(chatwootConversationCountsAtom);
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  // Fetch teams for team filter
  const { teams } = useChatwootTeams(accountId);

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

  return (
    <Box
      sx={{
        backgroundColor: neutralColor(25),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Top Section: Title, Status Tag, Action Buttons */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: neutralColor(900),
          }}
        >
          Tickets
        </Typography>

        <Stack direction="row" spacing={0.25}>
          {/* Clear Filters Button - only show when filters are active */}
          {hasActiveFilters && onClearFilters && (
            <Tooltip title="Clear Filters">
              <IconButton
                size="small"
                onClick={onClearFilters}
                sx={{
                  color: neutralColor(600),
                  "&:hover": {
                    backgroundColor: neutralColor(100),
                    color: primaryColor(600),
                  },
                  width: 28,
                  height: 28,
                  padding: 0.5,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          <ConversationLabelsFilter
            accountId={accountId}
            filters={filters}
            onFiltersChange={onFiltersChange}
            primaryColor={primaryColor}
            neutralColor={neutralColor}
          />

          <ConversationFilterMenu
            filters={filters}
            onFiltersChange={onFiltersChange}
            teams={teams}
            onFilterClick={onFilterClick}
            primaryColor={primaryColor}
            neutralColor={neutralColor}
          />

          <ConversationSortMenu
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSortClick={onSortClick}
            primaryColor={primaryColor}
            neutralColor={neutralColor}
          />

          {/* Next/Navigation Button */}
          <Tooltip title="Next">
            <IconButton
              size="small"
              onClick={onNextClick}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  backgroundColor: neutralColor(100),
                  color: neutralColor(900),
                },
                width: 28,
                height: 28,
                padding: 0.5,
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Filter Tabs */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <ConversationTabs
          filters={filters}
          onFiltersChange={onFiltersChange}
          counts={counts}
          primaryColor={primaryColor}
          neutralColor={neutralColor}
        />
      </Box>

      {/* Search Bar */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <ConversationSearchBar filters={filters} onFiltersChange={onFiltersChange} neutralColor={neutralColor} />
      </Box>
    </Box>
  );
};
