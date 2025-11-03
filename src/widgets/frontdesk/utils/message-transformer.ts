/**
 * Message Transformation Layer
 *
 * Provides a unified message format across all FrontDesk providers (Email, Tickets, DMs, etc.)
 * This enables shared components like MessageItem to work consistently across providers.
 */

export interface UnifiedMessage {
  id: string;
  content: string;
  html?: string;
  timestamp: string;
  author: {
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
  recipient?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  channel?: "email" | "whatsapp" | "sms" | "phone" | "internal";
  direction?: "inbound" | "outbound";
  status?: "pending" | "sent" | "delivered" | "failed";
  attachments?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    url?: string;
  }>;
  metadata?: Record<string, any>;
}

/**
 * Transform Email message to unified format
 */
export function emailToUnified(message: any, currentUserEmail?: string): UnifiedMessage {
  // Determine if message is from current user
  const senderEmail = message.from?.[0]?.email || message.from;
  const isOwn = currentUserEmail && senderEmail === currentUserEmail;

  return {
    id: message.id,
    content: message.text || message.snippet || "",
    html: message.html,
    timestamp: message.date,
    author: {
      name: message.from?.[0]?.name || message.from?.[0]?.email || senderEmail || "Unknown",
      email: senderEmail,
    },
    recipient: message.to?.[0]
      ? {
          name: message.to[0].name,
          email: message.to[0].email,
        }
      : undefined,
    channel: "email",
    direction: isOwn ? "outbound" : "inbound",
    status: message.status || "delivered",
    attachments: message.attachments?.map((att: any) => ({
      id: att.id || att.attachmentId,
      filename: att.filename,
      mimeType: att.mimeType,
      size: att.size,
      url: att.url,
    })),
    metadata: {
      threadId: message.threadId,
      subject: message.subject,
    },
  };
}

/**
 * Transform Ticket message to unified format
 */
export function ticketToUnified(message: any, ticket?: any): UnifiedMessage {
  const isInbound = message.direction === "INBOUND";

  // 🐛 DEBUG: Log message transformation
  console.log("[ticketToUnified] Transforming message:", {
    messageId: message.id,
    direction: message.direction,
    fromIdentifier: message.fromIdentifier,
    channel: message.channel,
    customerEmail: ticket?.customerEmail,
    assigneeEmail: ticket?.assignee?.email,
  });

  // Determine author based on direction and fromIdentifier
  // For INBOUND: Use customer info (sender is external customer)
  // For OUTBOUND: Use fromIdentifier if available (sender is agent/support), otherwise use assignee
  const author = isInbound
    ? {
        name: ticket?.customerName || ticket?.customerEmail || message.fromIdentifier || "Customer",
        email: ticket?.customerEmail || message.fromIdentifier,
        phone: ticket?.customerPhone,
      }
    : {
        // For outbound messages, prefer fromIdentifier (actual sender) over assignee
        name: message.fromIdentifier || ticket?.assignee?.name || "Support Agent",
        email: message.fromIdentifier || ticket?.assignee?.email,
      };

  // Determine recipient for better message context
  const recipient = isInbound
    ? {
        name: ticket?.assignee?.name || "Support",
        email: ticket?.assignee?.email,
      }
    : {
        name: ticket?.customerName,
        email: ticket?.customerEmail,
        phone: ticket?.customerPhone,
      };

  // Map ticket channel to unified channel
  const channelMap: Record<string, UnifiedMessage["channel"]> = {
    EMAIL: "email",
    WHATSAPP: "whatsapp",
    SMS: "sms",
    PHONE: "phone",
    INTERNAL: "internal",
  };

  // Smart HTML detection - same logic email uses!
  const content = message.content || "";
  const hasHtml =
    message.metadata?.hasHtml || // Trust backend flag if set
    content.includes("<") || // Has HTML tags
    content.includes("&lt;") || // Has encoded HTML
    content.match(/<[a-z][\s\S]*>/i); // Regex for HTML tags

  return {
    id: message.id,
    content: content,
    html: hasHtml ? content : undefined, // ✅ Always set html if HTML detected
    timestamp: message.createdAt,
    author,
    recipient, // Now includes recipient info
    channel: channelMap[message.channel] || "email",
    direction: isInbound ? "inbound" : "outbound",
    status: message.status || "delivered",
    attachments: message.attachments?.map((att: any) => ({
      id: att.id,
      filename: att.filename || att.fileName,
      mimeType: att.mimeType || att.contentType,
      size: att.size || att.fileSize,
      url: att.url,
    })),
    metadata: {
      ticketId: ticket?.id,
      ticketNumber: ticket?.ticketNumber,
      messageId: message.id,
      channelMetadata: message.channelMetadata,
      providerMessageId: message.channelMetadata?.providerMessageId,
    },
  };
}

/**
 * Transform DM message to unified format (for future use)
 */
export function dmToUnified(message: any, currentUserId?: string): UnifiedMessage {
  const isOwn = message.senderId === currentUserId;

  return {
    id: message.id,
    content: message.content || message.text || "",
    html: message.html,
    timestamp: message.timestamp || message.createdAt,
    author: {
      name: message.sender?.name || "Unknown",
      email: message.sender?.email,
      avatarUrl: message.sender?.avatar,
    },
    channel: "internal",
    direction: isOwn ? "outbound" : "inbound",
    status: message.status || "delivered",
    attachments: message.attachments?.map((att: any) => ({
      id: att.id,
      filename: att.name || att.filename,
      mimeType: att.type || att.mimeType,
      size: att.size,
      url: att.url,
    })),
  };
}

/**
 * Infer message direction based on author email/identifier
 */
export function inferDirection(message: any, currentUserEmail?: string, currentUserId?: string): "inbound" | "outbound" {
  // Check explicit direction field
  if (message.direction) {
    return message.direction.toLowerCase() as "inbound" | "outbound";
  }

  // Check sender email
  if (currentUserEmail && message.from) {
    const senderEmail = typeof message.from === "string" ? message.from : message.from?.[0]?.email;
    return senderEmail === currentUserEmail ? "outbound" : "inbound";
  }

  // Check sender ID
  if (currentUserId && message.senderId) {
    return message.senderId === currentUserId ? "outbound" : "inbound";
  }

  // Default to inbound
  return "inbound";
}

/**
 * Get avatar color based on email/name
 */
export function getAvatarColor(identifier: string | undefined | null): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7B731",
    "#5F27CD",
    "#00B894",
    "#0984E3",
    "#6C5CE7",
    "#FD79A8",
    "#FDCB6E",
  ];

  // Handle undefined, null, or non-string values
  if (!identifier || typeof identifier !== "string") {
    return colors[0]; // Return first color as default
  }

  const hash = identifier.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get initials from name or email
 */
export function getInitials(name: string | undefined | null): string {
  if (!name || typeof name !== "string") return "?";

  // If it's an email, extract name part
  if (name.includes("@")) {
    name = name.split("@")[0];
  }

  const parts = name.trim().split(/[\s._-]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
