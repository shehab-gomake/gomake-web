/**
 * Conversation Priority Selector
 *
 * Minimal icon-button priority selector for conversation header
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
  Flag as FlagIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationPriorityIcon } from "./conversation-priority-icon";

interface ConversationPrioritySelectorProps {
  priority: "urgent" | "high" | "medium" | "low" | null;
  onPriorityChange: (priority: "urgent" | "high" | "medium" | "low" | null) => void;
  updating?: boolean;
}

const PRIORITY_OPTIONS: Array<{
  value: "urgent" | "high" | "medium" | "low" | null;
  label: string;
}> = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: null, label: "None" },
];

export const ConversationPrioritySelector: React.FC<ConversationPrioritySelectorProps> = ({
  priority,
  onPriorityChange,
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

  const handlePrioritySelect = (newPriority: "urgent" | "high" | "medium" | "low" | null) => {
    onPriorityChange(newPriority);
    handleClose();
  };

  const currentPriorityOption = PRIORITY_OPTIONS.find((opt) => opt.value === priority) || PRIORITY_OPTIONS[4];

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
          Priority:
        </Typography>
        <Tooltip title={currentPriorityOption.label} arrow>
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
              <FlagIcon sx={{ fontSize: 20 }} />
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
        {PRIORITY_OPTIONS.map((option) => {
          const isSelected = priority === option.value;
          return (
            <MenuItem
              key={option.value || "none"}
              onClick={() => handlePrioritySelect(option.value)}
              sx={{
                py: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {option.value ? (
                <ConversationPriorityIcon priority={option.value} size={16} />
              ) : (
                <CloseIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
              )}
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
