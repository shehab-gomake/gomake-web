import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { MoreVert as MoreVertIcon, Logout as LogoutIcon } from "@mui/icons-material";

interface EmailAccountMenuProps {
  accountId: string;
  isSelected: boolean;
  onDisconnect: (accountId: string) => void;
}

export const EmailAccountMenu: React.FC<EmailAccountMenuProps> = ({ accountId, isSelected, onDisconnect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnectClick = () => {
    onDisconnect(accountId);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          opacity: 0.7,
          "&:hover": { opacity: 1 },
          color: isSelected ? "white" : "text.secondary",
        }}
      >
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleDisconnectClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Disconnect Account</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
