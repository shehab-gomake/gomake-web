import React from "react";
import { useRecoilValue } from "recoil";
import {
  messagingChannelsState,
  messagingUnreadCountsState,
  messagingOnlineUsersState,
  messagingUserPresenceState,
} from "@/store/messaging";
import { Channel, PresenceData } from "../types/internal.types";
import { BaseProviderSidebar, BaseSidebarItem } from "@/widgets/frontdesk/components/shared/BaseProviderSidebar";
import { getDisplayName, getLastSeenText, getStatusColor } from "../utils/internal-utils";

interface ChannelSidebarProps {
  activeChannelId: string | null;
  currentUser?: { id: string; email: string; name?: string };
  onChannelSelect: (channelId: string) => void;
  onStartDirectMessage?: (userId: string) => void;
  onAddChannel?: () => void;
  onCreateChannel?: (name: string, description?: string) => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  activeChannelId,
  currentUser,
  onChannelSelect,
  onStartDirectMessage,
  onAddChannel,
  onCreateChannel,
}) => {
  const channels = useRecoilValue(messagingChannelsState);
  const unreadCounts = useRecoilValue(messagingUnreadCountsState);
  const onlineUsers = useRecoilValue(messagingOnlineUsersState);
  const userPresence = useRecoilValue(messagingUserPresenceState);

  // Convert channels to sidebar items
  const channelItems: BaseSidebarItem[] = channels
    .filter((c) => c.type === "channel")
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: "channel" as const,
      unreadCount: unreadCounts[channel.id] || 0,
      isSelected: activeChannelId === channel.id,
    }));

  // Convert direct channels to sidebar items
  const directChannelItems: BaseSidebarItem[] = channels
    .filter((c) => c.type === "direct")
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: "direct" as const,
      unreadCount: unreadCounts[channel.id] || 0,
      isSelected: activeChannelId === channel.id,
    }));

  // Get all unique users from presence data
  const allUsers = Object.values(userPresence);

  // Deduplicate users by userId and get the most complete data
  const uniqueUsers = allUsers.reduce((acc, presence) => {
    const existing = acc.get(presence.userId);
    if (!existing) {
      acc.set(presence.userId, presence);
    } else {
      // Keep the user with more complete data (prefer firstName/lastName over email)
      const existingHasName = existing.firstName || existing.lastName;
      const currentHasName = presence.firstName || presence.lastName;

      if (currentHasName && !existingHasName) {
        acc.set(presence.userId, presence);
      } else if (currentHasName && existingHasName) {
        // If both have names, prefer the one with more complete data
        const existingNameCompleteness = (existing.firstName ? 1 : 0) + (existing.lastName ? 1 : 0);
        const currentNameCompleteness = (presence.firstName ? 1 : 0) + (presence.lastName ? 1 : 0);

        if (currentNameCompleteness > existingNameCompleteness) {
          acc.set(presence.userId, presence);
        }
      }
    }
    return acc;
  }, new Map());

  // Convert unique users to sidebar items (excluding current user)
  const userItems: BaseSidebarItem[] = Array.from(uniqueUsers.values())
    .filter((presence) => presence.userId !== currentUser?.id) // Exclude current user
    .map((presence) => ({
      id: presence.userId,
      name: getDisplayName(presence),
      type: "direct" as const,
      status: onlineUsers.includes(presence.userId) ? "online" : presence.status,
      lastSeen: presence.lastSeen,
      email: presence.email,
    }))
    .sort((a, b) => {
      // Sort online users first, then by name
      if (a.status === "online" && b.status !== "online") return -1;
      if (a.status !== "online" && b.status === "online") return 1;
      return a.name.localeCompare(b.name);
    });

  const allItems = [...channelItems, ...directChannelItems, ...userItems];

  const handleItemSelect = (item: BaseSidebarItem) => {
    if (item.type === "channel") {
      onChannelSelect(item.id);
    } else if (item.type === "direct") {
      if (onStartDirectMessage) {
        onStartDirectMessage(item.id);
      } else {
        onChannelSelect(item.id);
      }
    }
  };

  return (
    <BaseProviderSidebar
      title="Direct Messages"
      items={allItems}
      selectedItemId={activeChannelId || undefined}
      onItemSelect={handleItemSelect}
      onAddItem={onAddChannel}
      sections={{
        channels: "CHANNELS",
        directMessages: "DIRECT MESSAGES",
      }}
      emptyMessage="No channels or users available"
    />
  );
};
