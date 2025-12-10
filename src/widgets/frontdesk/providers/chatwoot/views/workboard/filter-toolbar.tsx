/**
 * Filter Toolbar Component
 *
 * Provides filtering controls for the Kanban board.
 * Uses unified design system components for consistency.
 */

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Tooltip,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Clear as ClearIcon,
  Warning as WarningIcon,
  PriorityHigh as PriorityIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Design system - unified components and tokens
import {
  colorTokens,
  radiusTokens,
  semanticTypography,
  SearchInput,
  FilterChip,
  Button,
} from "@/widgets/frontdesk/design-system";

// Types
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { KanbanConversationFilters } from "../../types/kanban.types";
import { ConversationPriority } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

// ============================================
// Types
// ============================================

export interface FilterToolbarProps {
  filters: KanbanConversationFilters;
  onFiltersChange: (filters: Partial<KanbanConversationFilters>) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  inboxes: ChatwootInbox[];
  agents: Agent[];
  inboxesLoading?: boolean;
}

// Quick filter presets
interface QuickFilter {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  filters: Partial<KanbanConversationFilters>;
  color: "primary" | "success" | "warning" | "error" | "neutral";
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    id: "urgent",
    labelKey: "urgent",
    icon: <WarningIcon />,
    filters: { priority: ConversationPriority.URGENT },
    color: "error",
  },
  {
    id: "high-priority",
    labelKey: "highPriority",
    icon: <PriorityIcon />,
    filters: { priority: ConversationPriority.HIGH },
    color: "warning",
  },
  {
    id: "unassigned",
    labelKey: "unassigned",
    icon: <PersonIcon />,
    filters: { assigneeId: "unassigned" as const },
    color: "primary",
  },
];

// ============================================
// Unified dropdown styles
// ============================================

const selectStyles = {
  "& .MuiSelect-select": {
    fontSize: semanticTypography.body.small.fontSize,
    padding: "8px 32px 8px 12px",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: colorTokens.semantic.border.default,
    borderRadius: radiusTokens.md,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: colorTokens.semantic.border.medium,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: colorTokens.primary[500],
    borderWidth: 1,
  },
  "& .MuiSelect-icon": {
    color: colorTokens.semantic.text.secondary,
    right: 8,
  },
  backgroundColor: colorTokens.semantic.background.primary,
};

// ============================================
// Component
// ============================================

