import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Ticket } from '../types/ticket.types';
import { TicketListItem } from './TicketListItem';

interface TicketListPanelProps {
  viewTitle: string;
  tickets: Ticket[];
  selectedTicketId: string | null;
  selectedTicketIds: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTicketSelect: (ticketId: string) => void;
  onTicketCheck: (ticketId: string, checked: boolean) => void;
  onViewChange?: (view: string) => void;
}

export const TicketListPanel: React.FC<TicketListPanelProps> = ({
  viewTitle,
  tickets,
  selectedTicketId,
  selectedTicketIds,
  searchQuery,
  onSearchChange,
  onTicketSelect,
  onTicketCheck,
  onViewChange
}) => {
  const theme = useTheme();
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);

  const handleViewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const handleViewSelect = (view: string) => {
    onViewChange?.(view);
    handleViewMenuClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 280,
        minWidth: 280,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {/* View Title with Dropdown */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            cursor: 'pointer'
          }}
          onClick={handleViewMenuOpen}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              {viewTitle}
            </Typography>
            <ArrowDropDownIcon fontSize="small" />
          </Box>
          <IconButton size="small">
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search tickets"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: theme.palette.background.default,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
              }
            }
          }}
        />
      </Box>

      {/* Ticket List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: 3
          }
        }}
      >
        {tickets.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tickets found
            </Typography>
          </Box>
        ) : (
          tickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              selected={selectedTicketId === ticket.id}
              checked={selectedTicketIds.includes(ticket.id)}
              onSelect={onTicketSelect}
              onCheck={onTicketCheck}
            />
          ))
        )}
      </Box>

      {/* View Change Menu */}
      <Menu
        anchorEl={viewMenuAnchor}
        open={Boolean(viewMenuAnchor)}
        onClose={handleViewMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={() => handleViewSelect('my-tickets')}>My Tickets</MenuItem>
        <MenuItem onClick={() => handleViewSelect('past-due')}>Past Due</MenuItem>
        <MenuItem onClick={() => handleViewSelect('high-priority')}>High Priority</MenuItem>
        <MenuItem onClick={() => handleViewSelect('unassigned')}>Unassigned</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleViewSelect('all-tickets')}>All Tickets</MenuItem>
      </Menu>
    </Box>
  );
};