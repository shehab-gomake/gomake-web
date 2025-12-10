/**
 * ConversationSortMenu Component
 *
 * Handles conversation sort options.
 * Uses unified filter trigger for consistent styling.
 */

import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { FilterIconButton, UnifiedListDropdown } from "../unified-list";
import type { GenericListItem } from "../unified-list";
import {
  ConversationListParams,
  ConversationSortBy,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ConversationSortMenuProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onSortClick?: () => void;
  primaryColor?: (shade: number) => string;
  neutralColor?: (shade: number) => string;
}

const getSortOptions = (t: (key: string) => string): GenericListItem[] => [
  {
    type: "generic",
    id: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
    label: t("frontdesk.filters.sort.lastActivityNewest"),
    value: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
  },
  {
    type: "generic",
    id: ConversationSortBy.LAST_ACTIVITY_AT_ASC,
    label: t("frontdesk.filters.sort.lastActivityOldest"),
    value: ConversationSortBy.LAST_ACTIVITY_AT_ASC,
  },
  {
    type: "generic",
    id: ConversationSortBy.CREATED_AT_DESC,
    label: t("frontdesk.filters.sort.createdNewest"),
    value: ConversationSortBy.CREATED_AT_DESC,
  },
  {
    type: "generic",
    id: ConversationSortBy.CREATED_AT_ASC,
    label: t("frontdesk.filters.sort.createdOldest"),
    value: ConversationSortBy.CREATED_AT_ASC,
  },
];

export const ConversationSortMenu: React.FC<ConversationSortMenuProps> =
  React.memo(
    ({ filters, onFiltersChange, onSortClick }) => {
      const { t } = useTranslation();
      const SORT_OPTIONS = getSortOptions(t);
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);

      const handleOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
          onSortClick?.();
        },
        [onSortClick]
      );

      const handleClose = useCallback(() => {
        setAnchorEl(null);
      }, []);

      const handleSelect = useCallback(
        (id: string | number | null) => {
          if (id) {
            onFiltersChange({ ...filters, sort_by: id as ConversationSortBy });
          }
          handleClose();
        },
        [filters, onFiltersChange, handleClose]
      );

      // Check if sort is non-default (has a value set)
      const isActive = !!filters.sort_by;

      // Get current sort label for tooltip
      const currentSort = useMemo(
        () => SORT_OPTIONS.find((o) => o.id === filters.sort_by),
        [filters.sort_by]
      );

      return (
        <>
          <FilterIconButton
            icon={<SwapVertIcon />}
            tooltip={
              currentSort
                ? t("frontdesk.filters.sort.tooltip", {
                    label: currentSort.label,
                  })
                : t("frontdesk.filters.sort.default")
            }
            isActive={isActive}
            onClick={handleOpen}
          />

          <UnifiedListDropdown
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            items={SORT_OPTIONS}
            selectionMode="single"
            selectedValue={filters.sort_by ?? null}
            onSelect={handleSelect}
            headerText={t("frontdesk.filters.sortBy")}
            minWidth={200}
            maxWidth={260}
          />
        </>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.filters.sort_by === nextProps.filters.sort_by &&
        prevProps.onFiltersChange === nextProps.onFiltersChange &&
        prevProps.onSortClick === nextProps.onSortClick
      );
    }
  );
