import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  IconButton,
  Collapse,
  Stack
} from '@mui/material';
import {
  Tag as ChannelIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
  Circle as OnlineIcon
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { messagingChannelsState, messagingUnreadCountsState, messagingOnlineUsersState, messagingUserPresenceState } from '@/store/messaging';
import { Channel, PresenceData } from '../types';

interface ChannelSidebarProps {
  activeChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onStartDirectMessage?: (userId: string) => void;
  onAddChannel?: () => void;
}

const StatusIndicator: React.FC<{ status: 'online' | 'away' | 'busy' | 'offline' }> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'online': return '#10B981'; // green
      case 'away': return '#F59E0B'; // yellow
      case 'busy': return '#EF4444'; // red
      case 'offline': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  return (
    <OnlineIcon
      sx={{
        fontSize: 8,
        color: getColor(),
        mr: 0.5
      }}
    />
  );
};

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  activeChannelId,
  onChannelSelect,
  onStartDirectMessage,
  onAddChannel
}) => {
  const channels = useRecoilValue(messagingChannelsState);
  const unreadCounts = useRecoilValue(messagingUnreadCountsState);
  const onlineUsers = useRecoilValue(messagingOnlineUsersState);
  const userPresence = useRecoilValue(messagingUserPresenceState);

  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);

  const channelChannels = channels.filter(c => c.type === 'channel');
  const directChannels = channels.filter(c => c.type === 'direct');

  const getDisplayName = (presence: PresenceData) => {
    return `${presence.firstName} ${presence.lastName}`.trim() || presence.email;
  };

  const getLastSeenText = (presence: PresenceData) => {
    if (presence.status === 'offline' && presence.lastSeen) {
      const lastSeenDate = new Date(presence.lastSeen);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

      if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)}h ago`;
      } else {
        return `${Math.floor(diffMinutes / 1440)}d ago`;
      }
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #EAECF0',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #EAECF0' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#101828' }}>
          Internal Messaging
        </Typography>
      </Box>

      {/* Channel List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Channels Section */}
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 2, py: 1 }}>
            <ListItemButton
              onClick={() => setChannelsExpanded(!channelsExpanded)}
              sx={{ p: 0, minHeight: 'auto' }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem' }}>
                    CHANNELS
                  </Typography>
                }
              />
              {channelsExpanded ? (
                <ExpandLess sx={{ fontSize: 16, color: '#6B7280' }} />
              ) : (
                <ExpandMore sx={{ fontSize: 16, color: '#6B7280' }} />
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={channelsExpanded}>
            {channelChannels.map((channel) => (
              <ListItem key={channel.id} sx={{ py: 0, px: 1 }}>
                <ListItemButton
                  selected={activeChannelId === channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#F3F4F6',
                      '&:hover': {
                        backgroundColor: '#E5E7EB',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChannelIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {channel.name}
                        </Typography>
                        {unreadCounts[channel.id] && unreadCounts[channel.id] > 0 && (
                          <Badge
                            badgeContent={unreadCounts[channel.id]}
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.625rem',
                                minWidth: 16,
                                height: 16,
                              },
                            }}
                          />
                        )}
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Add Channel Button */}
            {onAddChannel && (
              <ListItem sx={{ py: 0, px: 1 }}>
                <ListItemButton
                  onClick={onAddChannel}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    color: '#6B7280',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AddIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Add Channel
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Direct Messages Section */}
          <ListItem sx={{ px: 2, py: 1 }}>
            <ListItemButton
              onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
              sx={{ p: 0, minHeight: 'auto' }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem' }}>
                    DIRECT MESSAGES
                  </Typography>
                }
              />
              {directMessagesExpanded ? (
                <ExpandLess sx={{ fontSize: 16, color: '#6B7280' }} />
              ) : (
                <ExpandMore sx={{ fontSize: 16, color: '#6B7280' }} />
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={directMessagesExpanded}>
            {/* Online Users */}
            {Object.values(userPresence)
              .filter(presence => onlineUsers.includes(presence.userId))
              .map((presence) => (
                <ListItem key={presence.userId} sx={{ py: 0, px: 1 }}>
                  <ListItemButton
                    onClick={() => onStartDirectMessage?.(presence.userId)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Stack direction="row" alignItems="center">
                        <StatusIndicator status={presence.status} />
                        <PersonIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      </Stack>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {getDisplayName(presence)}
                        </Typography>
                      }
                      secondary={
                        presence.status !== 'online' && (
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {presence.status === 'offline' ? getLastSeenText(presence) : presence.status}
                          </Typography>
                        )
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}

            {/* Offline Users */}
            {Object.values(userPresence)
              .filter(presence => !onlineUsers.includes(presence.userId))
              .slice(0, 5) // Show only first 5 offline users
              .map((presence) => (
                <ListItem key={presence.userId} sx={{ py: 0, px: 1 }}>
                  <ListItemButton
                    onClick={() => onStartDirectMessage?.(presence.userId)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      opacity: 0.7,
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                        opacity: 1,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Stack direction="row" alignItems="center">
                        <StatusIndicator status={presence.status} />
                        <PersonIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      </Stack>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {getDisplayName(presence)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {getLastSeenText(presence) || 'Offline'}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}

            {/* Existing Direct Message Channels */}
            {directChannels.map((channel) => (
              <ListItem key={channel.id} sx={{ py: 0, px: 1 }}>
                <ListItemButton
                  selected={activeChannelId === channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#F3F4F6',
                      '&:hover': {
                        backgroundColor: '#E5E7EB',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {channel.name}
                        </Typography>
                        {unreadCounts[channel.id] && unreadCounts[channel.id] > 0 && (
                          <Badge
                            badgeContent={unreadCounts[channel.id]}
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.625rem',
                                minWidth: 16,
                                height: 16,
                              },
                            }}
                          />
                        )}
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* New Message Button */}
            {onStartDirectMessage && (
              <ListItem sx={{ py: 0, px: 1 }}>
                <ListItemButton
                  onClick={() => {/* TODO: Open user selection modal */}}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    color: '#6B7280',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AddIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        New Message
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Collapse>
        </List>
      </Box>
    </Paper>
  );
};