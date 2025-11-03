import React, { useState } from "react";
import { frontdeskV2Theme } from "../../styles/theme";
import { NavItem } from "./nav-item";
import { NavSectionConfig } from "./types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export interface NavSectionProps extends NavSectionConfig {
  selectedItemId?: string;
  isCollapsed?: boolean;
  onItemClick?: (itemId: string) => void;
}

export const NavSection: React.FC<NavSectionProps> = ({
  label,
  items,
  defaultExpanded = true,
  selectedItemId,
  isCollapsed = false,
  onItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      {/* Section Header - only show when not collapsed */}
      {!isCollapsed && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: `${frontdeskV2Theme.spacing[2]} ${frontdeskV2Theme.spacing[4]}`,
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: frontdeskV2Theme.transitions.default,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = frontdeskV2Theme.colors.background.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span
            style={{
              color: frontdeskV2Theme.colors.text.secondary,
              fontWeight: frontdeskV2Theme.typography.fontWeight.semibold,
              fontSize: frontdeskV2Theme.typography.fontSize.xs,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </span>
          {isExpanded ? (
            <ExpandLessIcon sx={{ fontSize: 16, color: frontdeskV2Theme.colors.text.secondary }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 16, color: frontdeskV2Theme.colors.text.secondary }} />
          )}
        </button>
      )}

      {/* Section Items */}
      {(isCollapsed || isExpanded) && (
        <div>
          {items.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              isSelected={selectedItemId === item.id}
              isCollapsed={isCollapsed}
              onClick={() => {
                item.onClick?.();
                onItemClick?.(item.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
