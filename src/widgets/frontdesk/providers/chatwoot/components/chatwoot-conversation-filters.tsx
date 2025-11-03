import React, { useState, useMemo } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Badge,
  Typography,
  Divider,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  getConversationStatusLabel,
  getAssigneeTypeLabel,
  getSortByLabel,
} from "../utils/filter-utils";
import { ChatwootMultiSelectFilter, ChatwootSearchFilter, MultiSelectOption } from "./filters";
import { useChatwootTeams } from "../hooks/resources/use-chatwoot-teams";

interface ChatwootConversationFiltersProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  accountId?: number | null;
}

export const ChatwootConversationFilters: React.FC<ChatwootConversationFiltersProps> = ({
  filters,
  onFiltersChange,
  accountId,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Fetch teams for team filter
  const { teams, loading: teamsLoading } = useChatwootTeams(accountId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: ConversationStatus | undefined) => {
    onFiltersChange({ ...filters, status, page: 1 });
    handleClose();
  };

  const handleAssigneeTypeChange = (assignee_type: ConversationAssigneeType | undefined) => {
    onFiltersChange({ ...filters, assignee_type, page: 1 });
    handleClose();
  };

  const handleSortByChange = (sort_by: ConversationSortBy | string | undefined) => {
    onFiltersChange({ ...filters, sort_by: sort_by as ConversationSortBy, page: 1 });
    handleClose();
  };

  // New filter handlers
  const handleSearchChange = (q: string) => {
    onFiltersChange({ ...filters, q: q || undefined, page: 1 });
  };

  const handleTeamChange = (teamIds: string[]) => {
    // Convert string IDs to number for team_id (API expects single team_id)
    const team_id = teamIds.length > 0 ? parseInt(teamIds[0], 10) : undefined;
    onFiltersChange({ ...filters, team_id, page: 1 });
  };

  const handleClearAll = () => {
    onFiltersChange({ page: 1 });
    handleClose();
  };

  // Prepare team options for multi-select
  const teamOptions: MultiSelectOption[] = useMemo(() => {
    return (teams || []).map((team) => ({
      value: team.id?.toString() || "",
      label: team.name || "Unknown Team",
      count: team.conversations_count,
    }));
  }, [teams]);

  // Selected team IDs for multi-select
  const selectedTeamIds = useMemo(() => {
    return filters.team_id ? [filters.team_id.toString()] : [];
  }, [filters.team_id]);

  // Count active filters for badge
  const activeFilterCount = [
    filters.status && filters.status !== ConversationStatus.ALL,
    filters.assignee_type,
    filters.sort_by,
    filters.q,
    filters.team_id,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
      {/* Search Filter */}
      <ChatwootSearchFilter
        value={filters.q || ""}
        onChange={handleSearchChange}
        placeholder="Search conversations..."
      />

      {/* Team Filter */}
      <ChatwootMultiSelectFilter
        label="Team"
        options={teamOptions}
        selectedValues={selectedTeamIds}
        onChange={handleTeamChange}
        placeholder="All Teams"
        disabled={teamsLoading}
      />

      {/* Advanced Filters Menu (Status, Assignee, Sort) */}
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: neutralColor(600),
          "&:hover": {
            backgroundColor: neutralColor(100),
          },
        }}
      >
        <Badge badgeContent={activeFilterCount} color="primary">
          <FilterListIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            maxHeight: 400,
            overflow: "auto",
          },
        }}
      >
        {/* Status Filter */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(600),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Status
          </Typography>
        </Box>
        {Object.values(ConversationStatus).map((status) => {
          // Handle "All" status selection: when status is ALL, filters.status will be undefined
          const isSelected = 
            status === ConversationStatus.ALL 
              ? (filters.status === undefined || filters.status === ConversationStatus.ALL)
              : filters.status === status;
          return (
            <MenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItemText
                primary={getConversationStatusLabel(status)}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && (
                <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />
              )}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Assignee Type Filter */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(600),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Assignee
          </Typography>
        </Box>
        <MenuItem
          onClick={() => handleAssigneeTypeChange(undefined)}
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ListItemText
            primary="All"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: !filters.assignee_type ? 600 : 400,
            }}
          />
          {!filters.assignee_type && (
            <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />
          )}
        </MenuItem>
        {Object.values(ConversationAssigneeType).map((type) => {
          const isSelected = filters.assignee_type === type;
          return (
            <MenuItem
              key={type}
              onClick={() => handleAssigneeTypeChange(type)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItemText
                primary={getAssigneeTypeLabel(type)}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && (
                <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />
              )}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Sort By Filter */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(600),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Sort By
          </Typography>
        </Box>
        <MenuItem
          onClick={() => handleSortByChange(undefined)}
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ListItemText
            primary="Default"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: !filters.sort_by ? 600 : 400,
            }}
          />
          {!filters.sort_by && (
            <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />
          )}
        </MenuItem>
        {Object.values(ConversationSortBy).map((sortBy) => {
          const isSelected = filters.sort_by === sortBy;
          return (
            <MenuItem
              key={sortBy}
              onClick={() => handleSortByChange(sortBy)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItemText
                primary={getSortByLabel(sortBy)}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && (
                <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          size="small"
          variant="text"
          startIcon={<ClearIcon />}
          onClick={handleClearAll}
          sx={{
            textTransform: "none",
            color: neutralColor(600),
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              color: theme.palette.error.main,
            },
          }}
        >
          Clear All
        </Button>
      )}
    </Stack>
  );
};

