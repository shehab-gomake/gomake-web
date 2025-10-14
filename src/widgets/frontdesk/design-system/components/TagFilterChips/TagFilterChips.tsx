import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Tag } from '@/widgets/frontdesk/providers/tickets/types';

export interface TagFilterChipsProps {
  /** Currently active tag filters */
  tags: Tag[];
  /** Callback when a tag is removed */
  onRemoveTag: (tag: Tag) => void;
  /** Callback to clear all tags */
  onClearAll?: () => void;
}

/**
 * TagFilterChips Component
 *
 * Displays active tag filters as removable chips:
 * - Shows "Filtered by:" label
 * - Color-coded chips matching tag colors
 * - Click × to remove filter
 * - Optional "Clear All" button
 */
export const TagFilterChips: React.FC<TagFilterChipsProps> = ({
  tags,
  onRemoveTag,
  onClearAll,
}) => {
  const theme = useTheme();

  if (tags.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        backgroundColor: theme.palette.grey[50],
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.secondary,
          textTransform: 'uppercase',
          fontSize: 10,
        }}
      >
        Filtered by:
      </Typography>

      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.displayName}
          size="small"
          onDelete={() => onRemoveTag(tag)}
          sx={{
            backgroundColor: tag.color || theme.palette.primary.main,
            color: theme.palette.getContrastText(tag.color || theme.palette.primary.main),
            fontSize: 11,
            height: 24,
            '& .MuiChip-deleteIcon': {
              color: theme.palette.getContrastText(tag.color || theme.palette.primary.main),
              fontSize: 16,
              '&:hover': {
                opacity: 0.7,
              },
            },
          }}
        />
      ))}

      {onClearAll && tags.length > 1 && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            cursor: 'pointer',
            fontSize: 11,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={onClearAll}
        >
          Clear All
        </Typography>
      )}
    </Box>
  );
};
