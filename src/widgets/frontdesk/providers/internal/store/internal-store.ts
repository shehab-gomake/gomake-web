import { atom } from "recoil";
import { Channel, Message, PresenceData } from "../types/internal.types";

// Channel state
export const internalChannelsState = atom<Channel[]>({
  key: "internalChannelsState",
  default: [],
});

// Messages state
export const internalMessagesState = atom<Message[]>({
  key: "internalMessagesState",
  default: [],
});

// User presence state
export const internalUserPresenceState = atom<Record<string, PresenceData>>({
  key: "internalUserPresenceState",
  default: {},
});

// Online users state
export const internalOnlineUsersState = atom<string[]>({
  key: "internalOnlineUsersState",
  default: [],
});

// Typing users state
export const internalTypingUsersState = atom<string[]>({
  key: "internalTypingUsersState",
  default: [],
});

// Active channel state
export const internalActiveChannelState = atom<string | null>({
  key: "internalActiveChannelState",
  default: null,
});

// Connection state
export const internalConnectionState = atom<{
  isConnected: boolean;
  status: "connecting" | "connected" | "disconnected" | "error";
  error?: string;
}>({
  key: "internalConnectionState",
  default: {
    isConnected: false,
    status: "disconnected",
  },
});
