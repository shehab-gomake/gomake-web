import React, { useEffect, useRef } from "react";
import { Box, Typography, Stack, Avatar, Paper, Chip, CircularProgress, useTheme, alpha } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export interface BaseMessage {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  isOwn?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
}

interface BaseMessageListProps {
  messages: BaseMessage[];
  currentUserId?: string;
  typingUsers?: string[];
  userPresence?: Record<string, any>;
  isLoadingHistory?: boolean;
  emptyMessage?: string;
  themLabel?: string;
  lastReadMessageId?: string;
  onScrollToUnread?: () => void;
}

interface MessageBubbleProps {
  message: BaseMessage;
  isOwn: boolean;
  showAvatar: boolean;
  userPresence: Record<string, any>;
  themLabel?: string;
  isUnread?: boolean;
  isFirstUnread?: boolean;
  unreadRef?: React.RefObject<HTMLDivElement>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  showAvatar, 
  userPresence, 
  themLabel = "Them",
  isUnread = false,
  isFirstUnread = false,
  unreadRef
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Just now";
    }

    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }
  };

  const getDisplayName = () => {
    if (isOwn) return "You";

    // Try message.userName first
    if (message.userName) return message.userName;

    // Try to construct name from userPresence
    const user = userPresence[message.userId];
    if (user) {
      // Prefer full name field if present
      if (user.name && typeof user.name === "string" && user.name.trim()) {
        return user.name.trim();
      }
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
    }

    // Fallback to email or label
    return message.userEmail || themLabel;
  };

  const getInitials = () => {
    if (isOwn) return "Y";
    const name = getDisplayName();
    if (!name || name === "Unknown User") return "T";
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2) || "T"
    );
  };

  const getMessageBubbleStyles = () => ({
    bgcolor: isUnread 
      ? (isOwn ? alpha(primaryColor(200), 0.8) : alpha(primaryColor(100), 0.6))
      : (isOwn ? primaryColor(100) : neutralColor(50)),
    color: isOwn ? primaryColor(900) : neutralColor(800),
    border: `1px solid ${isOwn ? primaryColor(200) : neutralColor(200)}`,
    borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative",
    boxShadow: isUnread 
      ? `0 2px 8px ${alpha(primaryColor(300), 0.3)}`
      : `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: theme.transitions.create(["box-shadow", "transform", "background-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
      transform: "translateY(-1px)",
    },
    // Add a subtle animation for unread messages
    ...(isUnread && {
      animation: "unreadPulse 2s ease-in-out",
      "@keyframes unreadPulse": {
        "0%": {
          backgroundColor: isOwn ? alpha(primaryColor(200), 0.8) : alpha(primaryColor(100), 0.6),
        },
        "50%": {
          backgroundColor: isOwn ? alpha(primaryColor(300), 0.9) : alpha(primaryColor(200), 0.8),
        },
        "100%": {
          backgroundColor: isOwn ? alpha(primaryColor(200), 0.8) : alpha(primaryColor(100), 0.6),
        },
      },
    }),
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
      ref={isFirstUnread ? unreadRef : undefined}
      direction="row"
      spacing={1}
      justifyContent={isOwn ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      sx={{
        mb: showAvatar ? 2 : 0.5,
        px: 2,
        // Add a subtle border for the first unread message
        ...(isFirstUnread && {
          borderLeft: `3px solid ${primaryColor(500)}`,
          pl: 1,
        }),
      }}
    >
      {!isOwn && <Avatar sx={getAvatarStyles()}>{showAvatar ? getInitials() : ""}</Avatar>}

      <Stack maxWidth="70%" alignItems={isOwn ? "flex-end" : "flex-start"} spacing={0.5}>
        {showAvatar && (
          <Chip
            label={getDisplayName()}
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
        )}

        <Paper elevation={0} sx={getMessageBubbleStyles()}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        <Typography
          variant="caption"
          sx={{
            color: neutralColor(500),
            fontSize: "0.7rem",
            px: 0.5,
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Stack>

      {isOwn && <Avatar sx={getAvatarStyles()}>{showAvatar ? "Y" : ""}</Avatar>}
    </Stack>
  );
};

const TypingIndicator: React.FC<{
  typingUsers: string[];
  userPresence: Record<string, any>;
}> = ({ typingUsers, userPresence }) => {
  const { neutralColor } = useGomakeTheme();

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      const user = userPresence[typingUsers[0]];
      const name = user ? `${user.firstName} ${user.lastName}`.trim() : "Someone";
      return `${name} is typing...`;
    } else if (typingUsers.length === 2) {
      const names = typingUsers.map((id) => {
        const user = userPresence[id];
        return user ? user.firstName || "Someone" : "Someone";
      });
      return `${names[0]} and ${names[1]} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1 }}>
      <Avatar sx={{ width: 24, height: 24, fontSize: "0.65rem", bgcolor: neutralColor(400) }}>•••</Avatar>
      <Typography variant="caption" sx={{ color: neutralColor(600), fontStyle: "italic" }}>
        {getTypingText()}
      </Typography>
    </Stack>
  );
};

