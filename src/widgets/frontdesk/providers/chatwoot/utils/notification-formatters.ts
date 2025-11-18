/**
 * Notification Formatters
 * Utility functions for formatting notification data
 */

import { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";

/**
 * Notification sender information
 */
export interface NotificationSender {
  name: string;
  email: string;
  thumbnail: string;
  initials: string;
  color: string;
}

/**
 * Notification assignee information
 */
export interface NotificationAssignee {
  name: string;
  id: number;
  thumbnail: string;
}

/**
 * Avatar color palette for consistent user identification
 */
const AVATAR_COLORS = [
  "#1976D2", // Primary blue
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
];

/**
 * Get notification sender information (the actual contact who sent the message)
 */
export function getNotificationSender(notification: ChatwootNotification, fallbackColor: string): NotificationSender {
  const primaryActor = notification.primary_actor as any;
  const secondaryActor = notification.secondary_actor as any;

  // Priority order for sender name:
  // 1. secondary_actor.name (message sender - most accurate)
  // 2. secondary_actor.email (message sender email)
  // 3. primary_actor.meta.sender.name (contact name from conversation meta)
  // 4. primary_actor.meta.sender.email (contact email from conversation meta)
  // 5. secondary_actor.sender.name (nested sender object)
  // 6. primary_actor.name (conversation/contact name)
  // 7. primary_actor.email (conversation/contact email)
  // 8. Fallback to "Unknown"
  
  const senderName = 
    secondaryActor?.name ||
    secondaryActor?.email ||
    primaryActor?.meta?.sender?.name ||
    primaryActor?.meta?.sender?.email ||
    secondaryActor?.sender?.name ||
    secondaryActor?.sender?.email ||
    primaryActor?.name ||
    primaryActor?.email ||
    "Unknown";

  const senderEmail = 
    secondaryActor?.email ||
    primaryActor?.meta?.sender?.email ||
    secondaryActor?.sender?.email ||
    primaryActor?.email ||
    "";

  const senderThumbnail = 
    secondaryActor?.thumbnail ||
    secondaryActor?.avatar_url ||
    secondaryActor?.sender?.thumbnail ||
    primaryActor?.meta?.sender?.thumbnail ||
    primaryActor?.avatar_url ||
    "";

  const name = senderName;
  const email = senderEmail;
  const thumbnail = senderThumbnail;

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate consistent color based on name
  const colors = [fallbackColor, ...AVATAR_COLORS];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return {
    name,
    email,
    thumbnail,
    initials,
    color: colors[colorIndex],
  };
}

/**
 * Get assignee information from notification
 */
export function getAssigneeInfo(notification: ChatwootNotification): NotificationAssignee | null {
  const primaryActor = notification.primary_actor as any;
  const assignee = primaryActor?.meta?.assignee;

  if (!assignee) return null;

  return {
    name: assignee.name || assignee.available_name || "Unknown",
    id: assignee.id,
    thumbnail: assignee.thumbnail || assignee.avatar_url || "",
  };
}

/**
 * Get conversation ID from notification
 */
export function getConversationId(notification: ChatwootNotification): number | null {
  const primaryActor = notification.primary_actor as any;
  return primaryActor?.id || notification.primary_actor_id || null;
}

/**
 * Get email subject from notification (for email channels)
 */
export function getEmailSubject(notification: ChatwootNotification): string | null {
  const primaryActor = notification.primary_actor as any;
  const additionalAttrs = primaryActor?.additional_attributes;

  if (!additionalAttrs?.mail_subject) return null;

  // Decode HTML entities
  const decoded = additionalAttrs.mail_subject
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  return decoded;
}

/**
 * Get message preview from notification
 */
export function getMessagePreview(notification: ChatwootNotification, maxLength: number = 80): string {
  // First try to get actual message content from secondary_actor (the message itself)
  const messageContent = notification.secondary_actor?.content;

  if (messageContent) {
    // Remove HTML tags and extra whitespace
    const plainText = messageContent
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .replace(/={3,}/g, "") // Remove separator lines
      .trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
  }

  // Fallback to push message body
  const pushMessageBody = notification.push_message_body;
  if (pushMessageBody) {
    const plainText = pushMessageBody.replace(/<[^>]*>/g, "").trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
  }

  return "New message";
}

/**
 * Get snooze information text
 */
export function getSnoozeText(notification: ChatwootNotification): string | null {
  const primaryActor = notification.primary_actor as any;

  if (primaryActor?.snoozed_until) {
    const snoozeDate = new Date(primaryActor.snoozed_until);
    const now = new Date();

    if (snoozeDate > now) {
      const diffMs = snoozeDate.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `Snoozed until ${diffMins}m`;
      if (diffHours < 24) return `Snoozed until ${diffHours}h`;
      return `Snoozed until ${diffDays}d`;
    }
    return "Snooze ended";
  }

  const lastSnoozedAt = primaryActor?.meta?.lastSnoozedAt || primaryActor?.meta?.lastSnoozedAt;
  if (lastSnoozedAt) {
    return "Snoozed";
  }

  return null;
}

/**
 * Notification type details
 */
export interface NotificationTypeDetails {
  icon: string;
  label: string;
  color: string;
}

/**
 * Get notification type details (icon, label, color)
 */
export function getNotificationTypeDetails(
  notificationType: string | undefined,
  colors: { primary: string; neutral: string }
): NotificationTypeDetails {
  if (!notificationType) {
    return { icon: "notifications", label: "Notification", color: colors.neutral };
  }

  const typeMap: Record<string, NotificationTypeDetails> = {
    "conversation.mention": { icon: "alternate_email", label: "Mention", color: colors.primary },
    "conversation.assigned": { icon: "person_add", label: "Assignment", color: colors.primary },
    "conversation.created": { icon: "add_comment", label: "New Ticket", color: colors.primary },
    "conversation.updated": { icon: "edit", label: "Updated", color: colors.neutral },
    "message.created": { icon: "message", label: "New Message", color: colors.primary },
    // Handle compound notification types
    "assigned_conversation_new_message": { icon: "message", label: "New Message", color: colors.primary },
    "unassigned_conversation_new_message": { icon: "message", label: "New Message", color: colors.primary },
  };

  // Check exact match first
  if (typeMap[notificationType]) {
    return typeMap[notificationType];
  }

  // Handle patterns for better user experience
  // Priority: Check for message-related notifications first (most common)
  if (notificationType.includes("new_message") || notificationType.includes("message.created") || notificationType.includes("message")) {
    return { icon: "message", label: "New Message", color: colors.primary };
  }

  // Pattern: "conversation.mention" or "mention" -> "Mention"
  if (notificationType.includes("mention")) {
    return { icon: "alternate_email", label: "Mention", color: colors.primary };
  }

  // Pattern: "conversation.created" or "created" -> "New Conversation"
  if (notificationType.includes("created")) {
    return { icon: "add_comment", label: "New Conversation", color: colors.primary };
  }

  // Pattern: "conversation.assigned" or "assigned" -> "Assignment"
  // (but not if it's about a message, which we already handled above)
  if (notificationType.includes("assigned") && !notificationType.includes("unassigned")) {
    return { icon: "person_add", label: "Assignment", color: colors.primary };
  }

  // Pattern: "conversation.updated" or "updated" -> "Updated"
  if (notificationType.includes("updated")) {
    return { icon: "edit", label: "Updated", color: colors.neutral };
  }

  // Fallback: Try to format the notification type nicely
  // Convert snake_case to Title Case and clean up common patterns
  const formattedLabel = notificationType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

  return {
    icon: "notifications",
    label: formattedLabel || "Notification",
    color: colors.neutral,
  };
}

/**
 * Conversation status label mapping
 */
const STATUS_LABELS: Record<string, string> = {
  resolved: "Closed",
  pending: "Pending",
  snoozed: "Snoozed",
};

/**
 * Get conversation status label
 */
export function getStatusLabel(status?: string): string | null {
  if (!status || status === "open") return null;
  return STATUS_LABELS[status] || status;
}

/**
 * Conversation status colors
 */
const STATUS_COLORS: Record<string, string> = {
  resolved: "#6B7280", // neutral-600
  pending: "#F59E0B", // amber-500
  snoozed: "#9CA3AF", // neutral-500
};

/**
 * Get conversation status color
 */
export function getStatusColor(status?: string, neutralColor?: string): string | null {
  if (!status || status === "open") return null;
  return STATUS_COLORS[status] || neutralColor || "#6B7280";
}
