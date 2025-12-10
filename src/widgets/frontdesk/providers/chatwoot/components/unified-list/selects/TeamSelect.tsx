/**
 * TeamSelect Component
 *
 * Complete team selection component with trigger and dropdown.
 * Uses unified triggers for consistent styling across variants.
 *
 * @module unified-list/selects/TeamSelect
 */

import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import { UnifiedListDropdown } from "../UnifiedListDropdown";
import { TeamListItemRenderer } from "../list-items";
import { FilterIconButton, AssignmentTrigger } from "../triggers";
import type { TeamListItem, ActionItem } from "../types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";

// =============================================================================
// TYPES
// =============================================================================

export interface TeamSelectProps {
  /** Current selected team */
  selectedTeam: Team | null;
  /** Available teams */
  teams: Team[];
  /** Selection handler */
  onSelect: (teamId: number | null, team: Team | null) => void;
  /** Whether teams are loading */
  loading?: boolean;
  /** Whether selection is in progress */
  updating?: boolean;
  /** Trigger variant */
  variant?: "inline" | "filter";
  /** Label text (for inline variant) */
  label?: string;
  /** Empty state text */
  emptyText?: string;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Can create new team */
  canCreate?: boolean;
  /** Create team handler */
  onCreateClick?: () => void;
  /** Show "All Teams" option (for filters) */
  showAllOption?: boolean;
  /** All teams option label */
  allOptionLabel?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const teamToListItem = (team: Team): TeamListItem => ({
  type: "team",
  id: team.id!,
  label: team.name || "Unknown Team",
  description: team.description,
  allowAutoAssign: team.allow_auto_assign,
});

// =============================================================================
// COMPONENT
// =============================================================================

export const TeamSelect: React.FC<TeamSelectProps> = ({
  selectedTeam,
  teams,
  onSelect,
  loading = false,
  updating = false,
  variant = "inline",
  label,
  emptyText,
  placeholder,
  disabled = false,
  canCreate = false,
  onCreateClick,
  showAllOption = false,
  allOptionLabel = "All Teams",
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const finalLabel = label || t("frontdesk.detailPanel.assignedTeam");
  const finalPlaceholder =
    placeholder || t("frontdesk.detailPanel.assignToTeam");
  const finalEmptyText = emptyText || t("frontdesk.teams.noTeamsAvailable");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Convert teams to list items
  const teamItems = useMemo(() => {
    const items = teams.map(teamToListItem);
    if (showAllOption) {
      items.unshift({
        type: "team",
        id: "all",
        label: allOptionLabel,
      });
    }
    return items;
  }, [teams, showAllOption, allOptionLabel]);

  // Footer actions
  const footerActions = useMemo<ActionItem[]>(() => {
    if (!canCreate || !onCreateClick) return [];
    return [
      {
        type: "action",
        id: "create-team",
        label: t("frontdesk.teams.addNewTeam"),
        icon: <AddIcon sx={{ fontSize: 18 }} />,
        variant: "primary",
        onClick: onCreateClick,
      },
    ];
  }, [canCreate, onCreateClick, t]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!disabled && !updating) {
        setAnchorEl(event.currentTarget);
      }
    },
    [disabled, updating]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelect = useCallback(
    (id: string | number | null) => {
      if (id === null || id === "all") {
        onSelect(null, null);
      } else {
        const team = teams.find((t) => t.id === id);
        onSelect(Number(id), team || null);
      }
      handleClose();
    },
    [teams, onSelect, handleClose]
  );

  const renderItem = useCallback(
    (item: TeamListItem, isSelected: boolean, onClick: () => void) => (
      <TeamListItemRenderer
        item={item}
        isSelected={isSelected}
        onClick={onClick}
        showMemberCount
      />
    ),
    []
  );

  const hasSelection = !!selectedTeam;

  return (
    <>
      {/* Filter Trigger */}
      {variant === "filter" && (
        <FilterIconButton
          icon={<GroupsIcon />}
          tooltip={
            selectedTeam
              ? t("frontdesk.filters.teamTooltip", { name: selectedTeam.name })
              : t("frontdesk.filters.filterByTeam")
          }
          isActive={hasSelection}
          badgeCount={hasSelection ? 1 : 0}
          onClick={handleOpen}
          disabled={disabled || updating}
        />
      )}

      {/* Inline Assignment Trigger */}
      {variant === "inline" && (
        <AssignmentTrigger
          type="team"
          label={finalLabel}
          valueName={selectedTeam?.name}
          valueDescription={selectedTeam?.description}
          hasValue={hasSelection}
          placeholder={finalPlaceholder}
          onClick={handleOpen}
          loading={updating}
          disabled={disabled}
        />
      )}

      {/* Dropdown */}
      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={teamItems}
        selectionMode="single"
        selectedValue={
          showAllOption && !selectedTeam ? "all" : selectedTeam?.id ?? null
        }
        onSelect={handleSelect}
        renderItem={renderItem}
        showNoneOption={!showAllOption && !!selectedTeam}
        noneOptionLabel={t("frontdesk.teams.unassign")}
        headerText={t("frontdesk.teams.selectTeam")}
        footerActions={footerActions}
        loading={loading}
        emptyMessage={finalEmptyText}
        searchable={teams.length > 5}
        searchPlaceholder={t("frontdesk.teams.searchTeams")}
      />
    </>
  );
};

export default TeamSelect;
