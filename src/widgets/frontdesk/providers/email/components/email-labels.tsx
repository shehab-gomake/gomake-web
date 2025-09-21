import React from 'react';
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Badge,
  CircularProgress,
  Divider,
  Collapse,
  IconButton,
  alpha
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Send as SentIcon,
  Drafts as DraftsIcon,
  Delete as TrashIcon,
  Report as SpamIcon,
  Label as LabelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Archive as ArchiveIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailLabel } from "../types/email.types";

interface EmailLabelsProps {
  accountId?: string;
  labels: EmailLabel[];
  systemLabels: EmailLabel[];
  userLabels: EmailLabel[];
  selectedLabelId?: string | null;
  loading?: boolean;
  error?: string;
  onLabelSelect: (labelId: string | null) => void;
}

export const EmailLabels: React.FC<EmailLabelsProps> = ({
  accountId,
  labels,
  systemLabels,
  userLabels,
  selectedLabelId,
  loading = false,
  error,
  onLabelSelect,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [showUserLabels, setShowUserLabels] = React.useState(true);

  // Icon mapping for system labels
  const getSystemLabelIcon = (labelId: string, labelName: string) => {
    const lowerId = labelId.toLowerCase();
    const lowerName = labelName.toLowerCase();

    if (lowerId.includes('inbox') || lowerName.includes('inbox')) return InboxIcon;
    if (lowerId.includes('sent') || lowerName.includes('sent')) return SentIcon;
    if (lowerId.includes('draft') || lowerName.includes('draft')) return DraftsIcon;
    if (lowerId.includes('trash') || lowerName.includes('trash') || lowerName.includes('bin')) return TrashIcon;
    if (lowerId.includes('spam') || lowerName.includes('spam') || lowerName.includes('junk')) return SpamIcon;
    if (lowerId.includes('starred') || lowerName.includes('starred')) return StarIcon;
    if (lowerId.includes('archive') || lowerName.includes('archive')) return ArchiveIcon;

    return InboxIcon; // Default icon
  };

  const LabelListItem: React.FC<{ label: EmailLabel; isSystem?: boolean }> = ({ label, isSystem = false }) => {
    const isSelected = label.id === selectedLabelId;
    const IconComponent = isSystem ? getSystemLabelIcon(label.id, label.name) : LabelIcon;

    return (
      <ListItem disablePadding>
        <ListItemButton
          selected={isSelected}
          onClick={() => onLabelSelect(isSelected ? null : label.id)}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            py: 0.75,
            '&.Mui-selected': {
              backgroundColor: alpha(primaryColor(100), 0.8),
              borderLeft: `3px solid ${primaryColor(500)}`,
              '&:hover': {
                backgroundColor: alpha(primaryColor(100), 0.9),
              }
            },
            '&:hover': {
              backgroundColor: alpha(neutralColor(100), 0.5),
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <IconComponent
              sx={{
                fontSize: 16,
                color: isSelected ? primaryColor(600) : neutralColor(500)
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? primaryColor(700) : neutralColor(700),
                  }}
                  noWrap
                >
                  {label.name}
                </Typography>

                {label.unreadCount && label.unreadCount > 0 && (
                  <Badge
                    badgeContent={label.unreadCount > 99 ? '99+' : label.unreadCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: 16,
                        minWidth: 16,
                      }
                    }}
                  />
                )}
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  if (!accountId) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: neutralColor(500) }}>
          Select an account to view labels
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ color: neutralColor(600), mt: 1 }}>
          Loading labels...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          Failed to load labels
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 1 }}>
      {/* System Labels */}
      {systemLabels.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(600),
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 1,
              py: 0.5,
              display: 'block'
            }}
          >
            FOLDERS
          </Typography>
          <List dense sx={{ py: 0 }}>
            {systemLabels.map((label) => (
              <LabelListItem key={label.id} label={label} isSystem />
            ))}
          </List>
        </Box>
      )}

      {/* User Labels */}
      {userLabels.length > 0 && (
        <Box>
          {systemLabels.length > 0 && <Divider sx={{ my: 1 }} />}

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(600),
                fontWeight: 600,
                fontSize: '0.75rem',
                py: 0.5,
              }}
            >
              LABELS
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowUserLabels(!showUserLabels)}
              sx={{
                color: neutralColor(500),
                '&:hover': { color: neutralColor(700) }
              }}
            >
              {showUserLabels ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Stack>

          <Collapse in={showUserLabels}>
            <List dense sx={{ py: 0 }}>
              {userLabels.map((label) => (
                <LabelListItem key={label.id} label={label} />
              ))}
            </List>
          </Collapse>
        </Box>
      )}

      {labels.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: neutralColor(500) }}>
            No labels found
          </Typography>
        </Box>
      )}
    </Box>
  );
};