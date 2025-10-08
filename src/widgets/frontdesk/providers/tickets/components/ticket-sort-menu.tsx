import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckIcon from '@mui/icons-material/Check';

interface TicketSortMenuProps {
  sortBy: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'lastMessageAt', label: 'Last Message' },
  { value: 'priority', label: 'Priority' },
  { value: 'ticketNumber', label: 'Ticket Number' },
  { value: 'status', label: 'Status' },
];

export const TicketSortMenu: React.FC<TicketSortMenuProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortByChange = (value: string) => {
    onSortChange(value, sortOrder);
    handleClose();
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    onSortChange(sortBy, order);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick} aria-label="Sort tickets">
        <SortIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 220 }
        }}
      >
        <Box px={2} py={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            SORT BY
          </Typography>
        </Box>

        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSortByChange(option.value)}
            selected={sortBy === option.value}
          >
            <ListItemText>{option.label}</ListItemText>
            {sortBy === option.value && (
              <CheckIcon fontSize="small" color="primary" />
            )}
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <Box px={2} py={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            ORDER
          </Typography>
        </Box>

        <MenuItem
          onClick={() => handleSortOrderChange('desc')}
          selected={sortOrder === 'desc'}
        >
          <ListItemIcon>
            <ArrowDownwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descending</ListItemText>
          {sortOrder === 'desc' && (
            <CheckIcon fontSize="small" color="primary" />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSortOrderChange('asc')}
          selected={sortOrder === 'asc'}
        >
          <ListItemIcon>
            <ArrowUpwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ascending</ListItemText>
          {sortOrder === 'asc' && (
            <CheckIcon fontSize="small" color="primary" />
          )}
        </MenuItem>
      </Menu>
    </>
  );
};
