/**
 * Conversation List Tabs Component
 *
 * Tabs for filtering by assignee (Mine, Unassigned, All).
 * Displays conversation counts for each tab.
 */

import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { ConversationAssigneeType } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

export interface ConversationCounts {
  mine: number;
  unassigned: number;
  all: number;
}

export interface ConversationListTabsProps {
  /** Current assignee type filter */
  currentAssigneeType?: ConversationAssigneeType;
  /** Conversation counts */
  counts: ConversationCounts;
  /** Callback when tab changes */
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  /** Primary color function */
  primaryColor: (shade: number) => string;
  /** Neutral color function */
  neutralColor: (shade: number) => string;
}

export const ConversationListTabs: React.FC<ConversationListTabsProps> = ({
  currentAssigneeType,
  counts,
  onTabChange,
  primaryColor,
  neutralColor,
}) => {
  const getTabValue = (): string => {
    if (currentAssigneeType === ConversationAssigneeType.ME) return "mine";
    if (currentAssigneeType === ConversationAssigneeType.UNASSIGNED) return "unassigned";
    return "all";
  };

  return (
    <Box
      sx={{
        px: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
      }}
    >
      <Tabs
        value={getTabValue()}
        onChange={onTabChange}
        sx={{
          minHeight: 44,
          "& .MuiTabs-indicator": {
            backgroundColor: primaryColor(500),
            height: 3,
          },
        }}
      >
        <Tab
          label={`Mine (${counts.mine || 0})`}
          value="mine"
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            minHeight: 44,
            minWidth: "auto",
            px: 2,
            color: neutralColor(600),
            "&.Mui-selected": {
              color: primaryColor(700),
              fontWeight: 600,
            },
          }}
        />
        <Tab
          label={`Unassigned (${counts.unassigned || 0})`}
          value="unassigned"
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            minHeight: 44,
            minWidth: "auto",
            px: 2,
            color: neutralColor(600),
            "&.Mui-selected": {
              color: primaryColor(700),
              fontWeight: 600,
            },
          }}
        />
        <Tab
          label={`All (${counts.all || 0})`}
          value="all"
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            minHeight: 44,
            minWidth: "auto",
            px: 2,
            color: neutralColor(600),
            "&.Mui-selected": {
              color: primaryColor(700),
              fontWeight: 600,
            },
          }}
        />
      </Tabs>
    </Box>
  );
};
