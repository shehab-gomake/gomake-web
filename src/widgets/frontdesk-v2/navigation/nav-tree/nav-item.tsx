import React from "react";
import { frontdeskV2Theme } from "../../styles/theme";
import { Badge } from "../../components/ui/badge";
import { Tooltip } from "../../components/ui/tooltip";
import { NavItemConfig } from "./types";

export interface NavItemProps extends NavItemConfig {
  isSelected?: boolean;
  isCollapsed?: boolean;
  size?: "small" | "medium";
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  badge = 0,
  badgeVariant = "default",
  isSelected = false,
  isCollapsed = false,
  onClick,
  size = "medium",
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const sizeStyles = {
    small: {
      padding: `${frontdeskV2Theme.spacing[2]} ${isCollapsed ? frontdeskV2Theme.spacing[2] : frontdeskV2Theme.spacing[3]}`,
      fontSize: frontdeskV2Theme.typography.fontSize.sm,
    },
    medium: {
      padding: `${frontdeskV2Theme.spacing[3]} ${isCollapsed ? frontdeskV2Theme.spacing[3] : frontdeskV2Theme.spacing[4]}`,
      fontSize: frontdeskV2Theme.typography.fontSize.base,
    },
  };

  const content = (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "flex-start",
        gap: frontdeskV2Theme.spacing[3],
        width: "100%",
        border: "none",
        borderLeft: isSelected ? `3px solid ${frontdeskV2Theme.colors.brand.primary}` : "3px solid transparent",
        backgroundColor: isSelected
          ? frontdeskV2Theme.colors.interactive.selected
          : isHovered
          ? frontdeskV2Theme.colors.interactive.hover
          : "transparent",
        color: isSelected ? frontdeskV2Theme.colors.brand.primary : frontdeskV2Theme.colors.text.primary,
        cursor: "pointer",
        transition: frontdeskV2Theme.transitions.default,
        ...sizeStyles[size],
      }}
    >
      {icon && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: frontdeskV2Theme.colors.text.secondary,
          }}
        >
          {badge > 0 && isCollapsed ? (
            <Badge count={badge} variant={badgeVariant} size="small">
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </div>
      )}

      {!isCollapsed && (
        <>
          <span
            style={{
              flex: 1,
              textAlign: "left",
              fontWeight: isSelected
                ? frontdeskV2Theme.typography.fontWeight.semibold
                : frontdeskV2Theme.typography.fontWeight.normal,
            }}
          >
            {label}
          </span>
          {badge > 0 && (
            <Badge count={badge} variant={badgeVariant} size="small">
              <div />
            </Badge>
          )}
        </>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={label} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};
