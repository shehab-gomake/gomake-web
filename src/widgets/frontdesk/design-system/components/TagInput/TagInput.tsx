import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Paper,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Tag } from '@/widgets/frontdesk/providers/tickets/types';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

export interface TagInputProps {
  /** Currently selected tags */
  tags: Tag[];
  /** Function to fetch tag suggestions */
  onSuggest: (query: string) => Promise<Tag[]>;
  /** Callback when tags are added */
  onAdd: (tagNames: string[]) => void;
  /** Callback when a tag is removed */
  onRemove: (tagId: string) => void;
  /** Popular tags to show initially */
  popularTags?: Tag[];
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of tags allowed */
  maxTags?: number;
}

/**
 * TagInput Component
 *
 * Autocomplete input for adding tags to tickets with:
 * - Real-time suggestions
 * - Popular tags display
 * - Auto-create on Enter
 * - Color-coded chips
 * - Max tag limit
 */
export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onSuggest,
  onAdd,
  onRemove,
  popularTags = [],
  loading = false,
  disabled = false,
  placeholder = 'Type to search or create new tag...',
  maxTags = 10,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>(popularTags);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (!inputValue || inputValue.length < 1) {
      setSuggestions(popularTags);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const results = await onSuggest(inputValue);
        setSuggestions(results);
      } catch (error) {
        console.error('[TagInput] Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSuggest, popularTags]);

  const handleAddTag = useCallback(
    (tagNames: string[]) => {
      if (tags.length >= maxTags) {
        console.warn(`[TagInput] Maximum ${maxTags} tags allowed`);
        return;
      }

      // Filter out duplicates and empty strings
      const uniqueNewTags = tagNames
        .filter((name) => name.trim().length > 0)
        .filter((name) => !tags.some((t) => t.name === name.toLowerCase()));

      if (uniqueNewTags.length > 0) {
        onAdd(uniqueNewTags);
        setInputValue('');
      }
    },
    [tags, maxTags, onAdd]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && inputValue.trim()) {
        event.preventDefault();
        handleAddTag([inputValue.trim()]);
      }
    },
    [inputValue, handleAddTag]
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Autocomplete Input */}
      <Autocomplete
        multiple
        freeSolo
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        options={suggestions}
        value={[]}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, newValue) => {
          // Handle selection from dropdown
          const newTagNames = newValue
            .map((item) => (typeof item === 'string' ? item : item.name))
            .filter((name) => !tags.some((t) => t.name === name.toLowerCase()));

          if (newTagNames.length > 0) {
            handleAddTag(newTagNames);
          }
        }}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.displayName)}
        renderOption={(props, option) => {
          const tag = typeof option === 'string' ? null : option;
          return (
            <li {...props} key={String(tag?.id || option)}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  py: 0.5,
                  '&:hover': {
                    '& .tag-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {tag ? (
                  <>
                    <LocalOfferOutlinedIcon
                      className="tag-icon"
                      sx={{
                        fontSize: 16,
                        color: tag.color || theme.palette.primary.main,
                        transition: 'transform 0.2s ease',
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {tag.displayName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.grey[100],
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: 10,
                      }}
                    >
                      {tag.usageCount} uses
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2">{typeof option === 'string' ? option : option.displayName}</Typography>
                )}
              </Box>
            </li>
          );
        }}
        loading={suggestionsLoading}
        disabled={disabled || loading || tags.length >= maxTags}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
            size="small"
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {suggestionsLoading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          />
        )}
        PaperComponent={(props) => (
          <Paper {...props} elevation={3}>
            {/* Show section headers */}
            {suggestions.length > 0 && !inputValue && (
              <Box sx={{ px: 2, py: 1, backgroundColor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  POPULAR TAGS
                </Typography>
              </Box>
            )}
            {suggestions.length > 0 && inputValue && (
              <Box sx={{ px: 2, py: 1, backgroundColor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  MATCHING TAGS
                </Typography>
              </Box>
            )}
            {suggestions.length === 0 && inputValue && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Press <strong>Enter</strong> to create "{inputValue}"
                </Typography>
              </Box>
            )}
            {suggestions.length === 0 && !inputValue && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No popular tags yet. Start typing to create a new tag.
                </Typography>
              </Box>
            )}
            {props.children}
          </Paper>
        )}
      />

      {/* Helper Text */}
      {(inputValue || tags.length > 0) && (
        <Box sx={{ mt: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {inputValue && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
              Type and press <strong>Enter</strong> to create
            </Typography>
          )}
          {tags.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, fontWeight: 500, ml: 'auto' }}>
              {tags.length}/{maxTags}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
