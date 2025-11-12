/**
 * Conversation Priority Selector
 *
 * Minimal icon-button priority selector for conversation header
 */

import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Flag as FlagIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationPriorityIcon } from "./conversation-priority-icon";
import { ConversationPriority } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

type PriorityValue = ConversationPriority.URGENT | ConversationPriority.HIGH | ConversationPriority.MEDIUM | ConversationPriority.LOW | null;

interface ConversationPrioritySelectorProps {
  priority: PriorityValue;
  onPriorityChange: (priority: PriorityValue) => void;
  updating?: boolean;
}

const PRIORITY_OPTIONS: Array<{
  value: PriorityValue;
  label: string;
}> = [
  { value: ConversationPriority.URGENT, label: "Urgent" },
  { value: ConversationPriority.HIGH, label: "High" },
  { value: ConversationPriority.MEDIUM, label: "Medium" },
  { value: ConversationPriority.LOW, label: "Low" },
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

  const handlePrioritySelect = (newPriority: PriorityValue) => {
    onPriorityChange(newPriority);
    handleClose();
  };

  const currentPriorityOption = PRIORITY_OPTIONS.find((opt) => opt.value === priority) || PRIORITY_OPTIONS[4];

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          cursor: updating ? "default" : "pointer",
          px: 1.25,
          py: 0.5,
          borderRadius: "6px",
          border: `1px solid ${neutralColor(300)}`,
          backgroundColor: neutralColor(0),
          transition: "all 0.2s",
          "&:hover": updating
            ? {}
            : {
                backgroundColor: neutralColor(50),
                borderColor: neutralColor(400),
              },
        }}
      >
        {updating ? (
          <CircularProgress size={16} sx={{ color: neutralColor(600) }} />
        ) : priority ? (
          <ConversationPriorityIcon priority={priority} size={16} />
        ) : (
          <FlagIcon sx={{ fontSize: 16, color: neutralColor(400) }} />
        )}
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: neutralColor(700),
            lineHeight: 1,
          }}
        >
          {currentPriorityOption.label}
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
