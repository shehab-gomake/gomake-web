import React from 'react';
import { Box, Typography, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticTypography } from '../../tokens';
import { Button } from '../../primitives/Button';

export interface EmptyStateProps {
  /** Icon to display (React element) */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * EmptyState Component
 *
 * Displays when lists, panels, or sections have no content
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        p: 4,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Stack alignItems="center" spacing={3} sx={{ maxWidth: 400 }}>
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              fontSize: 64,
              color: colorTokens.neutral[300],
              '& > svg': {
                fontSize: 'inherit',
              },
            }}
          >
            {icon}
          </Box>
        )}

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontSize: semanticTypography.heading.h5.fontSize,
            fontWeight: semanticTypography.heading.h5.fontWeight,
            color: colorTokens.semantic.text.primary,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            sx={{
              fontSize: semanticTypography.body.small.fontSize,
              color: colorTokens.semantic.text.secondary,
              lineHeight: semanticTypography.body.small.lineHeight,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <Stack direction="row" spacing={2}>
            {action && (
              <Button variant="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="secondary" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};