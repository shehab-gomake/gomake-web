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
  onChannelSelect: (channelId: string) => void;
  onStartDirectMessage?: (userId: string) => void;
  onAddChannel?: () => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  activeChannelId,
  onChannelSelect,
  onStartDirectMessage,
  onAddChannel,
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

  // Convert online users to sidebar items
  const onlineUserItems: BaseSidebarItem[] = Object.values(userPresence)
    .filter((presence) => onlineUsers.includes(presence.userId))
    .map((presence) => ({
      id: presence.userId,
      name: getDisplayName(presence),
      type: "direct" as const,
      status: presence.status,
      lastSeen: presence.lastSeen,
      email: presence.email,
    }));

  // Convert offline users to sidebar items
  const offlineUserItems: BaseSidebarItem[] = Object.values(userPresence)
    .filter((presence) => !onlineUsers.includes(presence.userId))
    .slice(0, 5) // Show only first 5 offline users
    .map((presence) => ({
      id: presence.userId,
      name: getDisplayName(presence),
      type: "direct" as const,
      status: presence.status,
      lastSeen: presence.lastSeen,
      email: presence.email,
    }));

  const allItems = [...channelItems, ...directChannelItems, ...onlineUserItems, ...offlineUserItems];

  const handleItemSelect = (item: BaseSidebarItem) => {
    if (item.type === "channel" || item.type === "direct") {
      onChannelSelect(item.id);
    } else if (item.type === "direct" && onStartDirectMessage) {
      onStartDirectMessage(item.id);
    }
  };

  return (
    <BaseProviderSidebar
      title="Internal Messaging"
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
