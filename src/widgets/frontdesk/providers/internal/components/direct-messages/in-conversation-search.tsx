import React, { useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  IconButton,
  Typography,
  Stack,
  Collapse,
  InputAdornment,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { ConversationSearchResult } from '@/store/direct-messages';

interface InConversationSearchProps {
  open: boolean;
  query: string;
  results: ConversationSearchResult[];
  currentIndex: number;
  onClose: () => void;
  onSearch: (query: string) => Promise<ConversationSearchResult[]>;
  onNavigateToResult: (messageId: string, index: number) => void;
  onQueryChange: (value: string) => void;
  conversationName?: string;
  loading?: boolean;
}

const InConversationSearch: React.FC<InConversationSearchProps> = ({
  open,
  query,
  results,
  currentIndex,
  onClose,
  onSearch,
  onNavigateToResult,
  onQueryChange,
  conversationName = 'this conversation',
  loading = false,
}) => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastResultSignatureRef = useRef<string>('');

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!open) {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      searchTimeoutRef.current = setTimeout(() => {
        void onSearch('');
      }, 100);
    } else {
      searchTimeoutRef.current = setTimeout(() => {
        void onSearch(trimmedQuery);
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch, open]);

  // Auto-navigate to first result when the result set changes
  useEffect(() => {
    if (!open || results.length === 0) {
      lastResultSignatureRef.current = '';
      return;
    }

    const signature = `${query}|${results.map((result) => result.id).join('|')}`;

    if (signature !== lastResultSignatureRef.current) {
      lastResultSignatureRef.current = signature;
      onNavigateToResult(results[0].id, 0);
    }
  }, [results, open, query, onNavigateToResult]);

  const handleClose = () => {
    onQueryChange('');
    onClose();
  };

  const handleNavigateUp = () => {
    if (results.length === 0) return;

    const newIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
    onNavigateToResult(results[newIndex].id, newIndex);
  };

  const handleNavigateDown = () => {
    if (results.length === 0) return;

    const newIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
    onNavigateToResult(results[newIndex].id, newIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    } else if (event.key === 'Enter') {
      if (event.shiftKey) {
        handleNavigateUp();
      } else {
        handleNavigateDown();
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp' && event.ctrlKey) {
      handleNavigateUp();
      event.preventDefault();
    } else if (event.key === 'ArrowDown' && event.ctrlKey) {
      handleNavigateDown();
      event.preventDefault();
    }
  };

  if (!open) return null;

  return (
    <Collapse in={open}>
      <Paper
        elevation={3}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          mx: 2,
          mt: 1,
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Search Input */}
            <TextField
              ref={inputRef}
              fullWidth
              placeholder={`Search in ${conversationName}...`}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
              }}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Results Counter and Navigation */}
            {results.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={`${currentIndex + 1} of ${results.length}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <IconButton
                  size="small"
                  onClick={handleNavigateUp}
                  disabled={results.length === 0}
                  title="Previous result (Shift+Enter or Ctrl+↑)"
                >
                  <ArrowUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleNavigateDown}
                  disabled={results.length === 0}
                  title="Next result (Enter or Ctrl+↓)"
                >
                  <ArrowDownIcon />
                </IconButton>
              </Stack>
            )}

            {/* Close Button */}
            <IconButton onClick={handleClose} size="small" title="Close search (Esc)">
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* Search Status */}
          {query.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {loading ? (
                <Typography variant="caption" color="text.secondary">
                  Searching...
                </Typography>
              ) : results.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  No results found for &quot;{query}&quot;
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Found {results.length} {results.length === 1 ? 'result' : 'results'}
                </Typography>
              )}
            </Box>
          )}

          {/* Keyboard Shortcuts Hint */}
          {query.length === 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Press Enter to navigate results • Esc to close
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Collapse>
  );
};

export default InConversationSearch;
