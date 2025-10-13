import React from "react";
import { IconButton, alpha } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

interface EmailAccountMenuProps {
  accountId: string;
  isSelected: boolean;
  onDisconnect: (accountId: string) => void;
}

export const EmailAccountMenu: React.FC<EmailAccountMenuProps> = ({ accountId, isSelected, onDisconnect }) => {
  const handleDisconnectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDisconnect(accountId);
  };

  return (
    <IconButton
      size="small"
      onClick={handleDisconnectClick}
      sx={{
        opacity: 0.6,
        color: "error.main",
        "&:hover": {
          opacity: 1,
          backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
        },
      }}
      title="Disconnect Account"
    >
      <LogoutIcon sx={{ fontSize: 16 }} />
    </IconButton>
  );
};
