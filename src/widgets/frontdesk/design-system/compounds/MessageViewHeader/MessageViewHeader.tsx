import React from 'react';
import { Box, Stack, Typography, IconButton, Tooltip, Avatar } from '@mui/material';
import {
  Search as SearchIcon,
  Star,
  StarBorder,
  ArchiveOutlined,
  Unarchive,
  Close as CloseIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

export interface MessageViewHeaderAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  color?: string;
  activeColor?: string;
}

export interface MessageViewHeaderProps {
  /**
   * Conversation title to display
   */
  title: string;

  /**
   * Conversation type
   */
  conversationType?: 'DM' | 'GROUP_DM';

  /**
   * Whether the conversation is favorited
   */
  isFavorite?: boolean;

  /**
   * Whether the conversation is archived
   */
  isArchived?: boolean;

  /**
   * Whether search is currently active
   */
  isSearchActive?: boolean;

  /**
   * Callback when search button is clicked
   */
  onSearch?: () => void;

  /**
   * Callback when favorite button is clicked
   */
  onFavorite?: () => void;

  /**
   * Callback when archive button is clicked
   */
  onArchive?: () => void;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;

  /**
   * Optional custom actions to display
   */
  customActions?: MessageViewHeaderAction[];

  /**
   * Additional content to render below the header (e.g., participants list)
   */
  children?: React.ReactNode;
}

/**
 * MessageViewHeader
 *
 * Header for message view with title and action buttons (search, favorite, archive, close).
 * Supports custom actions and additional content like participant lists.
 *
 * @example
 * ```tsx
 * <MessageViewHeader
 *   title="Engineering Team"
 *   conversationType="GROUP_DM"
 *   isFavorite={false}
 *   isArchived={false}
 *   onSearch={handleSearch}
 *   onFavorite={handleFavorite}
 *   onArchive={handleArchive}
 *   onClose={handleClose}
 * >
 *   <ParticipantsList members={members} />
 * </MessageViewHeader>
 * ```
 */
export const MessageViewHeader: React.FC<MessageViewHeaderProps> = ({
  title,
  conversationType,
  isFavorite = false,
  isArchived = false,
  isSearchActive = false,
  onSearch,
  onFavorite,
  onArchive,
  onClose,
  customActions,
  children,
}) => {
  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #EAECF0' }}>
      <Stack spacing={1}>
        {/* Title and Actions Row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Title */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {conversationType === 'GROUP_DM' && (
              <Tooltip title="Group Chat">
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>
                  <GroupIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Tooltip>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#101828' }}>
              {title}
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            {/* Search */}
            {onSearch && (
              <Tooltip title="Search in conversation">
                <IconButton
                  size="small"
                  onClick={onSearch}
                  sx={{
                    color: isSearchActive ? 'primary.main' : 'grey.500',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Favorite */}
            {onFavorite && (
              <Tooltip title={isFavorite ? 'Unfavorite conversation' : 'Favorite conversation'}>
                <IconButton
                  size="small"
                  onClick={onFavorite}
                  sx={{
                    color: isFavorite ? 'warning.main' : 'grey.500',
                    '&:hover': {
                      color: 'warning.main',
                    },
                  }}
                >
                  {isFavorite ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}

            {/* Archive */}
            {onArchive && (
              <Tooltip title={isArchived ? 'Unarchive conversation' : 'Archive conversation'}>
                <IconButton
                  size="small"
                  onClick={onArchive}
                  sx={{
                    color: isArchived ? 'primary.main' : 'grey.500',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {isArchived ? <Unarchive fontSize="small" /> : <ArchiveOutlined fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}

            {/* Custom Actions */}
            {customActions?.map((action, index) => (
              <Tooltip key={index} title={action.label}>
                <IconButton
                  size="small"
                  onClick={action.onClick}
                  sx={{
                    color: action.active ? action.activeColor || 'primary.main' : action.color || 'grey.500',
                    '&:hover': {
                      color: action.activeColor || 'primary.main',
                    },
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}

            {/* Close */}
            {onClose && (
              <Tooltip title="Close conversation">
                <IconButton
                  size="small"
                  onClick={onClose}
                  sx={{
                    color: 'grey.500',
                    '&:hover': {
                      color: 'error.main',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Additional Content (e.g., participants list) */}
        {children}
      </Stack>
    </Box>
  );
};