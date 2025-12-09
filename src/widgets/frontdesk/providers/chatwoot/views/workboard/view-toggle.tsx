/**
 * View Toggle Component
 *
 * Toggle between Status and Assignee views for the Kanban board.
 *
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo } from "react";
import { ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  ViewColumn as StatusIcon,
  People as AssigneeIcon,
} from "@mui/icons-material";

// Design system
import { colorTokens, radiusTokens } from "@/widgets/frontdesk/design-system";

// Types
import { KanbanViewMode } from "../../types/kanban.types";

// ============================================
// Types
// ============================================

export interface ViewToggleProps {
  viewMode: KanbanViewMode;
  onViewModeChange: (mode: KanbanViewMode) => void;
}

// ============================================
// Component
// ============================================

const ViewToggleComponent: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  const { t } = useTranslation();
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: KanbanViewMode | null
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleChange}
      aria-label={t("frontdesk.workboard.kanbanViewMode")}
      size="small"
      sx={{
        backgroundColor: colorTokens.neutral[100],
        borderRadius: "10px",
        padding: "3px",
        border: `1px solid ${colorTokens.neutral[200]}`,
        "& .MuiToggleButtonGroup-grouped": {
          border: "none",
          borderRadius: "8px !important",
          margin: 0,
        },
        "& .MuiToggleButton-root": {
          fontSize: "13px",
          fontWeight: 500,
          color: colorTokens.neutral[600],
          padding: "8px 14px",
          textTransform: "none",
          transition: "all 0.15s ease",
          "&.Mui-selected": {
            backgroundColor: colorTokens.primary[600],
            color: colorTokens.semantic.text.inverse,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            "&:hover": {
              backgroundColor: colorTokens.primary[700],
            },
          },
          "&:hover:not(.Mui-selected)": {
            backgroundColor: colorTokens.neutral[200],
          },
        },
      }}
    >
      <Tooltip title={t("frontdesk.workboard.groupByStatus")}>
        <ToggleButton
          value="status"
          aria-label={t("frontdesk.workboard.statusView")}
        >
          <StatusIcon sx={{ fontSize: 16, marginRight: "6px" }} />
          {t("frontdesk.workboard.status")}
        </ToggleButton>
      </Tooltip>
      <Tooltip title={t("frontdesk.workboard.groupByAssignee")}>
        <ToggleButton
          value="assignee"
          aria-label={t("frontdesk.workboard.assigneeView")}
        >
          <AssigneeIcon sx={{ fontSize: 16, marginRight: "6px" }} />
          {t("frontdesk.workboard.assignee")}
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export const ViewToggle = memo(ViewToggleComponent);
