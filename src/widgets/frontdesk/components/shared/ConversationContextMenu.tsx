import React from 'react';
import { Divider, Box } from '@mui/material';
import {
  MarkEmailUnread as MarkUnreadIcon,
  RestartAlt as ReopenIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  LocalOffer as LabelIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DropdownMenu } from '../dropdown-menu';
import { ActionMenuItem } from '@/widgets/frontdesk/design-system/primitives/MenuItem';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';

export interface ConversationContextMenuAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  hasSubmenu?: boolean;
  disabled?: boolean;
}

export interface ConversationContextMenuProps {
  anchorEl?: HTMLElement | null;
  anchorPosition?: { top: number; left: number } | null;
  open: boolean;
  onClose: () => void;
  conversationId: string | number;
  onActionClick?: (actionId: string, conversationId: string | number) => void;
}

/**
 * Conversation Context Menu
 * 
 * Right-click menu for conversation list items with actions like:
 * - Mark as unread
 * - Reopen conversation
 * - Mark as pending
 * - Priority (submenu)
 * - Assign label (submenu)
 * - Assign agent (submenu)
 * - Assign team (submenu)
 * - Open in new tab
 * - Copy conversation link
 * - Delete conversation
 */
export const ConversationContextMenu: React.FC<ConversationContextMenuProps> = ({
  anchorEl,
  anchorPosition,
  open,
  onClose,
  conversationId,
  onActionClick,
}) => {
  const handleActionClick = (actionId: string) => {
    if (onActionClick) {
      onActionClick(actionId, conversationId);
    }
    onClose();
  };

  const menuActions: ConversationContextMenuAction[] = [
    {
      id: 'mark-unread',
      label: 'Mark as unread',
      icon: <MarkUnreadIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('mark-unread'),
    },
    {
      id: 'reopen',
      label: 'Reopen conversation',
      icon: <ReopenIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('reopen'),
    },
    {
      id: 'mark-pending',
      label: 'Mark as pending',
      icon: <ScheduleIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('mark-pending'),
    },
    {
      id: 'priority',
      label: 'Priority',
      icon: <PriorityIcon sx={{ fontSize: 18 }} />,
      hasSubmenu: true,
      onClick: () => handleActionClick('priority'),
    },
    {
      id: 'assign-label',
      label: 'Assign label',
      icon: <LabelIcon sx={{ fontSize: 18 }} />,
      hasSubmenu: true,
      onClick: () => handleActionClick('assign-label'),
    },
    {
      id: 'assign-agent',
      label: 'Assign agent',
      icon: <PersonAddIcon sx={{ fontSize: 18 }} />,
      hasSubmenu: true,
      onClick: () => handleActionClick('assign-agent'),
    },
    {
      id: 'assign-team',
      label: 'Assign team',
      icon: <GroupAddIcon sx={{ fontSize: 18 }} />,
      hasSubmenu: true,
      onClick: () => handleActionClick('assign-team'),
    },
    {
      id: 'open-new-tab',
      label: 'Open in new tab',
      icon: <OpenInNewIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('open-new-tab'),
    },
    {
      id: 'copy-link',
      label: 'Copy conversation link',
      icon: <ContentCopyIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('copy-link'),
    },
    {
      id: 'delete',
      label: 'Delete conversation',
      icon: <DeleteIcon sx={{ fontSize: 18 }} />,
      onClick: () => handleActionClick('delete'),
    },
  ];

  // Use anchorPosition (mouse coordinates) if provided, otherwise fall back to anchorEl
  const menuProps = anchorPosition
    ? {
        anchorReference: 'anchorPosition' as const,
        anchorPosition: {
          top: anchorPosition.top,
          left: anchorPosition.left,
        },
        // When using anchorPosition, we want the menu to appear with top-left at cursor
        anchorOrigin: {
          vertical: 'top' as const,
          horizontal: 'left' as const,
        },
        transformOrigin: {
          vertical: 'top' as const,
          horizontal: 'left' as const,
        },
      }
    : {
        anchorEl: anchorEl || undefined,
        anchorOrigin: {
          vertical: 'bottom' as const,
          horizontal: 'right' as const,
        },
        transformOrigin: {
          vertical: 'top' as const,
          horizontal: 'right' as const,
        },
      };

  return (
    <DropdownMenu
      open={open}
      onClose={onClose}
      {...menuProps}
      disableContentPadding
      width={240}
    >
      {menuActions.map((action, index) => (
        <React.Fragment key={action.id}>
          <ActionMenuItem
            id={action.id}
            label={action.label}
            icon={action.icon}
            disabled={action.disabled}
            onClick={action.onClick}
            rightElement={
              action.hasSubmenu ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: colorTokens.semantic.text.secondary,
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 16 }} />
                </Box>
              ) : undefined
            }
          />
          {/* Divider before destructive action */}
          {index === menuActions.length - 2 && (
            <Divider 
              sx={{ 
                my: 0.5,
                borderColor: colorTokens.semantic.border.default,
              }} 
            />
          )}
        </React.Fragment>
      ))}
    </DropdownMenu>
  );
};

