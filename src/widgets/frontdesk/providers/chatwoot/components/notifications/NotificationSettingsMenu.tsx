/**
 * NotificationSettingsMenu Component
 * Bulk actions menu for notifications (mark all read, delete all, etc.)
 */

import React, { useState } from "react";
import { IconButton, MenuItem, ListItemText, Divider } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { DropdownMenu } from "@/widgets/frontdesk/components/dropdown-menu/dropdown-menu";

interface NotificationSettingsMenuProps {
  onMarkAllAsRead: () => Promise<void>;
  onDeleteAll: () => Promise<void>;
  onDeleteAllRead: () => Promise<void>;
  neutralColor: (shade: number) => string;
}

export const NotificationSettingsMenu: React.FC<NotificationSettingsMenuProps> = ({
  onMarkAllAsRead,
  onDeleteAll,
  onDeleteAllRead,
  neutralColor,
}) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMarkAllAsRead = async () => {
    try {
      await onMarkAllAsRead();
      setSettingsMenuAnchor(null);
    } catch (err) {
      // Error is handled by parent
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        await onDeleteAll();
        setSettingsMenuAnchor(null);
      } catch (err) {
        // Error is handled by parent
      }
    }
  };

  const handleDeleteAllRead = async () => {
    if (window.confirm("Are you sure you want to delete all read notifications?")) {
      try {
        await onDeleteAllRead();
        setSettingsMenuAnchor(null);
      } catch (err) {
        // Error is handled by parent
      }
    }
  };

  return (
    <>
      {/* Settings Icon */}
      <IconButton
        size="small"
        onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
        sx={{
          color: neutralColor(600),
          backgroundColor: neutralColor(100),
          "&:hover": {
            backgroundColor: neutralColor(200),
          },
          width: 32,
          height: 32,
        }}
      >
        <TuneIcon fontSize="small" />
      </IconButton>

      {/* Settings Menu */}
      <DropdownMenu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={() => setSettingsMenuAnchor(null)}
        width={200}
        disableContentPadding
      >
        <MenuItem onClick={handleMarkAllAsRead} sx={{ py: 1, px: 2 }}>
          <ListItemText
            primary="Mark all as read"
            primaryTypographyProps={{
              fontSize: 13,
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleDeleteAllRead} sx={{ py: 1, px: 2 }}>
          <ListItemText
            primary="Delete all read"
            primaryTypographyProps={{
              fontSize: 13,
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteAll}
          sx={{
            py: 1,
            px: 2,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.dark",
            },
          }}
        >
          <ListItemText
            primary="Delete all"
            primaryTypographyProps={{
              fontSize: 13,
            }}
          />
        </MenuItem>
      </DropdownMenu>
    </>
  );
};
