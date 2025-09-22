import React, { useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import { DMMessage, DMPresenceData } from '../../types/direct-messages.types';
import { MessageListProps } from '../../types/direct-messages.types';

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  userPresence,
  isLoadingHistory = false,
  onLoadMore,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getUserDisplayName = (message: DMMessage) => {
    if (message.userName) return message.userName;
    
    const presence = userPresence[message.userId];
    if (presence) {
      return presence.name || `${presence.firstName} ${presence.lastName}`.trim();
    }
    
    return message.userEmail || 'Unknown User';
  };

  const getUserAvatar = (message: DMMessage) => {
    const presence = userPresence[message.userId];
    if (presence) {
      return (
        <Avatar sx={{ width: 32, height: 32 }}>
          {presence.firstName?.[0]}{presence.lastName?.[0]}
        </Avatar>
      );
    }
    
    return (
      <Avatar sx={{ width: 32, height: 32 }}>
        {message.userName?.[0] || message.userEmail?.[0] || 'U'}
      </Avatar>
    );
  };

  const isConsecutiveMessage = (currentMessage: DMMessage, previousMessage?: DMMessage) => {
    if (!previousMessage) return false;
    
    const currentTime = new Date(currentMessage.createdAt);
    const previousTime = new Date(previousMessage.createdAt);
    const timeDiff = currentTime.getTime() - previousTime.getTime();
    
    return (
      currentMessage.userId === previousMessage.userId &&
      timeDiff < 5 * 60 * 1000 // 5 minutes
    );
  };

  const shouldShowDateSeparator = (currentMessage: DMMessage, previousMessage?: DMMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    return (
      <ListItem sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
            <Typography variant="caption">...</Typography>
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.length} people are typing...`
              }
            </Typography>
          </Box>
        </Stack>
      </ListItem>
    );
  };

  const renderMessage = (message: DMMessage, index: number) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const isConsecutive = isConsecutiveMessage(message, previousMessage);
    const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
    const isOwnMessage = message.userId === currentUserId;
    const isPending = !!message.tempId;

    return (
      <React.Fragment key={message.id || message.tempId}>
        {showDateSeparator && (
          <ListItem sx={{ justifyContent: 'center', py: 1 }}>
            <Chip
              label={formatMessageDate(message.createdAt)}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </ListItem>
        )}
        
        <ListItem
          sx={{
            py: isConsecutive ? 0.5 : 1,
            alignItems: 'flex-start',
            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              maxWidth: '70%',
              alignItems: 'flex-start',
              flexDirection: isOwnMessage ? 'row-reverse' : 'row',
            }}
          >
            {!isConsecutive && (
              <Box sx={{ flexShrink: 0 }}>
                {getUserAvatar(message)}
              </Box>
            )}
            
            {isConsecutive && (
              <Box sx={{ width: 32, flexShrink: 0 }} />
            )}
            
            <Stack spacing={0.5}>
              {!isConsecutive && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    textAlign: isOwnMessage ? 'right' : 'left',
                  }}
                >
                  {getUserDisplayName(message)}
                </Typography>
              )}
              
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                  color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.content}
                </Typography>
                
                {isPending && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.7,
                      fontStyle: 'italic',
                    }}
                  >
                    Sending...
                  </Typography>
                )}
              </Paper>
              
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textAlign: isOwnMessage ? 'right' : 'left',
                }}
              >
                {formatMessageTime(message.createdAt)}
                {isPending && ' • Pending'}
              </Typography>
            </Stack>
          </Stack>
        </ListItem>
      </React.Fragment>
    );
  };

  return (
    <Box
      ref={messagesContainerRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isLoadingHistory && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {messages.map((message, index) => renderMessage(message, index))}
        {renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </List>
      
      {messages.length === 0 && !isLoadingHistory && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Start the conversation by sending a message
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};