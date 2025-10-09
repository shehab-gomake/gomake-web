import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Badge, Divider, Typography, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatIcon from '@mui/icons-material/Chat';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import InboxIcon from '@mui/icons-material/Inbox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type Channel = 'all' | 'email' | 'whatsapp' | 'internal';
export type Section = 'inbox' | 'assigned' | 'admin' | 'settings';
export type TicketView = 'my-tickets' | 'unassigned' | 'all-tickets' | 'done';

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
    'my-tickets'?: number;
    'unassigned'?: number;
    'all-tickets'?: number;
    'done'?: number;
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
  selectedTicketView,
  onChannelSelect,
  onSectionSelect,
  onTicketViewSelect,
  channelBadges = {},
  ticketCounts = {},
  isCollapsed = false,
  onToggleCollapse,
  className
}) => {
  const theme = useTheme();
  const [ticketViewsExpanded, setTicketViewsExpanded] = useState(true);
  const [chatsExpanded, setChatsExpanded] = useState(true);

  const channelItems = [
    { id: 'all' as Channel, icon: <AllInclusiveIcon />, label: 'All Channels' },
    { id: 'email' as Channel, icon: <EmailIcon />, label: 'Email' },
    { id: 'whatsapp' as Channel, icon: <WhatsAppIcon />, label: 'WhatsApp' },
    { id: 'internal' as Channel, icon: <ChatIcon />, label: 'Direct Messages' }
  ];

  const ticketViewItems = [
    { id: 'my-tickets' as TicketView, icon: <InboxIcon fontSize="small" />, label: 'My Tickets' },
    { id: 'unassigned' as TicketView, icon: <PersonOutlineIcon fontSize="small" />, label: 'Unassigned' },
    { id: 'all-tickets' as TicketView, icon: <ViewListIcon fontSize="small" />, label: 'All Tickets' },
    { id: 'done' as TicketView, icon: <AssignmentIcon fontSize="small" />, label: 'Done' }
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
        paddingTop: '64px',
        width: isCollapsed ? 64 : 220,
        minWidth: isCollapsed ? 64 : 220,
        transition: 'width 0.3s ease-in-out'
      }}
    >
      {/* Toggle Collapse Button - Top */}
      {onToggleCollapse && (
        <Box
          sx={{
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main
                }
              }}
            >
              {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Ticket Views Section */}
      <Box sx={{ py: 1 }}>
        {!isCollapsed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: theme.palette.action.hover }
            }}
            onClick={() => setTicketViewsExpanded(!ticketViewsExpanded)}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.688rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              TICKET VIEWS
            </Typography>
            {ticketViewsExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </Box>
        )}
        <Collapse in={isCollapsed || ticketViewsExpanded}>
          <List disablePadding>
            {ticketViewItems.map(item => (
              <Tooltip key={item.id} title={item.label} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemButton
                  selected={selectedTicketView === item.id}
                  onClick={() => onTicketViewSelect?.(item.id)}
                  sx={{
                    py: 1,
                    px: isCollapsed ? 1.5 : 2,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '10',
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '20'
                      }
                    }
                  }}
                >
                  {isCollapsed ? (
                    <Badge
                      badgeContent={ticketCounts[item.id] || 0}
                      color="default"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.625rem',
                          height: 16,
                          minWidth: 16,
                          backgroundColor: theme.palette.grey[200],
                          color: theme.palette.text.primary
                        }
                      }}
                      invisible={!ticketCounts[item.id] || ticketCounts[item.id]! <= 0}
                    >
                      <Box sx={{ color: theme.palette.text.secondary, display: 'flex' }}>{item.icon}</Box>
                    </Badge>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                      <Box sx={{ color: theme.palette.text.secondary }}>{item.icon}</Box>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontSize: '0.875rem', fontWeight: selectedTicketView === item.id ? 600 : 400 }
                        }}
                      />
                      {ticketCounts[item.id] !== undefined && ticketCounts[item.id]! > 0 && (
                        <Badge
                          badgeContent={ticketCounts[item.id]}
                          color="default"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.688rem',
                              height: 18,
                              minWidth: 18,
                              backgroundColor: theme.palette.grey[200],
                              color: theme.palette.text.primary
                            }
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Live Chats Section */}
      <Box sx={{ py: 1 }}>
        {!isCollapsed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: theme.palette.action.hover }
            }}
            onClick={() => setChatsExpanded(!chatsExpanded)}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.688rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              LIVE CHATS
            </Typography>
            {chatsExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </Box>
        )}
        <Collapse in={isCollapsed || chatsExpanded}>
          <List disablePadding>
            {channelItems.map(item => (
              <Tooltip key={item.id} title={item.label} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemButton
                  selected={selectedSection === 'inbox' && selectedChannel === item.id && !selectedTicketView}
                  onClick={() => {
                    onSectionSelect('inbox');
                    onChannelSelect(item.id);
                  }}
                  sx={{
                    py: 1,
                    px: isCollapsed ? 1.5 : 2,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '10',
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '20'
                      }
                    }
                  }}
                >
                  {isCollapsed ? (
                    <Badge
                      badgeContent={channelBadges[item.id] || 0}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.625rem',
                          height: 16,
                          minWidth: 16
                        }
                      }}
                      invisible={!channelBadges[item.id] || channelBadges[item.id]! <= 0}
                    >
                      <Box sx={{ color: theme.palette.text.secondary, display: 'flex' }}>{item.icon}</Box>
                    </Badge>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                      <Box sx={{ color: theme.palette.text.secondary }}>{item.icon}</Box>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontSize: '0.875rem', fontWeight: selectedSection === 'inbox' && selectedChannel === item.id && !selectedTicketView ? 600 : 400 }
                        }}
                      />
                      {channelBadges[item.id] !== undefined && channelBadges[item.id]! > 0 && (
                        <Badge
                          badgeContent={channelBadges[item.id]}
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.688rem',
                              height: 18,
                              minWidth: 18
                            }
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Footer/System Items */}
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
