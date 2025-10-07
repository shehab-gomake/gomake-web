import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Tag, TagCategory } from '@/widgets/frontdesk/providers/tickets/types';

export interface TagChipProps {
  /** Tag data */
  tag: Tag;
  /** Show delete icon */
  onDelete?: () => void;
  /** Click handler */
  onClick?: () => void;
  /** Size variant */
  size?: 'small' | 'medium';
  /** Show tooltip with tag details */
  showTooltip?: boolean;
  /** Variant style */
  variant?: 'filled' | 'outlined';
}

/**
 * TagChip Component
 *
 * Display tag with color coding and optional interactions:
 * - Color-coded by tag color
 * - Deletable (optional)
 * - Clickable (optional)
 * - Tooltip with usage count
 * - Category-based styling
 */
export const TagChip: React.FC<TagChipProps> = ({
  tag,
  onDelete,
  onClick,
  size = 'small',
  showTooltip = true,
  variant = 'filled',
}) => {
  const theme = useTheme();

  const chipElement = (
    <Chip
      label={tag.displayName}
      onDelete={onDelete}
      onClick={onClick}
      size={size}
      variant={variant}
      sx={{
        backgroundColor: variant === 'filled' ? tag.color || theme.palette.primary.main : 'transparent',
        color:
          variant === 'filled'
            ? theme.palette.getContrastText(tag.color || theme.palette.primary.main)
            : tag.color || theme.palette.primary.main,
        borderColor: variant === 'outlined' ? tag.color || theme.palette.primary.main : undefined,
        cursor: onClick ? 'pointer' : 'default',
        '& .MuiChip-deleteIcon': {
          color:
            variant === 'filled'
              ? theme.palette.getContrastText(tag.color || theme.palette.primary.main)
              : tag.color || theme.palette.primary.main,
          '&:hover': {
            opacity: 0.7,
          },
        },
        '&:hover': onClick
          ? {
              opacity: 0.8,
            }
          : undefined,
      }}
    />
  );

  if (showTooltip) {
    return (
      <Tooltip
        title={
          <>
            {tag.description && <div>{tag.description}</div>}
            <div>Category: {tag.category}</div>
            <div>Used {tag.usageCount} times</div>
          </>
        }
        arrow
      >
        {chipElement}
      </Tooltip>
    );
  }

  return chipElement;
};

/**
 * TagList Component - Display multiple tags
 */
export interface TagListProps {
  tags: Tag[];
  onRemoveTag?: (tagId: string) => void;
  onClickTag?: (tag: Tag) => void;
  maxDisplay?: number;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  onRemoveTag,
  onClickTag,
  maxDisplay,
  size = 'small',
  variant = 'filled',
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {displayTags.map((tag) => (
        <TagChip
          key={tag.id}
          tag={tag}
          onDelete={onRemoveTag ? () => onRemoveTag(tag.id) : undefined}
          onClick={onClickTag ? () => onClickTag(tag) : undefined}
          size={size}
          variant={variant}
        />
      ))}
      {remainingCount > 0 && (
        <Chip label={`+${remainingCount} more`} size={size} variant="outlined" />
      )}
    </div>
  );
};
