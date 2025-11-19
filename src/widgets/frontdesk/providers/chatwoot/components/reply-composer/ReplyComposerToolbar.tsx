/**
 * Reply Composer Toolbar Component
 *
 * Rich text formatting toolbar for the reply composer.
 * Provides buttons for bold, italic, underline, code, lists, links, etc.
 */

import React from "react";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Link as LinkIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Code as CodeIcon,
  InsertEmoticon as EmojiIcon,
  AttachFile as AttachIcon,
  Mic as MicIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AIAssistIcon,
} from "@mui/icons-material";

export interface ReplyComposerToolbarProps {
  /** Callback when a formatting command is triggered */
  onFormat: (command: string) => void;
  /** Whether the toolbar is disabled */
  disabled?: boolean;
  /** Icon button color */
  iconColor?: string;
}

export const ReplyComposerToolbar: React.FC<ReplyComposerToolbarProps> = ({
  onFormat,
  disabled = false,
  iconColor = "#6B7280",
}) => {
  const toolbarButtons = [
    { icon: <BoldIcon />, tooltip: "Bold (Ctrl+B)", command: "bold" },
    { icon: <ItalicIcon />, tooltip: "Italic (Ctrl+I)", command: "italic" },
    { icon: <UnderlineIcon />, tooltip: "Underline (Ctrl+U)", command: "underline" },
    { icon: <CodeIcon />, tooltip: "Code", command: "code" },
    { type: "divider" },
    { icon: <LinkIcon />, tooltip: "Insert Link", command: "link" },
    { icon: <BulletListIcon />, tooltip: "Bullet List", command: "bullet" },
    { icon: <NumberedListIcon />, tooltip: "Numbered List", command: "numbered" },
    { type: "divider" },
    { icon: <UndoIcon />, tooltip: "Undo", command: "undo" },
    { icon: <RedoIcon />, tooltip: "Redo", command: "redo" },
  ];

  const secondaryActions = [
    { icon: <EmojiIcon />, tooltip: "Add Emoji", command: "emoji" },
    { icon: <AttachIcon />, tooltip: "Attach File", command: "attach" },
    { icon: <MicIcon />, tooltip: "Voice Message", command: "voice" },
    { icon: <CalendarIcon />, tooltip: "Schedule", command: "schedule" },
    { icon: <AIAssistIcon />, tooltip: "AI Assist", command: "ai" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 0.5,
        gap: 0.5,
      }}
    >
      {/* Main formatting buttons */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {toolbarButtons.map((button, index) =>
          button.type === "divider" ? (
            <Divider
              key={`divider-${index}`}
              orientation="vertical"
              flexItem
              sx={{ mx: 0.5 }}
            />
          ) : (
            <Tooltip key={button.command} title={button.tooltip} arrow>
              <IconButton
                size="small"
                onClick={() => onFormat(button.command)}
                disabled={disabled}
                sx={{
                  color: iconColor,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {button.icon}
              </IconButton>
            </Tooltip>
          )
        )}
      </Box>

      {/* Secondary actions */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {secondaryActions.map((action) => (
          <Tooltip key={action.command} title={action.tooltip} arrow>
            <IconButton
              size="small"
              onClick={() => onFormat(action.command)}
              disabled={disabled}
              sx={{
                color: iconColor,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};
