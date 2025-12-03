/**
 * ConversationTabs Component
 * 
 * Modern tab bar for filtering conversations by assignee type (Mine/Unassigned/All).
 * Features clean design with equal spacing, soft radius, and clear visual indicators.
 *
 * RBAC: Tabs are filtered based on user permissions
 * - "Mine" tab: visible to all users
 * - "Unassigned" tab: visible to admins and users with conversation_unassigned_manage permission
 * - "All" tab: visible to admins and users with conversation_participating_manage permission
 */

import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  ConversationAssigneeType,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useChatwootPermissions } from "../../hooks/use-chatwoot-permissions";
import { ASSIGNEE_TAB_PERMISSIONS } from "../../constants/permissions.constants";
import { colorTokens, radiusTokens, shadowTokens, semanticSpacing } from "@/widgets/frontdesk/design-system";

// =============================================================================
// Types
// =============================================================================

interface ConversationTabsProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  counts: {
    mine: number;
    unassigned: number;
    all: number;
  };
  /** @deprecated No longer used - colors are now from design tokens */
  primaryColor?: (shade: number) => string;
  /** @deprecated No longer used - colors are now from design tokens */
  neutralColor?: (shade: number) => string;
}

interface TabConfig {
  id: string;
  label: string;
  value: ConversationAssigneeType;
  count: number;
}

// =============================================================================
// Styles
// =============================================================================

const TAB_HEIGHT = 32;
const BADGE_HEIGHT = 18;
const BADGE_MIN_WIDTH = 22;

const getTabStyles = (isActive: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
  flex: 1,
  px: 1,
  py: 0.625,
  borderRadius: `${radiusTokens.md}px`,
  cursor: "pointer",
  transition: "all 0.15s ease",
  position: "relative" as const,
  backgroundColor: isActive ? colorTokens.primary[50] : "transparent",
  border: `1px solid ${isActive ? colorTokens.primary[200] : "transparent"}`,
  "&:hover": {
    backgroundColor: isActive ? colorTokens.primary[50] : colorTokens.neutral[50],
  },
});

const getTabLabelStyles = (isActive: boolean) => ({
  fontSize: "0.8125rem",
  fontWeight: isActive ? 600 : 500,
  color: isActive ? colorTokens.primary[700] : colorTokens.neutral[600],
  lineHeight: 1,
  letterSpacing: "-0.01em",
  transition: "color 0.15s ease",
});

const getBadgeStyles = (isActive: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: BADGE_HEIGHT,
  minWidth: BADGE_MIN_WIDTH,
  px: 0.75,
  borderRadius: `${radiusTokens.full}px`,
  fontSize: "0.6875rem",
  fontWeight: 600,
  lineHeight: 1,
  backgroundColor: isActive ? colorTokens.primary[100] : colorTokens.neutral[100],
  color: isActive ? colorTokens.primary[700] : colorTokens.neutral[500],
  transition: "all 0.15s ease",
});

// =============================================================================
// Component
// =============================================================================

export const ConversationTabs: React.FC<ConversationTabsProps> = React.memo(({
  filters,
  onFiltersChange,
  counts,
}) => {
  // Get permission checking functions
  const { canAccess, isAgent, isAdministrator } = useChatwootPermissions();

  // Check which tabs are visible based on permissions
  const visibleTabs = useMemo(() => ({
    mine: true,
    unassigned: isAdministrator || isAgent || canAccess(ASSIGNEE_TAB_PERMISSIONS.unassigned),
    all: isAdministrator || isAgent || canAccess(ASSIGNEE_TAB_PERMISSIONS.all),
  }), [canAccess, isAgent, isAdministrator]);

  const getCurrentTab = (): string => {
    if (filters.assignee_type === ConversationAssigneeType.ME) return "mine";
    if (filters.assignee_type === ConversationAssigneeType.UNASSIGNED) return "unassigned";
    return "all";
  };

  const handleTabClick = (tabId: string) => {
    let assignee_type: ConversationAssigneeType | undefined;

    if (tabId === "mine") {
      assignee_type = ConversationAssigneeType.ME;
    } else if (tabId === "unassigned") {
      assignee_type = ConversationAssigneeType.UNASSIGNED;
    } else if (tabId === "all") {
      assignee_type = ConversationAssigneeType.ALL;
    }

    const newFilters: Partial<ConversationListParams> = {
      assignee_type,
      page: 1,
    };

    if (filters.status !== undefined) {
      newFilters.status = filters.status;
    }

    if (filters.inbox_id !== undefined) {
      newFilters.inbox_id = filters.inbox_id;
    }

    onFiltersChange(newFilters);
  };

  const currentTab = getCurrentTab();

  // Build tab configuration
  const tabs: TabConfig[] = useMemo(() => {
    const allTabs: TabConfig[] = [];
    
    if (visibleTabs.mine) {
      allTabs.push({ id: "mine", label: "Mine", value: ConversationAssigneeType.ME, count: counts.mine });
    }
    if (visibleTabs.unassigned) {
      allTabs.push({ id: "unassigned", label: "Unassigned", value: ConversationAssigneeType.UNASSIGNED, count: counts.unassigned });
    }
    if (visibleTabs.all) {
      allTabs.push({ id: "all", label: "All", value: ConversationAssigneeType.ALL, count: counts.all });
    }
    
    return allTabs;
  }, [visibleTabs, counts]);

  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
      }}
    >
      {/* Tab Container with subtle background */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.5,
          p: 0.5,
          backgroundColor: colorTokens.neutral[50],
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${colorTokens.neutral[100]}`,
          width: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          
          return (
            <Box
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              sx={getTabStyles(isActive)}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTabClick(tab.id);
                }
              }}
            >
              <Typography component="span" sx={getTabLabelStyles(isActive)}>
                {tab.label}
              </Typography>
              <Box component="span" sx={getBadgeStyles(isActive)}>
                {tab.count > 99 ? "99+" : tab.count}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filters.assignee_type === nextProps.filters.assignee_type &&
    prevProps.filters.status === nextProps.filters.status &&
    prevProps.filters.inbox_id === nextProps.filters.inbox_id &&
    prevProps.counts.mine === nextProps.counts.mine &&
    prevProps.counts.unassigned === nextProps.counts.unassigned &&
    prevProps.counts.all === nextProps.counts.all &&
    prevProps.onFiltersChange === nextProps.onFiltersChange
  );
});
