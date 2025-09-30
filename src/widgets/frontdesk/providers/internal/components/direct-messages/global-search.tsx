import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { MessageSearchResult } from '@/store/direct-messages';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<MessageSearchResult[]>;
  onResultSelect: (result: MessageSearchResult) => void;
  loading?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  open,
  onClose,
  onSearch,
  onResultSelect,
  loading = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MessageSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

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

    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const searchResults = await onSearch(trimmedQuery);
          setResults(searchResults);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch]);

  const handleResultClick = (result: MessageSearchResult) => {
    onResultSelect(result);
    handleClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    onClose();
  };

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) {
      return text;
    }

    const safeQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => (
      index % 2 === 1 ? (
        <Box component="mark" key={index} sx={{ backgroundColor: 'yellow', fontWeight: 'bold', px: 0.25 }}>
          {part}
        </Box>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getConversationName = (conversation?: MessageSearchResult['conversation']) => {
    if (!conversation) {
      return 'Conversation';
    }

    if (conversation.name) return conversation.name;

    if (conversation.type === 'GROUP_DM' || conversation.type === 'group') {
      return 'Group Chat';
    }

    return 'Direct Message';
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: 8,
      }}
      onClick={handleClose}
    >
      <Paper
        sx={{
          width: '90%',
          maxWidth: 600,
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #EAECF0' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              ref={inputRef}
              fullWidth
              placeholder="Search messages across all conversations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: isSearching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : null,
              }}
              variant="outlined"
              size="small"
            />
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Search Results */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {query.length > 0 && query.length <= 2 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Type at least 3 characters to search
              </Typography>
            </Box>
          )}

          {query.length > 2 && !isSearching && results.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <MessageIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No messages found for &quot;{query}&quot;
              </Typography>
            </Box>
          )}

          {results.length > 0 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </Typography>
              <List disablePadding>
                {results.map((result, index) => (
                  <React.Fragment key={`${result.conversationId}-${result.id}-${index}`}>
                    <ListItem
                      button
                      onClick={() => handleResultClick(result)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                        <Avatar sx={{ width: 36, height: 36 }}>
                          {(result.user?.name || result.user?.firstName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {result.user?.name || `${result.user?.firstName || ''} ${result.user?.lastName || ''}`.trim() || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              in {getConversationName(result.conversation)}
                            </Typography>
                            <Box sx={{ flex: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(result.createdAt)}
                            </Typography>
                            {result.rank && (
                              <Chip
                                label={`${Math.round(result.rank * 100)}%`}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 1, fontSize: '0.6rem', height: '20px' }}
                              />
                            )}
                          </Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.4,
                            }}
                          >
                            {highlightText(result.contentSnippet || result.content, query)}
                          </Typography>
                        </Box>
                      </Stack>
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Search Tips */}
        {query.length === 0 && (
          <Box sx={{ p: 3, borderTop: '1px solid #EAECF0' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Search Tips:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Use quotes for exact phrases" size="small" variant="outlined" />
              <Chip label="Search by username" size="small" variant="outlined" />
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GlobalSearch;
