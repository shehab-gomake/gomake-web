import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  AvatarGroup,
  Button,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Menu
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HistoryIcon from '@mui/icons-material/History';
import { TicketWithDetails } from '../types/api.types';
import { apiStatusToUi, apiPriorityToUi, getChannelIcon, getChannelColor } from '../types/transformers';
import { format, parseISO } from 'date-fns';
import { isApproachingSLA, isOverdueSLA } from '../utils/sla-helpers';
import {
  Chip,
  PriorityBadge,
  TicketTypeBadge,
  ChannelBadge,
  AttachmentCard,
  MessageCard,
  SystemEventMessage,
  MessageComposer,
  colorTokens,
  TagInput,
  TagList,
  PopularTags,
  QuickActionButton,
  QuickActionMenu,
  QuickActionItem,
} from '@/widgets/frontdesk/design-system';
import { Alert } from '@mui/material';
import { TicketTimeline } from './ticket-timeline';
import { RelatedTickets } from './related-tickets';
import { CustomerProfileSection } from './customer-profile-section';
import { useQuickActions } from '../hooks/use-quick-actions';
import { getGroupedActions, GROUP_LABELS } from '../utils/quick-actions-config';
import { InlineReplySection } from '@/widgets/frontdesk/components/shared/InlineReplySection';
import { MessageItem } from '@/widgets/frontdesk/components/shared/MessageItem';
import { ticketToUnified } from '@/widgets/frontdesk/utils/message-transformer';

interface TicketDetailViewProps {
  ticket: TicketWithDetails;
  onClose: () => void;
  /**
   * BREAKING CHANGE: onReply now requires conversationId
   * @param content - Reply message content
   * @param conversationId - Conversation ID (which channel/tab to reply on)
   */
  onReply?: (content: string, conversationId: string) => void;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
  onAddTags?: (tags: string[]) => void;
  onRemoveTag?: (tagId: string) => void;
  onSuggestTags?: (query: string) => Promise<any[]>;
  popularTags?: any[];
  ticketHistory?: any[];
  relatedTickets?: any[];
  onSelectRelatedTicket?: (ticketId: string) => void;
}

