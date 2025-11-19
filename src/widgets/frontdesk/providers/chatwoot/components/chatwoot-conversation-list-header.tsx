import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useChatwootTeams } from "../hooks/resources/use-chatwoot-teams";
import { ConversationStatus, ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import {
  ConversationFilterMenu,
  ConversationSortMenu,
  ConversationSearchBar,
  ConversationTabs,
} from "./conversation-list";

interface ChatwootConversationListHeaderProps {
  status?: ConversationStatus;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onNextClick?: () => void;
  onRefresh?: () => void;
  onClearFilters?: () => void;
  onComposeClick?: () => void;
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
  onRefresh,
  onClearFilters,
  onComposeClick,
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

  // Get status label - memoized to prevent recreation on every render
  const statusLabel = useMemo(() => {
    if (!status || status === ConversationStatus.ALL) return "All";
    const labels: Record<ConversationStatus, string> = {
      [ConversationStatus.OPEN]: "Open",
      [ConversationStatus.RESOLVED]: "Closed",
      [ConversationStatus.PENDING]: "Pending",
      [ConversationStatus.SNOOZED]: "Snoozed",
      [ConversationStatus.ALL]: "All",
    };
    return labels[status] || "All";
  }, [status]);

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
        <Stack direction="row" alignItems="center" spacing={1}>
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
          {status && status !== ConversationStatus.ALL && (
            <Chip
              label={statusLabel}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: neutralColor(100),
                color: neutralColor(700),
                border: `1px solid ${neutralColor(300)}`,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {/* New Conversation Button */}
          {onComposeClick && (
            <Tooltip title="New Conversation">
              <IconButton
                size="small"
                onClick={onComposeClick}
                sx={{
                  color: "white",
                  backgroundColor: primaryColor(600),
                  "&:hover": {
                    backgroundColor: primaryColor(700),
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={onRefresh}
                sx={{
                  color: neutralColor(600),
                  backgroundColor: neutralColor(100),
                  "&:hover": {
                    backgroundColor: neutralColor(200),
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Clear Filters Button - only show when filters are active */}
          {hasActiveFilters && onClearFilters && (
            <Tooltip title="Clear Filters">
              <IconButton
                size="small"
                onClick={onClearFilters}
                sx={{
                  color: primaryColor(600),
                  backgroundColor: primaryColor(50),
                  "&:hover": {
                    backgroundColor: primaryColor(100),
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

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
                backgroundColor: neutralColor(100),
                "&:hover": {
                  backgroundColor: neutralColor(200),
                },
                width: 32,
                height: 32,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
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

