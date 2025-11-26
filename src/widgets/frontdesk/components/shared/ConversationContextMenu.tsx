import React, { useState } from "react";
import { Divider, Box, CircularProgress, Menu } from "@mui/material";
import {
  MarkEmailUnread as MarkUnreadIcon,
  MarkEmailRead as MarkReadIcon,
  RestartAlt as ReopenIcon,
  CheckCircle as ResolveIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  LocalOffer as LabelIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { DropdownMenu } from "../dropdown-menu";
import { ActionMenuItem } from "@/widgets/frontdesk/design-system/primitives/MenuItem";
import { colorTokens, shadowTokens, radiusTokens } from "@/widgets/frontdesk/design-system/tokens";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("ConversationContextMenu");

/**
 * Context Menu Action Definition
 * Matches the structure from use-chatwoot-context-menu.ts
 */
export interface ConversationContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  divider?: boolean;
  submenu?: ConversationContextMenuAction[];
  disabled?: boolean;
  requiresAdmin?: boolean;
}

export interface ConversationContextMenuProps {
  anchorEl?: HTMLElement | null;
  anchorPosition?: { top: number; left: number } | null;
  open: boolean;
  onClose: () => void;
  conversationId: string | number;
  /** Dynamic action list from hook */
  actions?: ConversationContextMenuAction[];
  /** Action handler from hook */
  onActionClick?: (actionId: string, conversationId?: string | number) => void | Promise<void>;
  /** Loading state for async operations */
  loading?: boolean;
}

/**
 * Map icon names to MUI icons with consistent styling
 */
const iconMap: Record<string, React.ReactNode> = {
  mail: <MarkReadIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  "mail-unread": <MarkUnreadIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  checkmark: <ResolveIcon sx={{ fontSize: 18, color: colorTokens.success[600] }} />,
  "arrow-redo": <ReopenIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  "book-clock": <ScheduleIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  warning: <WarningIcon sx={{ fontSize: 18, color: colorTokens.warning[600] }} />,
  tag: <LabelIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  "person-add": <PersonAddIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  "people-team-add": <GroupAddIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  open: <OpenInNewIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  copy: <ContentCopyIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />,
  delete: <DeleteIcon sx={{ fontSize: 18, color: colorTokens.error[600] }} />,
};

/**
 * Get icon component from icon name
 */
const getIcon = (iconName?: string): React.ReactNode => {
  if (!iconName) return undefined;
  return iconMap[iconName] || <PriorityIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />;
};

/**
 * Conversation Context Menu
 *
 * Enhanced context menu with:
 * - Dynamic action list from hook
 * - Submenu support for Priority, Labels, Agents, Teams
 * - Loading states for async operations
 * - Conditional rendering based on conversation state
 * - Divider support
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * const contextMenu = useChatwootContextMenu(conversation);
 *
 * <ConversationContextMenu
 *   open={isOpen}
 *   anchorPosition={mousePosition}
 *   conversationId={conversation.id}
 *   actions={contextMenu.actions}
 *   onActionClick={contextMenu.handleAction}
 *   onClose={handleClose}
 * />
 * ```
 */
