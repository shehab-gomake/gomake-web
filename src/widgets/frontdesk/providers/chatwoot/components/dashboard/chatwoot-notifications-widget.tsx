/**
 * Chatwoot Notifications Widget - Modern SaaS Design
 *
 * Compact notifications widget for dashboard display.
 * Redesigned with improved empty state and modern aesthetics.
 */

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as DotIcon,
  Wifi as OnlineIcon,
  WifiOff as OfflineIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  NotificationsNone as NotificationsNoneIcon,
} from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useChatwootNotifications } from "../../hooks/use-chatwoot-notifications";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import type { ChatwootNotification } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { NotificationType } from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { formatTimeAgo } from "../../utils/date-utils";
import {
  getNotificationSender,
  getMessagePreview,
} from "../../utils/notification-formatters";

// Modern design tokens
const WIDGET_TOKENS = {
  colors: {
    background: "#FFFFFF",
    backgroundAlt: "#FAFBFC",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
    primary: "#3B82F6",
    primaryLight: "#EFF6FF",
    primaryDark: "#2563EB",
    success: "#10B981",
    error: "#EF4444",
    errorLight: "#FEE2E2",
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
};

interface ChatwootNotificationsWidgetProps {
  maxItems?: number;
  showHeader?: boolean;
  onViewAll?: () => void;
}

export const ChatwootNotificationsWidget: React.FC<
  ChatwootNotificationsWidgetProps
> = ({ maxItems = 5, showHeader = true, onViewAll }) => {
  const { t } = useTranslation();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    notificationMeta,
    wsConnected,
    filters,
    updateFilters,
    markConversationAsRead,
    markAllAsRead,
    deleteAll,
    deleteAllRead,
    refresh,
  } = useChatwootNotifications();
  const { router: chatwootRouter, selectedAccountId } = useChatwootProvider();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Check if showing all notifications (including read)
  const showingAllNotifications = filters.includes?.includes("read") || false;

  // Get recent notifications based on filter
  const recentNotifications = useMemo(() => {
    if (showingAllNotifications) {
      return notifications.slice(0, maxItems);
    } else {
      const unread = notifications.filter((n) => !n.read_at);
      return unread.slice(0, maxItems);
    }
  }, [notifications, maxItems, showingAllNotifications]);

  // Get notification type info
  const getNotificationTypeInfo = (notificationType: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      [NotificationType.CONVERSATION_MENTION]: {
        color: WIDGET_TOKENS.colors.primary,
        label: t("frontdesk.dashboard.notificationTypes.mention"),
      },
      [NotificationType.CONVERSATION_ASSIGNMENT]: {
        color: "#8B5CF6",
        label: t("frontdesk.dashboard.notificationTypes.assignment"),
      },
      [NotificationType.ASSIGNED_CONVERSATION_NEW_MESSAGE]: {
        color: WIDGET_TOKENS.colors.primary,
        label: t("frontdesk.dashboard.notificationTypes.message"),
      },
      [NotificationType.PARTICIPATING_CONVERSATION_NEW_MESSAGE]: {
        color: WIDGET_TOKENS.colors.primary,
        label: t("frontdesk.dashboard.notificationTypes.message"),
      },
      [NotificationType.CONVERSATION_CREATION]: {
        color: WIDGET_TOKENS.colors.success,
        label: t("frontdesk.dashboard.notificationTypes.new"),
      },
    };

    return (
      typeMap[notificationType] || {
        color: WIDGET_TOKENS.colors.textMuted,
        label: t("frontdesk.dashboard.notificationTypes.notification"),
      }
    );
  };

  // Get sender info using shared formatter
  const getSenderInfo = (notification: ChatwootNotification) => {
    const sender = getNotificationSender(
      notification,
      WIDGET_TOKENS.colors.primary
    );
    const primaryActor = notification.primary_actor as any;
    return {
      name: sender.name,
      initials: sender.initials,
      color: sender.color,
      avatar: sender.thumbnail || primaryActor?.avatar_url || null,
    };
  };

  // Handle notification click
  const handleNotificationClick = async (
    notification: ChatwootNotification
  ) => {
    const primaryActor = notification.primary_actor as any;
    const conversationId = primaryActor?.id;
    const inboxId = primaryActor?.inbox_id;

    if (conversationId) {
      try {
        await markConversationAsRead(conversationId);
      } catch (err) {
        console.error(
          "Failed to mark conversation notifications as read:",
          err
        );
      }

      chatwootRouter.navigateToConversation(
        conversationId.toString(),
        inboxId?.toString()
      );
    }
  };

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      chatwootRouter.navigateToMyInbox();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMarkAllAsRead = async () => {
    handleMenuClose();
    try {
      await markAllAsRead();
      await refresh();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDeleteAll = async () => {
    handleMenuClose();
    try {
      await deleteAll();
      await refresh();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  const handleDeleteAllRead = async () => {
    handleMenuClose();
    try {
      await deleteAllRead();
      await refresh();
    } catch (err) {
      console.error("Failed to delete all read notifications:", err);
    }
  };

  const handleFilterToggle = (
    _event: React.MouseEvent<HTMLElement>,
    value: "unread" | "all" | null
  ) => {
    if (value === null) return;

    if (value === "all") {
      updateFilters({
        includes: ["read"],
        page: 1,
      });
    } else {
      updateFilters({
        includes: undefined,
        page: 1,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${WIDGET_TOKENS.colors.border}`,
            backgroundColor: WIDGET_TOKENS.colors.backgroundAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: `${WIDGET_TOKENS.borderRadius.md}px`,
                backgroundColor: WIDGET_TOKENS.colors.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsIcon
                sx={{ fontSize: 18, color: WIDGET_TOKENS.colors.primary }}
              />
            </Box>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: WIDGET_TOKENS.colors.textPrimary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("frontdesk.dashboard.notifications")}
                </Typography>
                {(() => {
                  const displayCount = showingAllNotifications
                    ? notificationMeta.count
                    : notificationMeta.unread_count;

                  if (displayCount > 0) {
                    return (
                      <Chip
                        label={displayCount}
                        size="small"
                        sx={{
                          height: 20,
                          minWidth: 20,
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          backgroundColor: showingAllNotifications
                            ? WIDGET_TOKENS.colors.textMuted
                            : WIDGET_TOKENS.colors.primary,
                          color: "white",
                          borderRadius: `${WIDGET_TOKENS.borderRadius.sm}px`,
                          "& .MuiChip-label": {
                            px: 0.75,
                          },
                        }}
                      />
                    );
                  }
                  return null;
                })()}
                <Tooltip
                  title={
                    wsConnected
                      ? t("frontdesk.dashboard.realTimeUpdatesActive")
                      : t("frontdesk.dashboard.realTimeUpdatesUnavailable")
                  }
                >
                  {wsConnected ? (
                    <OnlineIcon
                      sx={{ fontSize: 12, color: WIDGET_TOKENS.colors.success }}
                    />
                  ) : (
                    <OfflineIcon
                      sx={{
                        fontSize: 12,
                        color: WIDGET_TOKENS.colors.textMuted,
                      }}
                    />
                  )}
                </Tooltip>
              </Stack>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: WIDGET_TOKENS.colors.textMuted,
                  mt: 0.25,
                }}
              >
                {t("frontdesk.dashboard.stayUpdatedOnConversations")}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              gap: 1,
            }}
          >
            {/* Filter Toggle */}
            <ToggleButtonGroup
              value={showingAllNotifications ? "all" : "unread"}
              exclusive
              onChange={handleFilterToggle}
              size="small"
              sx={{
                height: 28,
                gap: 0.5,
                "& .MuiToggleButton-root": {
                  px: 1.25,
                  py: 0.5,
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  border: `1px solid ${WIDGET_TOKENS.colors.border}`,
                  color: WIDGET_TOKENS.colors.textSecondary,
                  textTransform: "none",
                  borderRadius: `${WIDGET_TOKENS.borderRadius.sm}px !important`,
                  "&.Mui-selected": {
                    backgroundColor: WIDGET_TOKENS.colors.primary,
                    color: "white",
                    borderColor: WIDGET_TOKENS.colors.primary,
                    "&:hover": {
                      backgroundColor: WIDGET_TOKENS.colors.primaryDark,
                    },
                  },
                  "&:hover": {
                    backgroundColor: WIDGET_TOKENS.colors.borderSubtle,
                  },
                },
              }}
            >
              <ToggleButton
                value="unread"
                aria-label={t("frontdesk.dashboard.unreadOnly")}
              >
                {t("frontdesk.dashboard.unread")}
              </ToggleButton>
              <ToggleButton
                value="all"
                aria-label={t("frontdesk.dashboard.allNotifications")}
              >
                {t("frontdesk.dashboard.all")}
              </ToggleButton>
            </ToggleButtonGroup>

            {recentNotifications.length > 0 && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    padding: "4px",
                    borderRadius: `${WIDGET_TOKENS.borderRadius.sm}px`,
                    "&:hover": {
                      backgroundColor: WIDGET_TOKENS.colors.borderSubtle,
                    },
                  }}
                >
                  <MoreVertIcon
                    sx={{
                      fontSize: 18,
                      color: WIDGET_TOKENS.colors.textSecondary,
                    }}
                  />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleViewAllClick}
                  sx={{
                    padding: "4px",
                    borderRadius: `${WIDGET_TOKENS.borderRadius.sm}px`,
                    "&:hover": {
                      backgroundColor: WIDGET_TOKENS.colors.primaryLight,
                    },
                  }}
                >
                  <ArrowForwardIcon
                    sx={{ fontSize: 16, color: WIDGET_TOKENS.colors.primary }}
                  />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: `${WIDGET_TOKENS.borderRadius.md}px`,
            boxShadow:
              "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
            border: `1px solid ${WIDGET_TOKENS.colors.borderSubtle}`,
          },
        }}
      >
        <MenuItem
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          sx={{
            fontSize: "0.8125rem",
            py: 1.25,
            "&:hover": {
              backgroundColor: WIDGET_TOKENS.colors.borderSubtle,
            },
          }}
        >
          {t("frontdesk.dashboard.markAllAsRead")}
        </MenuItem>
        <MenuItem
          onClick={handleDeleteAllRead}
          disabled={notifications.filter((n) => n.read_at).length === 0}
          sx={{
            fontSize: "0.8125rem",
            py: 1.25,
            "&:hover": {
              backgroundColor: WIDGET_TOKENS.colors.borderSubtle,
            },
          }}
        >
          {t("frontdesk.dashboard.deleteAllRead")}
        </MenuItem>
        <MenuItem
          onClick={handleDeleteAll}
          disabled={notifications.length === 0}
          sx={{
            fontSize: "0.8125rem",
            py: 1.25,
            color: WIDGET_TOKENS.colors.error,
            "&:hover": {
              backgroundColor: WIDGET_TOKENS.colors.errorLight,
            },
          }}
        >
          {t("frontdesk.dashboard.deleteAll")}
        </MenuItem>
      </Menu>

      {/* Notifications List */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: WIDGET_TOKENS.colors.border,
            borderRadius: 3,
            "&:hover": {
              backgroundColor: WIDGET_TOKENS.colors.textMuted,
            },
          },
        }}
      >
        {error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography
              sx={{
                color: WIDGET_TOKENS.colors.error,
                fontSize: "0.8125rem",
              }}
            >
              {error}
            </Typography>
          </Box>
        ) : loading && recentNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography
              sx={{
                color: WIDGET_TOKENS.colors.textMuted,
                fontSize: "0.8125rem",
              }}
            >
              {t("frontdesk.dashboard.loadingNotifications")}
            </Typography>
          </Box>
        ) : recentNotifications.length === 0 ? (
          // Improved Empty State
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
              p: 4,
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 260 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: `${WIDGET_TOKENS.borderRadius.lg}px`,
                  backgroundColor: WIDGET_TOKENS.colors.borderSubtle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <NotificationsNoneIcon
                  sx={{
                    fontSize: 32,
                    color: WIDGET_TOKENS.colors.textMuted,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: WIDGET_TOKENS.colors.textPrimary,
                  mb: 1,
                }}
              >
                {showingAllNotifications
                  ? t("frontdesk.dashboard.noNotifications")
                  : t("frontdesk.dashboard.noUnreadNotifications")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: WIDGET_TOKENS.colors.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {showingAllNotifications
                  ? t("frontdesk.dashboard.notificationsWillAppear")
                  : t("frontdesk.dashboard.allCaughtUpNoNotifications")}
              </Typography>
            </Box>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {recentNotifications.map((notification, index) => {
              const sender = getSenderInfo(notification);
              const typeInfo = getNotificationTypeInfo(
                notification.notification_type
              );
              const messagePreview = getMessagePreview(notification, 60);
              const timestamp = notification.created_at;
              const isUnread = !notification.read_at;

              return (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    backgroundColor: isUnread
                      ? WIDGET_TOKENS.colors.primaryLight
                      : WIDGET_TOKENS.colors.background,
                    "&:hover": {
                      backgroundColor: isUnread
                        ? `${WIDGET_TOKENS.colors.primary}15`
                        : WIDGET_TOKENS.colors.borderSubtle,
                    },
                    borderBottom:
                      index < recentNotifications.length - 1
                        ? `1px solid ${WIDGET_TOKENS.colors.borderSubtle}`
                        : "none",
                    borderLeft: isUnread
                      ? `3px solid ${WIDGET_TOKENS.colors.primary}`
                      : "3px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      width: "100%",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      src={sender.avatar || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: sender.color,
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {sender.initials}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Header Row */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          mb: 0.25,
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            fontWeight: isUnread ? 600 : 500,
                            color: isUnread
                              ? WIDGET_TOKENS.colors.textPrimary
                              : WIDGET_TOKENS.colors.textSecondary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sender.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.6875rem",
                            color: WIDGET_TOKENS.colors.textMuted,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatTimeAgo(timestamp)}
                        </Typography>
                      </Stack>

                      {/* Message Preview */}
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          fontWeight: isUnread ? 500 : 400,
                          color: isUnread
                            ? WIDGET_TOKENS.colors.textSecondary
                            : WIDGET_TOKENS.colors.textMuted,
                          lineHeight: 1.4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                        title={messagePreview}
                      >
                        {messagePreview}
                      </Typography>

                      {/* Type Label */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          mt: 0.5,
                          gap: 0.5,
                        }}
                      >
                        <DotIcon sx={{ fontSize: 8, color: typeInfo.color }} />
                        <Typography
                          sx={{
                            fontSize: "0.6875rem",
                            color: typeInfo.color,
                            fontWeight: 500,
                          }}
                        >
                          {typeInfo.label}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${WIDGET_TOKENS.colors.border}`,
            backgroundColor: WIDGET_TOKENS.colors.backgroundAlt,
            textAlign: "center",
          }}
        >
          <Typography
            onClick={handleViewAllClick}
            sx={{
              fontSize: "0.8125rem",
              color: WIDGET_TOKENS.colors.primary,
              cursor: "pointer",
              fontWeight: 500,
              transition: "color 0.15s ease",
              "&:hover": {
                color: WIDGET_TOKENS.colors.primaryDark,
                textDecoration: "underline",
              },
            }}
          >
            {t("frontdesk.dashboard.viewAllNotifications")} (
            {showingAllNotifications
              ? notificationMeta.count
              : notificationMeta.unread_count}{" "}
            {showingAllNotifications
              ? t("frontdesk.dashboard.total")
              : t("frontdesk.dashboard.unread")}
            )
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatwootNotificationsWidget;