const formatDateTime = (dateString: string) => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
};

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  onClose,
  onReply,
  onStatusChange,
  onPriorityChange,
  onAddTags,
  onRemoveTag,
  onSuggestTags,
  popularTags = [],
  ticketHistory = [],
  relatedTickets = [],
  onSelectRelatedTicket,
}) => {
  const theme = useTheme();
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);
  const [quickActionsAnchor, setQuickActionsAnchor] = useState<null | HTMLElement>(null);
  const [activeView, setActiveView] = useState<'conversation' | 'objectives' | 'activity'>('conversation');
  const [conversationMinimized, setConversationMinimized] = useState(false);

  // Multi-conversation support: Track active conversation (tab)
  // Use conversations array if available, otherwise fall back to single conversation
  const conversations = ticket.conversations || (ticket.conversation ? [{
    ...ticket.conversation,
    channel: 'EMAIL' as any, // Default to EMAIL for old format
    provider: { id: '', vendor: '', type: 'EMAIL' },
    identifier: ticket.customerEmail || '',
    messageCount: ticket.conversation.messages?.length || 0,
  }] : []);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || ''
  );

  // Get active conversation based on selected tab
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Inline reply state - open by default for tickets
  const [showInlineReply, setShowInlineReply] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Quick Actions integration
  const { availableActions, hasCustomer, executeAction, getActionBlockReason } = useQuickActions({
    ticketId: ticket.id,
    customerId: ticket.customerId,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    customerPhone: ticket.customerPhone,
    onActionComplete: (actionType) => {
      console.log('[TicketDetailView] Quick action completed:', actionType);
    },
    onActionError: (actionType, error) => {
      console.error('[TicketDetailView] Quick action error:', actionType, error);
      // TODO: Show toast notification
      alert(`Cannot execute action: ${error}`);
    },
  });

  // Add defensive logging with multi-conversation support
  console.log('[TicketDetailView] Rendering ticket:', ticket.id, ticket.ticketNumber);
  console.log('[TicketDetailView] Conversations:', conversations.length);
  console.log('[TicketDetailView] Active conversation:', activeConversationId);
  console.log('[TicketDetailView] Active conversation messages:', activeConversation?.messages?.length || 0);

  // Backward compatibility check
  if (ticket.conversation && !ticket.conversations) {
    console.warn('[TicketDetailView] ⚠️ OLD FORMAT: ticket.conversation detected (no conversations array)');
  }

  const handleSendReply = (data: any) => {
    if (onReply && data.message && activeConversationId) {
      onReply(data.message, activeConversationId);
    }
  };

  // Inline reply handlers
  const handleCancelReply = () => {
    // Just clear the text, keep reply section open
    setReplyText("");
  };

  const handleSendInlineReply = async () => {
    if (!replyText.trim() || !onReply || !activeConversationId) {
      console.error('[TicketDetailView] Cannot send reply: missing reply text, onReply handler, or activeConversationId');
      return;
    }

    setIsSendingReply(true);
    try {
      console.log('[TicketDetailView] Sending reply to conversation:', activeConversationId);
      await onReply(replyText, activeConversationId);
      setReplyText("");
      setShowInlineReply(false);
    } catch (error) {
      console.error("[TicketDetailView] Failed to send reply:", error);
      // Keep reply open so user can retry
    } finally {
      setIsSendingReply(false);
    }
  };

  // Quick Actions menu helpers
  const groupedActions = getGroupedActions();
  const quickActionMenuItems: QuickActionItem[] = availableActions.map((action) => ({
    id: action.type,
    label: action.label,
    icon: action.icon,
    tooltip: action.tooltip,
    disabled: !!getActionBlockReason(action.type),
    disabledReason: getActionBlockReason(action.type) || undefined,
    group: action.group,
  }));

  const handleQuickActionClick = (action: QuickActionItem) => {
    executeAction(action.id as any);
  };

  // Convert UI status to backend status for display
  const uiStatus = apiStatusToUi(ticket.status);
  const uiPriority = apiPriorityToUi(ticket.priority);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Ticket meta info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TicketTypeBadge type={'Support'} size="sm" />
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontWeight: 600 }}>
                  #{ticket.ticketNumber}
                </Typography>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary }}>
                  · Created {formatDateTime(ticket.createdAt)}
                </Typography>
                {/* Origin Provider Channel Badge */}
                {ticket.originProviderChannel && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ChannelBadge
                      channel={ticket.originProviderChannel.type.toLowerCase() as any}
                      mode="both"
                      size="sm"
                    />
                    <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary }}>
                      · {ticket.originProviderChannel.identifier}
                    </Typography>
                  </Box>
                )}
                {/* SLA Warning */}
                {ticket.sla?.breached && (
                  <Chip
                    label="SLA Breached"
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: 10, fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.25rem' }}>
                {ticket.conversation?.name || `Ticket #${ticket.ticketNumber}`}
              </Typography>
              {/* Customer info */}
              {(ticket.customerName || ticket.customerEmail || ticket.customerPhone) && (
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary }}>
                  {ticket.customerName || ticket.customerEmail || ticket.customerPhone}
                </Typography>
              )}
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {/* Quick Actions Button */}
              <QuickActionButton
                size="sm"
                isOpen={Boolean(quickActionsAnchor)}
                onClick={(e) => setQuickActionsAnchor(e.currentTarget)}
              />

              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* View Toggle Tabs */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 2,
            py: 1,
            borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Button
            size="small"
            startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
            onClick={() => setActiveView('conversation')}
            sx={{
              textTransform: 'none',
              px: 2,
              py: 0.75,
              fontWeight: activeView === 'conversation' ? 600 : 400,
              color: activeView === 'conversation' ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
              backgroundColor: activeView === 'conversation' ? colorTokens.primary[50] : 'transparent',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: activeView === 'conversation' ? colorTokens.primary[100] : colorTokens.neutral[100],
              },
            }}
          >
            Conversation
          </Button>
          <Button
            size="small"
            startIcon={<AssignmentOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => setActiveView('objectives')}
            sx={{
              textTransform: 'none',
              px: 2,
              py: 0.75,
              fontWeight: activeView === 'objectives' ? 600 : 400,
              color: activeView === 'objectives' ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
              backgroundColor: activeView === 'objectives' ? colorTokens.primary[50] : 'transparent',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: activeView === 'objectives' ? colorTokens.primary[100] : colorTokens.neutral[100],
              },
            }}
          >
            Objectives & Details
          </Button>
          <Button
            size="small"
            startIcon={<HistoryIcon sx={{ fontSize: 18 }} />}
            onClick={() => setActiveView('activity')}
            sx={{
              textTransform: 'none',
              px: 2,
              py: 0.75,
              fontWeight: activeView === 'activity' ? 600 : 400,
              color: activeView === 'activity' ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
              backgroundColor: activeView === 'activity' ? colorTokens.primary[50] : 'transparent',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: activeView === 'activity' ? colorTokens.primary[100] : colorTokens.neutral[100],
              },
            }}
          >
            Activity History
          </Button>
        </Box>

        {/* Conversation Tabs - Multi-Channel Support */}
        {activeView === 'conversation' && conversations.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
              backgroundColor: theme.palette.background.paper,
              overflowX: 'auto',
            }}
          >
            {conversations.map((conversation) => {
              const channelIcon = getChannelIcon(conversation.channel || 'EMAIL');
              const isActive = conversation.id === activeConversationId;

              return (
                <Button
                  key={conversation.id}
                  size="small"
                  onClick={() => setActiveConversationId(conversation.id)}
                  sx={{
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? colorTokens.primary[700] : colorTokens.semantic.text.secondary,
                    backgroundColor: isActive ? colorTokens.primary[50] : 'transparent',
                    borderRadius: '8px',
                    border: `1px solid ${isActive ? colorTokens.primary[200] : 'transparent'}`,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: isActive ? colorTokens.primary[100] : colorTokens.neutral[100],
                    },
                  }}
                >
                  {channelIcon} {conversation.channel || 'Email'} ({conversation.messageCount || conversation.messages?.length || 0})
                </Button>
              );
            })}
          </Box>
        )}

        {/* Comments/Thread - Multi-Channel Timeline */}
        {activeView === 'conversation' && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: colorTokens.neutral[50]
            }}
          >
            {/* Collapsible Section Header */}
            {conversationMinimized && (
              <Box
                onClick={() => setConversationMinimized(false)}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: `1px solid ${colorTokens.semantic.border.default}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    backgroundColor: colorTokens.neutral[50],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: colorTokens.semantic.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {conversations.length > 1 ? `${conversations.length} Conversations` : 'Conversation'} ({activeConversation?.messages?.length || 0} messages)
                  </Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ color: colorTokens.semantic.text.secondary }} />
              </Box>
            )}

            {!conversationMinimized && (
              <Box>
                {/* Minimize Button */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    px: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colorTokens.semantic.text.secondary }}>
                    {conversations.length > 1
                      ? `${activeConversation?.channel || 'Email'} Conversation`
                      : 'Conversation Timeline'}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setConversationMinimized(true)}
                    title="Minimize conversation"
                  >
                    <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                {/* System Event: Ticket Created */}
                <SystemEventMessage
                  type="ticket.created"
                  timestamp={ticket.createdAt}
                  actor={{ name: ticket.customerName || ticket.customerEmail || 'Customer' }}
                />

                {/* Render messages from ACTIVE conversation only */}
                {activeConversation?.messages && Array.isArray(activeConversation.messages) && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((message, index) => {
                    // Defensive null checks for message
                    if (!message || !message.id) {
                      console.warn('[TicketDetailView] Skipping invalid message:', message);
                      return null;
                    }

                    // Transform ticket message to unified format
                    const unifiedMessage = ticketToUnified(message, ticket);

                    return (
                      <React.Fragment key={message.id}>
                        {/* Show assignment event if it's the first message */}
                        {index === 0 && ticket.assignee && (
                          <SystemEventMessage
                            type="ticket.assigned"
                            timestamp={message.createdAt}
                            actor={{ name: ticket.assignee.name }}
                          />
                        )}

                        {/* Show priority change event (example) */}
                        {index === 1 && (
                          <SystemEventMessage
                            type="ticket.priority.changed"
                            timestamp={message.createdAt}
                            actor={{ name: ticket.assignee?.name || 'System' }}
                            data={{
                              oldPriority: 'Low',
                              newPriority: ticket.priority as any,
                            }}
                          />
                        )}

                        {/* Unified Message Item */}
                        <MessageItem
                          message={unifiedMessage}
                          variant="ticket"
                          isLast={index === activeConversation.messages.length - 1}
                        />
                      </React.Fragment>
                    );
                  })
                ) : null}

                {(!activeConversation?.messages || activeConversation.messages.length === 0) && (
                  <Box sx={{ textAlign: 'center', py: 8, backgroundColor: 'white', borderRadius: '8px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      No messages yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add a reply to start the conversation
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Objectives & Details View */}
        {activeView === 'objectives' && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: colorTokens.neutral[50]
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: `1px solid ${colorTokens.semantic.border.default}`,
                p: 3,
              }}
            >
              {/* Ticket Description */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: '0.5px',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Description
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, color: colorTokens.semantic.text.primary }}>
                  {activeConversation?.messages?.[0]?.content || conversations[0]?.messages?.[0]?.content || 'No description available'}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Customer Information */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: '0.5px',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Customer
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {(ticket.customerName || ticket.customerEmail || 'C').charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14 }}>
                      {ticket.customerName || ticket.customerEmail || 'Unknown Customer'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 12 }}>
                      {ticket.customerEmail || ticket.customerPhone || 'No contact info'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Objectives / Goals */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: '0.5px',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Ticket Objectives
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 2,
                      backgroundColor: colorTokens.neutral[50],
                      borderRadius: '8px',
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: colorTokens.primary[600],
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.6 }}>
                      Resolve the customer's issue via {conversations.length > 1 ? 'multiple channels' : (activeConversation?.channel || 'email')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 2,
                      backgroundColor: colorTokens.neutral[50],
                      borderRadius: '8px',
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: colorTokens.primary[600],
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.6 }}>
                      Ensure customer satisfaction and provide follow-up documentation
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 2,
                      backgroundColor: colorTokens.neutral[50],
                      borderRadius: '8px',
                      border: `1px solid ${colorTokens.semantic.border.default}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: colorTokens.primary[600],
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.6 }}>
                      Close ticket within SLA timeframe ({ticket.priority} priority)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Success Criteria */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: '0.5px',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Success Criteria
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: colorTokens.success[50],
                    borderRadius: '8px',
                    border: `1px solid ${colorTokens.success[200]}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6, color: colorTokens.success[900] }}>
                    ✓ Customer confirms issue is resolved<br />
                    ✓ All technical steps documented in knowledge base<br />
                    ✓ Follow-up scheduled if necessary
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Activity History View */}
        {activeView === 'activity' && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: colorTokens.neutral[50]
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                px: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: colorTokens.primary[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 24, color: colorTokens.primary[600] }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: colorTokens.semantic.text.primary,
                      lineHeight: 1.2,
                    }}
                  >
                    Activity History
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.semantic.text.secondary,
                      fontSize: 13,
                    }}
                  >
                    {ticketHistory.length} {ticketHistory.length === 1 ? 'event' : 'events'} recorded
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Timeline Content */}
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: `1px solid ${colorTokens.semantic.border.default}`,
                p: 4,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <TicketTimeline history={ticketHistory} />
            </Box>
          </Box>
        )}

        {/* Inline Reply Section - Always visible in Conversation view */}
        {activeView === 'conversation' && !conversationMinimized && (
          <InlineReplySection
            title="Reply to Ticket"
            replyText={replyText}
            isSending={isSendingReply}
            onReplyTextChange={setReplyText}
            onSend={handleSendInlineReply}
            onCancel={handleCancelReply}
          />
        )}
      </Box>

      {/* Right Sidebar - Metadata */}
      <Box
        sx={{
          width: 280,
          minWidth: 280,
          borderLeft: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'auto',
          p: 2
        }}
      >
        {/* Customer Profile Section */}
        <CustomerProfileSection
          customerId={ticket.customerId}
          customerName={ticket.customerName}
          customerEmail={ticket.customerEmail}
          customerPhone={ticket.customerPhone}
          onCustomerLinked={(customerId) => {
            // TODO: Update ticket with linked customer ID
            console.log('Customer linked:', customerId);
          }}
        />

        {/* Created By */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Created By
          </Typography>
          {ticket.creator ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
              <Avatar sx={{ width: 32, height: 32 }}>{ticket.creator.name.charAt(0)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>{ticket.creator.name}</Typography>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>{ticket.creator.email}</Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary }}>
              Unknown
            </Typography>
          )}
        </Box>

        {/* Status */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Status
          </Typography>
          <Box
            onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: '6px',
              border: `1px solid ${colorTokens.semantic.border.default}`,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: colorTokens.neutral[100],
              }
            }}
          >
            <Chip
              label={uiStatus}
              color={uiStatus === 'New' ? 'primary' : uiStatus === 'Active' ? 'warning' : uiStatus === 'Resolved' ? 'success' : uiStatus === 'On Hold' ? 'error' : 'neutral'}
              variant="soft"
              size="small"
              sx={{
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Priority */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Priority
          </Typography>
          <Box
            onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: '6px',
              border: `1px solid ${colorTokens.semantic.border.default}`,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: colorTokens.neutral[100],
              }
            }}
          >
            <PriorityBadge priority={uiPriority as 'Urgent' | 'High' | 'Medium' | 'Low'} mode="both" size="sm" showBackground={false} />
          </Box>
        </Box>

        {/* Assigned To */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Assigned To
          </Typography>
          {ticket.assignee ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
              <Avatar sx={{ width: 32, height: 32 }}>{ticket.assignee.name.charAt(0)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>{ticket.assignee.name}</Typography>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>{ticket.assignee.email}</Typography>

                {/* Self-assigned badge */}
                {ticket.assigneeId === ticket.createdBy && (
                  <Chip
                    label="Self-assigned"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      mt: 0.5,
                      backgroundColor: colorTokens.primary[100],
                      color: colorTokens.primary[700],
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>
            </Box>
          ) : (
            <Button variant="outlined" size="small" fullWidth sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
              Assign to someone
            </Button>
          )}
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Tags
          </Typography>

          <Box sx={{ p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
            {/* Popular Tags Quick-Add */}
            {onAddTags && popularTags && Array.isArray(popularTags) && popularTags.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <PopularTags
                  tags={popularTags}
                  selectedTags={Array.isArray(ticket.tags) ? ticket.tags : []}
                  onTagClick={(tagName) => {
                    if (onAddTags) {
                      onAddTags([tagName]);
                    }
                  }}
                  maxDisplay={6}
                  showTitle={true}
                />
              </Box>
            )}

            {/* Show existing tags */}
            {ticket.tags && Array.isArray(ticket.tags) && ticket.tags.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                <TagList
                  tags={ticket.tags}
                  onRemoveTag={onRemoveTag}
                  size="small"
                  variant="filled"
                />
              </Box>
            )}

            {/* Always-Visible Tag Input */}
            {onAddTags && onSuggestTags && (
              <TagInput
                tags={Array.isArray(ticket.tags) ? ticket.tags : []}
                onSuggest={onSuggestTags}
                onAdd={(tagNames) => {
                  onAddTags(tagNames);
                }}
                onRemove={(tagId) => {
                  if (onRemoveTag) onRemoveTag(tagId);
                }}
                popularTags={popularTags}
                maxTags={10}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Expandable Sections */}
        <Accordion elevation={0} defaultExpanded={false} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              TASKS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: 13 }}>
                No tasks yet
              </Typography>
              <Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>
                Add Task
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Customer History - Show Previous Tickets */}
        <Accordion elevation={0} defaultExpanded={relatedTickets.length > 0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                CUSTOMER HISTORY
              </Typography>
              {relatedTickets.length > 0 && (
                <Box
                  sx={{
                    backgroundColor: colorTokens.primary[100],
                    color: colorTokens.primary[800],
                    borderRadius: '10px',
                    px: 0.75,
                    py: 0.25,
                    fontSize: 10,
                    fontWeight: 600,
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {relatedTickets.length}
                </Box>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <RelatedTickets
              relatedTickets={relatedTickets}
              onTicketClick={onSelectRelatedTicket}
              maxDisplay={5}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} defaultExpanded={0 > 0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                LINKED TICKETS
              </Typography>
              {0 > 0 && (
                <Box
                  sx={{
                    backgroundColor: colorTokens.primary[100],
                    color: colorTokens.primary[800],
                    borderRadius: '10px',
                    px: 0.75,
                    py: 0.25,
                    fontSize: 10,
                    fontWeight: 600,
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {0}
                </Box>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {0 > 0 ? (
              [].map((link) => (
                <Box key={link.id} sx={{ mb: 1.5, p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
                  <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>
                    {link.relationship}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: 13 }}>{link.title}</Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: 13 }}>
                  No linked tickets
                </Typography>
                <Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>
                  Link Ticket
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

      </Box>

      {/* Quick Actions Menu */}
      <QuickActionMenu
        anchorEl={quickActionsAnchor}
        open={Boolean(quickActionsAnchor)}
        onClose={() => setQuickActionsAnchor(null)}
        actions={quickActionMenuItems}
        groupLabels={GROUP_LABELS}
        onActionClick={handleQuickActionClick}
      />

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (onStatusChange) {
              onStatusChange('OPEN');
            }
            setStatusMenuAnchor(null);
          }}
        >
          {apiStatusToUi('OPEN')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onStatusChange) {
              onStatusChange('IN_PROGRESS');
            }
            setStatusMenuAnchor(null);
          }}
        >
          {apiStatusToUi('IN_PROGRESS')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onStatusChange) {
              onStatusChange('PENDING');
            }
            setStatusMenuAnchor(null);
          }}
        >
          {apiStatusToUi('PENDING')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onStatusChange) {
              onStatusChange('RESOLVED');
            }
            setStatusMenuAnchor(null);
          }}
        >
          {apiStatusToUi('RESOLVED')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onStatusChange) {
              onStatusChange('CLOSED');
            }
            setStatusMenuAnchor(null);
          }}
        >
          {apiStatusToUi('CLOSED')}
        </MenuItem>
      </Menu>

      {/* Priority Menu */}
      <Menu
        anchorEl={priorityMenuAnchor}
        open={Boolean(priorityMenuAnchor)}
        onClose={() => setPriorityMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (onPriorityChange) {
              onPriorityChange('LOW');
            }
            setPriorityMenuAnchor(null);
          }}
        >
          🟢 Low
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onPriorityChange) {
              onPriorityChange('MEDIUM');
            }
            setPriorityMenuAnchor(null);
          }}
        >
          🟡 Medium
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onPriorityChange) {
              onPriorityChange('HIGH');
            }
            setPriorityMenuAnchor(null);
          }}
        >
          🟠 High
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (onPriorityChange) {
              onPriorityChange('URGENT');
            }
            setPriorityMenuAnchor(null);
          }}
        >
          🔴 Urgent
        </MenuItem>
      </Menu>
    </Box>
  );
};