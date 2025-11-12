/**
 * Conversation Labels Filter Menu
 *
 * Button with dropdown menu that displays labels with show_on_sidebar enabled
 * and allows filtering conversations by labels.
 * Uses AND logic: selecting multiple labels shows conversations with ALL labels.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import CheckIcon from '@mui/icons-material/Check';
import { useChatwootLabels } from '../../hooks/use-chatwoot-labels';
import type { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

interface ConversationLabelsFilterProps {
  accountId: number | null;
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  onLabelClick?: () => void;
  primaryColor: (shade: number) => string;
  neutralColor: (shade: number) => string;
}

export const ConversationLabelsFilter: React.FC<ConversationLabelsFilterProps> = ({
  accountId,
  filters,
  onFiltersChange,
  onLabelClick,
  primaryColor,
  neutralColor,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const { labels: allLabels = [] } = useChatwootLabels(accountId ?? undefined, !!accountId);

  // Filter labels to only show those with show_on_sidebar enabled
  const sidebarLabels = allLabels.filter(label => label.show_on_sidebar === true);

  // Get currently selected labels from filters (ensure it's always an array)
  const selectedLabels: string[] = Array.isArray(filters.labels)
    ? filters.labels
    : filters.labels
    ? [filters.labels]
    : [];

  // Toggle label selection (AND logic)
  const handleLabelToggle = (labelTitle: string) => {
    const isSelected = selectedLabels.includes(labelTitle);

    let newLabels: string[];
    if (isSelected) {
      // Remove label from filter
      newLabels = selectedLabels.filter(l => l !== labelTitle);
    } else {
      // Add label to filter (AND logic)
      newLabels = [...selectedLabels, labelTitle];
    }

    // Update filters
    onFiltersChange({
      ...filters,
      labels: newLabels.length > 0 ? newLabels : undefined,
      page: 1, // Reset to first page when filters change
    });

    // Don't close menu - allow multiple selections
  };

  // Don't render if no sidebar labels
  if (sidebarLabels.length === 0) {
    return null;
  }

  return (
    <>
      {/* Labels Button */}
      <Tooltip title="Filter by Labels">
        <IconButton
          size="small"
          onClick={(e) => {
            setMenuAnchor(e.currentTarget);
            onLabelClick?.();
          }}
          sx={{
            color: neutralColor(600),
            backgroundColor: neutralColor(100),
            "&:hover": {
              backgroundColor: neutralColor(200),
              boxShadow: `0 2px 8px ${neutralColor(300)}`,
            },
            width: 36,
            height: 36,
            transition: "all 0.2s ease-in-out",
            boxShadow: `0 1px 3px ${neutralColor(200)}`,
          }}
        >
          <Badge
            badgeContent={selectedLabels.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.65rem',
                height: 16,
                minWidth: 16,
                backgroundColor: primaryColor(600),
              },
            }}
          >
            <LabelIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Labels Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 260,
            maxWidth: 320,
            backgroundColor: neutralColor(0),
            border: `1px solid ${neutralColor(200)}`,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            maxHeight: 400,
            overflow: "auto",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.688rem",
              fontWeight: 600,
              color: neutralColor(500),
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Filter by Labels (AND)
          </Typography>
        </Box>

        {/* Label Items */}
        {sidebarLabels.map(label => {
          const isSelected = selectedLabels.includes(label.title);

          return (
            <MenuItem
              key={label.id}
              onClick={() => handleLabelToggle(label.title)}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: isSelected ? `${label.color}08` : 'transparent',
                '&:hover': {
                  backgroundColor: isSelected ? `${label.color}15` : neutralColor(50),
                },
              }}
            >
              {/* Color Indicator */}
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: label.color,
                    border: `2px solid ${label.color}`,
                    boxShadow: isSelected ? `0 0 8px ${label.color}60` : 'none',
                  }}
                />
              </ListItemIcon>

              {/* Label Title */}
              <ListItemText
                primary={label.title}
                secondary={label.description}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: neutralColor(900),
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                  color: neutralColor(600),
                  noWrap: true,
                }}
              />

              {/* Selected Indicator */}
              {isSelected && (
                <CheckIcon
                  sx={{
                    fontSize: 18,
                    color: label.color,
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          );
        })}

        {/* Clear All Option */}
        {selectedLabels.length > 0 && (
          <>
            <Box sx={{ mx: 2, my: 1, borderTop: `1px solid ${neutralColor(200)}` }} />
            <MenuItem
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  labels: undefined,
                  page: 1,
                });
                setMenuAnchor(null);
              }}
              sx={{
                px: 2,
                py: 1,
                color: primaryColor(600),
                fontWeight: 600,
                fontSize: "0.875rem",
                justifyContent: "center",
              }}
            >
              Clear All Labels
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