export const BaseMessageList: React.FC<BaseMessageListProps> = ({
  messages,
  currentUserId,
  typingUsers = [],
  userPresence = {},
  isLoadingHistory = false,
  emptyMessage = "No messages yet",
  themLabel = "Them",
  lastReadMessageId,
  onScrollToUnread,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadMessageRef = useRef<HTMLDivElement>(null);
  const { neutralColor } = useGomakeTheme();

  // Auto-scroll to unread message when conversation is first opened
  useEffect(() => {
    if (lastReadMessageId && unreadMessageRef.current && !isLoadingHistory) {
      // Find the first unread message and scroll to it
      unreadMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
      // Call the callback to indicate we've scrolled to unread
      onScrollToUnread?.();
    }
  }, [lastReadMessageId, isLoadingHistory, onScrollToUnread]);

  // Auto-scroll to bottom when new messages arrive (only if no unread messages)
  useEffect(() => {
    if (messagesEndRef.current && !lastReadMessageId) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUsers, lastReadMessageId]);

  // Group messages by same user within 5 minutes
  const groupedMessages = messages.reduce((groups: { message: BaseMessage; showAvatar: boolean }[], message, index) => {
    const prevMessage = messages[index - 1];
    const showAvatar =
      !prevMessage ||
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ color: neutralColor(600) }}>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h6" sx={{ color: neutralColor(600) }}>
            {emptyMessage}
          </Typography>
          <Typography variant="body2" sx={{ color: neutralColor(500), textAlign: "center" }}>
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
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        py: 1,
        background: `linear-gradient(to bottom, ${neutralColor(25)}, ${neutralColor(50)})`,
      }}
      className="custom-scrollbar"
    >
      {groupedMessages.map(({ message, showAvatar }, index) => {
        const isOwn = message.userId === currentUserId || message.isOwn;
        const isUnread = lastReadMessageId ? 
          messages.findIndex(m => m.id === message.id) > messages.findIndex(m => m.id === lastReadMessageId) :
          false;
        const isFirstUnread = isUnread && 
          messages.findIndex(m => m.id === message.id) === messages.findIndex(m => m.id === lastReadMessageId) + 1;
        
        return (
          <MessageBubble
            key={`${message.id}-${index}`}
            message={{
              ...message,
              isOwn,
            }}
            isOwn={isOwn}
            showAvatar={showAvatar}
            userPresence={userPresence}
            themLabel={themLabel}
            isUnread={isUnread}
            isFirstUnread={isFirstUnread}
            unreadRef={unreadMessageRef}
          />
        );
      })}

      <TypingIndicator typingUsers={typingUsers} userPresence={userPresence} />

      <div ref={messagesEndRef} />
    </Box>
  );
};
