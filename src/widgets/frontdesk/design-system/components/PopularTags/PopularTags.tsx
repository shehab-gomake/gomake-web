import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Tag } from '@/widgets/frontdesk/providers/tickets/types';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

export interface PopularTagsProps {
  /** Popular tags to display */
  tags: Tag[];
  /** Currently selected tags (to filter out) */
  selectedTags?: Tag[];
  /** Callback when a tag is clicked */
  onTagClick: (tagName: string) => void;
  /** Maximum number of tags to show */
  maxDisplay?: number;
  /** Show title */
  showTitle?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * PopularTags Component
 *
 * Quick-add section for popular/frequently used tags
 * - Shows clickable tag chips
 * - Filters out already-selected tags
 * - Color-coded for easy identification
 */
export const PopularTags: React.FC<PopularTagsProps> = ({
  tags,
  selectedTags = [],
  onTagClick,
  maxDisplay = 8,
  showTitle = true,
  loading = false,
}) => {
  const theme = useTheme();

  // Filter out already-selected tags and limit display
  const availableTags = tags
    .filter((tag) => !selectedTags.some((selected) => selected.id === tag.id))
    .slice(0, maxDisplay);

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      {showTitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, textTransform: 'uppercase', fontSize: 10 }}>
            Suggested Tags
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
        }}
      >
        {availableTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.displayName}
            size="small"
            variant="outlined"
            onClick={() => onTagClick(tag.displayName)}
            sx={{
              borderColor: tag.color || theme.palette.primary.main,
              color: tag.color || theme.palette.primary.main,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: tag.color || theme.palette.primary.main,
                color: theme.palette.getContrastText(tag.color || theme.palette.primary.main),
                borderColor: tag.color || theme.palette.primary.main,
              },
            }}
          />
        ))}
      </Box>

      {!showTitle && availableTags.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: 10 }}>
          Click to add
        </Typography>
      )}
    </Box>
  );
};
