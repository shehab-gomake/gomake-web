import React from "react";
import { frontdeskV2Theme } from "../../styles/theme";

export interface BadgeProps {
  children: React.ReactNode;
  count?: number;
  variant?: "default" | "error" | "success" | "warning";
  size?: "small" | "medium";
  invisible?: boolean;
  showZero?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  count = 0,
  variant = "default",
  size = "medium",
  invisible = false,
  showZero = false,
}) => {
  const shouldShow = !invisible && (count > 0 || (showZero && count === 0));

  const variantStyles = {
    default: {
      backgroundColor: frontdeskV2Theme.colors.border.strong,
      color: frontdeskV2Theme.colors.text.primary,
    },
    error: {
      backgroundColor: frontdeskV2Theme.colors.priority.urgent,
      color: "#ffffff",
    },
    success: {
      backgroundColor: frontdeskV2Theme.colors.status.online,
      color: "#ffffff",
    },
    warning: {
      backgroundColor: frontdeskV2Theme.colors.priority.high,
      color: "#ffffff",
    },
  };

  const sizeStyles = {
    small: {
      height: "16px",
      minWidth: "16px",
      fontSize: "0.625rem",
      padding: "0 4px",
    },
    medium: {
      height: "20px",
      minWidth: "20px",
      fontSize: "0.688rem",
      padding: "0 6px",
    },
  };

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {children}
      {shouldShow && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            fontWeight: 600,
            lineHeight: 1,
            ...variantStyles[variant],
            ...sizeStyles[size],
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};
