/**
 * ReplyComposerTextArea Component
 * Text input area with fullscreen button
 */

import React, { KeyboardEvent } from "react";
import { Box, IconButton, TextareaAutosize } from "@mui/material";
import { Fullscreen as FullscreenIcon } from "@mui/icons-material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

interface ReplyComposerTextAreaProps {
  messageContent: string;
  onContentChange: (content: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  maxLength: number;
  isSending: boolean;
  shouldUseRichEditor: boolean;
  textColor: string;
  lightGrayText: string;
  neutralColor?: (shade: number) => string;
  primaryColor?: (shade: number) => string;
  isPrivateNote?: boolean;
}

export const ReplyComposerTextArea: React.FC<ReplyComposerTextAreaProps> = ({
  messageContent,
  onContentChange,
  onKeyDown,
  textareaRef,
  maxLength,
  isSending,
  shouldUseRichEditor,
  textColor,
  lightGrayText,
  neutralColor,
  primaryColor,
  isPrivateNote = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Enforce max length
    if (newValue.length <= maxLength) {
      onContentChange(newValue);
    }
  };

  // Background color for private note mode - use a clearly visible shade
  // Use neutral gray background with a left border indicator
  const backgroundColor = isPrivateNote ? colorTokens.neutral[100] : "transparent";
  const borderColor = isPrivateNote ? colorTokens.primary[300] : "transparent";

  return (
    <Box
      sx={{
        position: "relative",
        px: 2,
        py: 1.5,
        backgroundColor: backgroundColor,
        borderLeft: isPrivateNote ? `4px solid ${borderColor}` : "none",
        transition: "background-color 0.2s ease, border-left 0.2s ease",
      }}
    >
      <TextareaAutosize
        ref={textareaRef}
        value={messageContent}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={
          shouldUseRichEditor ? "Shift + enter for new line. Start with '/' to select a Canned Response." : "Type your message..."
        }
        minRows={shouldUseRichEditor ? 4 : 3}
        maxLength={maxLength}
        disabled={isSending}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          resize: "none",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          lineHeight: 1.5,
          backgroundColor: backgroundColor,
          color: textColor,
          transition: "background-color 0.2s ease",
        }}
        className="textarea-placeholder"
      />
      <style>{`
        .textarea-placeholder::placeholder {
          color: ${lightGrayText};
          opacity: 1;
        }
      `}</style>

      {/* Fullscreen Icon */}
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: lightGrayText,
          p: 0.5,
          "&:hover": {
            backgroundColor: colorTokens.neutral[100],
            color: colorTokens.primary[600],
          },
        }}
      >
        <FullscreenIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};
