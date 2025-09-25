import React, { useState } from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Circle as CircleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export interface BaseAccount {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  unreadCount?: number;
}

interface BaseAccountSidebarProps {
  accounts: BaseAccount[];
  selectedAccountId?: string;
  onAccountSelect: (accountId: string) => void;
  onAddAccount: () => void;
  onDisconnectAccount?: (accountId: string) => void;
  onRefresh?: () => void;
  title?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  showStatus?: boolean;
  labelsSection?: React.ReactNode;
}

export const BaseAccountSidebar: React.FC<BaseAccountSidebarProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onAddAccount,
  onDisconnectAccount,
  onRefresh,
  title = "Accounts",
  addButtonLabel = "Add Account",
  emptyMessage = "No accounts connected",
  showStatus = true,
  labelsSection
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMenuAccount, setSelectedMenuAccount] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedMenuAccount(accountId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMenuAccount(null);
  };

  const handleDisconnect = () => {
    if (selectedMenuAccount && onDisconnectAccount) {
      onDisconnectAccount(selectedMenuAccount);
    }
    handleMenuClose();
  };

  const getInitials = (account: BaseAccount) => {
    if (account.name) {
      return account.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return account.email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const AccountListItem: React.FC<{ account: BaseAccount }> = ({ account }) => {
    const isSelected = account.id === selectedAccountId;

    return (
      <ListItem
        disablePadding
        sx={{
          borderRadius: 1,
          mb: 0.5,
          mx: 1,
        }}
      >
        <ListItemButton
          selected={isSelected}
          onClick={() => onAccountSelect(account.id)}
          sx={{
            borderRadius: 1,
            py: 1.5,
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
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                showStatus && account.isOnline ? (
                  <CircleIcon sx={{ fontSize: 8, color: 'success.main' }} />
                ) : null
              }
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  backgroundColor: isSelected ? primaryColor(500) : neutralColor(400),
                  color: 'white'
                }}
                src={account.avatar}
              >
                {getInitials(account)}
              </Avatar>
            </Badge>
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? primaryColor(700) : neutralColor(700),
                  fontSize: '0.875rem'
                }}
                noWrap
              >
                {account.name || account.email.split('@')[0]}
              </Typography>
            }
            secondary={
              <Typography
                variant="caption"
                sx={{
                  color: isSelected ? primaryColor(600) : neutralColor(500),
                  fontSize: '0.75rem'
                }}
                noWrap
              >
                {account.email}
              </Typography>
            }
          />

          <ListItemSecondaryAction>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {account.unreadCount && account.unreadCount > 0 && (
                <Badge
                  badgeContent={account.unreadCount > 99 ? '99+' : account.unreadCount}
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

              {onDisconnectAccount && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, account.id)}
                  sx={{
                    opacity: isSelected ? 1 : 0,
                    transition: 'opacity 0.2s',
                    color: neutralColor(500),
                    '&:hover': {
                      color: neutralColor(700),
                    }
                  }}
                >
                  <MoreIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Stack>
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
              fontSize: '1rem'
            }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  sx={{
                    color: neutralColor(600),
                    '&:hover': {
                      color: primaryColor(600),
                      backgroundColor: alpha(primaryColor(100), 0.5),
                    }
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={addButtonLabel}>
              <IconButton
                size="small"
                onClick={onAddAccount}
                sx={{
                  color: primaryColor(600),
                  backgroundColor: alpha(primaryColor(100), 0.5),
                  '&:hover': {
                    backgroundColor: alpha(primaryColor(100), 0.8),
                  }
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Accounts List */}
      <Box sx={{ overflow: 'auto' }}>
        {accounts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: neutralColor(500), mb: 2 }}>
              {emptyMessage}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddAccount}
              size="small"
              sx={{
                backgroundColor: primaryColor(500),
                '&:hover': {
                  backgroundColor: primaryColor(600),
                }
              }}
            >
              {addButtonLabel}
            </Button>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {accounts.map((account) => (
              <AccountListItem key={account.id} account={account} />
            ))}
          </List>
        )}
      </Box>

      {/* Labels Section */}
      {labelsSection && accounts.length > 0 && (
        <Box
          sx={{
            borderTop: `1px solid ${neutralColor(200)}`,
            backgroundColor: neutralColor(25),
            overflow: 'auto',
            flexShrink: 0,
            maxHeight: '50%'
          }}
        >
          {labelsSection}
        </Box>
      )}

      {/* Account Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDisconnect} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Disconnect</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};