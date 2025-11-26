/**
 * Conversation List Actions Component
 *
 * Action buttons for filtering, sorting, and composing conversations.
 */

import React from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export interface ConversationListActionsProps {
  /** Callback when filter button is clicked */
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback when sort button is clicked */
  onSortClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback when compose button is clicked (optional) */
  onComposeClick?: () => void;
  /** Neutral color function */
  neutralColor: (shade: number) => string;
  /** Primary color function (optional) */
  primaryColor?: (shade: number) => string;
}

export const ConversationListActions: React.FC<ConversationListActionsProps> = ({
  onFilterClick,
  onSortClick,
  onComposeClick,
  neutralColor,
  primaryColor,
}) => {
  return (
    <Stack direction="row" spacing={0.5}>
      {/* New Conversation Button */}
      {onComposeClick && (
        <Tooltip title="New Conversation">
          <IconButton
            size="small"
            onClick={onComposeClick}
            sx={{
              color: "white",
              backgroundColor: primaryColor ? primaryColor(600) : "#2563EB",
              "&:hover": {
                backgroundColor: primaryColor ? primaryColor(700) : "#1D4ED8",
              },
              width: 32,
              height: 32,
            }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Filter Button */}
      <Tooltip title="Filter">
        <IconButton
          size="small"
          onClick={onFilterClick}
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

      {/* Sort Button */}
      <Tooltip title="Sort">
        <IconButton
          size="small"
          onClick={onSortClick}
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
          <SwapVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
