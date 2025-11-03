import React from "react";
import { frontdeskV2Theme } from "../../styles/theme";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: keyof typeof frontdeskV2Theme.spacing;
  variant?: "default" | "strong";
}

export const Divider: React.FC<DividerProps> = ({ orientation = "horizontal", spacing = "2", variant = "default" }) => {
  const color =
    variant === "strong" ? frontdeskV2Theme.colors.border.strong : frontdeskV2Theme.colors.border.default;

  if (orientation === "vertical") {
    return (
      <div
        style={{
          width: "1px",
          backgroundColor: color,
          margin: `0 ${frontdeskV2Theme.spacing[spacing]}`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        height: "1px",
        backgroundColor: color,
        margin: `${frontdeskV2Theme.spacing[spacing]} 0`,
      }}
    />
  );
};
