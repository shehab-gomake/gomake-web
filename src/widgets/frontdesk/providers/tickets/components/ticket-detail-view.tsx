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
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { Ticket, TicketComment } from '../types/ticket.types';
import { format, parseISO } from 'date-fns';
import {
  Chip,
  PriorityBadge,
  TicketTypeBadge,
  AttachmentCard,
  MessageCard,
  colorTokens
} from '@/widgets/frontdesk/design-system';

interface TicketDetailViewProps {
  ticket: Ticket;
  onClose: () => void;
}

const formatDateTime = (dateString: string) => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
};

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

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
                <TicketTypeBadge type={ticket.type as 'Bug' | 'Feature' | 'Task' | 'Support'} size="sm" />
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontWeight: 600 }}>
                  {ticket.ticketNumber}
                </Typography>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary }}>
                  · Created {formatDateTime(ticket.createdAt)}
                </Typography>
              </Box>

              {/* Title */}
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.25rem' }}>
                {ticket.title}
              </Typography>
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <IconButton size="small" title="Send email notification">
                <EmailIcon fontSize="small" />
              </IconButton>

              <IconButton size="small" onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>

              {/* Status Chip */}
              <Box
                onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                sx={{ cursor: 'pointer' }}
              >
                <Chip
                  label={ticket.status}
                  color={ticket.status === 'To Do' ? 'primary' : ticket.status === 'In Progress' ? 'warning' : ticket.status === 'Done' ? 'success' : 'error'}
                  variant="soft"
                  size="small"
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              </Box>

              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Reply Tabs */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Public Reply" />
            <Tab label="Private Comment" />
          </Tabs>
        </Box>

        {/* Reply Composer */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {/* Text Editor */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={activeTab === 0 ? "Write a public reply..." : "Add a private comment..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                fontSize: 14,
              }
            }}
          />

          {/* Toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small">
                <FormatBoldIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <FormatItalicIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <FormatUnderlinedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <InsertLinkIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <AttachFileIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <InsertPhotoIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <CodeIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <FormatQuoteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button variant="text" size="small">
                Add to KB
              </Button>
              <Button
                variant="contained"
                size="small"
                endIcon={<SendIcon />}
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Comments/Thread - Multi-Channel Timeline */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            backgroundColor: colorTokens.neutral[50]
          }}
        >
          {ticket.comments.map((comment) => (
            <MessageCard
              key={comment.id}
              id={comment.id}
              channel={(comment.channel || 'email') as any}
              direction={(comment.direction || 'inbound') as any}
              status={comment.status as any}
              author={{
                name: comment.author.name,
                email: comment.author.email,
                avatarUrl: comment.author.avatarUrl,
              }}
              content={comment.content}
              timestamp={comment.createdAt}
              attachments={comment.attachments}
              isPrivate={comment.isPrivate}
            />
          ))}

          {ticket.comments.length === 0 && (
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
        {/* Priority */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Priority
          </Typography>
          <Box
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
            <PriorityBadge priority={ticket.priority as 'Urgent' | 'High' | 'Medium' | 'Low'} mode="both" size="sm" showBackground={false} />
          </Box>
        </Box>

        {/* Assigned To */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Assigned To
          </Typography>
          {ticket.assignedTo ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
              <Avatar sx={{ width: 32, height: 32 }}>{ticket.assignedTo.name.charAt(0)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>{ticket.assignedTo.name}</Typography>
                <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>{ticket.assignedTo.email}</Typography>
              </Box>
            </Box>
          ) : (
            <Button variant="outlined" size="small" fullWidth sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
              Assign to someone
            </Button>
          )}
        </Box>

        {/* Project */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Project
          </Typography>
          <FormControl fullWidth size="small">
            <Select value={ticket.project}>
              <MenuItem value="Administrative">Administrative</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Documentation">Documentation</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Ticket Type */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Ticket Type
          </Typography>
          <FormControl fullWidth size="small">
            <Select value={ticket.type}>
              <MenuItem value="Task">Task</MenuItem>
              <MenuItem value="Bug">Bug</MenuItem>
              <MenuItem value="Feature">Feature</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Due Date */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Due Date
          </Typography>
          <TextField fullWidth size="small" type="date" value={ticket.dueDate ? ticket.dueDate.split('T')[0] : ''} />
        </Box>

        {/* Reporter */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Reporter
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, backgroundColor: colorTokens.neutral[50], borderRadius: '6px', border: `1px solid ${colorTokens.semantic.border.default}` }}>
            <Avatar sx={{ width: 32, height: 32 }}>{ticket.reporter.name.charAt(0)}</Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>{ticket.reporter.name}</Typography>
              <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 11 }}>{ticket.reporter.email}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Tags
          </Typography>
          <Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>
            Add Tag
          </Button>
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

        <Accordion elevation={0} defaultExpanded={false} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              COLLECTED FIELDS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                No custom fields
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} defaultExpanded={ticket.linkedTickets.length > 0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
                LINKED TICKETS
              </Typography>
              {ticket.linkedTickets.length > 0 && (
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
                  {ticket.linkedTickets.length}
                </Box>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {ticket.linkedTickets.length > 0 ? (
              ticket.linkedTickets.map((link) => (
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

        <Accordion elevation={0} defaultExpanded={false} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11, color: colorTokens.semantic.text.secondary }}>
              HISTORY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                No activity yet
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* More Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={() => setMoreMenuAnchor(null)}
      >
        <MenuItem>Print</MenuItem>
        <MenuItem>Export</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
      >
        <MenuItem>To Do</MenuItem>
        <MenuItem>In Progress</MenuItem>
        <MenuItem>Done</MenuItem>
        <MenuItem>Blocked</MenuItem>
      </Menu>
    </Box>
  );
};