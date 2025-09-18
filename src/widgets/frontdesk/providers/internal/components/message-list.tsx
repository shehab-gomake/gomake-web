import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers: string[];
  userPresence: Record<string, any>;
  isLoadingHistory?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  userPresence: Record<string, any>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar, userPresence }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDisplayName = () => {
    if (isOwn) return 'You';
    return message.userName ||
           `${userPresence[message.userId]?.firstName || ''} ${userPresence[message.userId]?.lastName || ''}`.trim() ||
           message.userEmail ||
           'Unknown User';
  };

  const getInitials = () => {
    if (isOwn) return 'Y';
    const name = getDisplayName();
    if (!name || name === 'Unknown User') return 'U';
    return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <Stack
      direction={isOwn ? 'row-reverse' : 'row'}
      spacing={1}
      sx={{
        alignItems: 'flex-start',
        mb: showAvatar ? 2 : 0.5,
        px: 2
      }}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.75rem',
            bgcolor: isOwn ? '#3B82F6' : '#6B7280'
          }}
        >
          {getInitials()}
        </Avatar>
      )}

      {/* Message Content */}
      <Stack
        sx={{
          maxWidth: '70%',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
          ml: showAvatar ? 0 : isOwn ? 0 : '40px'
        }}
      >
        {/* Name and timestamp */}
        {showAvatar && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>
              {getDisplayName()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280' }}>
              {formatTime(message.timestamp)}
            </Typography>
          </Stack>
        )}

        {/* Message bubble */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            backgroundColor: isOwn ? '#3B82F6' : '#F3F4F6',
            color: isOwn ? 'white' : '#374151',
            maxWidth: '100%',
            wordBreak: 'break-word'
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
            {message.content}
          </Typography>
        </Paper>

        {/* Timestamp for grouped messages */}
        {!showAvatar && (
          <Typography
            variant="caption"
            sx={{
              color: '#6B7280',
              mt: 0.5,
              fontSize: '0.6875rem',
              opacity: 0.7
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

const TypingIndicator: React.FC<{ typingUsers: string[]; userPresence: Record<string, any> }> = ({
  typingUsers,
  userPresence
}) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      const user = userPresence[typingUsers[0]];
      const name = user ? `${user.firstName} ${user.lastName}`.trim() : 'Someone';
      return `${name} is typing...`;
    } else if (typingUsers.length === 2) {
      const names = typingUsers.map(id => {
        const user = userPresence[id];
        return user ? user.firstName || 'Someone' : 'Someone';
      });
      return `${names[0]} and ${names[1]} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1 }}>
      <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: '#6B7280' }}>
        •••
      </Avatar>
      <Typography variant="caption" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
        {getTypingText()}
      </Typography>
    </Stack>
  );
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  userPresence,
  isLoadingHistory = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  // Group messages by same user within 5 minutes
  const groupedMessages = messages.reduce((groups: { message: Message; showAvatar: boolean }[], message, index) => {
    const prevMessage = messages[index - 1];
    const showAvatar = !prevMessage ||
      prevMessage.userId !== message.userId ||
      new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000; // 5 minutes

    groups.push({ message, showAvatar });
    return groups;
  }, []);

  if (isLoadingHistory) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Loading message history...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (messages.length === 0 && typingUsers.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h6" sx={{ color: '#6B7280' }}>
            No messages yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
            Start the conversation by sending your first message
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        py: 1
      }}
    >
      {/* Date dividers could be added here */}

      {/* Messages */}
      {groupedMessages.map(({ message, showAvatar }, index) => (
        <MessageBubble
          key={`${message.messageId || message.timestamp}-${index}`}
          message={message}
          isOwn={message.userId === currentUserId}
          showAvatar={showAvatar}
          userPresence={userPresence}
        />
      ))}

      {/* Typing indicators */}
      <TypingIndicator typingUsers={typingUsers} userPresence={userPresence} />

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </Box>
  );
};