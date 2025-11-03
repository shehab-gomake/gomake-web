import React, { useState } from "react";
import { NavigationSidebar } from "@/widgets/frontdesk-v2/navigation/navigation-sidebar";
import type { Channel, Section, TicketView } from "@/widgets/frontdesk-v2/navigation/navigation-sidebar";

export const LeftSidebar = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("email");
  const [selectedSection, setSelectedSection] = useState<Section>("inbox");
  const [selectedTicketView, setSelectedTicketView] = useState<TicketView | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <NavigationSidebar
      selectedChannel={selectedChannel}
      selectedSection={selectedSection}
      selectedTicketView={selectedTicketView}
      channelBadges={{
        email: 5,
        whatsapp: 2,
        internal: 3,
      }}
      ticketCounts={{
        "my-tickets": 8,
        unassigned: 4,
        "all-tickets": 24,
      }}
      isCollapsed={isCollapsed}
      onChannelSelect={setSelectedChannel}
      onSectionSelect={setSelectedSection}
      onTicketViewSelect={setSelectedTicketView}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    />
  );
};
