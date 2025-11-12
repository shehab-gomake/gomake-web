/**
 * Ticket History Card Component
 *
 * Rich card-based UI for displaying individual conversation/ticket history
 * Shows status, priority, message preview, assignee, channel, and metadata
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { colorTokens, radiusTokens } from "@/widgets/frontdesk/design-system/tokens";
import { Chip } from "@/widgets/frontdesk/design-system/primitives/Chip";
import { Avatar } from "@/widgets/frontdesk/design-system/primitives/Avatar";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  AccessTime as TimeIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Flag as PriorityIcon,
} from "@mui/icons-material";

interface TicketHistoryCardProps {
  conversation: ChatwootConversation;
  onClick: (conversation: ChatwootConversation) => void;
  isActive?: boolean; // Whether this is the currently viewed conversation
  inboxes?: ChatwootInbox[]; // Inboxes list to get inbox names
}

/**
 * Get status color and label
 */
const getStatusInfo = (status?: string) => {
  const statusMap: Record<string, { label: string; color: "primary" | "success" | "warning" | "neutral" }> = {
    open: { label: "Open", color: "primary" },
    pending: { label: "Pending", color: "warning" },
    resolved: { label: "Resolved", color: "success" },
    snoozed: { label: "Snoozed", color: "neutral" },
  };
  return statusMap[status || "open"] || { label: status || "Open", color: "neutral" };
};

/**
 * Get priority color and label
 */
const getPriorityInfo = (priority?: string | null) => {
  if (!priority) return null;

  const priorityMap: Record<string, { label: string; color: string }> = {
    urgent: { label: "Urgent", color: colorTokens.semantic.priority.urgent },
    high: { label: "High", color: colorTokens.semantic.priority.high },
    medium: { label: "Medium", color: colorTokens.semantic.priority.medium },
    low: { label: "Low", color: colorTokens.semantic.priority.low },
  };

  return priorityMap[priority.toLowerCase()] || { label: priority, color: colorTokens.neutral[600] };
};

/**
 * Get channel icon based on channel type
 */
const getChannelIcon = (channel?: string) => {
  const channelLower = channel?.toLowerCase() || "";

  if (channelLower.includes("email")) return <EmailIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes("whatsapp")) return <WhatsAppIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes("sms")) return <SmsIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes("phone")) return <PhoneIcon sx={{ fontSize: 12 }} />;

  return <ChatIcon sx={{ fontSize: 12 }} />;
};

/**
 * Get inbox name from inbox_id
 */
const getInboxName = (inboxId?: number, inboxes: ChatwootInbox[] = []): string => {
  if (!inboxId || !inboxes.length) return "Unknown Inbox";

  const inbox = inboxes.find((inbox) => inbox.id === inboxId);
  return inbox?.name || "Unknown Inbox";
};

/**
 * Get inbox icon based on channel type
 */
const getInboxIcon = (inboxId?: number, inboxes: ChatwootInbox[] = []) => {
  if (!inboxId || !inboxes.length) return <ChatIcon sx={{ fontSize: 12 }} />;

  const inbox = inboxes.find((inbox) => inbox.id === inboxId);
  const channelType = inbox?.channel_type?.toLowerCase() || "";

  if (channelType.includes("email")) return <EmailIcon sx={{ fontSize: 12 }} />;
  if (channelType.includes("whatsapp")) return <WhatsAppIcon sx={{ fontSize: 12 }} />;
  if (channelType.includes("sms")) return <SmsIcon sx={{ fontSize: 12 }} />;
  if (channelType.includes("phone")) return <PhoneIcon sx={{ fontSize: 12 }} />;

  return <ChatIcon sx={{ fontSize: 12 }} />;
};

/**
 * Get relative time string
 */
const getRelativeTime = (timestamp?: number) => {
  if (!timestamp) return "Unknown";

  const now = Date.now();
  const diff = now - timestamp * 1000; // Convert to milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;

  // For older dates, show formatted date
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/**
 * Extract and clean message preview
 */
const getMessagePreview = (conversation: ChatwootConversation): string => {
  // Try to get last non-activity message
  let content = conversation.last_non_activity_message?.content;

  // Fallback to last message in messages array
  if (!content && conversation.messages && conversation.messages.length > 0) {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    content = lastMessage.content;
  }

  if (!content) return "No messages";

  // Strip HTML tags
  const stripped = content.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  const cleaned = decoded.replace(/\s+/g, " ").trim();

  // Truncate to ~80 characters
  if (cleaned.length > 80) {
    return cleaned.substring(0, 77) + "...";
  }

  return cleaned || "No messages";
};

/**
 * Ticket History Card Component
 */
export const TicketHistoryCard: React.FC<TicketHistoryCardProps> = ({
  conversation,
  onClick,
  isActive = false,
  inboxes = [],
}) => {
  const statusInfo = getStatusInfo(conversation.status);
  const messagePreview = getMessagePreview(conversation);
  const relativeTime = getRelativeTime(conversation.last_activity_at || conversation.created_at);

  // Get inbox name and icon
  const inboxName = getInboxName(conversation.inbox_id, inboxes);
  const inboxIcon = getInboxIcon(conversation.inbox_id, inboxes);

  // Contact information
  const contactName = conversation.meta?.sender?.name || conversation.meta?.sender?.email || "Unknown";
  const contactAvatar = conversation.meta?.sender?.avatar_url;

  return (
    <Box
      onClick={() => onClick(conversation)}
      sx={{
        p: 1.25,
        backgroundColor: isActive ? colorTokens.primary[50] : colorTokens.neutral[50],
        border: `1px solid ${isActive ? colorTokens.primary[300] : colorTokens.semantic.border.default}`,
        borderRadius: radiusTokens.md,
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: isActive ? colorTokens.primary[100] : colorTokens.neutral[100],
          borderColor: isActive ? colorTokens.primary[400] : colorTokens.primary[300],
          boxShadow: `0 1px 3px ${colorTokens.neutral[200]}`,
        },
      }}
    >
      {/* Row 1: Status ... Ticket ID */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.875,
        }}
      >
        <Chip label={statusInfo.label} color={statusInfo.color} variant="soft" size="small" sx={{ fontSize: 11, height: 22 }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: 11,
            color: isActive ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
            fontFamily: "monospace",
          }}
        >
          #{conversation.id}
        </Typography>
      </Box>

      {/* Row 2: Contact name and icon ... datetime */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.875,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.625,
          }}
        >
          <Avatar size="xs" name={contactName} src={contactAvatar} />
          <Typography
            variant="body2"
            sx={{
              fontSize: 11,
              color: colorTokens.semantic.text.primary,
              fontWeight: 500,
            }}
          >
            {contactName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: colorTokens.semantic.text.tertiary,
          }}
        >
          <TimeIcon sx={{ fontSize: 12 }} />
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {relativeTime}
          </Typography>
        </Box>
      </Box>

      {/* Row 3: Message preview */}
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          color: colorTokens.semantic.text.secondary,
          mb: 0.875,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: 1.4,
        }}
      >
        {messagePreview}
      </Typography>

      {/* Row 4: Inbox with icon and name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          color: colorTokens.semantic.text.tertiary,
        }}
      >
        {inboxIcon}
        <Typography variant="caption" sx={{ fontSize: 10 }}>
          {inboxName}
        </Typography>
      </Box>
    </Box>
  );
};
