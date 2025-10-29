import React, { useState } from "react";
import { frontdeskV2Theme } from "../styles/theme";
import { NavTree } from "./nav-tree/nav-tree";
import { NavItem } from "./nav-tree/nav-item";
import { IconButton } from "../components/ui/icon-button";
import { Tooltip } from "../components/ui/tooltip";
import { NavSectionConfig } from "./nav-tree/types";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import InboxIcon from "@mui/icons-material/Inbox";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArchiveIcon from "@mui/icons-material/Archive";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type Channel = "all" | "email" | "whatsapp" | "internal";
export type Section = "inbox" | "assigned" | "admin" | "settings";
export type TicketView = "my-tickets" | "unassigned" | "all-tickets" | "done" | "archived";

export interface NavigationSidebarProps {
  selectedChannel?: Channel;
  selectedSection?: Section;
  selectedTicketView?: TicketView;
  onChannelSelect?: (channel: Channel) => void;
  onSectionSelect?: (section: Section) => void;
  onTicketViewSelect?: (view: TicketView) => void;
  channelBadges?: {
    all?: number;
    email?: number;
    whatsapp?: number;
    internal?: number;
  };
  ticketCounts?: {
    "my-tickets"?: number;
    unassigned?: number;
    "all-tickets"?: number;
    done?: number;
    archived?: number;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  selectedChannel = "all",
  selectedSection = "inbox",
  selectedTicketView,
  onChannelSelect,
  onSectionSelect,
  onTicketViewSelect,
  channelBadges = {},
  ticketCounts = {},
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Determine which item is selected
  const getSelectedId = () => {
    if (selectedTicketView) return selectedTicketView;
    if (selectedChannel === "all" && selectedSection === "inbox") return "dashboard";
    if (selectedSection === "settings") return "settings";
    return selectedChannel;
  };

  // Build navigation sections
  const ticketViewsSection: NavSectionConfig = {
    id: "ticket-views",
    label: "Ticket Views",
    defaultExpanded: true,
    items: [
      {
        id: "my-tickets",
        label: "My Tickets",
        icon: <InboxIcon fontSize="small" />,
        badge: ticketCounts["my-tickets"],
        badgeVariant: "default",
        onClick: () => onTicketViewSelect?.("my-tickets"),
      },
      {
        id: "unassigned",
        label: "Unassigned",
        icon: <PersonOutlineIcon fontSize="small" />,
        badge: ticketCounts.unassigned,
        badgeVariant: "default",
        onClick: () => onTicketViewSelect?.("unassigned"),
      },
      {
        id: "all-tickets",
        label: "All Tickets",
        icon: <ViewListIcon fontSize="small" />,
        badge: ticketCounts["all-tickets"],
        badgeVariant: "default",
        onClick: () => onTicketViewSelect?.("all-tickets"),
      },
      {
        id: "done",
        label: "Done",
        icon: <AssignmentIcon fontSize="small" />,
        badge: ticketCounts.done,
        badgeVariant: "default",
        onClick: () => onTicketViewSelect?.("done"),
      },
      {
        id: "archived",
        label: "Archived",
        icon: <ArchiveIcon fontSize="small" />,
        badge: ticketCounts.archived,
        badgeVariant: "default",
        onClick: () => onTicketViewSelect?.("archived"),
      },
    ],
  };

  const liveChatsSection: NavSectionConfig = {
    id: "live-chats",
    label: "Live Chats",
    defaultExpanded: true,
    items: [
      {
        id: "email",
        label: "Email",
        icon: <EmailIcon />,
        badge: channelBadges.email,
        badgeVariant: "error",
        onClick: () => {
          onSectionSelect?.("inbox");
          onChannelSelect?.("email");
        },
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: <WhatsAppIcon />,
        badge: channelBadges.whatsapp,
        badgeVariant: "error",
        onClick: () => {
          onSectionSelect?.("inbox");
          onChannelSelect?.("whatsapp");
        },
      },
      {
        id: "internal",
        label: "Direct Messages",
        icon: <ChatIcon />,
        badge: channelBadges.internal,
        badgeVariant: "error",
        onClick: () => {
          onSectionSelect?.("inbox");
          onChannelSelect?.("internal");
        },
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: frontdeskV2Theme.colors.background.tertiary,
        width: isCollapsed ? 64 : 240,
        minWidth: isCollapsed ? 64 : 240,
        transition: frontdeskV2Theme.transitions.default,
        borderRight: `1px solid ${frontdeskV2Theme.colors.border.default}`,
      }}
    >
      {/* Toggle Collapse Button */}
      {onToggleCollapse && (
        <div
          style={{
            padding: frontdeskV2Theme.spacing[2],
            borderBottom: `1px solid ${frontdeskV2Theme.colors.border.default}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton onClick={onToggleCollapse} size="small" ariaLabel="Toggle sidebar">
              {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </div>
      )}

      {/* Dashboard Item */}
      <div style={{ padding: `${frontdeskV2Theme.spacing[2]} 0` }}>
        <NavItem
          id="dashboard"
          label="Dashboard"
          icon={<DashboardIcon />}
          isSelected={selectedChannel === "all" && selectedSection === "inbox" && !selectedTicketView}
          isCollapsed={isCollapsed}
          onClick={() => {
            onSectionSelect?.("inbox");
            onChannelSelect?.("all");
          }}
        />
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: frontdeskV2Theme.colors.border.default,
          margin: `${frontdeskV2Theme.spacing[2]} 0`,
        }}
      />

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <NavTree sections={[ticketViewsSection, liveChatsSection]} selectedItemId={getSelectedId()} isCollapsed={isCollapsed} />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Settings Footer */}
      <div
        style={{
          padding: `${frontdeskV2Theme.spacing[2]} 0`,
          borderTop: `1px solid ${frontdeskV2Theme.colors.border.default}`,
        }}
      >
        <NavItem
          id="settings"
          label="Settings"
          icon={<SettingsIcon />}
          isSelected={selectedSection === "settings"}
          isCollapsed={isCollapsed}
          onClick={() => onSectionSelect?.("settings")}
        />
      </div>
    </div>
  );
};
