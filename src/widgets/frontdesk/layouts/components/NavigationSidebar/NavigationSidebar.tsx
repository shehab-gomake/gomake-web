import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import InboxIcon from "@mui/icons-material/Inbox";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ViewListIcon from "@mui/icons-material/ViewList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArchiveIcon from "@mui/icons-material/Archive";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CommentIcon from "@mui/icons-material/Comment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { useChatwootRouter } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-router";
import { useChatwootPermissions } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-permissions";
import { VIEW_PERMISSIONS, ACTION_PERMISSIONS } from "@/widgets/frontdesk/providers/chatwoot/constants/permissions.constants";
import { AddChannelModal } from "@/widgets/frontdesk/providers/chatwoot/components/add-channel-modal";
import { ComposeConversationModal } from "@/widgets/frontdesk/providers/chatwoot/components/compose/ComposeConversationModal";
import { InboxIcon as ChatwootInboxIcon } from "@/widgets/frontdesk/providers/chatwoot/utils/inbox-icons";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useRecoilValue } from "recoil";
import { RouteBuilder, buildRoute } from "@/widgets/frontdesk/routing/route-builder";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

/**
 * Legacy type exports for backward compatibility
 * These are kept for components that haven't migrated to the centralized routing system yet.
 *
 * For new code, use the types from @/widgets/frontdesk/routing instead.
 */
export type Channel = "all" | "email" | "whatsapp" | "internal" | "chatwoot";
export type Section = "inbox" | "assigned" | "admin" | "settings";
export type TicketView = "my-tickets" | "unassigned" | "all-tickets" | "done" | "archived";

