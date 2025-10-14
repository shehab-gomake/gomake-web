import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { getListItemButtonStyles } from "../../utils/styling-utils";
import { EmailBadge } from "./email-badge";

interface EmailListItemProps {
  icon?: React.ReactNode;
  primary: string;
  secondary?: string;
  badgeCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const EmailListItem: React.FC<EmailListItemProps> = ({
  icon,
  primary,
  secondary,
  badgeCount,
  isSelected = false,
  onClick,
  children,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const buttonStyles = getListItemButtonStyles(primaryColor, neutralColor);

  return (
    <ListItem disablePadding>
      <ListItemButton selected={isSelected} onClick={onClick} sx={buttonStyles}>
        {icon && <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>}

        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? primaryColor(700) : neutralColor(700),
                }}
                noWrap
              >
                {primary}
              </Typography>

              {badgeCount && badgeCount > 0 && (
                <EmailBadge count={badgeCount}>
                  <div />
                </EmailBadge>
              )}
            </Stack>
          }
          secondary={
            secondary && (
              <Typography
                variant="caption"
                sx={{
                  color: isSelected ? primaryColor(600) : neutralColor(500),
                  fontSize: "0.75rem",
                }}
                noWrap
              >
                {secondary}
              </Typography>
            )
          }
        />
        {children}
      </ListItemButton>
    </ListItem>
  );
};
