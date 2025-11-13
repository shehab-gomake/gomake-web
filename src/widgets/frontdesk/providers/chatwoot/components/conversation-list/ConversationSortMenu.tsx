/**
 * ConversationSortMenu Component
 * Handles conversation sort options
 */

import React, { useState } from "react";
import { IconButton, Tooltip, Menu, Box, Typography } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  ConversationListParams,
  ConversationSortBy,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ConversationSortMenuProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onSortClick?: () => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

const SORT_OPTIONS = [
  { label: "Last Activity (Newest)", value: ConversationSortBy.LAST_ACTIVITY_AT_DESC },
  { label: "Last Activity (Oldest)", value: ConversationSortBy.LAST_ACTIVITY_AT_ASC },
  { label: "Created (Newest)", value: ConversationSortBy.CREATED_AT_DESC },
  { label: "Created (Oldest)", value: ConversationSortBy.CREATED_AT_ASC },
];

export const ConversationSortMenu: React.FC<ConversationSortMenuProps> = React.memo(({
  filters,
  onFiltersChange,
  onSortClick,
  primaryColor,
  neutralColor,
}) => {
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSortSelect = (sortBy: ConversationSortBy) => {
    onFiltersChange({ ...filters, sort_by: sortBy });
    setSortMenuAnchor(null);
  };

  return (
    <>
      {/* Sort Button */}
      <Tooltip title="Sort">
        <IconButton
          size="small"
          onClick={(e) => {
            setSortMenuAnchor(e.currentTarget);
            onSortClick?.();
          }}
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
          <SwapVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
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
            minWidth: 200,
            backgroundColor: neutralColor(0),
            border: `1px solid ${neutralColor(200)}`,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          {SORT_OPTIONS.map((option) => (
            <Box
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              sx={{
                px: 2,
                py: 1,
                cursor: "pointer",
                color: filters.sort_by === option.value ? primaryColor(700) : neutralColor(900),
                fontWeight: filters.sort_by === option.value ? 600 : 400,
                "&:hover": {
                  backgroundColor: neutralColor(100),
                },
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                {option.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if sort filter or callbacks changed
  return (
    prevProps.filters.sort_by === nextProps.filters.sort_by &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.onSortClick === nextProps.onSortClick &&
    prevProps.primaryColor === nextProps.primaryColor &&
    prevProps.neutralColor === nextProps.neutralColor
  );
});
