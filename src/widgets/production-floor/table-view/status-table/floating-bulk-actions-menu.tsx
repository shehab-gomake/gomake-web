import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  Update as UpdateIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const FloatingBulkActionsMenu = ({
  selectedJobs = [],
  onUpdateStatus,
  onMoveToNextStation,
  onMoveToDone,
  onClearSelection,
  statusOptions = [],
  t = (key) => key
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedJobs.length > 0);
    if (selectedJobs.length === 0) {
      setAnchorEl(null);
    }
  }, [selectedJobs]);

  const handleStatusMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = (statusId) => {
    onUpdateStatus(selectedJobs, statusId);
    handleStatusMenuClose();
  };

  if (!isVisible) return null;

  return (
    <Fade in={isVisible}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1300,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          backgroundColor: 'white',
        }}
      >
        {/* Horizontal Layout */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1.5,
            gap: 1,
          }}
        >
          {/* Selected Count */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: 2,
              minWidth: 'fit-content',
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {selectedJobs.length}
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {t('bulkActions.tasksSelected') || 'Tasks selected'}
            </Typography>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Update Status */}
          <Box
            onClick={handleStatusMenuOpen}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 64,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <UpdateIcon sx={{ fontSize: 20, color: '#6b7280', mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#6b7280' }}>
              {t('bulkActions.updateStatus') || 'Update Status'}
            </Typography>
          </Box>

          {/* Move to Next Station */}
          <Box
            onClick={() => onMoveToNextStation(selectedJobs)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 64,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 20, color: '#6b7280', mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#6b7280' }}>
              {t('bulkActions.moveToNext') || 'Move to Next'}
            </Typography>
          </Box>

          {/* Move to Done */}
          <Box
            onClick={() => onMoveToDone(selectedJobs)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 64,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 20, color: '#6b7280', mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#6b7280' }}>
              {t('bulkActions.moveToDone') || 'Move to Done'}
            </Typography>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Close Button */}
          <IconButton
            onClick={onClearSelection}
            sx={{
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Status Selection Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleStatusMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              minWidth: 200,
              maxHeight: 300,
              mt: -1,
            },
          }}
        >
          {statusOptions.map((status) => (
            <MenuItem
              key={status.id}
              onClick={() => handleUpdateStatus(status.id)}
              sx={{
                py: 1.5,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: status.backgroundColor,
                  border: `2px solid ${status.textColor}`,
                  mr: 2,
                }}
              />
              <Typography variant="body2" color={status.textColor}>
                {status.name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Fade>
  );
};

export { FloatingBulkActionsMenu };