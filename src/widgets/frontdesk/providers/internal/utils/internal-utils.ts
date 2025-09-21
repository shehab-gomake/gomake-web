import { Message, PresenceData } from "../types/internal.types";

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
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
  return `${presence.firstName} ${presence.lastName}`.trim() || presence.email;
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
