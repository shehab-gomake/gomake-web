/**
 * ConversationTabs Component
 * Mine/Unassigned/All tabs with counts
 */

import React from "react";
import { Box, Tabs, Tab, Stack, Typography, Chip } from "@mui/material";
import {
  ConversationAssigneeType,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ConversationTabsProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  counts: {
    mine: number;
    unassigned: number;
    all: number;
  };
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

export const ConversationTabs: React.FC<ConversationTabsProps> = React.memo(({
  filters,
  onFiltersChange,
  counts,
  primaryColor,
  neutralColor,
}) => {
  const getCurrentTab = (): string => {
    if (filters.assignee_type === ConversationAssigneeType.ME) return "mine";
    if (filters.assignee_type === ConversationAssigneeType.UNASSIGNED) return "unassigned";
    return "all";
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    let assignee_type: ConversationAssigneeType | undefined;

    if (newValue === "mine") {
      assignee_type = ConversationAssigneeType.ME;
    } else if (newValue === "unassigned") {
      assignee_type = ConversationAssigneeType.UNASSIGNED;
    } else if (newValue === "all") {
      assignee_type = ConversationAssigneeType.ALL;
    }

    onFiltersChange({ ...filters, assignee_type, page: 1 });
  };

  const currentTab = getCurrentTab();

  return (
    <Box sx={{ px: 1.5, py: 0.5 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          minHeight: "auto",
          "& .MuiTab-root": {
            minHeight: "auto",
            py: 0.25,
            px: 1.5,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 400,
            color: neutralColor(600),
            "&.Mui-selected": {
              color: primaryColor(700),
              fontWeight: 500,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: primaryColor(500),
            height: 2,
          },
        }}
      >
        <Tab
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontSize: "0.875rem", color: "inherit" }}>Mine</Typography>
              <Chip
                label={counts.mine}
                size="small"
                sx={{
                  height: 18,
                  minWidth: 18,
                  fontSize: "0.688rem",
                  fontWeight: 500,
                  backgroundColor: currentTab === "mine" ? primaryColor(100) : neutralColor(100),
                  color: currentTab === "mine" ? primaryColor(700) : neutralColor(700),
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />
            </Stack>
          }
          value="mine"
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontSize: "0.875rem", color: "inherit" }}>Unassigned</Typography>
              <Chip
                label={counts.unassigned}
                size="small"
                sx={{
                  height: 18,
                  minWidth: 18,
                  fontSize: "0.688rem",
                  fontWeight: 500,
                  backgroundColor: currentTab === "unassigned" ? primaryColor(100) : neutralColor(100),
                  color: currentTab === "unassigned" ? primaryColor(700) : neutralColor(700),
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />
            </Stack>
          }
          value="unassigned"
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontSize: "0.875rem", color: "inherit" }}>All</Typography>
              <Chip
                label={counts.all}
                size="small"
                sx={{
                  height: 18,
                  minWidth: 18,
                  fontSize: "0.688rem",
                  fontWeight: 500,
                  backgroundColor: currentTab === "all" ? primaryColor(100) : neutralColor(100),
                  color: currentTab === "all" ? primaryColor(700) : neutralColor(700),
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />
            </Stack>
          }
          value="all"
        />
      </Tabs>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if filters, counts, or callbacks changed
  return (
    prevProps.filters.assignee_type === nextProps.filters.assignee_type &&
    prevProps.counts.mine === nextProps.counts.mine &&
    prevProps.counts.unassigned === nextProps.counts.unassigned &&
    prevProps.counts.all === nextProps.counts.all &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.primaryColor === nextProps.primaryColor &&
    prevProps.neutralColor === nextProps.neutralColor
  );
});
