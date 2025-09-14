import { ConversationMessage } from "@/widgets/frontdesk/components/conversation/conversation-types";

export const parseEmailField = (emailField: string): string => {
  const match = emailField.match(/^(.*?)\s*<.*>$/);
  return match ? match[1].trim().replace(/"/g, "") : emailField;
};

export const formatTimestamp = (timestamp: string | number): string => {
  try {
    const date = typeof timestamp === "string" ? new Date(parseInt(timestamp)) : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch {
    return String(timestamp);
  }
};

export const decodeHtmlEntities = (str: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const mapToConversationMessage = (
  message: any,
  currentUserEmail?: string,
  fromField?: string
): ConversationMessage => ({
  id: message.id || `msg-${Date.now()}`,
  from: message.from === currentUserEmail || fromField === currentUserEmail ? "me" : "them",
  text: message.body || message.text || message.snippet || "",
  at:
    message.at ||
    (message.date
      ? new Date(message.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
});