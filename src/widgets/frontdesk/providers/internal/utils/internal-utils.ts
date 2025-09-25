import { Message, PresenceData } from "../types/internal.types";

export const formatMessageTime = (timestamp: string): string => {
  if (!timestamp) return "Just now";

  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffHours < 168) {
    // 7 days
    return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }
};

export const getDisplayName = (presence: PresenceData): string => {
  const firstName = presence.firstName || "";
  const lastName = presence.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || presence.email || "Unknown User";
};

export const getLastSeenText = (presence: PresenceData): string | null => {
  if (presence.status === "offline" && presence.lastSeen) {
    const lastSeenDate = new Date(presence.lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  }
  return null;
};

export const getInitials = (name: string): string => {
  if (!name || name === "Unknown User") return "U";
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
};

export const groupMessages = (messages: Message[]): { message: Message; showAvatar: boolean }[] => {
  return messages.reduce((groups: { message: Message; showAvatar: boolean }[], message, index) => {
    const prevMessage = messages[index - 1];
    const showAvatar =
      !prevMessage ||
      prevMessage.userId !== message.userId ||
      new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000; // 5 minutes

    groups.push({ message, showAvatar });
    return groups;
  }, []);
};

export const getStatusColor = (status: "online" | "away" | "busy" | "offline"): string => {
  switch (status) {
    case "online":
      return "#10B981"; // green
    case "away":
      return "#F59E0B"; // yellow
    case "busy":
      return "#EF4444"; // red
    case "offline":
      return "#6B7280"; // gray
    default:
      return "#6B7280";
  }
};

export const getChannelTitle = (
  channelId: string,
  userPresence: Record<string, PresenceData>,
  currentUser?: { id: string; email: string; name?: string }
): string => {
  if (!channelId) return "Select a channel";

  // Direct message channel
  if (channelId.startsWith("dm-")) {
    const userIds = channelId.replace("dm-", "").split("-");
    const otherUserId = userIds.find((id) => id !== currentUser?.id);

    if (otherUserId && userPresence[otherUserId]) {
      return getDisplayName(userPresence[otherUserId]);
    }

    return "Direct Message";
  }

  // Regular channel
  if (channelId.includes("@")) {
    return channelId; // Email address
  }

  // Default channel name
  return `#${channelId}`;
};
