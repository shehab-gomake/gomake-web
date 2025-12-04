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
import { colorTokens } from "@/widgets/frontdesk/design-system";

export interface ConversationListActionsProps {
  /** Callback when filter button is clicked */
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback when sort button is clicked */
  onSortClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback when compose button is clicked (optional) */
  onComposeClick?: () => void;
  /** @deprecated Use colorTokens.neutral directly */
  neutralColor?: (shade: number) => string;
  /** @deprecated Use colorTokens.primary directly */
  primaryColor?: (shade: number) => string;
}

export const ConversationListActions: React.FC<ConversationListActionsProps> = ({
  onFilterClick,
  onSortClick,
  onComposeClick,
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
              backgroundColor: colorTokens.primary[600],
              "&:hover": {
                backgroundColor: colorTokens.primary[700],
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
            color: colorTokens.neutral[600],
            backgroundColor: colorTokens.neutral[100],
            "&:hover": {
              backgroundColor: colorTokens.neutral[200],
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
            color: colorTokens.neutral[600],
            backgroundColor: colorTokens.neutral[100],
            "&:hover": {
              backgroundColor: colorTokens.neutral[200],
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
