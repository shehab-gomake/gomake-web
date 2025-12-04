/**
 * FrontDesk Design System - Chatwoot-Specific Tokens
 *
 * Semantic tokens specifically for the Chatwoot provider.
 * Extends base color tokens with conversation, message, and status semantics.
 */

import { colorTokens } from './colors.tokens';

/**
 * Conversation status colors
 * Maps Chatwoot conversation statuses to visual indicators
 */
export const conversationStatusColors = {
  open: {
    main: colorTokens.success[600],
    bg: colorTokens.success[50],
    border: colorTokens.success[200],
    text: colorTokens.success[700],
  },
  pending: {
    main: colorTokens.warning[600],
    bg: colorTokens.warning[50],
    border: colorTokens.warning[200],
    text: colorTokens.warning[700],
  },
  snoozed: {
    main: colorTokens.info[600],
    bg: colorTokens.info[50],
    border: colorTokens.info[200],
    text: colorTokens.info[700],
  },
  resolved: {
    main: colorTokens.neutral[500],
    bg: colorTokens.neutral[100],
    border: colorTokens.neutral[200],
    text: colorTokens.neutral[600],
  },
  all: {
    main: colorTokens.primary[600],
    bg: colorTokens.primary[50],
    border: colorTokens.primary[200],
    text: colorTokens.primary[700],
  },
} as const;

/**
 * Message type colors
 * Distinct visual styles for different message types
 */
export const messageTypeColors = {
  incoming: {
    bg: colorTokens.neutral[100],
    text: colorTokens.neutral[900],
    border: colorTokens.neutral[200],
    meta: colorTokens.neutral[500],
  },
  outgoing: {
    bg: colorTokens.primary[600],
    text: '#FFFFFF',
    border: colorTokens.primary[700],
    meta: colorTokens.primary[200],
  },
  private_note: {
    bg: colorTokens.warning[50],
    text: colorTokens.warning[900],
    border: colorTokens.warning[300],
    meta: colorTokens.warning[600],
    indicator: colorTokens.warning[500],
  },
  activity: {
    bg: 'transparent',
    text: colorTokens.neutral[500],
    border: 'transparent',
    meta: colorTokens.neutral[400],
  },
  template: {
    bg: colorTokens.info[50],
    text: colorTokens.info[900],
    border: colorTokens.info[200],
    meta: colorTokens.info[600],
  },
} as const;

/**
 * Priority colors with semantic meaning
 */
export const priorityColors = {
  urgent: {
    main: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#991B1B',
    icon: '#EF4444',
  },
  high: {
    main: '#EA580C',
    bg: '#FFF7ED',
    border: '#FFEDD5',
    text: '#9A3412',
    icon: '#F97316',
  },
  medium: {
    main: '#D97706',
    bg: '#FFFBEB',
    border: '#FEF3C7',
    text: '#92400E',
    icon: '#F59E0B',
  },
  low: {
    main: '#16A34A',
    bg: '#F0FDF4',
    border: '#DCFCE7',
    text: '#166534',
    icon: '#22C55E',
  },
  none: {
    main: colorTokens.neutral[400],
    bg: colorTokens.neutral[50],
    border: colorTokens.neutral[200],
    text: colorTokens.neutral[600],
    icon: colorTokens.neutral[400],
  },
} as const;

/**
 * SLA status colors
 */
export const slaColors = {
  onTrack: {
    main: colorTokens.success[600],
    bg: colorTokens.success[50],
    text: colorTokens.success[700],
  },
  warning: {
    main: colorTokens.warning[600],
    bg: colorTokens.warning[50],
    text: colorTokens.warning[700],
  },
  breached: {
    main: colorTokens.error[600],
    bg: colorTokens.error[50],
    text: colorTokens.error[700],
  },
} as const;

/**
 * Agent/User presence colors
 */
export const presenceColors = {
  online: {
    main: '#22C55E',
    pulse: '#4ADE80',
  },
  busy: {
    main: '#EF4444',
    pulse: '#F87171',
  },
  away: {
    main: '#F59E0B',
    pulse: '#FBBF24',
  },
  offline: {
    main: '#9CA3AF',
    pulse: '#D1D5DB',
  },
} as const;

