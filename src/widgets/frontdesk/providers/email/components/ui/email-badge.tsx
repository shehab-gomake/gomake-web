import React from "react";
import { Badge } from "@mui/material";
import { getUnreadBadgeStyles } from "../../utils/styling-utils";

interface EmailBadgeProps {
  count: number;
  maxCount?: number;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  children: React.ReactNode;
}

export const EmailBadge: React.FC<EmailBadgeProps> = ({ count, maxCount = 99, color = "primary", children }) => {
  if (count <= 0) {
    return <>{children}</>;
  }

  return (
    <Badge badgeContent={count > maxCount ? `${maxCount}+` : count} color={color} sx={getUnreadBadgeStyles()}>
      {children}
    </Badge>
  );
};
