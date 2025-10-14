import React from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { colorTokens, radiusTokens, shadowTokens } from '../../tokens';

export interface SearchInputProps extends Omit<TextFieldProps, 'variant'> {
  /** Show clear button when value is present */
  showClear?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
}

/**
 * SearchInput Component
 *
 * Specialized input for search functionality with icon and clear button
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  showClear = true,
  onClear,
  value,
  sx = {},
  ...rest
}) => {
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <TextField
      fullWidth
      size="small"
      placeholder={placeholder}
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 18, color: colorTokens.neutral[500] }} />
          </InputAdornment>
        ),
        endAdornment: showClear && hasValue && onClear ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onClear}
              edge="end"
              sx={{
                padding: 0.5,
                '&:hover': {
                  backgroundColor: colorTokens.neutral[100],
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 16, color: colorTokens.neutral[500] }} />
            </IconButton>
          </InputAdornment>
        ) : null,
        sx: {
          backgroundColor: colorTokens.semantic.background.secondary,
          borderRadius: radiusTokens.md,
          fontSize: 13,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.semantic.border.light,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colorTokens.semantic.border.medium,
          },
          '&.Mui-focused': {
            backgroundColor: colorTokens.semantic.background.primary,
            boxShadow: shadowTokens.focus,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colorTokens.semantic.border.focus,
              borderWidth: 1,
            },
          },
        },
      }}
      sx={sx}
      {...rest}
    />
  );
};