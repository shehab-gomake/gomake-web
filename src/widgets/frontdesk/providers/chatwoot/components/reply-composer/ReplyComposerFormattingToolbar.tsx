/**
 * ReplyComposerFormattingToolbar Component
 * Rich text formatting toolbar (Bold, Italic, etc.)
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
} from "@mui/icons-material";

interface ReplyComposerFormattingToolbarProps {
  onFormat: (command: string) => void;
  borderColor: string;
  lightGrayText: string;
  neutralColor: (shade: number) => string;
  primaryColor: (shade: number) => string;
}

const FORMATTING_BUTTONS = [
  { icon: BoldIcon, command: "bold", tooltip: "Bold" },
  { icon: ItalicIcon, command: "italic", tooltip: "Italic" },
  { icon: UnderlineIcon, command: "underline", tooltip: "Underline" },
  { icon: LinkIcon, command: "link", tooltip: "Insert Link" },
];

const ACTION_BUTTONS = [
  { icon: UndoIcon, tooltip: "Undo" },
  { icon: RedoIcon, tooltip: "Redo" },
];

const LIST_BUTTONS = [
  { icon: BulletListIcon, tooltip: "Bullet List" },
  { icon: NumberedListIcon, tooltip: "Numbered List" },
  { icon: CodeIcon, command: "code", tooltip: "Code Block" },
];

export const ReplyComposerFormattingToolbar: React.FC<ReplyComposerFormattingToolbarProps> = ({
  onFormat,
  borderColor,
  lightGrayText,
  neutralColor,
  primaryColor,
}) => {
  const buttonStyle = {
    p: 0.5,
    color: lightGrayText,
    "&:hover": {
      backgroundColor: neutralColor(100),
      color: primaryColor(600),
    },
  };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.75,
        borderBottom: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        gap: 0.25,
        backgroundColor: "transparent",
      }}
    >
      {/* Formatting Buttons */}
      {FORMATTING_BUTTONS.map(({ icon: Icon, command, tooltip }) => (
        <Tooltip key={command} title={tooltip}>
          <IconButton size="small" onClick={() => onFormat(command)} sx={buttonStyle}>
            <Icon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor }} />

      {/* Action Buttons */}
      {ACTION_BUTTONS.map(({ icon: Icon, tooltip }) => (
        <Tooltip key={tooltip} title={tooltip}>
          <IconButton size="small" sx={buttonStyle}>
            <Icon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ))}

      {/* List Buttons */}
      {LIST_BUTTONS.map(({ icon: Icon, command, tooltip }) => (
        <Tooltip key={tooltip} title={tooltip}>
          <IconButton
            size="small"
            onClick={command ? () => onFormat(command) : undefined}
            sx={buttonStyle}
          >
            <Icon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};
