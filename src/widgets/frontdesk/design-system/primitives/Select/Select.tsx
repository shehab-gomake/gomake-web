import React from 'react';
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SxProps,
  Theme,
} from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography } from '../../tokens';
import { transitionTokens } from '../../tokens/layout.tokens';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant' | 'size'> {
  /** Select options */
  options: SelectOption[];
  /** Label text */
  label?: string;
  /** Helper text below the select */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: {
    height: 32,
    fontSize: semanticTypography.body.small.fontSize,
    padding: '0 28px 0 10px',
  },
  md: {
    height: 40,
    fontSize: semanticTypography.body.medium.fontSize,
    padding: '0 32px 0 12px',
  },
  lg: {
    height: 48,
    fontSize: semanticTypography.body.large.fontSize,
    padding: '0 36px 0 14px',
  },
};

/**
 * Select Component
 *
 * Token-based dropdown select with consistent styling
 */
export const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  error = false,
  size = 'md',
  fullWidth = false,
  sx = {},
  ...rest
}) => {
  const sizeStyle = sizeStyles[size];

  const selectStyles: SxProps<Theme> = {
    '& .MuiSelect-select': {
      ...sizeStyle,
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? colorTokens.error[500] : colorTokens.semantic.border.default,
      borderRadius: radiusTokens.md,
      transition: transitionTokens.presets.colors,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? colorTokens.error[600] : colorTokens.semantic.border.medium,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? colorTokens.error[500] : colorTokens.primary[500],
      borderWidth: 2,
    },
    '& .MuiSelect-icon': {
      color: colorTokens.semantic.text.secondary,
      right: 8,
    },
    backgroundColor: colorTokens.semantic.background.primary,
    ...sx,
  };

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      {label && (
        <InputLabel
          sx={{
            ...semanticTypography.label.medium,
            color: error ? colorTokens.error[600] : colorTokens.semantic.text.secondary,
            '&.Mui-focused': {
              color: error ? colorTokens.error[600] : colorTokens.primary[600],
            },
          }}
        >
          {label}
        </InputLabel>
      )}
      <MuiSelect
        label={label}
        sx={selectStyles}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.5,
              borderRadius: radiusTokens.md,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: `1px solid ${colorTokens.semantic.border.default}`,
              '& .MuiMenuItem-root': {
                fontSize: sizeStyle.fontSize,
                py: 1,
                px: 1.5,
                '&:hover': {
                  backgroundColor: colorTokens.semantic.interactive.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: colorTokens.semantic.interactive.selected,
                  '&:hover': {
                    backgroundColor: colorTokens.semantic.interactive.selectedHover,
                  },
                },
              },
            },
          },
        }}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText
          sx={{
            ...semanticTypography.caption.medium,
            color: error ? colorTokens.error[600] : colorTokens.semantic.text.secondary,
            mt: 0.5,
            mx: 0,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

