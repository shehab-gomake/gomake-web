import React from 'react';
import { Box, Typography, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticTypography, semanticSpacing } from '../../tokens';

export interface FormFieldProps {
  /** Field label */
  label?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message (overrides helperText when present) */
  errorMessage?: string;
  /** Whether field is required */
  required?: boolean;
  /** Field content (input, select, etc.) */
  children: React.ReactNode;
  /** Field orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Label width for horizontal orientation */
  labelWidth?: number;
  /** Custom styles */
  sx?: SxProps<Theme>;
  /** Hide label visually but keep for accessibility */
  hideLabel?: boolean;
}

/**
 * FormField Component
 *
 * Wrapper component for form inputs with consistent label and helper text styling
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  errorMessage,
  required = false,
  children,
  orientation = 'vertical',
  labelWidth = 120,
  sx = {},
  hideLabel = false,
}) => {
  const hasError = Boolean(errorMessage);
  const displayText = errorMessage || helperText;

  const labelStyles: SxProps<Theme> = {
    ...semanticTypography.label.medium,
    color: hasError ? colorTokens.error[600] : colorTokens.semantic.text.primary,
    mb: orientation === 'vertical' ? 0.5 : 0,
    minWidth: orientation === 'horizontal' ? labelWidth : 'auto',
    flexShrink: 0,
    ...(hideLabel && {
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }),
  };

  const helperStyles: SxProps<Theme> = {
    ...semanticTypography.caption.medium,
    color: hasError ? colorTokens.error[600] : colorTokens.semantic.text.secondary,
    mt: 0.5,
  };

  if (orientation === 'horizontal') {
    return (
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{
          py: semanticSpacing.component.sm / 8,
          ...sx,
        }}
      >
        {label && (
          <Typography component="label" sx={labelStyles}>
            {label}
            {required && (
              <Typography
                component="span"
                sx={{ color: colorTokens.error[500], ml: 0.5 }}
              >
                *
              </Typography>
            )}
          </Typography>
        )}
        <Box sx={{ flex: 1 }}>
          {children}
          {displayText && (
            <Typography sx={helperStyles}>{displayText}</Typography>
          )}
        </Box>
      </Stack>
    );
  }

  return (
    <Box sx={sx}>
      {label && (
        <Typography component="label" sx={labelStyles}>
          {label}
          {required && (
            <Typography
              component="span"
              sx={{ color: colorTokens.error[500], ml: 0.5 }}
            >
              *
            </Typography>
          )}
        </Typography>
      )}
      {children}
      {displayText && (
        <Typography sx={helperStyles}>{displayText}</Typography>
      )}
    </Box>
  );
};