const FilterToolbarComponent: React.FC<FilterToolbarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount,
  inboxes,
  agents,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Priority options with translations
  const PRIORITY_OPTIONS: {
    value: ConversationPriority | "";
    label: string;
  }[] = [
    { value: "", label: t("frontdesk.workboard.filters.allPriorities") },
    {
      value: ConversationPriority.URGENT,
      label: t("frontdesk.workboard.filters.urgent"),
    },
    {
      value: ConversationPriority.HIGH,
      label: t("frontdesk.workboard.filters.high"),
    },
    {
      value: ConversationPriority.MEDIUM,
      label: t("frontdesk.workboard.filters.medium"),
    },
    {
      value: ConversationPriority.LOW,
      label: t("frontdesk.workboard.filters.low"),
    },
  ];

  // Ref to track search debounce timeout
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync search value with external filter changes
  useEffect(() => {
    if (filters.search !== searchValue && filters.search !== undefined) {
      setSearchValue(filters.search);
    } else if (filters.search === undefined && searchValue !== "") {
      setSearchValue("");
    }
  }, [filters.search]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onFiltersChange({ search: value || undefined });
      }, 300);
    },
    [onFiltersChange]
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    onFiltersChange({ search: undefined });
  }, [onFiltersChange]);

  const handleInboxChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      onFiltersChange({ inboxId: value || undefined });
    },
    [onFiltersChange]
  );

  const handlePriorityChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      onFiltersChange({ priority: value || undefined });
    },
    [onFiltersChange]
  );

  const handleAssigneeChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      if (value === "") {
        onFiltersChange({ assigneeId: undefined });
      } else if (value === "unassigned") {
        onFiltersChange({ assigneeId: "unassigned" });
      } else {
        onFiltersChange({ assigneeId: Number(value) });
      }
    },
    [onFiltersChange]
  );

  const handleQuickFilterClick = useCallback(
    (quickFilter: QuickFilter) => {
      const isActive = (() => {
        if (quickFilter.filters.priority) {
          return filters.priority === quickFilter.filters.priority;
        }
        if (quickFilter.filters.assigneeId !== undefined) {
          return filters.assigneeId === quickFilter.filters.assigneeId;
        }
        return false;
      })();

      if (isActive) {
        if (quickFilter.filters.priority) {
          onFiltersChange({ priority: undefined });
        } else if (quickFilter.filters.assigneeId !== undefined) {
          onFiltersChange({ assigneeId: undefined });
        }
      } else {
        onFiltersChange(quickFilter.filters);
      }
    },
    [filters, onFiltersChange]
  );

  const handleClearAll = useCallback(() => {
    setSearchValue("");
    onClearFilters();
  }, [onClearFilters]);

  // Check if a quick filter is active
  const isQuickFilterActive = useCallback(
    (quickFilter: QuickFilter) => {
      if (quickFilter.filters.priority) {
        return filters.priority === quickFilter.filters.priority;
      }
      if (quickFilter.filters.assigneeId !== undefined) {
        return filters.assigneeId === quickFilter.filters.assigneeId;
      }
      return false;
    },
    [filters]
  );

  return (
    <Box
      sx={{
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      }}
    >
      {/* Main Toolbar - Clean container */}
      <Box
        sx={{
          margin: "12px 24px",
          padding: "16px 20px",
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${colorTokens.semantic.border.default}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            gap: 2.5,
          }}
        >
          {/* Search - Using SearchInput from design system */}
          <Box sx={{ minWidth: 260 }}>
            <SearchInput
              placeholder={t("frontdesk.workboard.filters.searchPlaceholder")}
              value={searchValue}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              showClear={true}
            />
          </Box>

          {/* Quick Filters - Using FilterChip from design system */}
          <Stack
            direction="row"
            sx={{
              gap: 1,
            }}
          >
            {QUICK_FILTERS.map((qf) => {
              const isActive = isQuickFilterActive(qf);
              return (
                <FilterChip
                  key={qf.id}
                  label={t(`frontdesk.workboard.filters.${qf.labelKey}`)}
                  icon={qf.icon}
                  color={isActive ? qf.color : "neutral"}
                  onClick={() => handleQuickFilterClick(qf)}
                  sx={{
                    border: isActive
                      ? undefined
                      : `1px solid ${colorTokens.semantic.border.default}`,
                    backgroundColor: isActive ? undefined : "transparent",
                  }}
                />
              );
            })}
          </Stack>

          {/* Spacer */}
          <Box flex={1} />

          {/* Dropdown Filters - Unified MUI selects with design tokens */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              gap: 2.5,
            }}
          >
            {/* Inbox Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel
                sx={{
                  ...semanticTypography.label.small,
                  color: colorTokens.semantic.text.secondary,
                  "&.Mui-focused": { color: colorTokens.primary[600] },
                }}
              >
                {t("frontdesk.workboard.filters.inbox")}
              </InputLabel>
              <MuiSelect
                value={filters.inboxId || ""}
                onChange={handleInboxChange}
                label={t("frontdesk.workboard.filters.inbox")}
                sx={selectStyles}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 0.5,
                      borderRadius: `${radiusTokens.md}px`,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    },
                  },
                }}
              >
                <MenuItem
                  value=""
                  sx={{ fontSize: semanticTypography.body.small.fontSize }}
                >
                  {t("frontdesk.workboard.filters.allInboxes")}
                </MenuItem>
                {inboxes.map((inbox) => (
                  <MenuItem
                    key={inbox.id}
                    value={inbox.id}
                    sx={{ fontSize: semanticTypography.body.small.fontSize }}
                  >
                    {inbox.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Assignee Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel
                sx={{
                  ...semanticTypography.label.small,
                  color: colorTokens.semantic.text.secondary,
                  "&.Mui-focused": { color: colorTokens.primary[600] },
                }}
              >
                {t("frontdesk.workboard.filters.assignee")}
              </InputLabel>
              <MuiSelect
                value={
                  filters.assigneeId === "unassigned"
                    ? "unassigned"
                    : filters.assigneeId || ""
                }
                onChange={handleAssigneeChange}
                label={t("frontdesk.workboard.filters.assignee")}
                sx={selectStyles}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 0.5,
                      borderRadius: `${radiusTokens.md}px`,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    },
                  },
                }}
              >
                <MenuItem
                  value=""
                  sx={{ fontSize: semanticTypography.body.small.fontSize }}
                >
                  {t("frontdesk.workboard.filters.allAssignees")}
                </MenuItem>
                <MenuItem
                  value="unassigned"
                  sx={{ fontSize: semanticTypography.body.small.fontSize }}
                >
                  {t("frontdesk.workboard.filters.unassigned")}
                </MenuItem>
                {agents.map((agent) => (
                  <MenuItem
                    key={agent.id}
                    value={agent.id}
                    sx={{ fontSize: semanticTypography.body.small.fontSize }}
                  >
                    {agent.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Priority Filter */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel
                sx={{
                  ...semanticTypography.label.small,
                  color: colorTokens.semantic.text.secondary,
                  "&.Mui-focused": { color: colorTokens.primary[600] },
                }}
              >
                {t("frontdesk.workboard.filters.priority")}
              </InputLabel>
              <MuiSelect
                value={filters.priority || ""}
                onChange={handlePriorityChange}
                label={t("frontdesk.workboard.filters.priority")}
                sx={selectStyles}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 0.5,
                      borderRadius: `${radiusTokens.md}px`,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    },
                  },
                }}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ fontSize: semanticTypography.body.small.fontSize }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Stack>

          {/* Clear All Button - Using Button from design system */}
          {activeFilterCount > 0 && (
            <Tooltip title={t("frontdesk.workboard.filters.clearAllFilters")}>
              <span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  sx={{
                    color: colorTokens.error[600],
                    "&:hover": {
                      backgroundColor: colorTokens.error[50],
                    },
                  }}
                >
                  <ClearIcon
                    sx={{
                      fontSize: 14,
                      [isRTL ? "marginLeft" : "marginRight"]: 0.5,
                    }}
                  />
                  {t("frontdesk.workboard.filters.clear", {
                    count: activeFilterCount,
                  })}
                </Button>
              </span>
            </Tooltip>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export const FilterToolbar = memo(FilterToolbarComponent);
