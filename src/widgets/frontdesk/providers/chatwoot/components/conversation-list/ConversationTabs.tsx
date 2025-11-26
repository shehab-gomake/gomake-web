/**
 * ConversationTabs Component
 * Mine/Unassigned/All tabs with counts
 *
 * RBAC: Tabs are filtered based on user permissions
 * - "Mine" tab: visible to all users
 * - "Unassigned" tab: visible to admins and users with conversation_unassigned_manage permission
 * - "All" tab: visible to admins and users with conversation_participating_manage permission
 */

import React, { useMemo } from "react";
import { Box, Tabs, Tab, Stack, Typography, Chip } from "@mui/material";
import {
  ConversationAssigneeType,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { ASSIGNEE_TAB_PERMISSIONS } from "../../constants/permissions.constants";

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
  // Get permission checking functions
  const { canAccess, isAgent, isAdministrator } = useChatwootPermissions();

  // Check which tabs are visible based on permissions
  // NOTE: In Chatwoot, agents can see all tabs (Mine/Unassigned/All)
  // The backend automatically filters conversations based on the agent's assigned inboxes
  // Only hide tabs if user has restricted custom role permissions
  const visibleTabs = useMemo(() => ({
    mine: true, // Always visible - all users can see Mine
    // Unassigned: Show for admins, agents, and users with unassigned permission
    // Agents can see unassigned conversations from their assigned inboxes (backend filtered)
    unassigned: isAdministrator || isAgent || canAccess(ASSIGNEE_TAB_PERMISSIONS.unassigned),
    // All: Show for admins, agents, and users with participating permission
    // Agents can see all conversations from their assigned inboxes (backend filtered)
    all: isAdministrator || isAgent || canAccess(ASSIGNEE_TAB_PERMISSIONS.all),
  }), [canAccess, isAgent, isAdministrator]);

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

    // When switching tabs, only preserve status and inbox_id filters
    // Clear contextual filters (search, team, sort) to avoid pollution
    const newFilters: Partial<ConversationListParams> = {
      assignee_type,
      page: 1,
    };

    // Explicitly preserve status filter if present
    if (filters.status !== undefined) {
      newFilters.status = filters.status;
    }

    // Explicitly preserve inbox_id if present (for channel-specific views)
    if (filters.inbox_id !== undefined) {
      newFilters.inbox_id = filters.inbox_id;
    }

    onFiltersChange(newFilters);
  };

  const currentTab = getCurrentTab();

  return (
    <Box sx={{ px: 1.5, pt: 1, pb: 0 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          minHeight: 36,
          "& .MuiTab-root": {
            minHeight: 36,
            py: 1,
            px: 2,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: neutralColor(600),
            "&.Mui-selected": {
              color: neutralColor(900),
              fontWeight: 600,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: primaryColor(600),
            height: 2,
          },
        }}
      >
        {/* Mine tab - visible to all users */}
        {visibleTabs.mine && (
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "0.875rem", color: "inherit", fontWeight: "inherit" }}>Mine</Typography>
                <Chip
                  label={counts.mine}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: currentTab === "mine" ? neutralColor(200) : neutralColor(100),
                    color: currentTab === "mine" ? neutralColor(800) : neutralColor(600),
                    borderRadius: "10px",
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
        )}

        {/* Unassigned tab - visible to admins and users with conversation_unassigned_manage */}
        {visibleTabs.unassigned && (
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "0.875rem", color: "inherit", fontWeight: "inherit" }}>Unassigned</Typography>
                <Chip
                  label={counts.unassigned}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: currentTab === "unassigned" ? neutralColor(200) : neutralColor(100),
                    color: currentTab === "unassigned" ? neutralColor(800) : neutralColor(600),
                    borderRadius: "10px",
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
        )}

        {/* All tab - visible to admins and users with conversation_participating_manage */}
        {visibleTabs.all && (
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "0.875rem", color: "inherit", fontWeight: "inherit" }}>All</Typography>
                <Chip
                  label={counts.all}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: currentTab === "all" ? neutralColor(200) : neutralColor(100),
                    color: currentTab === "all" ? neutralColor(800) : neutralColor(600),
                    borderRadius: "10px",
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
        )}
      </Tabs>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if filters, counts, or callbacks changed
  // IMPORTANT: Check all relevant filter properties to ensure re-renders when needed
  return (
    prevProps.filters.assignee_type === nextProps.filters.assignee_type &&
    prevProps.filters.status === nextProps.filters.status && // Check status filter
    prevProps.filters.inbox_id === nextProps.filters.inbox_id && // Check inbox filter
    prevProps.counts.mine === nextProps.counts.mine &&
    prevProps.counts.unassigned === nextProps.counts.unassigned &&
    prevProps.counts.all === nextProps.counts.all &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.primaryColor === nextProps.primaryColor &&
    prevProps.neutralColor === nextProps.neutralColor
  );
});
