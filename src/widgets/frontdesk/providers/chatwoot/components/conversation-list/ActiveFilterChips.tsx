/**
 * ActiveFilterChips Component
 *
 * Modern filter chip display for active conversation filters.
 * Features clean pill-style chips with consistent sizing and softer colors.
 * Shows: Status, Team, Labels, Inbox filters (excludes assignee_type which is handled by tabs).
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  colorTokens,
  radiusTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";
import {
  ConversationListParams,
  ConversationStatus,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

// =============================================================================
// Types
// =============================================================================

interface ActiveFilterChipsProps {
  filters: Partial<ConversationListParams>;
  onRemoveFilter: (
    filterType: "status" | "team_id" | "labels" | "inbox_id" | "label",
    value?: string
  ) => void;
  teams?: Team[];
  labels?: ChatwootLabel[];
  inboxes?: ChatwootInbox[];
  /** @deprecated No longer used - colors are now from design tokens */
  primaryColor?: (shade: number) => string;
  /** @deprecated No longer used - colors are now from design tokens */
  neutralColor?: (shade: number) => string;
}

interface ChipColorConfig {
  bg: string;
  text: string;
  border: string;
  iconHover: string;
}

// =============================================================================
// Constants
// =============================================================================

const CHIP_HEIGHT = 24;
const CHIP_RADIUS = 12; // 12px for pill shape
const CLOSE_ICON_SIZE = 14;

// Status labels - function to get translated labels
const getStatusLabels = (
  t: (key: string) => string
): Record<ConversationStatus, string> => ({
  [ConversationStatus.ALL]: t("frontdesk.filters.statusAll"),
  [ConversationStatus.OPEN]: t("frontdesk.workboard.statusLabels.open"),
  [ConversationStatus.RESOLVED]: t("frontdesk.workboard.statusLabels.resolved"),
  [ConversationStatus.PENDING]: t("frontdesk.workboard.statusLabels.pending"),
  [ConversationStatus.SNOOZED]: t("frontdesk.filters.statusSnoozed"),
});

// Status color configurations - softer, more refined colors
const STATUS_COLORS: Record<ConversationStatus, ChipColorConfig> = {
  [ConversationStatus.ALL]: {
    bg: colorTokens.neutral[100],
    text: colorTokens.neutral[700],
    border: colorTokens.neutral[200],
    iconHover: colorTokens.neutral[800],
  },
  [ConversationStatus.OPEN]: {
    bg: colorTokens.success[50],
    text: colorTokens.success[700],
    border: colorTokens.success[200],
    iconHover: colorTokens.success[800],
  },
  [ConversationStatus.RESOLVED]: {
    bg: colorTokens.neutral[100],
    text: colorTokens.neutral[600],
    border: colorTokens.neutral[200],
    iconHover: colorTokens.neutral[700],
  },
  [ConversationStatus.PENDING]: {
    bg: colorTokens.warning[50],
    text: colorTokens.warning[700],
    border: colorTokens.warning[200],
    iconHover: colorTokens.warning[800],
  },
  [ConversationStatus.SNOOZED]: {
    bg: colorTokens.info[50],
    text: colorTokens.info[700],
    border: colorTokens.info[200],
    iconHover: colorTokens.info[800],
  },
};

// Team chip colors (indigo)
const TEAM_COLORS: ChipColorConfig = {
  bg: "#EEF2FF", // indigo-50
  text: "#4338CA", // indigo-600
  border: "#C7D2FE", // indigo-200
  iconHover: "#3730A3", // indigo-700
};

// Inbox chip colors (neutral)
const INBOX_COLORS: ChipColorConfig = {
  bg: colorTokens.neutral[100],
  text: colorTokens.neutral[700],
  border: colorTokens.neutral[200],
  iconHover: colorTokens.neutral[800],
};

// =============================================================================
// Styles
// =============================================================================

const getChipStyles = (colors: ChipColorConfig) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  height: CHIP_HEIGHT,
  px: 1.25,
  backgroundColor: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: `${CHIP_RADIUS}px`,
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: colors.text,
  },
});

