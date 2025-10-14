import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens } from '../../tokens';

export interface TextInputProps extends Omit<TextFieldProps, 'variant'> {
  /** Show error state */
  error?: boolean;
  /** Helper text or error message */
  helperText?: string;
}

/**
 * TextInput Component
 *
 * Standard text input field
 */
export const TextInput: React.FC<TextInputProps> = ({
  error = false,
  helperText,
  sx = {},
  ...rest
}) => {
  return (
    <TextField
      fullWidth
      error={error}
      helperText={helperText}
      InputProps={{
        sx: {
          borderRadius: radiusTokens.md,
          fontSize: 13,
          backgroundColor: colorTokens.semantic.background.primary,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? colorTokens.error[600] : colorTokens.semantic.border.default,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? colorTokens.error[700] : colorTokens.semantic.border.medium,
          },
          '&.Mui-focused': {
            boxShadow: error ? `0 0 0 3px ${colorTokens.error[100]}` : shadowTokens.focus,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? colorTokens.error[600] : colorTokens.semantic.border.focus,
              borderWidth: 1,
            },
          },
        },
      }}
      FormHelperTextProps={{
        sx: {
          fontSize: 11,
          marginLeft: 0.5,
          marginTop: 0.5,
        },
      }}
      sx={sx}
      {...rest}
    />
  );
};