import React, { useState } from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
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
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { BaseMessageList, BaseMessage } from './BaseMessageList';
import { format, formatDistanceToNow } from 'date-fns';

export interface BaseConversation {
  id: string;
  subject: string;
  participants: string[];
  messageCount: number;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  labels?: string[];
}

interface BaseMessageViewerProps {
  conversation: BaseConversation;
  messages: BaseMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  onBack?: () => void;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onStar?: (starred: boolean) => void;
  onPrint?: () => void;
  onAddLabel?: (label: string) => void;
  quickReplyComponent?: React.ReactNode;
  showQuickReply?: boolean;
}

export const BaseMessageViewer: React.FC<BaseMessageViewerProps> = ({
  conversation,
  messages,
  currentUserId,
  isLoading = false,
  onBack,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
  onArchive,
  onStar,
  onPrint,
  onAddLabel,
  quickReplyComponent,
  showQuickReply = true
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    onClick?: () => void;
    variant?: 'icon' | 'button';
    children?: React.ReactNode;
  }> = ({ icon, tooltip, onClick, variant = 'icon', children }) => {
    if (variant === 'button') {
      return (
        <Button
          size="small"
          variant="outlined"
          startIcon={icon}
          onClick={onClick}
          sx={{
            borderColor: neutralColor(300),
            color: neutralColor(700),
            '&:hover': {
              borderColor: primaryColor(300),
              backgroundColor: alpha(primaryColor(100), 0.5),
            }
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
            '&:hover': {
              backgroundColor: alpha(primaryColor(100), 0.5),
              color: primaryColor(600),
            }
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
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
              {onBack && (
                <ActionButton
                  icon={<BackIcon />}
                  tooltip="Back to conversations"
                  onClick={onBack}
                />
              )}

              <Typography
                variant="h6"
                noWrap
                sx={{
                  maxWidth: 500,
                  fontWeight: 600,
                  color: neutralColor(900)
                }}
              >
                {conversation.subject}
              </Typography>

              <Badge badgeContent={conversation.messageCount} color="primary">
                <PeopleIcon sx={{ fontSize: 20, color: neutralColor(600) }} />
              </Badge>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <ActionButton
                icon={conversation.isStarred ? <StarIcon sx={{ color: 'warning.main' }} /> : <StarBorderIcon />}
                tooltip="Star conversation"
                onClick={() => onStar?.(!conversation.isStarred)}
              />

              <ActionButton
                icon={<PrintIcon sx={{ fontSize: 18 }} />}
                tooltip="Print"
                onClick={onPrint}
              />

              <ActionButton
                icon={<ArchiveIcon sx={{ fontSize: 18 }} />}
                tooltip="Archive"
                onClick={onArchive}
              />

              <ActionButton
                icon={<DeleteIcon sx={{ fontSize: 18 }} />}
                tooltip="Delete"
                onClick={onDelete}
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
                    fontSize: '0.75rem',
                    backgroundColor: alpha(primaryColor(100), 0.7),
                    color: primaryColor(700),
                    borderColor: primaryColor(300)
                  }}
                />
              ))}

              <Typography variant="caption" sx={{ color: neutralColor(500), ml: 1 }}>
                <TimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                {formatDistanceToNow(new Date(conversation.date), { addSuffix: true })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <ActionButton
                icon={<ReplyIcon />}
                tooltip="Reply"
                variant="button"
                onClick={onReply}
              >
                Reply
              </ActionButton>

              <ActionButton
                icon={<ReplyAllIcon />}
                tooltip="Reply All"
                variant="button"
                onClick={onReplyAll}
              >
                Reply All
              </ActionButton>

              <ActionButton
                icon={<ForwardIcon />}
                tooltip="Forward"
                variant="button"
                onClick={onForward}
              >
                Forward
              </ActionButton>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Messages */}
      <BaseMessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoadingHistory={isLoading}
        emptyMessage="No messages in this conversation"
        themLabel={conversation.participants.join(', ')}
      />

      {/* Quick Reply Section */}
      {showQuickReply && quickReplyComponent && (
        <>
          <Divider />
          {quickReplyComponent}
        </>
      )}
    </Paper>
  );
};