const getChipLabelStyles = (color: string) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: color,
  lineHeight: 1,
  whiteSpace: "nowrap" as const,
});

const getCloseButtonStyles = (colors: ChipColorConfig) => ({
  p: 0,
  ml: 0.25,
  width: 16,
  height: 16,
  minWidth: 16,
  color: colors.text,
  opacity: 0.6,
  transition: "all 0.15s ease",
  "&:hover": {
    backgroundColor: "transparent",
    opacity: 1,
    color: colors.iconHover,
  },
});

// =============================================================================
// FilterChip Sub-component
// =============================================================================

interface FilterChipProps {
  label: string;
  colors: ChipColorConfig;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, colors, onRemove }) => {
  const { t } = useTranslation();
  return (
    <Box sx={getChipStyles(colors)}>
      <Box component="span" sx={getChipLabelStyles(colors.text)}>
        {label}
      </Box>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        sx={getCloseButtonStyles(colors)}
        aria-label={t("frontdesk.filters.removeFilter", { label })}
      >
        <CloseIcon sx={{ fontSize: CLOSE_ICON_SIZE }} />
      </IconButton>
    </Box>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  teams = [],
  labels = [],
  inboxes = [],
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const STATUS_LABELS = getStatusLabels(t);

  // Get selected labels (can be string or string[])
  const selectedLabels: string[] = Array.isArray(filters.labels)
    ? filters.labels
    : filters.labels
    ? [filters.labels]
    : [];

  // Get status (can be ConversationStatus or ConversationStatus[])
  const status = Array.isArray(filters.status)
    ? filters.status[0]
    : filters.status;

  // Get team name
  const selectedTeam = teams.find((t) => t.id === filters.team_id);

  // Get inbox name
  const selectedInbox = inboxes.find((i) => i.id === filters.inbox_id);

  // Check if we have any active filters
  const hasActiveFilters =
    (status && status !== ConversationStatus.ALL) ||
    filters.team_id ||
    selectedLabels.length > 0 ||
    filters.inbox_id;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 0.75,
        backgroundColor: colorTokens.semantic.background.secondary,
        borderTop: `1px solid ${colorTokens.neutral[100]}`,
        direction: dir,
      }}
    >
      {/* Status Filter Chip */}
      {status && status !== ConversationStatus.ALL && (
        <FilterChip
          label={t("frontdesk.filters.statusLabel", {
            status: STATUS_LABELS[status],
          })}
          colors={STATUS_COLORS[status]}
          onRemove={() => onRemoveFilter("status")}
        />
      )}

      {/* Team Filter Chip */}
      {selectedTeam && (
        <FilterChip
          label={t("frontdesk.filters.teamLabel", { name: selectedTeam.name })}
          colors={TEAM_COLORS}
          onRemove={() => onRemoveFilter("team_id")}
        />
      )}

      {/* Inbox Filter Chip */}
      {selectedInbox && (
        <FilterChip
          label={t("frontdesk.filters.inboxLabel", {
            name: selectedInbox.name,
          })}
          colors={INBOX_COLORS}
          onRemove={() => onRemoveFilter("inbox_id")}
        />
      )}

      {/* Label Filter Chips */}
      {selectedLabels.map((labelTitle) => {
        const label = labels.find((l) => l.title === labelTitle);
        const labelColors: ChipColorConfig = label?.color
          ? {
              bg: `${label.color}12`,
              text: label.color,
              border: `${label.color}30`,
              iconHover: label.color,
            }
          : {
              bg: colorTokens.primary[50],
              text: colorTokens.primary[700],
              border: colorTokens.primary[200],
              iconHover: colorTokens.primary[800],
            };

        return (
          <FilterChip
            key={labelTitle}
            label={labelTitle}
            colors={labelColors}
            onRemove={() => onRemoveFilter("label", labelTitle)}
          />
        );
      })}
    </Box>
  );
};
