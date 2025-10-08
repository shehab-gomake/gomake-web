import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { TicketFilters, TicketStatus, TicketPriority } from '../types/api.types';

interface TicketFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: TicketFilters;
  onApply: (filters: Partial<TicketFilters>) => void;
  onClear: () => void;
}

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'REOPENED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const TicketFiltersModal: React.FC<TicketFiltersModalProps> = ({
  open,
  onClose,
  filters,
  onApply,
  onClear,
}) => {
  const [status, setStatus] = useState(filters.status);
  const [priority, setPriority] = useState(filters.priority);
  const [tags, setTags] = useState(filters.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (open) {
      setStatus(filters.status);
      setPriority(filters.priority);
      setTags(filters.tags || []);
    }
  }, [open, filters]);

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
    onClose();
  };

  const handleClear = () => {
    setStatus(undefined);
    setPriority(undefined);
    setTags([]);
    setTagInput('');
    onClear();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        }
      }}
    >
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
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
                  {s.replace('_', ' ')}
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tags
            </Typography>
            <Box display="flex" gap={1}>
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
                sx={{ minWidth: 70 }}
              >
                Add
              </Button>
            </Box>
            {tags.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={0.5} mt={1.5}>
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
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClear} color="inherit">
          Clear
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            bgcolor: '#E91E63',
            '&:hover': { bgcolor: '#C2185B' },
            minWidth: 100
          }}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};
