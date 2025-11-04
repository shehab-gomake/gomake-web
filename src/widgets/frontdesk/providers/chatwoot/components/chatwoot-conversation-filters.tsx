import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemText, Badge, Typography, Divider } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ChatwootConversationFiltersProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
}

export const ChatwootConversationFilters: React.FC<ChatwootConversationFiltersProps> = ({ filters, onFiltersChange }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeFilterCount = [filters.status, filters.assignee_type, filters.sort_by].filter(Boolean).length;

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

  const getStatusLabel = (status: ConversationStatus): string => {
    const labels: Record<ConversationStatus, string> = {
      [ConversationStatus.ALL]: "All",
      [ConversationStatus.OPEN]: "Open",
      [ConversationStatus.RESOLVED]: "Resolved",
      [ConversationStatus.PENDING]: "Pending",
      [ConversationStatus.SNOOZED]: "Snoozed",
    };
    return labels[status];
  };

  const getAssigneeTypeLabel = (type: ConversationAssigneeType): string => {
    const labels: Record<ConversationAssigneeType, string> = {
      [ConversationAssigneeType.ME]: "Assigned to Me",
      [ConversationAssigneeType.UNASSIGNED]: "Unassigned",
      [ConversationAssigneeType.ALL]: "All",
      [ConversationAssigneeType.ASSIGNED]: "Assigned",
    };
    return labels[type];
  };

  const getSortByLabel = (sortBy: ConversationSortBy | string): string => {
    const labels: Record<ConversationSortBy | string, string> = {
      [ConversationSortBy.LAST_ACTIVITY_AT_DESC]: "Last Activity (Newest)",
      [ConversationSortBy.LAST_ACTIVITY_AT_ASC]: "Last Activity (Oldest)",
      [ConversationSortBy.CREATED_AT_DESC]: "Created (Newest)",
      [ConversationSortBy.CREATED_AT_ASC]: "Created (Oldest)",
    };
    return labels[sortBy] || sortBy;
  };

  return (
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
          const isSelected = filters.status === status;
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
                primary={getStatusLabel(status)}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />}
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
          {!filters.assignee_type && <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />}
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
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />}
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
          {!filters.sort_by && <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />}
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
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: primaryColor(600) }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
