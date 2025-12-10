import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Badge,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Icons
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import NotInterestedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import ForumIcon from "@mui/icons-material/ForumOutlined";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/EditOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import ViewKanbanIcon from "@mui/icons-material/ViewKanbanOutlined";
import CircularProgress from "@mui/material/CircularProgress";

// Hooks and services
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { useChatwootRouter } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-router";
import { useChatwootPermissions } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-permissions";
import { ACTION_PERMISSIONS } from "@/widgets/frontdesk/providers/chatwoot/constants/permissions.constants";
import { AddChannelModal } from "@/widgets/frontdesk/providers/chatwoot/components/add-channel-modal";
import { ComposeConversationModal } from "@/widgets/frontdesk/providers/chatwoot/components/compose/ComposeConversationModal";
import { InboxIcon as ChatwootInboxIcon } from "@/widgets/frontdesk/providers/chatwoot/utils/inbox-icons";
import { useRouter } from "next/router";
import {
  chatwootSelectedAccountAtom,
  chatwootInboxAgentsMapAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useRecoilValue } from "recoil";
import {
  RouteBuilder,
  buildRoute,
} from "@/widgets/frontdesk/routing/route-builder";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

// Design system tokens
import {
  navigationColors,
  navigationSpacing,
  navigationTypography,
  navigationRadius,
  navigationShadows,
  navigationTransitions,
  colorTokens,
} from "@/widgets/frontdesk/design-system/tokens";

/**
 * Legacy type exports for backward compatibility
 */
export type Channel = "all" | "email" | "whatsapp" | "internal" | "chatwoot";
export type Section = "inbox" | "assigned" | "admin" | "settings";
export type TicketView =
  | "my-tickets"
  | "unassigned"
  | "all-tickets"
  | "done"
  | "archived";

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

/**
 * Get the channel source (email, phone number, or website URL) for display
 */
const getChannelSource = (inbox: any): string | null => {
  if (
    inbox.channel_type === "Channel::WhatsApp" ||
    inbox.channel_type === "Channel::Whatsapp" ||
    inbox.provider === "whatsapp"
  ) {
    return inbox.phone_number || null;
  }

  if (inbox.channel_type === "Channel::Email" || inbox.provider === "email") {
    return inbox.email || null;
  }

  if (
    inbox.channel_type === "Channel::Sms" ||
    inbox.channel_type === "Channel::TwilioSms" ||
    inbox.channel_type === "Channel::Voice" ||
    inbox.provider === "sms" ||
    inbox.provider === "twilio"
  ) {
    return inbox.phone_number || null;
  }

  if (
    inbox.channel_type === "Channel::WebWidget" ||
    inbox.provider === "web_widget"
  ) {
    return inbox.website_url || null;
  }

  return null;
};

// ============================================================================
// STYLED COMPONENTS (Using Design System Tokens)
// ============================================================================

const menuItemBaseStyles = {
  height: navigationSpacing.menuItem.height,
  padding: `${navigationSpacing.menuItem.paddingY}px ${navigationSpacing.menuItem.paddingX}px`,
  borderRadius: `${navigationRadius.menuItem}px`,
  display: "flex",
  alignItems: "center",
  gap: `${navigationSpacing.menuItem.iconGap}px`,
  color: navigationColors.menuItem.text,
  backgroundColor: "transparent",
  transition: navigationTransitions.colors,
  cursor: "pointer",
  position: "relative" as const,
  "&:hover": {
    backgroundColor: navigationColors.menuItem.backgroundHover,
  },
};

const menuItemActiveStyles = {
  backgroundColor: navigationColors.menuItem.backgroundActive,
  color: navigationColors.menuItem.textActive,
  fontWeight: navigationTypography.menuItemActive.fontWeight,
  "&::before": {
    content: '""',
    position: "absolute" as const,
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: navigationSpacing.menuItem.accentBarWidth,
    height: navigationSpacing.menuItem.accentBarHeight,
    backgroundColor: navigationColors.menuItem.accentBar,
    borderRadius: "0 2px 2px 0",
  },
  "&:hover": {
    backgroundColor: navigationColors.menuItem.backgroundActive,
  },
};

