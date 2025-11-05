/**
 * ConversationFilterMenu Component
 * Handles team and status filter menu
 */

import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import {
  ConversationStatus,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";

interface ConversationFilterMenuProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  teams?: Team[];
  onFilterClick?: () => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

const STATUS_OPTIONS = [
  { label: "All", value: ConversationStatus.ALL },
  { label: "Open", value: ConversationStatus.OPEN },
  { label: "Resolved", value: ConversationStatus.RESOLVED },
  { label: "Pending", value: ConversationStatus.PENDING },
  { label: "Snoozed", value: ConversationStatus.SNOOZED },
];

export const ConversationFilterMenu: React.FC<ConversationFilterMenuProps> = React.memo(({
  filters,
  onFiltersChange,
  teams = [],
  onFilterClick,
  primaryColor,
  neutralColor,
}) => {
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  const handleTeamSelect = (teamId: number | undefined) => {
    // When changing team, preserve assignee_type, status, inbox_id, search, and sort
    onFiltersChange({ ...filters, team_id: teamId, page: 1 });
  };

  const handleStatusSelect = (status: ConversationStatus) => {
    // When changing status, preserve assignee_type, inbox_id, and sort
    // Clear contextual filters (search, team) to avoid confusion
    const newFilters: Partial<ConversationListParams> = {
      status: status === ConversationStatus.ALL ? undefined : status,
      page: 1,
    };

    // Preserve assignee_type
    if (filters.assignee_type !== undefined) {
      newFilters.assignee_type = filters.assignee_type;
    }

    // Preserve inbox_id (for channel-specific views)
    if (filters.inbox_id !== undefined) {
      newFilters.inbox_id = filters.inbox_id;
    }

    // Preserve sort (orthogonal filter)
    if (filters.sort_by !== undefined) {
      newFilters.sort_by = filters.sort_by;
    }

    onFiltersChange(newFilters);
    setFilterMenuAnchor(null);
  };

  const isStatusSelected = (status: ConversationStatus): boolean => {
    return (
      filters.status === status || (Array.isArray(filters.status) && filters.status.includes(status))
    );
  };

  return (
    <>
      {/* Filter Button */}
      <Tooltip title="Filter">
        <IconButton
          size="small"
          onClick={(e) => {
            setFilterMenuAnchor(e.currentTarget);
            onFilterClick?.();
          }}
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
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
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
            minWidth: 280,
            backgroundColor: neutralColor(0),
            border: `1px solid ${neutralColor(200)}`,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            maxHeight: 500,
            overflow: "auto",
          },
        }}
      >
        {/* Team Filter Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(500),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Team
          </Typography>
        </Box>
        <MenuItem
          onClick={() => handleTeamSelect(undefined)}
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: neutralColor(900),
            "&:hover": {
              backgroundColor: neutralColor(100),
            },
          }}
        >
          <ListItemText
            primary="All Teams"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: !filters.team_id ? 600 : 400,
            }}
          />
          {!filters.team_id && <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />}
        </MenuItem>
        {teams.map((team) => {
          const isSelected = filters.team_id === team.id;
          return (
            <MenuItem
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: neutralColor(900),
                "&:hover": {
                  backgroundColor: neutralColor(100),
                },
              }}
            >
              <ListItemText
                primary={team.name || "Unknown Team"}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1, borderColor: neutralColor(200) }} />

        {/* Status Filter Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(500),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Status
          </Typography>
        </Box>
        {STATUS_OPTIONS.map((option) => {
          const isSelected = isStatusSelected(option.value);
          return (
            <MenuItem
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: neutralColor(900),
                "&:hover": {
                  backgroundColor: neutralColor(100),
                },
              }}
            >
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(400) }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1, borderColor: neutralColor(200) }} />

        {/* Additional Filters Placeholder */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(500),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Additional Filters
          </Typography>
        </Box>
      </Menu>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if filters, teams, or callbacks changed
  return (
    prevProps.filters.status === nextProps.filters.status &&
    prevProps.filters.team_id === nextProps.filters.team_id &&
    prevProps.teams === nextProps.teams &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.onFilterClick === nextProps.onFilterClick &&
    prevProps.primaryColor === nextProps.primaryColor &&
    prevProps.neutralColor === nextProps.neutralColor
  );
});
