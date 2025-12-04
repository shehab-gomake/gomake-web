/**
 * NotificationFilters Component
 * Handles filter and sort controls for notifications
 */

import React, { useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  Divider,
  Checkbox,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NotificationSortOrder } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { NotificationListParams } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { buildNotificationFilters } from "../../utils/notification-filter-utils";
import { DropdownMenu, MenuSubheader } from "@/widgets/frontdesk/components/dropdown-menu/dropdown-menu";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

interface NotificationFiltersProps {
  filters: Partial<NotificationListParams>;
  onFiltersChange: (filters: Partial<NotificationListParams>) => void;
  neutralColor?: (shade: number) => string;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFiltersChange,
  neutralColor,
}) => {
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  const hasSnoozed = filters.includes?.includes("snoozed") || false;
  const hasRead = filters.includes?.includes("read") || false;
  const currentSortOrder = filters.sort_order === NotificationSortOrder.ASC ? "oldest" : "newest";

  const handleSortOrderChange = (event: any) => {
    const value = event.target.value;
    const sortOrder = value === "newest" ? NotificationSortOrder.DESC : NotificationSortOrder.ASC;
    const updatedFilters = buildNotificationFilters({
      snoozed: hasSnoozed,
      read: hasRead,
      sortOrder,
    });
    onFiltersChange(updatedFilters);
  };

  const handleSnoozedChange = (checked: boolean) => {
    const updatedFilters = buildNotificationFilters({
      snoozed: checked,
      read: hasRead,
      sortOrder: filters.sort_order as NotificationSortOrder,
    });
    onFiltersChange(updatedFilters);
  };

  const handleReadChange = (checked: boolean) => {
    const updatedFilters = buildNotificationFilters({
      snoozed: hasSnoozed,
      read: checked,
      sortOrder: filters.sort_order as NotificationSortOrder,
    });
    onFiltersChange(updatedFilters);
  };

  return (
    <>
      {/* Filter Dropdown Button */}
      <IconButton
        size="small"
        onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
        sx={{
          color: colorTokens.neutral[600],
          p: 0.5,
          "&:hover": {
            backgroundColor: colorTokens.neutral[100],
          },
        }}
      >
        <ExpandMoreIcon fontSize="small" />
      </IconButton>

      {/* Filter Menu - Dropdown */}
      <DropdownMenu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        width={280}
        disableContentPadding
      >
        {/* Display Options Section */}
        <Box sx={{ mb: 2 }}>
          <MenuSubheader>DISPLAY OPTIONS</MenuSubheader>

          {/* Snoozed Checkbox */}
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              handleSnoozedChange(!hasSnoozed);
            }}
            sx={{
              py: 1,
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Checkbox
              checked={hasSnoozed}
              onChange={(e) => handleSnoozedChange(e.target.checked)}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
            <ListItemText
              primary="Snoozed"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: hasSnoozed ? 600 : 400,
              }}
            />
          </MenuItem>

          {/* Read Checkbox */}
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              handleReadChange(!hasRead);
            }}
            sx={{
              py: 1,
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Checkbox
              checked={hasRead}
              onChange={(e) => handleReadChange(e.target.checked)}
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
            <ListItemText
              primary="Read"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: hasRead ? 600 : 400,
              }}
            />
          </MenuItem>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Sort Order Section */}
        <Box>
          <MenuSubheader>SORT ORDER</MenuSubheader>
          <FormControl fullWidth size="small" sx={{ px: 2, pb: 1 }}>
            <Select
              value={currentSortOrder}
              onChange={handleSortOrderChange}
              sx={{
                fontSize: 13,
                "& .MuiSelect-select": {
                  py: 1,
                },
              }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DropdownMenu>
    </>
  );
};
