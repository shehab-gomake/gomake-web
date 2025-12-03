/**
 * NavigationSidebar Sub-Components
 * 
 * Reusable components for the navigation sidebar
 */

import React, { memo } from "react";
import { Box, Typography, ListItemButton, ListItemText, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  SECTION_HEADER_STYLES,
  LIST_ITEM_STYLES,
  TYPOGRAPHY_STYLES,
  getIconColor,
  getBackgroundColor,
  ICON_SIZES,
  A11Y_LABELS,
  TRANSITIONS,
} from "./navigation-sidebar.constants";

interface SectionHeaderProps {
  label: string;
  isCollapsed?: boolean;
}

export const SectionHeader = memo<SectionHeaderProps>(({ label, isCollapsed = false }) => {
  const theme = useTheme();
  
  if (isCollapsed) return null;

  return (
    <Box sx={{ px: 2, py: 0.5, mt: label !== "Navigation" ? 1 : 0 }}>
      <Typography
        variant="caption"
        sx={{
          ...SECTION_HEADER_STYLES,
          color: alpha(theme.palette.text.secondary, SECTION_HEADER_STYLES.opacity),
        }}
      >
        {label}
      </Typography>
    </Box>
  );
});
SectionHeader.displayName = "SectionHeader";

interface NavListItemProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  badge?: number;
  nested?: boolean;
  tooltip?: string;
}

export const NavListItem = memo<NavListItemProps>(({
  icon,
  label,
  isSelected,
  onClick,
  isCollapsed = false,
  badge,
  nested = false,
  tooltip,
}) => {
  const theme = useTheme();
  const iconColor = getIconColor(theme, isSelected);
  const baseStyles = nested ? LIST_ITEM_STYLES.nested : LIST_ITEM_STYLES.default;
  const collapsedStyles = isCollapsed ? LIST_ITEM_STYLES.collapsed : {};

  const listItemSx = {
    ...baseStyles,
    ...collapsedStyles,
    pointerEvents: "auto" as const,
    transition: TRANSITIONS.normal,
    "&.Mui-selected": {
      backgroundColor: getBackgroundColor(theme, true, false),
      borderLeft: nested ? "none" : `3px solid ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: getBackgroundColor(theme, true, true),
        transform: "translateX(2px)",
      },
    },
    "&:hover": {
      backgroundColor: getBackgroundColor(theme, false, true),
      transform: "translateX(2px)",
    },
  };

  const typographyStyles = nested
    ? TYPOGRAPHY_STYLES.nestedItem
    : TYPOGRAPHY_STYLES.listItem;

  const content = (
    <ListItemButton selected={isSelected} onClick={onClick} sx={listItemSx}>
      {isCollapsed ? (
        <Box sx={{ color: iconColor, display: "flex" }}>
          {icon}
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
          <Box sx={{ color: iconColor, display: "flex", alignItems: "center" }}>
            {icon}
          </Box>
          {!nested && (
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                variant: "body2",
                sx: {
                  fontSize: typographyStyles.fontSize,
                  fontWeight: isSelected
                    ? typographyStyles.fontWeight.selected
                    : typographyStyles.fontWeight.default,
                },
              }}
            />
          )}
          {nested && (
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                variant: "body2",
                sx: {
                  fontSize: typographyStyles.fontSize,
                  fontWeight: isSelected
                    ? typographyStyles.fontWeight.selected
                    : typographyStyles.fontWeight.default,
                  color: theme.palette.text.secondary,
                },
              }}
            />
          )}
        </Box>
      )}
    </ListItemButton>
  );

  if (tooltip && !isCollapsed) {
    return <>{content}</>;
  }

  return content;
});
NavListItem.displayName = "NavListItem";

