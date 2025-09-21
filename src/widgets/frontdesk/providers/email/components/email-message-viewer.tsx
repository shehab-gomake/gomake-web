import React, { useState, useEffect } from "react";
import { Box, Stack, Paper, Typography, IconButton, Button, Divider, Chip, Badge, Tooltip, useTheme, alpha } from "@mui/material";
import {
  ArrowBack as BackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Print as PrintIcon,
  Label as LabelIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation, EmailMessage } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";
import { safeDecodeHtml } from "../utils/html-decode";
import { safeFormatDate } from "../utils/date-utils";

interface EmailMessageViewerProps {
  conversation: EmailConversation | null;
  accountId?: string;
  onBack: () => void;
  onReply: (conversation: EmailConversation) => void;
  onReplyAll: (conversation: EmailConversation) => void;
  onForward: (conversation: EmailConversation) => void;
  onDelete: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  onStar: (conversationId: string, starred: boolean) => void;
  onPrint: (conversation: EmailConversation) => void;
  onAddLabel: (conversationId: string, label: string) => void;
}

export const EmailMessageViewer: React.FC<EmailMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
  onArchive,
  onStar,
  onPrint,
  onAddLabel,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch conversation details when conversation changes
  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (conversation && accountId) {
        setLoading(true);
        try {
          const conversationDetail = await emailApiClient.getConversationDetail(accountId, conversation.id);
          setMessages(conversationDetail.messages);
        } catch (error) {
          console.error("Failed to fetch conversation details:", error);
          // Fallback to single message display
          setMessages([
            {
              id: conversation.lastMessage.id,
              threadId: conversation.lastMessage.threadId,
              subject: conversation.subject,
              from: { email: conversation.lastMessage.from, name: "" },
              to: [{ email: "", name: "" }],
              createdAt: conversation.lastMessage.date,
              text: conversation.lastMessage.snippet,
              snippet: conversation.lastMessage.snippet,
              isRead: conversation.lastMessage.isRead,
              isStarred: false,
              hasAttachments: false,
            },
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        setMessages([]);
      }
    };

    fetchConversationDetails();
  }, [conversation, accountId]);

  if (!conversation) {
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
            No conversation selected
          </Typography>
          <Typography variant="body2" sx={{ color: neutralColor(500) }}>
            Choose a conversation from the list to view messages
          </Typography>
        </Stack>
      </Box>
    );
  }

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    onClick?: () => void;
    variant?: "icon" | "button";
    children?: React.ReactNode;
  }> = ({ icon, tooltip, onClick, variant = "icon", children }) => {
    if (variant === "button") {
      return (
        <Button
          size="small"
          variant="outlined"
          startIcon={icon}
          onClick={onClick}
          sx={{
            borderColor: neutralColor(300),
            color: neutralColor(700),
            "&:hover": {
              borderColor: primaryColor(300),
              backgroundColor: alpha(primaryColor(100), 0.5),
            },
          }}
        >
          {children}
        </Button>
      );
    }

    return (
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onClick={onClick}
          sx={{
            color: neutralColor(600),
            "&:hover": {
              backgroundColor: alpha(primaryColor(100), 0.5),
              color: primaryColor(600),
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  const MessageItem: React.FC<{ message: EmailMessage; isLast?: boolean }> = ({ message, isLast = false }) => {
    const isOwn = false; // TODO: Check if message is from current user

    // Safe date formatting with fallback
    const formatMessageDate = (dateString: string) => safeFormatDate(dateString);

    return (
      <Box
        sx={{
          p: 2,
          borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
          backgroundColor: isOwn ? alpha(primaryColor(50), 0.3) : "transparent",
        }}
      >
        <Stack spacing={1}>
          {/* Message Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isOwn ? primaryColor(700) : neutralColor(800),
                }}
              >
                {typeof message.from === "string" ? message.from : message.from.name || message.from.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: neutralColor(500),
                }}
              >
                {formatMessageDate(message.createdAt)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <ActionButton icon={<ReplyIcon />} tooltip="Reply" onClick={() => onReply(conversation)} />
              <ActionButton icon={<ReplyAllIcon />} tooltip="Reply All" onClick={() => onReplyAll(conversation)} />
              <ActionButton icon={<ForwardIcon />} tooltip="Forward" onClick={() => onForward(conversation)} />
            </Stack>
          </Stack>

          {/* Message Content */}
          <Box
            sx={{
              "& p": {
                margin: 0,
                marginBottom: 1,
                "&:last-child": {
                  marginBottom: 0,
                },
              },
              "& a": {
                color: primaryColor(600),
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
            dangerouslySetInnerHTML={{
              __html: message.html || safeDecodeHtml(message.text || message.snippet || ""),
            }}
          />
        </Stack>
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
      }}
    >
      {/* Conversation Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <ActionButton icon={<BackIcon />} tooltip="Back to conversations" onClick={onBack} />

              <Typography
                variant="h6"
                noWrap
                sx={{
                  maxWidth: 500,
                  fontWeight: 600,
                  color: neutralColor(900),
                }}
              >
                {safeDecodeHtml(conversation.subject)}
              </Typography>

              <Badge badgeContent={conversation.messageCount} color="primary">
                <PeopleIcon sx={{ fontSize: 20, color: neutralColor(600) }} />
              </Badge>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <ActionButton
                icon={conversation.isStarred ? <StarIcon sx={{ color: "warning.main" }} /> : <StarBorderIcon />}
                tooltip="Star conversation"
                onClick={() => onStar(conversation.id, !(conversation.isStarred || false))}
              />

              <ActionButton icon={<PrintIcon sx={{ fontSize: 18 }} />} tooltip="Print" onClick={() => onPrint(conversation)} />

              <ActionButton
                icon={<ArchiveIcon sx={{ fontSize: 18 }} />}
                tooltip="Archive"
                onClick={() => onArchive(conversation.id)}
              />

              <ActionButton
                icon={<DeleteIcon sx={{ fontSize: 18 }} />}
                tooltip="Delete"
                onClick={() => onDelete(conversation.id)}
              />
            </Stack>
          </Stack>

          {/* Labels and Metadata */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              {conversation.labels?.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  icon={<LabelIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    height: 22,
                    fontSize: "0.75rem",
                    backgroundColor: alpha(primaryColor(100), 0.7),
                    color: primaryColor(700),
                    borderColor: primaryColor(300),
                  }}
                />
              ))}

              <Typography variant="caption" sx={{ color: neutralColor(500), ml: 1 }}>
                <TimeIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                {safeFormatDate(conversation.date)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <ActionButton icon={<ReplyIcon />} tooltip="Reply" variant="button" onClick={() => onReply(conversation)}>
                Reply
              </ActionButton>

              <ActionButton icon={<ReplyAllIcon />} tooltip="Reply All" variant="button" onClick={() => onReplyAll(conversation)}>
                Reply All
              </ActionButton>

              <ActionButton icon={<ForwardIcon />} tooltip="Forward" variant="button" onClick={() => onForward(conversation)}>
                Forward
              </ActionButton>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(600) }}>
              Loading messages...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No messages in this conversation
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <MessageItem key={message.id} message={message} isLast={index === messages.length - 1} />
          ))
        )}
      </Box>
    </Paper>
  );
};
