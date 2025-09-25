import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";

interface EmailActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  variant?: "icon" | "button";
  children?: React.ReactNode;
  disabled?: boolean;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

export const EmailActionButton: React.FC<EmailActionButtonProps> = ({
  icon,
  tooltip,
  onClick,
  variant = "icon",
  children,
  disabled = false,
  color = "primary",
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  if (variant === "button") {
    return (
      <Button
        size="small"
        variant="outlined"
        startIcon={icon}
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderColor: neutralColor(300),
          color: neutralColor(700),
          "&:hover": {
            borderColor: primaryColor(300),
            backgroundColor: alpha(primaryColor(100), 0.5),
          },
        }}
      >
        {children}
      </Button>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          color: neutralColor(600),
          "&:hover": {
            backgroundColor: alpha(primaryColor(100), 0.5),
            color: primaryColor(600),
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
