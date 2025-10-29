import React, { useState } from "react";
import { frontdeskV2Theme } from "../../styles/theme";

export interface TooltipProps {
  children: React.ReactElement;
  title: string;
  placement?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, title, placement = "top", disabled = false }) => {
  const [visible, setVisible] = useState(false);

  if (disabled || !title) {
    return children;
  }

  const placementStyles = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%) translateY(-8px)",
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%) translateX(8px)",
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%) translateY(8px)",
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%) translateX(-8px)",
    },
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            zIndex: 9999,
            pointerEvents: "none",
            ...placementStyles[placement],
          }}
        >
          <div
            style={{
              backgroundColor: frontdeskV2Theme.colors.text.primary,
              color: "#ffffff",
              padding: `${frontdeskV2Theme.spacing[1]} ${frontdeskV2Theme.spacing[2]}`,
              borderRadius: frontdeskV2Theme.spacing[1],
              fontSize: frontdeskV2Theme.typography.fontSize.sm,
              fontWeight: frontdeskV2Theme.typography.fontWeight.medium,
              whiteSpace: "nowrap",
              boxShadow: frontdeskV2Theme.shadows.md,
            }}
          >
            {title}
          </div>
        </div>
      )}
    </div>
  );
};
