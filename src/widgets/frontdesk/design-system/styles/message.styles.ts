/**
 * FrontDesk Design System - Message Style Patterns
 *
 * Reusable style objects for messages, chat bubbles, and composer.
 */

import { SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography, semanticSpacing } from '../tokens';
import { messageTypeColors, MessageType } from '../tokens/chatwoot.tokens';
import { layoutTokens, transitionTokens } from '../tokens/layout.tokens';

// ============================================================================
// Message Bubble Base
// ============================================================================

/** Base message bubble */
export const messageBubbleBase: SxProps<Theme> = {
  maxWidth: layoutTokens.messageBubble.maxWidth,
  minWidth: layoutTokens.messageBubble.minWidth,
  borderRadius: radiusTokens.lg,
  px: layoutTokens.messageBubble.padding.x / 8,
  py: layoutTokens.messageBubble.padding.y / 8,
  transition: transitionTokens.presets.colors,
  wordBreak: 'break-word',
};

/** Incoming message bubble */
export const messageBubbleIncoming: SxProps<Theme> = {
  ...messageBubbleBase,
  backgroundColor: messageTypeColors.incoming.bg,
  color: messageTypeColors.incoming.text,
  border: `1px solid ${messageTypeColors.incoming.border}`,
  borderBottomLeftRadius: radiusTokens.xs,
  alignSelf: 'flex-start',
};

/** Outgoing message bubble */
export const messageBubbleOutgoing: SxProps<Theme> = {
  ...messageBubbleBase,
  backgroundColor: messageTypeColors.outgoing.bg,
  color: messageTypeColors.outgoing.text,
  border: `1px solid ${messageTypeColors.outgoing.border}`,
  borderBottomRightRadius: radiusTokens.xs,
  alignSelf: 'flex-end',
};

/** Private note bubble */
export const messageBubblePrivateNote: SxProps<Theme> = {
  ...messageBubbleBase,
  backgroundColor: messageTypeColors.private_note.bg,
  color: messageTypeColors.private_note.text,
  border: `1px solid ${messageTypeColors.private_note.border}`,
  borderLeft: `3px solid ${messageTypeColors.private_note.indicator}`,
};

/** Activity message (system message) */
export const messageBubbleActivity: SxProps<Theme> = {
  ...semanticTypography.caption.medium,
  color: messageTypeColors.activity.text,
  fontStyle: 'italic',
  textAlign: 'center',
  py: 0.5,
  px: 2,
  backgroundColor: colorTokens.neutral[100],
  borderRadius: radiusTokens.full,
  alignSelf: 'center',
};

/**
 * Get message bubble style based on type
 */
export const getMessageBubbleStyle = (type: MessageType): SxProps<Theme> => {
  switch (type) {
    case 'outgoing':
      return messageBubbleOutgoing;
    case 'private_note':
      return messageBubblePrivateNote;
    case 'activity':
      return messageBubbleActivity;
    case 'incoming':
    default:
      return messageBubbleIncoming;
  }
};

// ============================================================================
// Message Container
// ============================================================================

/** Message row container */
export const messageRow: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  mb: 1.5,
  px: 2,
};

/** Incoming message row */
export const messageRowIncoming: SxProps<Theme> = {
  ...messageRow,
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

/** Outgoing message row */
export const messageRowOutgoing: SxProps<Theme> = {
  ...messageRow,
  flexDirection: 'row-reverse',
  justifyContent: 'flex-start',
};

/** Consecutive message (reduced spacing) */
export const messageConsecutive: SxProps<Theme> = {
  mb: 0.5,
};

// ============================================================================
// Message Content
// ============================================================================

/** Message text content */
export const messageText: SxProps<Theme> = {
  ...semanticTypography.body.medium,
  '& p': { m: 0 },
  '& a': {
    color: 'inherit',
    textDecoration: 'underline',
  },
  '& code': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: radiusTokens.xs,
    px: 0.5,
    fontFamily: 'monospace',
    fontSize: '0.9em',
  },
};

/** Message timestamp */
export const messageTimestamp: SxProps<Theme> = {
  ...semanticTypography.caption.small,
  mt: 0.5,
};

/** Message sender name */
export const messageSenderName: SxProps<Theme> = {
  ...semanticTypography.caption.small,
  color: colorTokens.semantic.text.secondary,
  mb: 0.5,
  ml: 1,
};

// ============================================================================
// Message List
// ============================================================================

/** Message list container */
export const messageListContainer: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  py: 2,
  scrollbarWidth: 'thin',
  scrollbarColor: `${colorTokens.neutral[300]} transparent`,
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: colorTokens.neutral[300],
    borderRadius: 3,
  },
};

/** Date separator in message list */
export const messageDateSeparator: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  my: 2,
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${colorTokens.semantic.border.light}`,
    mx: 2,
  },
};

/** Date separator text */
export const messageDateSeparatorText: SxProps<Theme> = {
  ...semanticTypography.caption.small,
  color: colorTokens.semantic.text.tertiary,
  px: 2,
  py: 0.5,
  backgroundColor: colorTokens.semantic.background.primary,
  borderRadius: radiusTokens.full,
};

// ============================================================================
// Composer Styles
// ============================================================================

/** Composer container */
export const composerContainer: SxProps<Theme> = {
  borderTop: `1px solid ${colorTokens.semantic.border.default}`,
  backgroundColor: colorTokens.semantic.background.primary,
  p: 2,
};

/** Composer input area */
export const composerInputArea: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  border: `1px solid ${colorTokens.semantic.border.default}`,
  borderRadius: radiusTokens.lg,
  backgroundColor: colorTokens.semantic.background.primary,
  transition: transitionTokens.presets.colors,
  '&:focus-within': {
    borderColor: colorTokens.primary[500],
    boxShadow: `0 0 0 2px ${colorTokens.primary[100]}`,
  },
};

/** Composer text input */
export const composerInput: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    ...semanticTypography.body.medium,
    py: 1.5,
    px: 2,
    minHeight: 60,
    maxHeight: 200,
    overflow: 'auto',
  },
};

/** Composer toolbar */
export const composerToolbar: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 1.5,
  py: 1,
  borderTop: `1px solid ${colorTokens.semantic.border.light}`,
  backgroundColor: colorTokens.semantic.background.secondary,
  borderBottomLeftRadius: radiusTokens.lg - 1,
  borderBottomRightRadius: radiusTokens.lg - 1,
};

/** Composer action buttons container */
export const composerActions: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

// ============================================================================
// Attachment Styles
// ============================================================================

/** Attachment container */
export const attachmentContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  p: 1.5,
  backgroundColor: colorTokens.semantic.background.secondary,
  border: `1px solid ${colorTokens.semantic.border.default}`,
  borderRadius: radiusTokens.md,
  transition: transitionTokens.presets.colors,
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.hover,
    borderColor: colorTokens.semantic.border.medium,
  },
};

/** Attachment thumbnail */
export const attachmentThumbnail: SxProps<Theme> = {
  width: 48,
  height: 48,
  borderRadius: radiusTokens.sm,
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: colorTokens.neutral[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${colorTokens.semantic.border.default}`,
};

/** Attachment info */
export const attachmentInfo: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  '& .filename': {
    ...semanticTypography.body.small,
    fontWeight: 500,
    color: colorTokens.semantic.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .filesize': {
    ...semanticTypography.caption.small,
    color: colorTokens.semantic.text.secondary,
  },
};

/** Attachment preview list */
export const attachmentPreviewList: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  p: 1.5,
  borderBottom: `1px solid ${colorTokens.semantic.border.light}`,
};