export const ConversationContextMenu: React.FC<ConversationContextMenuProps> = ({
  anchorEl,
  anchorPosition,
  open,
  onClose,
  conversationId,
  actions = [],
  onActionClick,
  loading = false,
}) => {
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<ConversationContextMenuAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle action click with loading state management
   */
  const handleActionClick = async (actionId: string) => {
    if (!onActionClick) return;

    // Client-side actions don't need loading state
    const clientSideActions = ["open-new-tab", "copy-link"];
    const needsLoading = !clientSideActions.includes(actionId);

    try {
      if (needsLoading) {
        setIsProcessing(true);
      }

      await onActionClick(actionId, conversationId);

      // Close menu after successful action (except for client-side actions that close immediately)
      if (!clientSideActions.includes(actionId)) {
        // Slight delay to show success feedback
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        onClose();
      }
    } catch (error) {
      logger.error("Context menu action failed", error instanceof Error ? error : new Error(String(error)));
      // Keep menu open on error so user can retry
    } finally {
      if (needsLoading) {
        setIsProcessing(false);
      }
    }
  };

  /**
   * Handle submenu open
   */
  const handleSubmenuOpen = (event: React.MouseEvent<HTMLElement>, submenu: ConversationContextMenuAction[]) => {
    setSubmenuAnchorEl(event.currentTarget);
    setActiveSubmenu(submenu);
  };

  /**
   * Handle submenu close
   */
  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
    setActiveSubmenu([]);
  };

  /**
   * Handle submenu action click
   */
  const handleSubmenuActionClick = async (actionId: string) => {
    handleSubmenuClose();
    await handleActionClick(actionId);
  };

  /**
   * Handle menu close - also close any open submenu
   */
  const handleClose = () => {
    handleSubmenuClose();
    onClose();
  };

  // Use anchorPosition (mouse coordinates) if provided, otherwise fall back to anchorEl
  const menuProps = anchorPosition
    ? {
        anchorReference: "anchorPosition" as const,
        anchorPosition: {
          top: anchorPosition.top,
          left: anchorPosition.left,
        },
        anchorOrigin: {
          vertical: "top" as const,
          horizontal: "left" as const,
        },
        transformOrigin: {
          vertical: "top" as const,
          horizontal: "left" as const,
        },
      }
    : {
        anchorEl: anchorEl || undefined,
        anchorOrigin: {
          vertical: "bottom" as const,
          horizontal: "right" as const,
        },
        transformOrigin: {
          vertical: "top" as const,
          horizontal: "right" as const,
        },
      };

  return (
    <>
      <DropdownMenu
        open={open}
        onClose={handleClose}
        {...menuProps}
        disableContentPadding
        width={240}
        slotProps={{
          paper: {
            sx: {
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: `0.5px solid rgba(229, 231, 235, 0.8)`,
            },
          },
        }}
      >
        {loading || isProcessing ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
            }}
          >
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Box
            sx={{
              py: 0.25,
            }}
          >
            {actions.map((action) => {
              // Render divider
              if (action.divider) {
                return (
                  <Divider
                    key={action.id}
                    sx={{
                      my: 0.25,
                      mx: 1,
                      borderColor: "rgba(229, 231, 235, 0.6)",
                      borderWidth: 0.5,
                      opacity: 0.5,
                    }}
                  />
                );
              }

              const hasSubmenu = action.submenu && action.submenu.length > 0;
              const isDeleteAction = action.id === "delete-conversation";

              return (
                <ActionMenuItem
                  key={action.id}
                  id={action.id}
                  label={action.label}
                  icon={getIcon(action.icon)}
                  disabled={action.disabled}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      handleSubmenuOpen(e as React.MouseEvent<HTMLElement>, action.submenu!);
                    } else {
                      handleActionClick(action.id);
                    }
                  }}
                  rightElement={
                    hasSubmenu ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: colorTokens.semantic.text.tertiary,
                          opacity: 0.6,
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 14 }} />
                      </Box>
                    ) : undefined
                  }
                  sx={{
                    ...(isDeleteAction && {
                      color: colorTokens.error[600],
                      "&:hover": {
                        backgroundColor: colorTokens.error[50],
                        color: colorTokens.error[700],
                      },
                    }),
                    ...(action.requiresAdmin && {
                      color: colorTokens.error[600],
                      "&:hover": {
                        backgroundColor: colorTokens.error[50],
                        color: colorTokens.error[700],
                      },
                    }),
                  }}
                />
              );
            })}
          </Box>
        )}
      </DropdownMenu>

      {/* Submenu */}
      <Menu
        open={Boolean(submenuAnchorEl)}
        anchorEl={submenuAnchorEl}
        onClose={handleSubmenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: 200,
              ml: 0.5,
              borderRadius: `${radiusTokens.md}px`,
              boxShadow: shadowTokens.xl,
              border: `0.5px solid rgba(229, 231, 235, 0.8)`,
              mt: 0.5,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            py: 0.25,
            background: "transparent",
          }}
        >
          {activeSubmenu.map((subAction) => {
            // Render divider
            if (subAction.divider) {
              return (
                <Divider
                  key={subAction.id}
                  sx={{
                    my: 0.25,
                    mx: 1,
                    borderColor: "rgba(229, 231, 235, 0.6)",
                    borderWidth: 0.5,
                    opacity: 0.5,
                  }}
                />
              );
            }

            return (
              <ActionMenuItem
                key={subAction.id}
                id={subAction.id}
                label={subAction.label}
                icon={getIcon(subAction.icon)}
                disabled={subAction.disabled}
                onClick={() => handleSubmenuActionClick(subAction.id)}
              />
            );
          })}
        </Box>
      </Menu>
    </>
  );
};
