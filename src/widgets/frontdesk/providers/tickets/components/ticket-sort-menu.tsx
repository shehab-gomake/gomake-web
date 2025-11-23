import React, { useState } from 'react';
import { IconButton, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { DropdownMenu, MenuSubheader } from '@/widgets/frontdesk/components/dropdown-menu';
import { colorTokens } from '@/widgets/frontdesk/design-system';

interface TicketSortMenuProps {
  sortBy: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

interface SortOption {
  field: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  order: 'asc' | 'desc';
  label: string;
  icon: React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  {
    field: 'createdAt',
    order: 'desc',
    label: 'Newest First',
    icon: <CalendarTodayIcon sx={{ fontSize: 18 }} />,
  },
  {
    field: 'createdAt',
    order: 'asc',
    label: 'Oldest First',
    icon: <CalendarTodayIcon sx={{ fontSize: 18 }} />,
  },
  {
    field: 'lastMessageAt',
    order: 'desc',
    label: 'Recently Updated',
    icon: <MessageIcon sx={{ fontSize: 18 }} />,
  },
  {
    field: 'priority',
    order: 'desc',
    label: 'Priority (High → Low)',
    icon: <PriorityHighIcon sx={{ fontSize: 18 }} />,
  },
  {
    field: 'priority',
    order: 'asc',
    label: 'Priority (Low → High)',
    icon: <PriorityHighIcon sx={{ fontSize: 18 }} />,
  },
  {
    field: 'ticketNumber',
    order: 'desc',
    label: 'Ticket Number',
    icon: <ConfirmationNumberIcon sx={{ fontSize: 18 }} />,
  },
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

  const handleSortSelect = (field: string, order: 'asc' | 'desc') => {
    onSortChange(field, order);
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="Sort tickets"
        sx={{
          color: colorTokens.semantic.text.secondary,
          '&:hover': {
            backgroundColor: colorTokens.neutral[100],
          },
        }}
      >
        <SortIcon fontSize="small" />
      </IconButton>

      <DropdownMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        width={240}
        disableContentPadding
      >
        {[
          <MenuSubheader key="header">SORT BY</MenuSubheader>,
          ...SORT_OPTIONS.map((option) => {
          const isSelected = sortBy === option.field && sortOrder === option.order;

          return (
            <MenuItem
              key={`${option.field}-${option.order}`}
              onClick={() => handleSortSelect(option.field, option.order)}
              selected={isSelected}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: `${colorTokens.primary[50]} !important`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: colorTokens.primary[600] }}>
                {option.icon}
              </ListItemIcon>
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                }}
              />
              {isSelected && (
                <CheckIcon fontSize="small" sx={{ color: colorTokens.primary[600] }} />
              )}
            </MenuItem>
          );
        })
        ]}
      </DropdownMenu>
    </>
  );
};
