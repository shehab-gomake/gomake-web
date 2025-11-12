/**
 * Conversation Status Selector
 *
 * Minimal icon-button status selector for conversation header
 */

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as OpenIcon,
  Pending as PendingIcon,
  AccessTime as SnoozeIcon,
  TaskAlt as ResolvedIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface ConversationStatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
  updating?: boolean;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open", icon: OpenIcon },
  { value: "pending", label: "Pending", icon: PendingIcon },
  { value: "resolved", label: "Resolved", icon: ResolvedIcon },
  { value: "snoozed", label: "Snoozed", icon: SnoozeIcon },
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: neutralColor(600),
          }}
        >
          Status:
        </Typography>
        <Tooltip title={currentStatusOption.label} arrow>
          <IconButton
            onClick={handleClick}
            disabled={updating}
            size="small"
            sx={{
              color: neutralColor(600),
              "&:hover": {
                backgroundColor: neutralColor(100),
              },
            }}
          >
            {updating ? (
              <CircularProgress size={20} sx={{ color: neutralColor(600) }} />
            ) : (
              <StatusIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Tooltip>
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
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <OptionIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && <CheckIcon sx={{ fontSize: 16, color: primaryColor(600), ml: "auto" }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