interface NavigationSidebarProps {
  selectedChannel: Channel;
  selectedSection: Section;
  selectedTicketView?: TicketView;
  onChannelSelect: (channel: Channel) => void;
  onSectionSelect: (section: Section) => void;
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
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  badge?: number;
  color?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isSelected, onClick, badge = 0, color }) => {
  const theme = useTheme();

  return (
    <Tooltip title={label} placement="right">
      <IconButton
        onClick={onClick}
        sx={{
          width: "100%",
          height: 56,
          borderRadius: 0,
          position: "relative",
          color: isSelected ? color || theme.palette.primary.main : theme.palette.text.secondary,
          backgroundColor: isSelected ? `${theme.palette.primary.main}10` : "transparent",
          "&:hover": {
            backgroundColor: isSelected ? `${theme.palette.primary.main}20` : theme.palette.action.hover,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 24,
            backgroundColor: theme.palette.primary.main,
            opacity: isSelected ? 1 : 0,
            transition: "opacity 0.2s ease",
          },
        }}
      >
        <Badge
          badgeContent={badge}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              right: -3,
              top: 3,
              fontSize: "0.625rem",
              height: 16,
              minWidth: 16,
              padding: "0 4px",
            },
          }}
        >
          {icon}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  selectedChannel,
  selectedSection,
  selectedTicketView,
  onChannelSelect,
  onSectionSelect,
  onTicketViewSelect,
  channelBadges = {},
  ticketCounts = {},
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [ticketViewsExpanded, setTicketViewsExpanded] = useState(true);
  const [chatsExpanded, setChatsExpanded] = useState(true);
  const [chatwootConversationsExpanded, setChatwootConversationsExpanded] = useState(true);
  const [chatwootChannelsExpanded, setChatwootChannelsExpanded] = useState(true);
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Get selected Chatwoot account
  const selectedAccount = useRecoilValue(chatwootSelectedAccountAtom);

  // Fetch Chatwoot inboxes (channels)
  const { inboxes, loading: inboxesLoading, selectedInboxId, selectInbox } = useChatwootInboxes();

  // Get current Chatwoot view for accurate selection state
  const {
    isDashboardView,
    isMyInboxView,
    isAllConversationsView,
    isMentionsView,
    isUnattendedView,
    isChannelsView,
    isSettingsView,
  } = useChatwootRouter();

  // Check permissions for channel creation (RBAC)
  const { canPerformAction } = useChatwootPermissions();
  const canCreateInbox = canPerformAction(ACTION_PERMISSIONS.createInbox);

  const channelItems = [
    { id: "email" as Channel, icon: <EmailIcon />, label: "Email" },
    { id: "whatsapp" as Channel, icon: <WhatsAppIcon />, label: "WhatsApp" },
    { id: "internal" as Channel, icon: <ChatIcon />, label: "Direct Messages" },
  ];

  const ticketViewItems = [
    { id: "my-tickets" as TicketView, icon: <InboxIcon fontSize="small" />, label: "My Tickets" },
    { id: "unassigned" as TicketView, icon: <PersonOutlineIcon fontSize="small" />, label: "Unassigned" },
    { id: "all-tickets" as TicketView, icon: <ViewListIcon fontSize="small" />, label: "All Tickets" },
    { id: "done" as TicketView, icon: <AssignmentIcon fontSize="small" />, label: "Done" },
    { id: "archived" as TicketView, icon: <ArchiveIcon fontSize="small" />, label: "Archived" },
  ];

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        width: isCollapsed ? 64 : 220,
        minWidth: isCollapsed ? 64 : 220,
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Toggle Collapse Button - Top */}
      {onToggleCollapse && (
        <Box
          sx={{
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Chatwoot Section */}
      <Box sx={{ py: 0.5 }}>
        <List disablePadding sx={{ pointerEvents: "auto" }}>
            {/* New Conversation Button */}
            {!isCollapsed ? (
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CreateIcon sx={{ fontSize: "1.125rem" }} />}
                  onClick={() => setShowComposeModal(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    backgroundColor: primaryColor(600),
                    color: "white",
                    py: 1.25,
                    px: 2,
                    borderRadius: "10px",
                    boxShadow: `0 2px 8px ${alpha(primaryColor(600), 0.3)}, 0 1px 3px ${alpha(primaryColor(600), 0.2)}`,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& .MuiButton-startIcon": {
                      marginRight: 1,
                      marginLeft: 0,
                    },
                    "&:hover": {
                      backgroundColor: primaryColor(700),
                      boxShadow: `0 4px 12px ${alpha(primaryColor(600), 0.4)}, 0 2px 6px ${alpha(primaryColor(600), 0.3)}`,
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                      boxShadow: `0 2px 6px ${alpha(primaryColor(600), 0.3)}, 0 1px 3px ${alpha(primaryColor(600), 0.2)}`,
                    },
                  }}
                >
                  New Ticket
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="New Ticket" placement="right">
                  <IconButton
                    onClick={() => setShowComposeModal(true)}
                    sx={{
                      color: "white",
                      backgroundColor: primaryColor(600),
                      boxShadow: `0 2px 6px ${alpha(primaryColor(600), 0.3)}`,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      width: 40,
                      height: 40,
                      "&:hover": {
                        backgroundColor: primaryColor(700),
                        boxShadow: `0 4px 10px ${alpha(primaryColor(600), 0.4)}`,
                        transform: "translateY(-1px)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <CreateIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {/* Dashboard */}
            <Tooltip title="Dashboard" placement="right" disableHoverListener={!isCollapsed}>
              <ListItemButton
                selected={isDashboardView}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  // Use RouteBuilder for type-safe navigation
                  const route = RouteBuilder.chatwootDashboard();
                  const { path, options } = buildRoute(route, { replace: true });

                  // Navigate to Chatwoot channel first if not already there
                  if (selectedChannel !== "chatwoot") {
                    onSectionSelect("inbox");
                    onChannelSelect("chatwoot" as Channel);
                  }

                  // Then navigate to the dashboard view
                  router.replace(path, undefined, { shallow: options.scroll === false });
                }}
                sx={{
                  py: 0.5,
                  px: isCollapsed ? 1.5 : 2,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  pointerEvents: "auto",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main + "10",
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main + "20",
                    },
                  },
                }}
              >
                {isCollapsed ? (
                  <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                    <DashboardIcon fontSize="small" />
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <Box sx={{ color: theme.palette.text.secondary }}>
                      <DashboardIcon fontSize="small" />
                    </Box>
                    <ListItemText
                      primary="Dashboard"
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: 400,
                        },
                      }}
                    />
                  </Box>
                )}
              </ListItemButton>
            </Tooltip>

            {/* My Inbox */}
            <Tooltip title="My Inbox" placement="right" disableHoverListener={!isCollapsed}>
              <ListItemButton
                selected={isMyInboxView}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  // Use RouteBuilder for type-safe navigation
                  const route = RouteBuilder.chatwootMyInbox();
                  const { path, options } = buildRoute(route, { replace: true });

                  // Navigate to Chatwoot channel first if not already there
                  if (selectedChannel !== "chatwoot") {
                    onSectionSelect("inbox");
                    onChannelSelect("chatwoot" as Channel);
                  }

                  // Then navigate to My Inbox
                  router.replace(path, undefined, { shallow: options.scroll === false });
                }}
                sx={{
                  py: 0.5,
                  px: isCollapsed ? 1.5 : 2,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  pointerEvents: "auto",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main + "10",
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main + "20",
                    },
                  },
                }}
              >
                {isCollapsed ? (
                  <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                    <InboxIcon />
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <Box sx={{ color: theme.palette.text.secondary }}>
                      <InboxIcon fontSize="small" />
                    </Box>
                    <ListItemText
                      primary="My Inbox"
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: selectedChannel === "chatwoot" && selectedSection === "inbox" ? 600 : 400,
                        },
                      }}
                    />
                  </Box>
                )}
              </ListItemButton>
            </Tooltip>

            {/* Conversations - Expandable */}
            {!isCollapsed && (
              <Box>
                <ListItemButton
                  onClick={() => setChatwootConversationsExpanded(!chatwootConversationsExpanded)}
                  sx={{
                    py: 0.5,
                    px: 2,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <Box sx={{ color: theme.palette.text.secondary }}>
                      <CommentIcon fontSize="small" />
                    </Box>
                    <ListItemText
                      primary="Tickets"
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { fontSize: "0.875rem" },
                      }}
                    />
                    {chatwootConversationsExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </Box>
                </ListItemButton>
                <Collapse in={chatwootConversationsExpanded}>
                  <List disablePadding sx={{ pointerEvents: "auto" }}>
                    {/* All Tickets */}
                    <Tooltip title="All Tickets" placement="right">
                      <ListItemButton
                        selected={isAllConversationsView}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          // Clear selected inbox to show ALL conversations
                          selectInbox(null);

                          // Use RouteBuilder for type-safe navigation
                          const route = RouteBuilder.chatwootAllConversations();
                          const { path, options } = buildRoute(route, { replace: true });

                          // Navigate to Chatwoot channel first if not already there
                          if (selectedChannel !== "chatwoot") {
                            onSectionSelect("inbox");
                            onChannelSelect("chatwoot" as Channel);
                          }

                          // Then navigate to the specific view
                          router.replace(path, undefined, { shallow: options.scroll === false });
                        }}
                        sx={{
                          py: 0.5,
                          pl: isCollapsed ? 1.5 : 5,
                          pr: isCollapsed ? 1.5 : 2,
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {isCollapsed ? (
                          <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                            <CommentIcon fontSize="small" />
                          </Box>
                        ) : (
                          <ListItemText
                            primary="All tickets"
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { fontSize: "0.813rem", color: theme.palette.text.secondary },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>

                    {/* Mentions */}
                    <Tooltip title="Mentions" placement="right">
                      <ListItemButton
                        selected={isMentionsView}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          // Use RouteBuilder for type-safe navigation
                          const route = RouteBuilder.chatwootMentions();
                          const { path, options } = buildRoute(route, { replace: true });

                          // Navigate to Chatwoot channel first if not already there
                          if (selectedChannel !== "chatwoot") {
                            onSectionSelect("inbox");
                            onChannelSelect("chatwoot" as Channel);
                          }

                          // Then navigate to the mentions view
                          router.replace(path, undefined, { shallow: options.scroll === false });
                        }}
                        sx={{
                          py: 0.5,
                          pl: isCollapsed ? 1.5 : 5,
                          pr: isCollapsed ? 1.5 : 2,
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {isCollapsed ? (
                          <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                            <AlternateEmailIcon fontSize="small" />
                          </Box>
                        ) : (
                          <ListItemText
                            primary="Mentions"
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { fontSize: "0.813rem", color: theme.palette.text.secondary },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>

                    {/* Unattended */}
                    <Tooltip title="Unattended" placement="right">
                      <ListItemButton
                        selected={isUnattendedView}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          // Use RouteBuilder for type-safe navigation
                          const route = RouteBuilder.chatwootUnattended();
                          const { path, options } = buildRoute(route, { replace: true });

                          // Navigate to Chatwoot channel first if not already there
                          if (selectedChannel !== "chatwoot") {
                            onSectionSelect("inbox");
                            onChannelSelect("chatwoot" as Channel);
                          }

                          // Then navigate to the unattended view
                          router.replace(path, undefined, { shallow: options.scroll === false });
                        }}
                        sx={{
                          py: 0.5,
                          pl: isCollapsed ? 1.5 : 5,
                          pr: isCollapsed ? 1.5 : 2,
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          pointerEvents: "auto",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {isCollapsed ? (
                          <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                            <NotInterestedIcon fontSize="small" />
                          </Box>
                        ) : (
                          <ListItemText
                            primary="Unattended"
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { fontSize: "0.813rem", color: theme.palette.text.secondary },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </List>
                </Collapse>
              </Box>
            )}

            {/* Channels (Inboxes) - Expandable */}
            {!isCollapsed && (
              <Box>
                <ListItemButton
                  onClick={() => setChatwootChannelsExpanded(!chatwootChannelsExpanded)}
                  sx={{
                    py: 0.5,
                    px: 2,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <Box sx={{ color: theme.palette.text.secondary }}>
                      <ForumIcon fontSize="small" />
                    </Box>
                    <ListItemText
                      primary="Channels"
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { fontSize: "0.875rem" },
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
                      {/* Only administrators can add new channels */}
                      {canCreateInbox && (
                        <Tooltip title="Add New Channel" placement="right">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddChannelModal(true);
                            }}
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                              width: 24,
                              height: 24,
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {inboxesLoading ? (
                        <CircularProgress size={16} sx={{ color: theme.palette.text.secondary }} />
                      ) : chatwootChannelsExpanded ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </Box>
                  </Box>
                </ListItemButton>
                <Collapse in={chatwootChannelsExpanded}>
                  <List disablePadding sx={{ pointerEvents: "auto" }}>
                    {inboxesLoading ? (
                      <ListItemButton
                        sx={{
                          py: 0.5,
                          pl: 5,
                          pr: 2,
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress size={16} />
                      </ListItemButton>
                    ) : inboxes.length === 0 ? (
                      <ListItemButton
                        sx={{
                          py: 0.5,
                          pl: 5,
                          pr: 2,
                        }}
                      >
                        <ListItemText
                          primary="No channels available"
                          primaryTypographyProps={{
                            variant: "body2",
                            sx: { fontSize: "0.813rem", color: theme.palette.text.secondary, fontStyle: "italic" },
                          }}
                        />
                      </ListItemButton>
                    ) : (
                      inboxes.map((inbox: any) => (
                        <Tooltip key={inbox.id} title={inbox.name} placement="right">
                          <ListItemButton
                            selected={isChannelsView && selectedInboxId === inbox.id}
                            onClick={(e) => {
                              e.stopPropagation();

                              // Use RouteBuilder for type-safe navigation
                              const route = RouteBuilder.chatwoot(ChatwootView.CHANNELS, undefined, inbox.id.toString());
                              const { path, options } = buildRoute(route, { replace: true });

                              // Navigate to Chatwoot channel first if not already there
                              if (selectedChannel !== "chatwoot") {
                                onSectionSelect("inbox");
                                onChannelSelect("chatwoot" as Channel);
                              } else if (selectedSection !== "inbox") {
                                onSectionSelect("inbox");
                              }

                              // Navigate to the specific channel view
                              // The router will sync the state from URL → Recoil automatically
                              // This prevents race conditions between state and URL updates
                              router.replace(path, undefined, { shallow: options.scroll === false });
                            }}
                            sx={{
                              py: 0.5,
                              pl: 5,
                              pr: 2,
                              pointerEvents: "auto",
                              "&.Mui-selected": {
                                backgroundColor: theme.palette.primary.main + "10",
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main + "20",
                                },
                              },
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                width: "100%",
                              }}
                            >
                              {/* Inbox Icon */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: selectedInboxId === inbox.id 
                                    ? theme.palette.primary.main 
                                    : theme.palette.text.secondary,
                                  flexShrink: 0,
                                }}
                              >
                                <ChatwootInboxIcon
                                  channelType={inbox.channel_type}
                                  medium={inbox.medium}
                                  size={16}
                                />
                              </Box>
                              {/* Inbox Name and Type */}
                              <ListItemText
                                primary={inbox.name}
                                secondary={inbox.channel_type?.replace("Channel::", "") || inbox.provider}
                                primaryTypographyProps={{
                                  variant: "body2",
                                  sx: {
                                    fontSize: "0.813rem",
                                    fontWeight: selectedInboxId === inbox.id ? 600 : 400,
                                    color: theme.palette.text.primary,
                                  },
                                }}
                                secondaryTypographyProps={{
                                  variant: "caption",
                                  sx: {
                                    fontSize: "0.688rem",
                                    color: theme.palette.text.secondary,
                                  },
                                }}
                              />
                            </Box>
                          </ListItemButton>
                        </Tooltip>
                      ))
                    )}
                  </List>
                </Collapse>
              </Box>
            )}

            {/* Channels - Collapsed view */}
            {isCollapsed && (
              <Tooltip title="Channels" placement="right">
                <ListItemButton
                  selected={selectedChannel === "chatwoot" && selectedInboxId !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionSelect("inbox");
                    onChannelSelect("chatwoot" as Channel);
                  }}
                  sx={{
                    py: 1,
                    px: 1.5,
                    justifyContent: "center",
                    pointerEvents: "auto",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main + "10",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main + "20",
                      },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ color: theme.palette.text.secondary, display: "flex", position: "relative" }}>
                    <ForumIcon />
                    {inboxesLoading && (
                      <CircularProgress
                        size={12}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: theme.palette.text.secondary,
                        }}
                      />
                    )}
                  </Box>
                </ListItemButton>
              </Tooltip>
            )}
          </List>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Footer/System Items - Settings */}
      <Box
        sx={{
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <List disablePadding>
          <Tooltip title="Settings" placement="right" disableHoverListener={!isCollapsed}>
            <ListItemButton
              selected={isSettingsView}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                // Use RouteBuilder for type-safe navigation
                const route = RouteBuilder.chatwoot(ChatwootView.SETTINGS);
                const { path, options } = buildRoute(route, { replace: true });

                // Navigate to Chatwoot channel first if not already there
                if (selectedChannel !== "chatwoot") {
                  onSectionSelect("inbox");
                  onChannelSelect("chatwoot" as Channel);
                }

                // Then navigate to Settings
                router.replace(path, undefined, { shallow: options.scroll === false });
              }}
              sx={{
                py: 1,
                px: isCollapsed ? 1.5 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main + "10",
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main + "20",
                  },
                },
              }}
            >
              {isCollapsed ? (
                <Box sx={{ color: theme.palette.text.secondary, display: "flex" }}>
                  <SettingsIcon />
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                  <Box sx={{ color: theme.palette.text.secondary }}>
                    <SettingsIcon />
                  </Box>
                  <ListItemText
                    primary="Settings"
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontSize: "0.875rem", fontWeight: isSettingsView ? 600 : 400 },
                    }}
                  />
                </Box>
              )}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>

      {/* Add Channel Modal */}
      <AddChannelModal open={showAddChannelModal} onClose={() => setShowAddChannelModal(false)} />

      {/* Compose Conversation Modal */}
      <ComposeConversationModal
        accountId={selectedAccount || 0}
        open={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSuccess={(conversationId) => {
          console.log("[NavigationSidebar] Conversation created:", conversationId);
          setShowComposeModal(false);

          // Navigate to the newly created conversation
          const route = RouteBuilder.chatwoot(ChatwootView.MY_INBOX, conversationId.toString());
          const { path, options } = buildRoute(route, { replace: true });

          // Ensure we're on the chatwoot channel
          if (selectedChannel !== "chatwoot") {
            onSectionSelect("inbox");
            onChannelSelect("chatwoot" as Channel);
          }

          // Navigate to the conversation
          router.push(path, undefined, { shallow: options.scroll === false });
        }}
      />
    </Box>
  );
};

export default NavigationSidebar;
