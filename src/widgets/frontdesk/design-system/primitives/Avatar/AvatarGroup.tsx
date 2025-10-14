import React from 'react';
import { AvatarGroup as MuiAvatarGroup, AvatarGroupProps as MuiAvatarGroupProps } from '@mui/material';
import { Avatar, AvatarProps } from './Avatar';

export interface AvatarGroupProps extends Omit<MuiAvatarGroupProps, 'max'> {
  /** Array of user data */
  users: Array<{
    name: string;
    src?: string;
    alt?: string;
  }>;
  /** Maximum number of avatars to show before "+X" */
  max?: number;
  /** Avatar size */
  size?: AvatarProps['size'];
}

/**
 * AvatarGroup Component
 *
 * Displays a group of avatars with overflow indicator
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'sm',
  sx = {},
  ...rest
}) => {
  return (
    <MuiAvatarGroup
      max={max}
      sx={{
        '& .MuiAvatar-root': {
          width: size === 'xs' ? 20 : size === 'sm' ? 24 : size === 'md' ? 32 : 40,
          height: size === 'xs' ? 20 : size === 'sm' ? 24 : size === 'md' ? 32 : 40,
          fontSize: size === 'xs' ? 10 : size === 'sm' ? 11 : size === 'md' ? 13 : 16,
        },
        ...sx,
      }}
      {...rest}
    >
      {users.map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          src={user.src}
          alt={user.alt}
          size={size}
        />
      ))}
    </MuiAvatarGroup>
  );
};