/**
 * Inbox/Channel type colors
 */
export const inboxTypeColors = {
  web_widget: {
    main: '#8B5CF6',
    bg: '#FAF5FF',
    border: '#E9D5FF',
  },
  email: {
    main: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  whatsapp: {
    main: '#25D366',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  sms: {
    main: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  api: {
    main: '#0891B2',
    bg: '#ECFEFF',
    border: '#A5F3FC',
  },
  facebook: {
    main: '#1877F2',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  twitter: {
    main: '#1DA1F2',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  telegram: {
    main: '#0088CC',
    bg: '#ECFEFF',
    border: '#A5F3FC',
  },
  line: {
    main: '#00B900',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
} as const;

/**
 * Notification type colors
 */
export const notificationColors = {
  conversation_creation: {
    main: colorTokens.primary[600],
    bg: colorTokens.primary[50],
    icon: colorTokens.primary[500],
  },
  conversation_assignment: {
    main: colorTokens.info[600],
    bg: colorTokens.info[50],
    icon: colorTokens.info[500],
  },
  assigned_conversation_new_message: {
    main: colorTokens.success[600],
    bg: colorTokens.success[50],
    icon: colorTokens.success[500],
  },
  conversation_mention: {
    main: colorTokens.warning[600],
    bg: colorTokens.warning[50],
    icon: colorTokens.warning[500],
  },
  participating_conversation_new_message: {
    main: colorTokens.neutral[600],
    bg: colorTokens.neutral[50],
    icon: colorTokens.neutral[500],
  },
} as const;

/**
 * Label colors palette for conversation labels
 * Provides a set of distinguishable colors for custom labels
 */
export const labelColorPalette = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#78716C', // Stone
] as const;

/**
 * File type colors for attachments
 */
export const fileTypeColors = {
  image: '#10B981', // Emerald
  video: '#8B5CF6', // Violet
  audio: '#F59E0B', // Amber
  pdf: '#EF4444',   // Red
  document: '#3B82F6', // Blue
  spreadsheet: '#22C55E', // Green
  presentation: '#F97316', // Orange
  archive: '#6B7280', // Gray
  code: '#06B6D4',  // Cyan
  default: '#9CA3AF', // Gray
} as const;

/**
 * Dashboard stat card colors
 */
export const dashboardColors = {
  openConversations: {
    main: colorTokens.primary[600],
    bg: colorTokens.primary[50],
    trend: colorTokens.primary[700],
  },
  unassigned: {
    main: colorTokens.warning[600],
    bg: colorTokens.warning[50],
    trend: colorTokens.warning[700],
  },
  responseTime: {
    main: colorTokens.info[600],
    bg: colorTokens.info[50],
    trend: colorTokens.info[700],
  },
  resolutionTime: {
    main: colorTokens.success[600],
    bg: colorTokens.success[50],
    trend: colorTokens.success[700],
  },
  satisfaction: {
    main: '#8B5CF6',
    bg: '#FAF5FF',
    trend: '#7C3AED',
  },
} as const;

// Type exports
export type ConversationStatus = keyof typeof conversationStatusColors;
export type MessageType = keyof typeof messageTypeColors;
export type Priority = keyof typeof priorityColors;
export type SLAStatus = keyof typeof slaColors;
export type Presence = keyof typeof presenceColors;
export type InboxType = keyof typeof inboxTypeColors;

/**
 * Get conversation status color
 */
export const getConversationStatusColor = (status: ConversationStatus) => {
  return conversationStatusColors[status] || conversationStatusColors.open;
};

/**
 * Get message type color
 */
export const getMessageTypeColor = (type: MessageType) => {
  return messageTypeColors[type] || messageTypeColors.incoming;
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: Priority) => {
  return priorityColors[priority] || priorityColors.none;
};

/**
 * Get presence color
 */
export const getPresenceColor = (presence: Presence) => {
  return presenceColors[presence] || presenceColors.offline;
};

/**
 * Get inbox type color
 */
export const getInboxTypeColor = (type: InboxType) => {
  return inboxTypeColors[type] || inboxTypeColors.web_widget;
};

