/**
 * Conversation Status Selector
 *
 * Status selector for conversation header with icon-based dropdown menu
 */

import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  OpenInNew as OpenIcon,
  Pending as PendingIcon,
  Snooze as SnoozeIcon,
  CheckCircle as ResolvedIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationStatus } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ConversationStatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
  updating?: boolean;
}

const STATUS_OPTIONS = [
  { value: ConversationStatus.OPEN, label: "Open", icon: OpenIcon },
  { value: ConversationStatus.PENDING, label: "Pending", icon: PendingIcon },
  { value: ConversationStatus.RESOLVED, label: "Resolved", icon: ResolvedIcon },
  { value: ConversationStatus.SNOOZED, label: "Snoozed", icon: SnoozeIcon },
];

export const ConversationStatusSelector: React.FC<ConversationStatusSelectorProps> = ({
  status,
  onStatusChange,
  updating = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!updating) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (newStatus: string) => {
    onStatusChange(newStatus);
    handleClose();
  };

  const currentStatusOption = STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];
  const StatusIcon = currentStatusOption.icon;

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          cursor: updating ? "not-allowed" : "pointer",
          px: 1.25,
          py: 0.5,
          borderRadius: "6px",
          border: `1px solid ${neutralColor(300)}`,
          backgroundColor: neutralColor(0),
          transition: "all 0.2s",
          opacity: updating ? 0.6 : 1,
          "&:hover": updating
            ? {}
            : {
                backgroundColor: neutralColor(50),
                borderColor: neutralColor(400),
              },
        }}
        title={updating ? "Updating status..." : `Change status (currently: ${currentStatusOption.label})`}
      >
        {updating ? (
          <CircularProgress size={16} sx={{ color: neutralColor(600) }} />
        ) : (
          <StatusIcon sx={{ fontSize: 16, color: neutralColor(600) }} />
        )}
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: neutralColor(700),
            lineHeight: 1,
          }}
        >
          {updating ? "Updating..." : currentStatusOption.label}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
          },
        }}
      >
        {STATUS_OPTIONS.map((option) => {
          const isSelected = status === option.value;
          const OptionIcon = option.icon;
          return (
            <MenuItem
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              disabled={isSelected}
              sx={{
                fontSize: 13,
                py: 1,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <OptionIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
