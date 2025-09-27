import React from 'react';
import { Box, IconButton, Tooltip, Badge, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatIcon from '@mui/icons-material/Chat';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import SettingsIcon from '@mui/icons-material/Settings';

export type Channel = 'all' | 'email' | 'whatsapp' | 'internal';
export type Section = 'inbox' | 'assigned' | 'admin' | 'settings';

interface NavigationSidebarProps {
  selectedChannel: Channel;
  selectedSection: Section;
  onChannelSelect: (channel: Channel) => void;
  onSectionSelect: (section: Section) => void;
  channelBadges?: {
    all?: number;
    email?: number;
    whatsapp?: number;
    internal?: number;
  };
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

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isSelected,
  onClick,
  badge = 0,
  color
}) => {
  const theme = useTheme();
  
  return (
    <Tooltip title={label} placement="right">
      <IconButton
        onClick={onClick}
        sx={{
          width: '100%',
          height: 56,
          borderRadius: 0,
          position: 'relative',
          color: isSelected ? (color || theme.palette.primary.main) : theme.palette.text.secondary,
          backgroundColor: isSelected ? `${theme.palette.primary.main}10` : 'transparent',
          '&:hover': {
            backgroundColor: isSelected 
              ? `${theme.palette.primary.main}20` 
              : theme.palette.action.hover
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 24,
            backgroundColor: theme.palette.primary.main,
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }
        }}
      >
        <Badge
          badgeContent={badge}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              right: -3,
              top: 3,
              fontSize: '0.625rem',
              height: 16,
              minWidth: 16,
              padding: '0 4px'
            }
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
  onChannelSelect,
  onSectionSelect,
  channelBadges = {},
  className
}) => {
  const theme = useTheme();

  const channelItems = [
    { id: 'all' as Channel, icon: <AllInclusiveIcon />, label: 'All Channels' },
    { id: 'email' as Channel, icon: <EmailIcon />, label: 'Email' },
    { id: 'whatsapp' as Channel, icon: <WhatsAppIcon />, label: 'WhatsApp' },
    { id: 'internal' as Channel, icon: <ChatIcon />, label: 'Direct Messages' }
  ];

  const systemItems = [
    { id: 'settings' as Section, icon: <SettingsIcon />, label: 'Settings' }
  ];

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        paddingTop: '64px' // Added padding to push content down
      }}
    >
      {/* Channels Section */}
      <Box sx={{ py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            opacity: 0.7
          }}
        >
          Channels
        </Typography>
        {channelItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={selectedSection === 'inbox' && selectedChannel === item.id}
            onClick={() => {
              onSectionSelect('inbox');
              onChannelSelect(item.id);
            }}
            badge={channelBadges[item.id]}
          />
        ))}
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Footer/Version */}
      <Box
        sx={{
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        {systemItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={selectedSection === item.id}
            onClick={() => onSectionSelect(item.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default NavigationSidebar;
