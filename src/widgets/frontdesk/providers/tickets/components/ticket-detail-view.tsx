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
  Chip,
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
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {ticket.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {ticket.ticketNumber}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {ticket.id.startsWith('1') ? `(${ticket.id})` : ''}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  | Created {formatDateTime(ticket.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <EmailIcon fontSize="small" />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                <Typography variant="caption">{ticket.viewCount}</Typography>
              </Box>
              <IconButton size="small" onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>

              {/* Participants */}
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                {ticket.participants.map((participant) => (
                  <Avatar key={participant.userId} alt={participant.name} src={participant.avatarUrl}>
                    {participant.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>

              {/* Status Dropdown */}
              <Button
                variant="outlined"
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                sx={{
                  borderColor: '#3B82F6',
                  color: '#1E40AF',
                  backgroundColor: '#DBEAFE',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    backgroundColor: '#BFDBFE'
                  }
                }}
              >
                {ticket.status}
              </Button>

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
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {/* Recipient */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              To:
            </Typography>
            <Chip
              avatar={<Avatar sx={{ width: 20, height: 20 }}>A</Avatar>}
              label={`Allison Westervelt <awestervelt@email.com>`}
              size="small"
              onDelete={() => {}}
              sx={{ height: 24 }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 'auto', cursor: 'pointer' }}>
              Cc
            </Typography>
          </Box>

          {/* Text Editor */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white'
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

        {/* Comments/Thread */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {ticket.comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }}>{comment.author.name.charAt(0)}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comment.author.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      To {ticket.reporter.name} &lt;{ticket.reporter.email}&gt;
                    </Typography>
                    <IconButton size="small" sx={{ ml: 'auto' }}>
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1 }}>
                    {formatDateTime(comment.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {comment.content}
                  </Typography>
                  {comment.attachments && comment.attachments.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {comment.attachments.map((attachment) => (
                        <Paper
                          key={attachment.id}
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 120,
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              backgroundColor: theme.palette.grey[200],
                              borderRadius: 1,
                              mb: 1
                            }}
                          />
                          <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.688rem' }}>
                            {attachment.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.625rem' }}>
                            {attachment.uploadedAt.split('T')[0]}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}

          {ticket.comments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No comments yet. Add a reply to start the conversation.
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Priority
          </Typography>
          <FormControl fullWidth size="small">
            <Select value={ticket.priority}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Assigned To */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Assigned To
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={ticket.assignedTo?.userId || ''}
              renderValue={() => ticket.assignedTo?.name || 'Unassigned'}
            >
              {ticket.participants.map((p) => (
                <MenuItem key={p.userId} value={p.userId}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {ticket.assignedTo && (
            <Button size="small" sx={{ mt: 0.5, textTransform: 'none' }}>
              Assign to me
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5, display: 'block' }}>
            Reporter
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 28, height: 28 }}>{ticket.reporter.name.charAt(0)}</Avatar>
            <Typography variant="body2">{ticket.reporter.name}</Typography>
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

        <Divider sx={{ my: 2 }} />

        {/* Expandable Sections */}
        <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              TASKS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              No tasks
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              COLLECTED FIELDS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              No collected fields
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                LINKED TICKETS
              </Typography>
              {ticket.linkedTickets.length > 0 && (
                <Chip label={ticket.linkedTickets.length} size="small" sx={{ height: 20, fontSize: '0.688rem' }} />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {ticket.linkedTickets.length > 0 ? (
              ticket.linkedTickets.map((link) => (
                <Box key={link.id} sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {link.relationship}
                  </Typography>
                  <Typography variant="body2">{link.title}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No linked tickets
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              HISTORY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              No history
            </Typography>
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