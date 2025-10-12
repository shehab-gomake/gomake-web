import React, { useState, useEffect } from 'react';
import { IconButton, Badge, MenuItem, ListItemText, Box, Typography, Button, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CircleIcon from '@mui/icons-material/Circle';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { TicketFilters, TicketStatus, TicketPriority, Tag } from '../types/api.types';
import { formatTicketStatus } from '../types/transformers';
import { DropdownMenu, MenuSubheader } from '@/widgets/frontdesk/components/dropdown-menu';
import { Chip, colorTokens } from '@/widgets/frontdesk/design-system';

interface TicketFiltersMenuProps {
  filters: TicketFilters;
  onApply: (filters: Partial<TicketFilters>) => void;
  onClear: () => void;
  activeFilterCount: number;
  popularTags?: Tag[];
  onFetchPopularTags?: () => void;
}

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'REOPENED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// Status colors
const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: colorTokens.info[600],
  IN_PROGRESS: colorTokens.warning[600],
  PENDING: colorTokens.warning[600],
  RESOLVED: colorTokens.success[600],
  CLOSED: colorTokens.neutral[600],
  REOPENED: colorTokens.error[600],
};

// Priority colors
const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: colorTokens.neutral[600],
  MEDIUM: colorTokens.info[600],
  HIGH: colorTokens.warning[600],
  URGENT: colorTokens.error[600],
};

export const TicketFiltersMenu: React.FC<TicketFiltersMenuProps> = ({
  filters,
  onApply,
  onClear,
  activeFilterCount,
  popularTags = [],
  onFetchPopularTags,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(filters.status);
  const [priority, setPriority] = useState(filters.priority);
  const [tags, setTags] = useState(filters.tags || []);

  // Fetch popular tags when menu opens
  useEffect(() => {
    if (anchorEl && onFetchPopularTags && popularTags.length === 0) {
      onFetchPopularTags();
    }
  }, [anchorEl, onFetchPopularTags, popularTags.length]);

  useEffect(() => {
    if (anchorEl) {
      setStatus(filters.status);
      setPriority(filters.priority);
      setTags(filters.tags || []);
    }
  }, [anchorEl, filters]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: TicketStatus | undefined) => {
    setStatus(newStatus);
    // Apply immediately
    onApply({ status: newStatus, priority, tags: tags.length > 0 ? tags : undefined });
  };

  const handlePriorityChange = (newPriority: TicketPriority | undefined) => {
    setPriority(newPriority);
    // Apply immediately
    onApply({ status, priority: newPriority, tags: tags.length > 0 ? tags : undefined });
  };

  const handleToggleTag = (tagName: string) => {
    const newTags = tags.includes(tagName)
      ? tags.filter((t) => t !== tagName)
      : [...tags, tagName];

    setTags(newTags);
    // Apply immediately
    onApply({ status, priority, tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleClearAll = () => {
    setStatus(undefined);
    setPriority(undefined);
    setTags([]);
    onClear();
  };

  const hasActiveFilters = status !== undefined || priority !== undefined || tags.length > 0;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="Filter tickets"
        sx={{
          color: colorTokens.semantic.text.secondary,
          '&:hover': {
            backgroundColor: colorTokens.neutral[100],
          },
        }}
      >
        <Badge badgeContent={activeFilterCount} color="primary">
          <FilterListIcon fontSize="small" />
        </Badge>
      </IconButton>

      <DropdownMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        width={280}
      >
        {/* Status Section */}
        <Box sx={{ mb: 2 }}>
          <MenuSubheader>STATUS</MenuSubheader>

          {/* All Statuses Option */}
          <MenuItem
            onClick={() => handleStatusChange(undefined)}
            sx={{
              py: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {status === undefined ? (
              <RadioButtonCheckedIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
            )}
            <ListItemText
              primary="All Statuses"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: status === undefined ? 600 : 400,
              }}
            />
          </MenuItem>

          {/* Individual Status Options */}
          {STATUSES.map((s) => {
            const isSelected = status === s;
            return (
              <MenuItem
                key={s}
                onClick={() => handleStatusChange(s)}
                sx={{
                  py: 1,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {isSelected ? (
                  <RadioButtonCheckedIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
                )}
                <CircleIcon sx={{ fontSize: 8, color: STATUS_COLORS[s] }} />
                <ListItemText
                  primary={formatTicketStatus(s)}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                />
              </MenuItem>
            );
          })}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Priority Section */}
        <Box sx={{ mb: 2 }}>
          <MenuSubheader>PRIORITY</MenuSubheader>

          {/* All Priorities Option */}
          <MenuItem
            onClick={() => handlePriorityChange(undefined)}
            sx={{
              py: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {priority === undefined ? (
              <RadioButtonCheckedIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
            )}
            <ListItemText
              primary="All Priorities"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: priority === undefined ? 600 : 400,
              }}
            />
          </MenuItem>

          {/* Individual Priority Options */}
          {PRIORITIES.map((p) => {
            const isSelected = priority === p;
            return (
              <MenuItem
                key={p}
                onClick={() => handlePriorityChange(p)}
                sx={{
                  py: 1,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {isSelected ? (
                  <RadioButtonCheckedIcon sx={{ fontSize: 18, color: colorTokens.primary[600] }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
                )}
                <CircleIcon sx={{ fontSize: 8, color: PRIORITY_COLORS[p] }} />
                <ListItemText
                  primary={p}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                />
              </MenuItem>
            );
          })}
        </Box>

        {/* Tags Section */}
        {popularTags.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mb: 1 }}>
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: colorTokens.semantic.text.secondary }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Tags {tags.length > 0 && `(${tags.length})`}
                </Typography>
              </Box>

              {/* Tag Chips */}
              <Box sx={{ px: 2, pb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {popularTags.slice(0, 12).map((tag) => {
                  const isSelected = tags.includes(tag.name);
                  return (
                    <Chip
                      key={tag.id}
                      label={tag.displayName}
                      variant={isSelected ? 'filled' : 'outlined'}
                      color={isSelected ? 'primary' : 'neutral'}
                      size="small"
                      onClick={() => handleToggleTag(tag.name)}
                      sx={{
                        cursor: 'pointer',
                        fontSize: 11,
                        transition: 'all 0.15s ease',
                        ...(tag.color && !isSelected
                          ? {
                              borderColor: tag.color,
                              color: tag.color,
                            }
                          : {}),
                        ...(tag.color && isSelected
                          ? {
                              backgroundColor: tag.color,
                              borderColor: tag.color,
                            }
                          : {}),
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </>
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, pb: 1 }}>
              <Button
                fullWidth
                onClick={handleClearAll}
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: colorTokens.neutral[600],
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: colorTokens.neutral[100],
                  },
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          </>
        )}
      </DropdownMenu>
    </>
  );
};
