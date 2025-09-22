import React from 'react';
import { Box, TextField, InputAdornment, Typography, CircularProgress, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Channel } from '../NavigationSidebar';

interface DynamicListPanelProps {
  channel: Channel;
  content: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  accountSelector?: React.ReactNode;
  loading?: boolean;
  error?: string;
  title?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

export const DynamicListPanel: React.FC<DynamicListPanelProps> = ({
  channel,
  content,
  searchValue = '',
  onSearchChange,
  accountSelector,
  loading = false,
  error,
  title,
  headerActions,
  className
}) => {
  const theme = useTheme();

  const getChannelTitle = () => {
    if (title) return title;
    
    switch (channel) {
      case 'all':
        return 'All Conversations';
      case 'email':
        return 'Email';
      case 'whatsapp':
        return 'WhatsApp';
      case 'internal':
        return 'Internal Chat';
      default:
        return 'Conversations';
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {/* Title Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: accountSelector || onSearchChange ? 2 : 0
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {getChannelTitle()}
          </Typography>
          {headerActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {headerActions}
            </Box>
          )}
        </Box>

        {/* Account Selector */}
        {accountSelector && (
          <Box sx={{ mb: 2 }}>
            {accountSelector}
          </Box>
        )}

        {/* Search Bar */}
        {onSearchChange && (
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${getChannelTitle().toLowerCase()}...`}
            value={searchValue}
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
                }
              }
            }}
          />
        )}
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          px: 2,
          py: 1,
          // Add fade animation for content changes
          '& > *': {
            animation: 'fadeIn 0.15s ease-in-out',
          },
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Paper
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: theme.palette.error.light + '10',
              borderLeft: `3px solid ${theme.palette.error.main}`
            }}
          >
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Paper>
        )}

        {!loading && !error && content}

        {!loading && !error && !content && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: theme.palette.text.secondary
            }}
          >
            <Typography variant="body2">
              No conversations found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DynamicListPanel;