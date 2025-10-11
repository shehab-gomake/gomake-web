import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  TextField,
  Box,
  Chip,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Badge,
  Typography,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TicketFilters, TicketStatus, TicketPriority, Tag } from '../types/api.types';
import { apiStatusToUi } from '../types/transformers';
import { DropdownMenu } from '@/widgets/frontdesk/components/dropdown-menu';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

interface TicketFiltersMenuProps {
  filters: TicketFilters;
  onApply: (filters: Partial<TicketFilters>) => void;
  onClear: () => void;
  activeFilterCount: number;
  // Popular tags
  popularTags?: Tag[];
  onFetchPopularTags?: () => void;
}

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'REOPENED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

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
  const [tagInput, setTagInput] = useState('');

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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleApply = () => {
    onApply({ status, priority, tags });
    handleClose();
  };

  const handleClear = () => {
    setStatus(undefined);
    setPriority(undefined);
    setTags([]);
    setTagInput('');
    onClear();
    handleClose();
  };

  const actions = (
    <>
      <Button onClick={handleClear} color="inherit" size="small">
        Clear
      </Button>
      <Button
        onClick={handleApply}
        variant="contained"
        size="small"
        sx={{
          bgcolor: '#E91E63',
          '&:hover': { bgcolor: '#C2185B' },
        }}
      >
        Apply
      </Button>
    </>
  );

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="Filter tickets"
      >
        <Badge badgeContent={activeFilterCount} color="primary">
          <FilterListIcon fontSize="small" />
        </Badge>
      </IconButton>
      <DropdownMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        title="FILTER BY"
        actions={actions}
        width={280}
      >
        <Stack spacing={2}>
          {/* Status */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={status || ''}
              label="Status"
              onChange={(e) => setStatus(e.target.value as TicketStatus || undefined)}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {STATUSES.map(s => (
                <MenuItem key={s} value={s}>
                  {apiStatusToUi(s)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority || ''}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as TicketPriority || undefined)}
            >
              <MenuItem value="">
                <em>All Priorities</em>
              </MenuItem>
              {PRIORITIES.map(p => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tags */}
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
              Filter by Tags
            </Typography>

            {/* Popular Tags - Quick Select */}
            {popularTags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10, fontWeight: 600 }}>
                    POPULAR TAGS
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {popularTags.slice(0, 8).map((tag) => {
                    const isSelected = tags.includes(tag.name);
                    return (
                      <Chip
                        key={tag.id}
                        label={`${tag.displayName} (${tag.usageCount})`}
                        size="small"
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveTag(tag.name);
                          } else {
                            setTags([...tags, tag.name]);
                          }
                        }}
                        sx={{
                          backgroundColor: isSelected ? tag.color || '#E91E63' : 'transparent',
                          color: isSelected ? '#fff' : tag.color || '#E91E63',
                          borderColor: tag.color || '#E91E63',
                          cursor: 'pointer',
                          fontSize: 11,
                          '&:hover': {
                            backgroundColor: isSelected ? tag.color || '#E91E63' : `${tag.color || '#E91E63'}22`,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Manual Tag Input */}
            <Box display="flex" gap={1} mb={tags.length > 0 ? 1 : 0}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type tag name"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                sx={{ minWidth: 60 }}
              >
                Add
              </Button>
            </Box>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontSize: 10, color: 'text.secondary' }}>
                  Selected ({tags.length}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </DropdownMenu>
    </>
  );
};
