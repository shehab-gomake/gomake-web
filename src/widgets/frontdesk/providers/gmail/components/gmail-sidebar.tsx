import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  IconButton,
  Collapse,
  Stack
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Send as SentIcon,
  Drafts as DraftsIcon,
  Star as StarredIcon,
  Report as SpamIcon,
  Delete as TrashIcon,
  Label as LabelIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon
} from '@mui/icons-material';

interface GmailFolder {
  id: string;
  name: string;
  icon: React.ReactNode;
  unreadCount?: number;
  type: 'system' | 'label';
}

interface GmailSidebarProps {
  activeFolderId: string | null;
  onFolderSelect: (folderId: string) => void;
  onSettingsClick?: () => void;
}

const systemFolders: GmailFolder[] = [
  { id: 'INBOX', name: 'Inbox', icon: <InboxIcon />, type: 'system', unreadCount: 5 },
  { id: 'STARRED', name: 'Starred', icon: <StarredIcon />, type: 'system' },
  { id: 'SENT', name: 'Sent', icon: <SentIcon />, type: 'system' },
  { id: 'DRAFTS', name: 'Drafts', icon: <DraftsIcon />, type: 'system', unreadCount: 2 },
  { id: 'SPAM', name: 'Spam', icon: <SpamIcon />, type: 'system' },
  { id: 'TRASH', name: 'Trash', icon: <TrashIcon />, type: 'system' },
];

// Mock labels - in real implementation these would come from Gmail API
const mockLabels: GmailFolder[] = [
  { id: 'LABEL_WORK', name: 'Work', icon: <LabelIcon />, type: 'label', unreadCount: 3 },
  { id: 'LABEL_PERSONAL', name: 'Personal', icon: <LabelIcon />, type: 'label' },
  { id: 'LABEL_URGENT', name: 'Urgent', icon: <LabelIcon />, type: 'label', unreadCount: 1 },
];

export const GmailSidebar: React.FC<GmailSidebarProps> = ({
  activeFolderId,
  onFolderSelect,
  onSettingsClick
}) => {
  const [labelsExpanded, setLabelsExpanded] = useState(true);

  const renderFolderItem = (folder: GmailFolder) => (
    <ListItem key={folder.id} sx={{ py: 0, px: 1 }}>
      <ListItemButton
        selected={activeFolderId === folder.id}
        onClick={() => onFolderSelect(folder.id)}
        sx={{
          borderRadius: 1,
          mx: 1,
          '&.Mui-selected': {
            backgroundColor: '#F3F4F6',
            '&:hover': {
              backgroundColor: '#E5E7EB',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: '#6B7280' }}>
          {folder.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                {folder.name}
              </Typography>
              {folder.unreadCount && folder.unreadCount > 0 && (
                <Badge
                  badgeContent={folder.unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.625rem',
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                />
              )}
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #EAECF0',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #EAECF0' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#101828' }}>
            Gmail
          </Typography>
          <IconButton
            size="small"
            onClick={onSettingsClick}
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Folder List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* System Folders */}
        <List dense sx={{ py: 1 }}>
          {systemFolders.map(renderFolderItem)}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Labels Section */}
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 2, py: 1 }}>
            <ListItemButton
              onClick={() => setLabelsExpanded(!labelsExpanded)}
              sx={{ p: 0, minHeight: 'auto' }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem' }}>
                    LABELS
                  </Typography>
                }
              />
              {labelsExpanded ? (
                <ExpandLess sx={{ fontSize: 16, color: '#6B7280' }} />
              ) : (
                <ExpandMore sx={{ fontSize: 16, color: '#6B7280' }} />
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={labelsExpanded}>
            {mockLabels.map(renderFolderItem)}

            {/* Add Label Button */}
            <ListItem sx={{ py: 0, px: 1 }}>
              <ListItemButton
                onClick={() => {/* TODO: Open label creation modal */}}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  color: '#6B7280',
                  '&:hover': {
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Create Label
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </Collapse>
        </List>
      </Box>
    </Paper>
  );
};