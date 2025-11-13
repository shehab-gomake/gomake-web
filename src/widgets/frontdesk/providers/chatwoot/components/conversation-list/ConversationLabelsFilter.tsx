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
  Divider,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { useChatwootLabels } from '../../hooks/use-chatwoot-labels';
import { useChatwootPermissions } from '../../hooks/use-chatwoot-permissions';
import { SETTINGS_PERMISSIONS } from '../../constants/permissions.constants';
import { AddEditLabelModal } from '../settings/add-edit-label-modal';
import type { ConversationListParams } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { CreateLabelPayload } from '@/services/frontdesk/api/chatwoot';

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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { labels: allLabels = [], loading: labelsLoading, createLabel } = useChatwootLabels(accountId ?? undefined, !!accountId);
  const { canAccess } = useChatwootPermissions();

  // Check if user can manage labels (admin only)
  const canManageLabels = canAccess(SETTINGS_PERMISSIONS.labels);

  // Filter labels to only show those with show_on_sidebar enabled (with safety check)
  const sidebarLabels = (Array.isArray(allLabels) ? allLabels : []).filter(label => label.show_on_sidebar === true);

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

  // Handle create label
  const handleCreateLabel = async (payload: CreateLabelPayload) => {
    try {
      await createLabel(payload);
      setCreateModalOpen(false);
      // New label will automatically appear in the list via recoil state update
    } catch (error) {
      // Error is handled by the modal
      console.error('[ConversationLabelsFilter] Failed to create label:', error);
    }
  };

  // Don't render if no sidebar labels and user can't create new ones
  if (sidebarLabels.length === 0 && !canManageLabels) {
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
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: neutralColor(900),
            },
            width: 28,
            height: 28,
            padding: 0.5,
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Badge
            badgeContent={selectedLabels.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 14,
                minWidth: 14,
                backgroundColor: primaryColor(600),
              },
            }}
          >
            <LabelIcon sx={{ fontSize: 16 }} />
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
        {sidebarLabels.length > 0 ? (
          sidebarLabels.map(label => {
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
          })
        ) : (
          /* Empty State - No Sidebar Labels */
          <Box
            sx={{
              px: 3,
              py: 3,
              textAlign: 'center',
            }}
          >
            <LabelIcon
              sx={{
                fontSize: 48,
                color: neutralColor(300),
                mb: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: neutralColor(600),
                fontSize: '0.875rem',
                mb: 0.5,
              }}
            >
              No labels with sidebar enabled
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(500),
                fontSize: '0.75rem',
              }}
            >
              {canManageLabels
                ? 'Create a label and enable "Show on sidebar"'
                : 'Ask an admin to create sidebar labels'}
            </Typography>
          </Box>
        )}

        {/* Clear All Option */}
        {selectedLabels.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
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

        {/* Add Label Option - Admin Only */}
        {canManageLabels && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setCreateModalOpen(true);
              }}
              sx={{
                px: 2,
                py: 1,
                color: primaryColor(600),
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                '&:hover': {
                  backgroundColor: primaryColor(50),
                },
              }}
            >
              <AddIcon fontSize="small" />
              Add New Label
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Create Label Modal - Admin Only */}
      {canManageLabels && (
        <AddEditLabelModal
          open={createModalOpen}
          label={null}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateLabel}
          onUpdate={async () => {}} // Not used for creation
          loading={labelsLoading}
        />
      )}
    </>
  );
};
