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
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TicketFilters, TicketStatus, TicketPriority } from '../types/api.types';
import { apiStatusToUi } from '../types/transformers';
import { DropdownMenu } from '@/widgets/frontdesk/components/dropdown-menu';

interface TicketFiltersMenuProps {
  filters: TicketFilters;
  onApply: (filters: Partial<TicketFilters>) => void;
  onClear: () => void;
  activeFilterCount: number;
}

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'REOPENED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const TicketFiltersMenu: React.FC<TicketFiltersMenuProps> = ({
  filters,
  onApply,
  onClear,
  activeFilterCount
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(filters.status);
  const [priority, setPriority] = useState(filters.priority);
  const [tags, setTags] = useState(filters.tags || []);
  const [tagInput, setTagInput] = useState('');

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
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Tags
            </Typography>
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
            {tags.length > 0 && (
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
            )}
          </Box>
        </Stack>
      </DropdownMenu>
    </>
  );
};
