/**
 * ConversationFilterMenu Component
 *
 * Handles team and status filter menu.
 * Uses unified filter trigger and styles for consistent styling.
 */

import React, { useState, useCallback } from "react";
import { Box, Menu, MenuItem, ListItemText, Divider, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import { FilterIconButton, filterStyles } from "../unified-list";
import { colorTokens } from "@/widgets/frontdesk/design-system";
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
  { label: "Closed", value: ConversationStatus.RESOLVED },
  { label: "Pending", value: ConversationStatus.PENDING },
  { label: "Snoozed", value: ConversationStatus.SNOOZED },
];

export const ConversationFilterMenu: React.FC<ConversationFilterMenuProps> = React.memo(({
  filters,
  onFiltersChange,
  teams = [],
  onFilterClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onFilterClick?.();
  }, [onFilterClick]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTeamSelect = useCallback((teamId: number | undefined) => {
    onFiltersChange({ ...filters, team_id: teamId, page: 1 });
  }, [filters, onFiltersChange]);

  const handleStatusSelect = useCallback((status: ConversationStatus) => {
    const newFilters: Partial<ConversationListParams> = {
      status: status === ConversationStatus.ALL ? undefined : status,
      page: 1,
    };

    // Preserve assignee_type, inbox_id, sort_by
    if (filters.assignee_type !== undefined) {
      newFilters.assignee_type = filters.assignee_type;
    }
    if (filters.inbox_id !== undefined) {
      newFilters.inbox_id = filters.inbox_id;
    }
    if (filters.sort_by !== undefined) {
      newFilters.sort_by = filters.sort_by;
    }

    onFiltersChange(newFilters);
    handleClose();
  }, [filters, onFiltersChange, handleClose]);

  // Check if any filter is active
  const isActive = !!(filters.status || filters.team_id);
  const activeCount = [filters.status, filters.team_id].filter(Boolean).length;

  return (
    <>
      <FilterIconButton
        icon={<FilterListIcon />}
        tooltip="Filter"
        isActive={isActive}
        badgeCount={activeCount}
        onClick={handleOpen}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { ...filterStyles.menuPaper, minWidth: 280, maxHeight: 500 } }}
      >
        {/* Team Filter Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={filterStyles.sectionHeader}>
            Team
          </Typography>
        </Box>
        <MenuItem
          onClick={() => handleTeamSelect(undefined)}
          sx={{ py: 1, px: 2, display: "flex", justifyContent: "space-between" }}
        >
          <ListItemText
            primary="All Teams"
            primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: !filters.team_id ? 600 : 400 }}
          />
          {!filters.team_id && <CheckIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />}
        </MenuItem>
        {teams.map((team) => {
          const isSelected = filters.team_id === team.id;
          return (
            <MenuItem
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              sx={{ py: 1, px: 2, display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={team.name || "Unknown Team"}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isSelected ? 600 : 400 }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 1 }} />

        {/* Status Filter Section */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={filterStyles.sectionHeader}>
            Status
          </Typography>
        </Box>
        {STATUS_OPTIONS.map((option) => {
          const isSelected = option.value === ConversationStatus.ALL
            ? !filters.status
            : filters.status === option.value;
          return (
            <MenuItem
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              sx={{ py: 1, px: 2, display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isSelected ? 600 : 400 }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filters.status === nextProps.filters.status &&
    prevProps.filters.team_id === nextProps.filters.team_id &&
    prevProps.teams === nextProps.teams &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.onFilterClick === nextProps.onFilterClick
  );
});
