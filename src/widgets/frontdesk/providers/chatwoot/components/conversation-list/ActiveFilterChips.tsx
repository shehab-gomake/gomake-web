/**
 * ActiveFilterChips Component
 * 
 * Displays active conversation filters as removable chips below the header.
 * Shows: Status, Team, Labels, Inbox filters (excludes assignee_type which is handled by tabs).
 */

import React from "react";
import { Box } from "@mui/material";
import { Chip, colorTokens } from "@/widgets/frontdesk/design-system";
import { ConversationListParams, ConversationStatus } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";
import type { ChatwootLabel } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

interface ActiveFilterChipsProps {
  filters: Partial<ConversationListParams>;
  onRemoveFilter: (filterType: "status" | "team_id" | "labels" | "inbox_id" | "label", value?: string) => void;
  teams?: Team[];
  labels?: ChatwootLabel[];
  inboxes?: ChatwootInbox[];
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

// Status labels
const STATUS_LABELS: Record<ConversationStatus, string> = {
  [ConversationStatus.ALL]: "All",
  [ConversationStatus.OPEN]: "Open",
  [ConversationStatus.RESOLVED]: "Resolved",
  [ConversationStatus.PENDING]: "Pending",
  [ConversationStatus.SNOOZED]: "Snoozed",
};

// Status colors
const STATUS_COLORS: Record<ConversationStatus, "primary" | "success" | "warning" | "neutral"> = {
  [ConversationStatus.ALL]: "neutral",
  [ConversationStatus.OPEN]: "primary",
  [ConversationStatus.RESOLVED]: "success",
  [ConversationStatus.PENDING]: "warning",
  [ConversationStatus.SNOOZED]: "warning",
};

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  teams = [],
  labels = [],
  inboxes = [],
  primaryColor,
  neutralColor,
}) => {
  // Get selected labels (can be string or string[])
  const selectedLabels: string[] = Array.isArray(filters.labels)
    ? filters.labels
    : filters.labels
    ? [filters.labels]
    : [];

  // Get status (can be ConversationStatus or ConversationStatus[])
  const status = Array.isArray(filters.status) ? filters.status[0] : filters.status;

  // Get team name
  const selectedTeam = teams.find((t) => t.id === filters.team_id);

  // Get inbox name
  const selectedInbox = inboxes.find((i) => i.id === filters.inbox_id);

  // Check if we have any active filters (excluding assignee_type which is handled by tabs)
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
        py: 0.75,
        display: "flex",
        flexWrap: "wrap",
        gap: 0.75,
        backgroundColor: neutralColor(50),
      }}
    >
      {/* Status Filter Chip */}
      {status && status !== ConversationStatus.ALL && (
        <Chip
          label={`Status: ${STATUS_LABELS[status]}`}
          variant="soft"
          color={STATUS_COLORS[status]}
          onDelete={() => onRemoveFilter("status")}
          size="small"
        />
      )}

      {/* Team Filter Chip - Indigo color to distinguish from status */}
      {selectedTeam && (
        <Chip
          label={`Team: ${selectedTeam.name}`}
          variant="soft"
          color="primary"
          onDelete={() => onRemoveFilter("team_id")}
          size="small"
          sx={{
            backgroundColor: "#4338ca20",
            borderColor: "#4338ca40",
            color: "#4338ca",
            "& .MuiChip-deleteIcon": {
              color: "#4338ca",
              "&:hover": {
                color: "#3730a3",
              },
            },
          }}
        />
      )}

      {/* Inbox Filter Chip */}
      {selectedInbox && (
        <Chip
          label={`Inbox: ${selectedInbox.name}`}
          variant="soft"
          color="neutral"
          onDelete={() => onRemoveFilter("inbox_id")}
          size="small"
        />
      )}

      {/* Label Filter Chips */}
      {selectedLabels.length > 0 &&
        selectedLabels.map((labelTitle) => {
          const label = labels.find((l) => l.title === labelTitle);
          return (
            <Chip
              key={labelTitle}
              label={labelTitle}
              variant="soft"
              color="primary"
              onDelete={() => onRemoveFilter("label", labelTitle)}
              size="small"
              sx={{
                ...(label?.color && {
                  backgroundColor: `${label.color}15`,
                  borderColor: `${label.color}30`,
                  color: label.color,
                  "& .MuiChip-deleteIcon": {
                    color: label.color,
                  },
                }),
              }}
            />
          );
        })}
    </Box>
  );
};