const sectionHeaderStyles = {
  padding: `${navigationSpacing.sectionHeader.paddingY}px ${navigationSpacing.sectionHeader.paddingX}px`,
  marginTop: `${navigationSpacing.sectionHeader.marginTop}px`,
  marginBottom: `${navigationSpacing.sectionHeader.marginBottom}px`,
  color: navigationColors.sectionHeader.text,
  fontSize: `${navigationTypography.sectionHeader.fontSize}px`,
  fontWeight: navigationTypography.sectionHeader.fontWeight,
  lineHeight: navigationTypography.sectionHeader.lineHeight,
  letterSpacing: navigationTypography.sectionHeader.letterSpacing,
  textTransform: navigationTypography.sectionHeader.textTransform,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  selectedChannel,
  selectedSection,
  onChannelSelect,
  onSectionSelect,
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [chatwootConversationsExpanded, setChatwootConversationsExpanded] =
    useState(true);
  const [chatwootChannelsExpanded, setChatwootChannelsExpanded] =
    useState(true);
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [preloadedInboxForModal, setPreloadedInboxForModal] = useState<{
    accountId: number;
    inboxId: number;
  } | null>(null);

  // Get selected Chatwoot account
  const selectedAccount = useRecoilValue(chatwootSelectedAccountAtom);

  // Fetch Chatwoot inboxes (channels)
  const {
    inboxes,
    loading: inboxesLoading,
    selectedInboxId,
    selectInbox,
  } = useChatwootInboxes();

  // Get inbox agents map to check which inboxes have agents
  const inboxAgentsMap = useRecoilValue(chatwootInboxAgentsMapAtom);

  // Get current Chatwoot view for accurate selection state
  const {
    isDashboardView,
    isMyInboxView,
    isAllConversationsView,
    isMentionsView,
    isUnattendedView,
    isChannelsView,
    isWorkboardView,
    isSettingsView,
  } = useChatwootRouter();

  // Check permissions for channel creation (RBAC)
  const { canPerformAction } = useChatwootPermissions();
  const canCreateInbox = canPerformAction(ACTION_PERMISSIONS.createInbox);

  // Navigation handlers
  const handleNavigate = useCallback(
    (route: ReturnType<typeof RouteBuilder.chatwoot>, clearInbox = false) => {
      if (clearInbox) {
        selectInbox(null);
      }

      const { path, options } = buildRoute(route, { replace: true });

      if (selectedChannel !== "chatwoot") {
        onSectionSelect("inbox");
        onChannelSelect("chatwoot" as Channel);
      }

      router.replace(path, undefined, { shallow: options.scroll === false });
    },
    [selectedChannel, onSectionSelect, onChannelSelect, router, selectInbox]
  );

  const handleDashboardClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootDashboard());
    },
    [handleNavigate]
  );

  const handleMyTicketsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootMyInbox());
    },
    [handleNavigate]
  );

  const handleAllTicketsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootAllConversations(), true);
    },
    [handleNavigate]
  );

  const handleMentionsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootMentions());
    },
    [handleNavigate]
  );

  const handleUnattendedClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootUnattended());
    },
    [handleNavigate]
  );

  const handleWorkboardClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwootWorkboard());
    },
    [handleNavigate]
  );

  const handleSettingsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleNavigate(RouteBuilder.chatwoot(ChatwootView.SETTINGS));
    },
    [handleNavigate]
  );

  const handleChannelClick = useCallback(
    (inbox: any) => (e: React.MouseEvent) => {
      e.stopPropagation();

      const route = RouteBuilder.chatwoot(
        ChatwootView.CHANNELS,
        undefined,
        inbox.id.toString()
      );
      const { path, options } = buildRoute(route, { replace: true });

      if (selectedChannel !== "chatwoot") {
        onSectionSelect("inbox");
        onChannelSelect("chatwoot" as Channel);
      } else if (selectedSection !== "inbox") {
        onSectionSelect("inbox");
      }

      router.replace(path, undefined, { shallow: options.scroll === false });
    },
    [selectedChannel, selectedSection, onSectionSelect, onChannelSelect, router]
  );

  const handleComposeSuccess = useCallback(
    (conversationId: number) => {
      console.log("[NavigationSidebar] Conversation created:", conversationId);
      setShowComposeModal(false);

      const route = RouteBuilder.chatwoot(
        ChatwootView.MY_INBOX,
        conversationId.toString()
      );
      const { path, options } = buildRoute(route, { replace: true });

      if (selectedChannel !== "chatwoot") {
        onSectionSelect("inbox");
        onChannelSelect("chatwoot" as Channel);
      }

      router.push(path, undefined, { shallow: options.scroll === false });
    },
    [selectedChannel, onSectionSelect, onChannelSelect, router]
  );

  // Memoized channel list
  const channelList = useMemo(() => {
    if (inboxesLoading) {
      return (
        <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
          <CircularProgress
            size={16}
            sx={{ color: colorTokens.neutral[400] }}
          />
        </Box>
      );
    }

    if (inboxes.length === 0) {
      return (
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            sx={{
              fontSize: `${navigationTypography.channelMeta.fontSize}px`,
              color: colorTokens.neutral[400],
              fontStyle: "italic",
            }}
          >
            {t("frontdesk.navigation.noChannelsAvailable")}
          </Typography>
        </Box>
      );
    }

    return inboxes.map((inbox: any) => {
      const inboxAgents: Agent[] = inboxAgentsMap[inbox.id] || [];
      const hasAgents = inboxAgents.length > 0;
      const isSelected = isChannelsView && selectedInboxId === inbox.id;
      const channelSource = getChannelSource(inbox);

      return (
        <Tooltip
          key={inbox.id}
          title={
            hasAgents
              ? inbox.name
              : t("frontdesk.navigation.inboxNoAgents", { name: inbox.name })
          }
          placement="right"
        >
          <ListItemButton
            selected={isSelected}
            onClick={handleChannelClick(inbox)}
            sx={{
              py: `${navigationSpacing.channel.paddingY}px`,
              px: `${navigationSpacing.channel.paddingX}px`,
              mx: 1,
              borderRadius: `${navigationRadius.channel}px`,
              transition: navigationTransitions.colors,
              "&.Mui-selected": {
                backgroundColor: navigationColors.channel.backgroundActive,
                "&:hover": {
                  backgroundColor: navigationColors.channel.backgroundActive,
                },
              },
              "&:hover": {
                backgroundColor: navigationColors.channel.backgroundHover,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: `${navigationSpacing.channel.iconGap}px`,
                width: "100%",
              }}
            >
              {/* Inbox Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: isSelected
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[500],
                  flexShrink: 0,
                }}
              >
                <ChatwootInboxIcon
                  channelType={inbox.channel_type}
                  medium={inbox.medium}
                  size={navigationSpacing.channel.iconSize}
                />
              </Box>

              {/* Inbox Name and Source */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    ...navigationTypography.channelName,
                    fontWeight: isSelected ? 600 : 500,
                    color: colorTokens.neutral[800],
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {inbox.name}
                </Typography>
                {channelSource && (
                  <Typography
                    sx={{
                      ...navigationTypography.channelMeta,
                      color: navigationColors.channel.textMuted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {channelSource}
                  </Typography>
                )}
              </Box>

              {/* Warning Badge for inboxes without agents */}
              {!hasAgents && (
                <Tooltip
                  title={t("frontdesk.navigation.noAgentsAssigned")}
                  placement="top"
                >
                  <Box
                    component="span"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedAccount) {
                        setPreloadedInboxForModal({
                          accountId: selectedAccount,
                          inboxId: inbox.id,
                        });
                        setShowAddChannelModal(true);
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <WarningIcon
                      sx={{ fontSize: 16, color: colorTokens.warning[500] }}
                    />
                  </Box>
                </Tooltip>
              )}
            </Box>
          </ListItemButton>
        </Tooltip>
      );
    });
  }, [
    inboxes,
    inboxesLoading,
    inboxAgentsMap,
    isChannelsView,
    selectedInboxId,
    selectedAccount,
    handleChannelClick,
  ]);

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: navigationColors.sidebar.background,
        width: isCollapsed
          ? navigationSpacing.sidebar.widthCollapsed
          : navigationSpacing.sidebar.width,
        minWidth: isCollapsed
          ? navigationSpacing.sidebar.widthCollapsed
          : navigationSpacing.sidebar.width,
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRight: `1px solid ${navigationColors.sidebar.border}`,
        overflow: "hidden",
      }}
    >
      {/* Toggle Collapse Button - Top */}
      {onToggleCollapse && (
        <Box
          sx={{
            p: 1,
            borderBottom: `1px solid ${navigationColors.sidebar.divider}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip
            title={
              isCollapsed
                ? t("frontdesk.navigation.expandSidebar")
                : t("frontdesk.navigation.collapseSidebar")
            }
            placement="right"
          >
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                color: colorTokens.neutral[500],
                width: 28,
                height: 28,
                borderRadius: `${navigationRadius.menuItem}px`,
                transition: navigationTransitions.colors,
                "&:hover": {
                  backgroundColor: navigationColors.menuItem.backgroundHover,
                  color: colorTokens.primary[600],
                },
              }}
            >
              {isCollapsed ? (
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Primary Action - New Ticket Button */}
      <Box
        sx={{
          px: `${navigationSpacing.primaryAction.marginX}px`,
          py: `${navigationSpacing.primaryAction.marginY}px`,
        }}
      >
        {!isCollapsed ? (
          <Button
            fullWidth
            variant="contained"
            startIcon={
              <CreateIcon
                sx={{
                  fontSize: `${navigationSpacing.primaryAction.iconSize}px`,
                }}
              />
            }
            onClick={() => setShowComposeModal(true)}
            sx={{
              textTransform: "none",
              ...navigationTypography.primaryAction,
              backgroundColor: navigationColors.primaryAction.background,
              color: navigationColors.primaryAction.text,
              height: navigationSpacing.primaryAction.height,
              borderRadius: `${navigationRadius.primaryAction}px`,
              boxShadow: navigationShadows.primaryAction,
              transition: navigationTransitions.all,
              "& .MuiButton-startIcon": {
                marginRight: `${navigationSpacing.primaryAction.iconGap}px`,
                marginLeft: 0,
              },
              "&:hover": {
                backgroundColor: navigationColors.primaryAction.backgroundHover,
                boxShadow: navigationShadows.primaryActionHover,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {t("frontdesk.navigation.newTicket")}
          </Button>
        ) : (
          <Tooltip
            title={t("frontdesk.navigation.newTicket")}
            placement="right"
          >
            <IconButton
              onClick={() => setShowComposeModal(true)}
              sx={{
                color: navigationColors.primaryAction.text,
                backgroundColor: navigationColors.primaryAction.background,
                boxShadow: navigationShadows.primaryAction,
                transition: navigationTransitions.all,
                width: 40,
                height: 40,
                borderRadius: `${navigationRadius.primaryAction}px`,
                "&:hover": {
                  backgroundColor:
                    navigationColors.primaryAction.backgroundHover,
                  boxShadow: navigationShadows.primaryActionHover,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              <CreateIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Scrollable Navigation Area */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
        <List disablePadding>
          {/* ============================================ */}
          {/* NAVIGATION SECTION */}
          {/* ============================================ */}
          {!isCollapsed && (
            <Typography sx={sectionHeaderStyles}>
              {t("frontdesk.navigation.title")}
            </Typography>
          )}

          {/* Dashboard */}
          <Tooltip
            title={t("frontdesk.views.dashboard")}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={isDashboardView}
              onClick={handleDashboardClick}
              sx={{
                ...menuItemBaseStyles,
                mx: 1,
                px: isCollapsed ? 1.5 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                ...(isDashboardView && menuItemActiveStyles),
              }}
            >
              <DashboardIcon
                sx={{
                  fontSize: navigationSpacing.menuItem.iconSize,
                  color: isDashboardView
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[500],
                }}
              />
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: `${navigationTypography.menuItem.fontSize}px`,
                    fontWeight: isDashboardView ? 600 : 500,
                  }}
                >
                  {t("frontdesk.views.dashboard")}
                </Typography>
              )}
            </ListItemButton>
          </Tooltip>

          {/* Workboard (Kanban) */}
          <Tooltip
            title={t("frontdesk.views.workboard")}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={isWorkboardView}
              onClick={handleWorkboardClick}
              sx={{
                ...menuItemBaseStyles,
                mx: 1,
                px: isCollapsed ? 1.5 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                ...(isWorkboardView && menuItemActiveStyles),
              }}
            >
              <ViewKanbanIcon
                sx={{
                  fontSize: navigationSpacing.menuItem.iconSize,
                  color: isWorkboardView
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[500],
                }}
              />
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: `${navigationTypography.menuItem.fontSize}px`,
                    fontWeight: isWorkboardView ? 600 : 500,
                  }}
                >
                  {t("frontdesk.views.workboard")}
                </Typography>
              )}
            </ListItemButton>
          </Tooltip>

          {/* My Tickets */}
          <Tooltip
            title={t("frontdesk.tickets.myTickets")}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={isMyInboxView}
              onClick={handleMyTicketsClick}
              sx={{
                ...menuItemBaseStyles,
                mx: 1,
                px: isCollapsed ? 1.5 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                ...(isMyInboxView && menuItemActiveStyles),
              }}
            >
              <InboxIcon
                sx={{
                  fontSize: navigationSpacing.menuItem.iconSize,
                  color: isMyInboxView
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[500],
                }}
              />
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: `${navigationTypography.menuItem.fontSize}px`,
                    fontWeight: isMyInboxView ? 600 : 500,
                  }}
                >
                  {t("frontdesk.tickets.myTickets")}
                </Typography>
              )}
            </ListItemButton>
          </Tooltip>

          {/* ============================================ */}
          {/* TICKETS SECTION (Expandable) */}
          {/* ============================================ */}
          {!isCollapsed && (
            <>
              <Box
                onClick={() =>
                  setChatwootConversationsExpanded(
                    !chatwootConversationsExpanded
                  )
                }
                sx={{
                  ...sectionHeaderStyles,
                  cursor: "pointer",
                  "&:hover": {
                    color: navigationColors.sectionHeader.textHover,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CommentIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <span>{t("frontdesk.tickets.title")}</span>
                </Box>
                {chatwootConversationsExpanded ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </Box>

              <Collapse in={chatwootConversationsExpanded}>
                <List disablePadding sx={{ pl: 1 }}>
                  {/* All Tickets */}
                  <ListItemButton
                    selected={isAllConversationsView}
                    onClick={handleAllTicketsClick}
                    sx={{
                      ...menuItemBaseStyles,
                      mx: 1,
                      pl: `${navigationSpacing.menuItem.indentLevel}px`,
                      ...(isAllConversationsView && menuItemActiveStyles),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: `${
                          navigationTypography.menuItem.fontSize - 1
                        }px`,
                        color: isAllConversationsView
                          ? navigationColors.menuItem.textActive
                          : colorTokens.neutral[600],
                        fontWeight: isAllConversationsView ? 600 : 400,
                      }}
                    >
                      {t("frontdesk.tickets.allTickets")}
                    </Typography>
                  </ListItemButton>

                  {/* Mentions */}
                  <ListItemButton
                    selected={isMentionsView}
                    onClick={handleMentionsClick}
                    sx={{
                      ...menuItemBaseStyles,
                      mx: 1,
                      pl: `${navigationSpacing.menuItem.indentLevel}px`,
                      ...(isMentionsView && menuItemActiveStyles),
                    }}
                  >
                    <AlternateEmailIcon
                      sx={{
                        fontSize: 14,
                        color: isMentionsView
                          ? colorTokens.primary[600]
                          : colorTokens.neutral[500],
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: `${
                          navigationTypography.menuItem.fontSize - 1
                        }px`,
                        color: isMentionsView
                          ? navigationColors.menuItem.textActive
                          : colorTokens.neutral[600],
                        fontWeight: isMentionsView ? 600 : 400,
                      }}
                    >
                      {t("frontdesk.views.mentions")}
                    </Typography>
                  </ListItemButton>

                  {/* Unattended */}
                  <ListItemButton
                    selected={isUnattendedView}
                    onClick={handleUnattendedClick}
                    sx={{
                      ...menuItemBaseStyles,
                      mx: 1,
                      pl: `${navigationSpacing.menuItem.indentLevel}px`,
                      ...(isUnattendedView && menuItemActiveStyles),
                    }}
                  >
                    <NotInterestedIcon
                      sx={{
                        fontSize: 14,
                        color: isUnattendedView
                          ? colorTokens.primary[600]
                          : colorTokens.neutral[500],
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: `${
                          navigationTypography.menuItem.fontSize - 1
                        }px`,
                        color: isUnattendedView
                          ? navigationColors.menuItem.textActive
                          : colorTokens.neutral[600],
                        fontWeight: isUnattendedView ? 600 : 400,
                      }}
                    >
                      {t("frontdesk.views.unattended")}
                    </Typography>
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}

          {/* ============================================ */}
          {/* CHANNELS SECTION */}
          {/* ============================================ */}
          {!isCollapsed && (
            <>
              <Box
                onClick={() =>
                  setChatwootChannelsExpanded(!chatwootChannelsExpanded)
                }
                sx={{
                  ...sectionHeaderStyles,
                  cursor: "pointer",
                  "&:hover": {
                    color: navigationColors.sectionHeader.textHover,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ForumIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                  <span>{t("frontdesk.views.channels")}</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {canCreateInbox && (
                    <Tooltip
                      title={t("frontdesk.navigation.addChannel")}
                      placement="top"
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddChannelModal(true);
                        }}
                        sx={{
                          color: colorTokens.primary[600],
                          width: 22,
                          height: 22,
                          borderRadius: `${navigationRadius.menuItem}px`,
                          transition: navigationTransitions.colors,
                          "&:hover": {
                            backgroundColor: alpha(
                              colorTokens.primary[600],
                              0.1
                            ),
                          },
                        }}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {inboxesLoading ? (
                    <CircularProgress
                      size={14}
                      sx={{ color: colorTokens.neutral[400] }}
                    />
                  ) : chatwootChannelsExpanded ? (
                    <ExpandLessIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  )}
                </Box>
              </Box>

              <Collapse in={chatwootChannelsExpanded}>
                <List disablePadding>{channelList}</List>
              </Collapse>
            </>
          )}

          {/* Collapsed Channels Icon */}
          {isCollapsed && (
            <Tooltip title={t("frontdesk.views.channels")} placement="right">
              <ListItemButton
                selected={
                  selectedChannel === "chatwoot" && selectedInboxId !== null
                }
                onClick={() => {
                  onSectionSelect("inbox");
                  onChannelSelect("chatwoot" as Channel);
                }}
                sx={{
                  ...menuItemBaseStyles,
                  mx: 1,
                  justifyContent: "center",
                  ...(selectedChannel === "chatwoot" &&
                    selectedInboxId !== null &&
                    menuItemActiveStyles),
                }}
              >
                <ForumIcon
                  sx={{
                    fontSize: navigationSpacing.menuItem.iconSize,
                    color: colorTokens.neutral[500],
                  }}
                />
              </ListItemButton>
            </Tooltip>
          )}
        </List>
      </Box>

      {/* Footer - Settings */}
      <Box
        sx={{
          p: 1,
          borderTop: `1px solid ${navigationColors.sidebar.divider}`,
        }}
      >
        <List disablePadding>
          <Tooltip
            title={t("frontdesk.views.settings")}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={isSettingsView}
              onClick={handleSettingsClick}
              sx={{
                ...menuItemBaseStyles,
                mx: 0.5,
                px: isCollapsed ? 1.5 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                ...(isSettingsView && menuItemActiveStyles),
              }}
            >
              <SettingsIcon
                sx={{
                  fontSize: navigationSpacing.menuItem.iconSize,
                  color: isSettingsView
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[500],
                }}
              />
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: `${navigationTypography.menuItem.fontSize}px`,
                    fontWeight: isSettingsView ? 600 : 500,
                  }}
                >
                  {t("frontdesk.views.settings")}
                </Typography>
              )}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>

      {/* Modals */}
      <AddChannelModal
        open={showAddChannelModal}
        onClose={() => {
          setShowAddChannelModal(false);
          setPreloadedInboxForModal(null);
        }}
        preloadedInboxId={preloadedInboxForModal?.inboxId}
        preloadedAccountId={preloadedInboxForModal?.accountId}
      />

      <ComposeConversationModal
        accountId={selectedAccount || 0}
        open={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSuccess={handleComposeSuccess}
      />
    </Box>
  );
};

export default NavigationSidebar;
