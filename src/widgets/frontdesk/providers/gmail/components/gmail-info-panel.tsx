import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface ContactInfo {
  name: string;
  email: string;
  company?: string;
  avatar?: string;
  isStarred?: boolean;
  totalEmails: number;
  firstContactDate: string;
  lastInteractionDate: string;
}

interface GmailInfoPanelProps {
  selectedEmail?: {
    from: string;
    subject: string;
    receivedAt: string;
  };
  onStar?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onMarkAsSpam?: () => void;
}

// Mock contact data - in real implementation this would come from Gmail API or contacts
const generateMockContact = (email: string): ContactInfo => {
  const domains = email.split('@')[1];
  const name = email.split('@')[0];

  // Generate mock data based on email
  const companies = ['Acme Corp', 'Tech Solutions Inc', 'Digital Agency Ltd', 'StartUp Co', 'Enterprise LLC'];
  const mockCompany = companies[Math.floor(Math.random() * companies.length)];

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' '),
    email: email,
    company: mockCompany,
    isStarred: Math.random() > 0.7,
    totalEmails: Math.floor(Math.random() * 50) + 1,
    firstContactDate: '2023-08-15',
    lastInteractionDate: '2024-01-15'
  };
};

export const GmailInfoPanel: React.FC<GmailInfoPanelProps> = ({
  selectedEmail,
  onStar,
  onArchive,
  onDelete,
  onMarkAsSpam
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  if (!selectedEmail) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          border: `1px solid ${neutralColor(200)}`,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 48, color: neutralColor(400), mb: 2 }} />
          <Typography variant="body2" sx={{ color: neutralColor(600) }}>
            Select an email to view contact details
          </Typography>
        </Box>
      </Paper>
    );
  }

  const mockContact = generateMockContact(selectedEmail.from);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const quickActions = [
    { icon: <StarIcon />, label: 'Star', onClick: onStar, color: mockContact.isStarred ? '#F59E0B' : neutralColor(500) },
    { icon: <ArchiveIcon />, label: 'Archive', onClick: onArchive, color: neutralColor(500) },
    { icon: <DeleteIcon />, label: 'Delete', onClick: onDelete, color: neutralColor(500) },
    { icon: <ReportIcon />, label: 'Spam', onClick: onMarkAsSpam, color: neutralColor(500) },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${neutralColor(200)}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#101828' }}>
            Contact Info
          </Typography>
          <IconButton size="small" sx={{ color: neutralColor(500) }}>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Contact Profile */}
      <Box sx={{ p: 3 }}>
        <Stack alignItems="center" spacing={2}>
          {/* Avatar */}
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: primaryColor(500),
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {getInitials(mockContact.name)}
          </Avatar>

          {/* Name and Email */}
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', textAlign: 'center' }}>
              {mockContact.name}
            </Typography>
            <Typography variant="body2" sx={{ color: neutralColor(600) }}>
              {mockContact.email}
            </Typography>
            {mockContact.company && (
              <Chip
                icon={<BusinessIcon sx={{ fontSize: 14 }} />}
                label={mockContact.company}
                size="small"
                variant="outlined"
                sx={{
                  mt: 1,
                  height: 24,
                  fontSize: '0.75rem',
                  borderColor: neutralColor(300),
                  color: neutralColor(700),
                }}
              />
            )}
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Contact Stats */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 2, fontSize: '0.75rem' }}>
          CONVERSATION HISTORY
        </Typography>

        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <EmailIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  {mockContact.totalEmails} emails exchanged
                </Typography>
              }
            />
          </ListItem>

          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  First contact: {new Date(mockContact.firstContactDate).toLocaleDateString()}
                </Typography>
              }
            />
          </ListItem>

          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  Last reply: {new Date(mockContact.lastInteractionDate).toLocaleDateString()}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Divider />

      {/* Quick Actions */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 2, fontSize: '0.75rem' }}>
          QUICK ACTIONS
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {quickActions.map((action, index) => (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                onClick={action.onClick}
                sx={{
                  color: action.color,
                  backgroundColor: `${action.color}08`,
                  border: `1px solid ${action.color}20`,
                  '&:hover': {
                    backgroundColor: `${action.color}15`,
                  },
                  width: 36,
                  height: 36,
                }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Additional Info */}
      <Box sx={{ mt: 'auto', p: 2, backgroundColor: neutralColor(25) }}>
        <Typography variant="caption" sx={{ color: neutralColor(500), fontStyle: 'italic' }}>
          Contact information is automatically generated based on email interactions
        </Typography>
      </Box>
    </Paper>
  );
};