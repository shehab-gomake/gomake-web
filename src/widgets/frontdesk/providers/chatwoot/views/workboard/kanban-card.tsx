/**
 * Kanban Card Component for Chatwoot Conversations
 *
 * Draggable conversation card for the Kanban board.
 * Uses unified design system components and tokens for consistency.
 */

import React, { memo, useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import {
  Box,
  Tooltip,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  MoreVert as MoreIcon,
  CheckCircle as ResolveIcon,
  PersonAdd as AssignIcon,
  PriorityHigh as PriorityIcon,
  OpenInNew as OpenIcon,
  Flag as FlagIcon,
  Warning as UrgentIcon,
  ArrowUpward as HighIcon,
  Remove as MediumIcon,
  ArrowDownward as LowIcon,
} from "@mui/icons-material";

// Design system - unified components and tokens
import {
  colorTokens,
  shadowTokens,
  radiusTokens,
  semanticTypography,
  priorityColors,
  Avatar,
} from "@/widgets/frontdesk/design-system";

// Types
import {
  ChatwootConversation,
  ConversationPriority,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

// ============================================
// Types
// ============================================

export interface KanbanConversationCardProps {
  conversation: ChatwootConversation;
  index: number;
  agents?: Agent[];
  onClick?: (conversation: ChatwootConversation) => void;
  onResolve?: (conversation: ChatwootConversation) => void;
  onAssign?: (
    conversation: ChatwootConversation,
    agentId: number | null
  ) => void;
  onPriorityChange?: (
    conversation: ChatwootConversation,
    priority: ConversationPriority
  ) => void;
}

// ============================================
// Helper Functions
// ============================================

const formatRelativeTime = (
  timestamp?: number,
  t?: (key: string, options?: any) => string
): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (!t) {
    // Fallback if translation function not provided
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (diffMins < 1) return t("frontdesk.workboard.justNow");
  if (diffMins < 60)
    return t("frontdesk.workboard.minutesAgo", { count: diffMins });
  if (diffHours < 24)
    return t("frontdesk.workboard.hoursAgo", { count: diffHours });
  if (diffDays < 7)
    return t("frontdesk.workboard.daysAgo", { count: diffDays });

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getPriorityColorTokens = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "urgent":
      return priorityColors.urgent;
    case "high":
      return priorityColors.high;
    case "medium":
      return priorityColors.medium;
    case "low":
      return priorityColors.low;
    default:
      return priorityColors.none;
  }
};

const getPriorityLabel = (
  priority?: string,
  t?: (key: string) => string
): string | null => {
  if (!priority || priority === "none") return null;
  if (!t) {
    // Fallback if translation function not provided
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
  const keyMap: Record<string, string> = {
    urgent: "frontdesk.workboard.filters.urgent",
    high: "frontdesk.workboard.filters.high",
    medium: "frontdesk.workboard.filters.medium",
    low: "frontdesk.workboard.filters.low",
  };
  const key = keyMap[priority.toLowerCase()];
  return key ? t(key) : priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getChannelIcon = (channel?: string): React.ReactNode => {
  switch (channel?.toLowerCase()) {
    case "channel::email":
    case "email":
      return <EmailIcon sx={{ fontSize: 12 }} />;
    default:
      return <ChatIcon sx={{ fontSize: 12 }} />;
  }
};

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Priority options will be created inside component to access translations
const getPriorityOptions = (t: (key: string) => string) => [
  {
    value: ConversationPriority.URGENT,
    label: t("frontdesk.workboard.filters.urgent"),
    icon: <UrgentIcon />,
    color: colorTokens.error[500],
  },
  {
    value: ConversationPriority.HIGH,
    label: t("frontdesk.workboard.filters.high"),
    icon: <HighIcon />,
    color: colorTokens.warning[600],
  },
  {
    value: ConversationPriority.MEDIUM,
    label: t("frontdesk.workboard.filters.medium"),
    icon: <MediumIcon />,
    color: colorTokens.info[500],
  },
  {
    value: ConversationPriority.LOW,
    label: t("frontdesk.workboard.filters.low"),
    icon: <LowIcon />,
    color: colorTokens.success[500],
  },
  {
    value: ConversationPriority.NONE,
    label: t("frontdesk.workboard.filters.none"),
    icon: <FlagIcon />,
    color: colorTokens.neutral[400],
  },
];

// ============================================
// Component
// ============================================

const KanbanConversationCardComponent: React.FC<
  KanbanConversationCardProps
> = ({
  conversation,
  index,
  agents = [],
  onClick,
  onResolve,
  onAssign,
  onPriorityChange,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [assignMenuAnchor, setAssignMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".card-menu")) return;
      onClick?.(conversation);
    },
    [onClick, conversation]
  );

  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleResolve = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleMenuClose();
      onResolve?.(conversation);
    },
    [conversation, onResolve, handleMenuClose]
  );

  const handlePriorityMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      handleMenuClose();
      setPriorityMenuAnchor(e.currentTarget);
    },
    [handleMenuClose]
  );

  const handlePriorityMenuClose = useCallback(() => {
    setPriorityMenuAnchor(null);
  }, []);

  const handlePrioritySelect = useCallback(
    (priority: ConversationPriority) => {
      handlePriorityMenuClose();
      onPriorityChange?.(conversation, priority);
    },
    [conversation, onPriorityChange, handlePriorityMenuClose]
  );

  const handleAssignMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      handleMenuClose();
      setAssignMenuAnchor(e.currentTarget);
    },
    [handleMenuClose]
  );

  const handleAssignMenuClose = useCallback(() => {
    setAssignMenuAnchor(null);
  }, []);

  const handleAssignSelect = useCallback(
    (agentId: number | null) => {
      handleAssignMenuClose();
      onAssign?.(conversation, agentId);
    },
    [conversation, onAssign, handleAssignMenuClose]
  );

  const contact = conversation.meta?.sender;
  const assignee = conversation.meta?.assignee;
  const channel = conversation.meta?.channel;
  const lastMessage = conversation.last_non_activity_message;
  const priority = conversation.priority;
  const priorityTokens = getPriorityColorTokens(priority);
  const priorityLabel = getPriorityLabel(priority, t);
  const hasUnread = (conversation.unread_count || 0) > 0;
  const isResolved = conversation.status === "resolved";

  const contactName = contact?.name || contact?.email || "Unknown Contact";
  const messagePreview = truncateText(lastMessage?.content, 60);

  // Menu styling using design tokens
  const menuPaperStyles = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: shadowTokens.lg,
    border: `1px solid ${colorTokens.semantic.border.default}`,
    marginTop: "4px",
    "& .MuiMenuItem-root": {
      ...semanticTypography.body.small,
      padding: "8px 14px",
    },
  };

  return (
    <Draggable draggableId={conversation.id?.toString() || ""} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            backgroundColor: colorTokens.semantic.background.primary,
            borderRadius: `${radiusTokens.xl}px`,
            padding: "16px",
            marginBottom: "10px",
            boxShadow: snapshot.isDragging
              ? shadowTokens.lg
              : shadowTokens.card,
            border: `1px solid ${
              snapshot.isDragging
                ? colorTokens.primary[300]
                : colorTokens.semantic.border.default
            }`,
            [isRTL ? "borderRight" : "borderLeft"]: priorityLabel
              ? `3px solid ${priorityTokens.main}`
              : `1px solid ${colorTokens.semantic.border.default}`,
            cursor: "pointer",
            transition: "all 0.15s ease",
            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
            position: "relative",
            opacity: isResolved ? 0.65 : 1,
            "&:hover": {
              boxShadow: shadowTokens.cardHover,
              borderColor: colorTokens.primary[200],
            },
          }}
        >
          {/* Unread indicator */}
          {hasUnread && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                [isRTL ? "left" : "right"]: 10,
                width: 7,
                height: 7,
                borderRadius: radiusTokens.full,
                backgroundColor: colorTokens.primary[500],
                boxShadow: `0 0 0 2px ${colorTokens.semantic.background.primary}`,
              }}
            />
          )}

          {/* Quick Actions - Show on hover */}
          {isHovered && !snapshot.isDragging && (
            <Box
              className="card-menu"
              sx={{
                position: "absolute",
                top: 6,
                [isRTL ? "left" : "right"]: 6,
                display: "flex",
                gap: "2px",
                direction: dir,
                backgroundColor: colorTokens.semantic.background.primary,
                borderRadius: `${radiusTokens.md}px`,
                padding: "3px",
                boxShadow: shadowTokens.md,
                border: `1px solid ${colorTokens.semantic.border.default}`,
              }}
            >
              {!isResolved && (
                <Tooltip title={t("frontdesk.workboard.markResolved")}>
                  <IconButton
                    size="small"
                    onClick={handleResolve}
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: `${radiusTokens.sm}px`,
                      color: colorTokens.success[600],
                      "&:hover": {
                        backgroundColor: colorTokens.success[50],
                      },
                    }}
                  >
                    <ResolveIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t("frontdesk.workboard.moreActions")}>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: `${radiusTokens.sm}px`,
                    color: colorTokens.semantic.text.secondary,
                    "&:hover": {
                      backgroundColor: colorTokens.semantic.interactive.hover,
                    },
                  }}
                >
                  <MoreIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Header: Contact Avatar + Name + Channel */}
          <Stack
            direction="row"
            alignItems="center"
            marginBottom="10px"
            sx={{
              gap: 1.5,
              direction: dir,
            }}
          >
            {/* Using Avatar primitive from design system */}
            <Avatar name={contactName} src={contact?.avatar_url} size="sm" />
            <Box flex={1} minWidth={0}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  gap: 0.75,
                  direction: dir,
                }}
              >
                {/* Name - Using semantic typography */}
                <Box
                  component="span"
                  sx={{
                    ...semanticTypography.body.medium,
                    fontWeight: semanticTypography.heading.h5.fontWeight,
                    color: colorTokens.semantic.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contactName}
                </Box>
                <Tooltip title={channel || t("frontdesk.workboard.chat")}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: colorTokens.semantic.text.tertiary,
                    }}
                  >
                    {getChannelIcon(channel)}
                  </Box>
                </Tooltip>
              </Stack>
              {/* Email - Using semantic typography */}
              {contact?.email && contact.name && (
                <Box
                  component="span"
                  sx={{
                    ...semanticTypography.caption.medium,
                    color: colorTokens.semantic.text.tertiary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {contact.email}
                </Box>
              )}
            </Box>
          </Stack>

          {/* Message Preview - Using semantic typography */}
          {messagePreview && (
            <Box
              component="p"
              sx={{
                ...semanticTypography.body.small,
                color: colorTokens.semantic.text.secondary,
                lineHeight: 1.45,
                marginBottom: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                mb: "10px",
              }}
            >
              {messagePreview}
            </Box>
          )}

          {/* Labels */}
          {conversation.labels && conversation.labels.length > 0 && (
            <Stack
              direction="row"
              marginBottom="10px"
              flexWrap="wrap"
              sx={{
                gap: 0.75,
                direction: dir,
              }}
            >
              {conversation.labels.slice(0, 2).map((label, idx) => (
                <Chip
                  key={idx}
                  label={label}
                  size="small"
                  sx={{
                    height: 20,
                    ...semanticTypography.caption.small,
                    fontWeight: semanticTypography.label.small.fontWeight,
                    borderRadius: `${radiusTokens.sm}px`,
                    backgroundColor: colorTokens.semantic.background.secondary,
                    color: colorTokens.semantic.text.secondary,
                    border: `1px solid ${colorTokens.semantic.border.default}`,
                    "& .MuiChip-label": {
                      padding: "0 8px",
                    },
                  }}
                />
              ))}
              {conversation.labels.length > 2 && (
                <Box
                  component="span"
                  sx={{
                    ...semanticTypography.caption.small,
                    color: colorTokens.semantic.text.tertiary,
                    alignSelf: "center",
                  }}
                >
                  +{conversation.labels.length - 2}
                </Box>
              )}
            </Stack>
          )}

          {/* Footer: Assignee + Priority + Time */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              direction: dir,
            }}
          >
            {/* Assignee - Using Avatar primitive */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: 0.75,
              }}
            >
              {assignee ? (
                <Tooltip
                  title={assignee.name || t("frontdesk.workboard.assigned")}
                >
                  <span>
                    <Avatar
                      name={assignee.name || "Agent"}
                      src={assignee.thumbnail}
                      size="xs"
                    />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title={t("frontdesk.workboard.filters.unassigned")}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: radiusTokens.full,
                      backgroundColor:
                        colorTokens.semantic.background.secondary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 12,
                        color: colorTokens.semantic.text.tertiary,
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
            </Stack>

            {/* Priority + Time */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: 1,
                direction: dir,
              }}
            >
              {priorityLabel && (
                <Chip
                  label={priorityLabel}
                  size="small"
                  sx={{
                    height: 18,
                    ...semanticTypography.caption.small,
                    fontWeight: semanticTypography.heading.h6.fontWeight,
                    borderRadius: `${radiusTokens.xs}px`,
                    backgroundColor: priorityTokens.bg,
                    color: priorityTokens.text,
                    "& .MuiChip-label": {
                      padding: "0 6px",
                    },
                  }}
                />
              )}
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  gap: 0.5,
                  direction: dir,
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: 12,
                    color: colorTokens.semantic.text.tertiary,
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    ...semanticTypography.caption.medium,
                    color: colorTokens.semantic.text.tertiary,
                  }}
                >
                  {formatRelativeTime(conversation.last_activity_at, t)}
                </Box>
              </Stack>
            </Stack>
          </Stack>

          {/* Actions Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{ sx: { ...menuPaperStyles, minWidth: 170 } }}
          >
            <MenuItem onClick={() => onClick?.(conversation)}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <OpenIcon sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.workboard.open")}</ListItemText>
            </MenuItem>

            {!isResolved && (
              <MenuItem onClick={handleResolve}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ResolveIcon
                    sx={{ fontSize: 16, color: colorTokens.success[500] }}
                  />
                </ListItemIcon>
                <ListItemText>
                  {t("frontdesk.workboard.markResolved")}
                </ListItemText>
              </MenuItem>
            )}

            <Divider sx={{ my: "4px" }} />

            <MenuItem onClick={handleAssignMenuOpen}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <AssignIcon sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.workboard.assignTo")}</ListItemText>
            </MenuItem>

            <MenuItem onClick={handlePriorityMenuOpen}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PriorityIcon sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText>
                {t("frontdesk.workboard.setPriority")}
              </ListItemText>
            </MenuItem>
          </Menu>

          {/* Priority Sub-Menu */}
          <Menu
            anchorEl={priorityMenuAnchor}
            open={Boolean(priorityMenuAnchor)}
            onClose={handlePriorityMenuClose}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            PaperProps={{ sx: { ...menuPaperStyles, minWidth: 140 } }}
          >
            {getPriorityOptions(t).map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handlePrioritySelect(option.value)}
                selected={conversation.priority === option.value}
              >
                <ListItemIcon sx={{ minWidth: 28, color: option.color }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          {/* Assign Sub-Menu */}
          <Menu
            anchorEl={assignMenuAnchor}
            open={Boolean(assignMenuAnchor)}
            onClose={handleAssignMenuClose}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            PaperProps={{
              sx: { ...menuPaperStyles, minWidth: 170, maxHeight: 280 },
            }}
          >
            <MenuItem onClick={() => handleAssignSelect(null)}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PersonIcon
                  sx={{
                    fontSize: 16,
                    color: colorTokens.semantic.text.tertiary,
                  }}
                />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.workboard.unassign")}</ListItemText>
            </MenuItem>
            <Divider sx={{ my: "4px" }} />
            {agents.map((agent) => (
              <MenuItem
                key={agent.id}
                onClick={() => handleAssignSelect(agent.id)}
                selected={assignee?.id === agent.id}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Avatar
                    name={agent.name || "Agent"}
                    src={agent.thumbnail}
                    size="xs"
                  />
                </ListItemIcon>
                <ListItemText>{agent.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Draggable>
  );
};

export const KanbanConversationCard = memo(KanbanConversationCardComponent);
