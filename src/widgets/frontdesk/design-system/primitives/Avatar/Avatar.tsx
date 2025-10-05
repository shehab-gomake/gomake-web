import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Badge } from '@mui/material';
import { colorTokens, semanticSpacing } from '../../tokens';

export interface AvatarProps extends Omit<MuiAvatarProps, 'size'> {
  /** Avatar size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** User's name for initials fallback */
  name?: string;
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Presence indicator */
  presence?: 'online' | 'away' | 'busy' | 'offline' | null;
  /** Show unread count badge */
  unreadCount?: number;
  /** Custom background color */
  backgroundColor?: string;
}

const sizeMap = {
  xs: semanticSpacing.avatar.xs,
  sm: semanticSpacing.avatar.sm,
  md: semanticSpacing.avatar.md,
  lg: semanticSpacing.avatar.lg,
  xl: semanticSpacing.avatar.xl,
  xxl: semanticSpacing.avatar.xxl,
};

const fontSizeMap = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const presenceMap = {
  online: colorTokens.semantic.status.online,
  away: colorTokens.semantic.status.away,
  busy: colorTokens.semantic.status.busy,
  offline: colorTokens.semantic.status.offline,
};

/**
 * Get initials from name
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generate consistent color from string
 */
const getAvatarColor = (name: string): string => {
  const colors = [
    colorTokens.primary[500],
    colorTokens.success[500],
    colorTokens.warning[500],
    colorTokens.error[500],
    colorTokens.info[500],
    colorTokens.primary[700],
    colorTokens.success[700],
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Avatar Component
 *
 * Displays user avatar with support for images, initials fallback,
 * presence indicators, and unread count badges.
 */
export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  name = '',
  src,
  alt,
  presence = null,
  unreadCount,
  backgroundColor,
  children,
  sx = {},
  ...rest
}) => {
  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const initials = name ? getInitials(name) : '';
  const bgColor = backgroundColor || (name ? getAvatarColor(name) : colorTokens.neutral[400]);

  const avatarContent = (
    <MuiAvatar
      src={src}
      alt={alt || name}
      sx={{
        width: avatarSize,
        height: avatarSize,
        fontSize,
        fontWeight: 600,
        backgroundColor: bgColor,
        color: 'white',
        ...sx,
      }}
      {...rest}
    >
      {children || initials}
    </MuiAvatar>
  );

  // Wrap with unread badge if needed
  if (unreadCount && unreadCount > 0) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={unreadCount > 99 ? '99+' : unreadCount}
        color="primary"
        sx={{
          '& .MuiBadge-badge': {
            fontSize: size === 'xs' || size === 'sm' ? 9 : 11,
            height: size === 'xs' || size === 'sm' ? 16 : 20,
            minWidth: size === 'xs' || size === 'sm' ? 16 : 20,
            padding: size === 'xs' || size === 'sm' ? '0 4px' : '0 6px',
            fontWeight: 600,
          },
        }}
      >
        {presence ? (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-dot': {
                backgroundColor: presenceMap[presence],
                width: Math.max(8, avatarSize * 0.25),
                height: Math.max(8, avatarSize * 0.25),
                borderRadius: '50%',
                border: `2px solid ${colorTokens.semantic.background.primary}`,
              },
            }}
          >
            {avatarContent}
          </Badge>
        ) : (
          avatarContent
        )}
      </Badge>
    );
  }

  // Wrap with presence indicator if needed
  if (presence) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-dot': {
            backgroundColor: presenceMap[presence],
            width: Math.max(8, avatarSize * 0.25),
            height: Math.max(8, avatarSize * 0.25),
            borderRadius: '50%',
            border: `2px solid ${colorTokens.semantic.background.primary}`,
          },
        }}
      >
        {avatarContent}
      </Badge>
    );
  }

  return avatarContent;
};