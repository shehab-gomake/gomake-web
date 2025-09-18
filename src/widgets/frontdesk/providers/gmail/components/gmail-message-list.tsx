import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Paper,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationMessage } from '@/widgets/frontdesk/components/conversation/conversation-types';

interface GmailMessageListProps {
  messages: ConversationMessage[];
  currentUserEmail?: string;
  senderName?: string;
}

interface MessageBubbleProps {
  message: ConversationMessage;
  isOwn: boolean;
  showAvatar: boolean;
  senderName?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar, senderName }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const getInitials = () => {
    if (isOwn) return 'Y';
    return senderName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';
  };

  const getMessageBubbleStyles = () => ({
    bgcolor: isOwn ? primaryColor(100) : neutralColor(50),
    color: isOwn ? primaryColor(900) : neutralColor(800),
    border: `1px solid ${isOwn ? primaryColor(200) : neutralColor(200)}`,
    borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative",
    boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
      transform: "translateY(-1px)",
    },
    maxWidth: '100%',
    wordBreak: 'break-word'
  });

  const getAvatarStyles = () => ({
    width: 32,
    height: 32,
    bgcolor: isOwn ? primaryColor(500) : neutralColor(400),
    fontSize: "0.75rem",
    fontWeight: 600,
  });

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
        <Avatar sx={getAvatarStyles()}>
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
            <Chip
              label={isOwn ? "You" : senderName || "Sender"}
              size="small"
              variant="outlined"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                borderColor: isOwn ? primaryColor(300) : neutralColor(300),
                color: isOwn ? primaryColor(700) : neutralColor(700),
                bgcolor: "transparent",
              }}
            />
            <Typography variant="caption" sx={{ color: neutralColor(500) }}>
              {message.at}
            </Typography>
          </Stack>
        )}

        {/* Message bubble */}
        <Paper
          elevation={0}
          sx={getMessageBubbleStyles()}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {message.text}
          </Typography>
        </Paper>

        {/* Timestamp for grouped messages */}
        {!showAvatar && (
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(500),
              mt: 0.5,
              fontSize: '0.6875rem',
              opacity: 0.7
            }}
          >
            {message.at}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export const GmailMessageList: React.FC<GmailMessageListProps> = ({
  messages,
  currentUserEmail,
  senderName
}) => {
  const { neutralColor } = useGomakeTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by same sender within 5 minutes
  const groupedMessages = messages.reduce((groups: { message: ConversationMessage; showAvatar: boolean }[], message, index) => {
    const prevMessage = messages[index - 1];
    const showAvatar = !prevMessage ||
      prevMessage.from !== message.from ||
      new Date().getTime() - new Date().getTime() > 5 * 60 * 1000; // 5 minutes (simplified for now)

    groups.push({ message, showAvatar });
    return groups;
  }, []);

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          background: `linear-gradient(to bottom, ${neutralColor(25)}, ${neutralColor(50)})`,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h6" sx={{ color: '#6B7280' }}>
            No messages in this conversation
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
            This conversation is empty
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
        py: 1,
        background: `linear-gradient(to bottom, ${neutralColor(25)}, ${neutralColor(50)})`,
      }}
      className="custom-scrollbar"
    >
      {/* Messages */}
      {groupedMessages.map(({ message, showAvatar }, index) => (
        <MessageBubble
          key={`${message.id || message.at}-${index}`}
          message={message}
          isOwn={message.from === "me"}
          showAvatar={showAvatar}
          senderName={senderName}
        />
      ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </Box>
  );
};