/**
 * FrontDesk Design System - Form Style Patterns
 *
 * Reusable style objects for form elements and containers.
 */

import { SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography, semanticSpacing } from '../tokens';
import { transitionTokens } from '../tokens/layout.tokens';

// ============================================================================
// Input Base Styles
// ============================================================================

/** Base input field styling */
export const inputBase: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: radiusTokens.md,
    backgroundColor: colorTokens.semantic.background.primary,
    transition: transitionTokens.presets.colors,
    '& fieldset': {
      borderColor: colorTokens.semantic.border.default,
    },
    '&:hover fieldset': {
      borderColor: colorTokens.semantic.border.medium,
    },
    '&.Mui-focused fieldset': {
      borderColor: colorTokens.primary[500],
      borderWidth: 2,
    },
    '&.Mui-error fieldset': {
      borderColor: colorTokens.error[500],
    },
  },
  '& .MuiInputBase-input': {
    ...semanticTypography.body.medium,
  },
};

/** Compact input variant */
export const inputCompact: SxProps<Theme> = {
  ...inputBase,
  '& .MuiOutlinedInput-root': {
    '& .MuiOutlinedInput-input': {
      py: 1,
      px: 1.5,
      ...semanticTypography.body.small,
    },
  },
};

/** Borderless input */
export const inputBorderless: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    ...semanticTypography.body.medium,
    padding: 0,
  },
};

// ============================================================================
// Input States
// ============================================================================

/** Error input state */
export const inputError: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: colorTokens.error[500],
    },
    '&:hover fieldset': {
      borderColor: colorTokens.error[600],
    },
    '&.Mui-focused fieldset': {
      borderColor: colorTokens.error[500],
    },
  },
};

/** Disabled input state */
export const inputDisabled: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: colorTokens.semantic.interactive.disabled,
    '& fieldset': {
      borderColor: colorTokens.semantic.border.light,
    },
  },
  '& .MuiInputBase-input': {
    color: colorTokens.semantic.text.disabled,
  },
};

// ============================================================================
// Form Field Containers
// ============================================================================

/** Form field container with consistent spacing */
export const formField: SxProps<Theme> = {
  mb: semanticSpacing.component.lg / 8,
};

/** Inline form field for horizontal layouts */
export const formFieldInline: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
  mb: semanticSpacing.component.md / 8,
};

/** Form section container */
export const formSection: SxProps<Theme> = {
  mb: semanticSpacing.component.xxl / 8,
  pb: semanticSpacing.component.lg / 8,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  '&:last-child': {
    borderBottom: 'none',
    mb: 0,
    pb: 0,
  },
};

/** Compact form row for settings */
export const formRowCompact: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  py: 1.5,
  px: 2,
  borderBottom: `1px solid ${colorTokens.semantic.border.light}`,
  '&:last-child': {
    borderBottom: 'none',
  },
};

// ============================================================================
// Labels & Helper Text
// ============================================================================

/** Form label styling */
export const formLabel: SxProps<Theme> = {
  ...semanticTypography.label.medium,
  color: colorTokens.semantic.text.primary,
  mb: 0.5,
  display: 'block',
};

/** Form label with required indicator */
export const formLabelRequired: SxProps<Theme> = {
  ...formLabel,
  '&::after': {
    content: '" *"',
    color: colorTokens.error[500],
  },
};

/** Helper text styling */
export const helperText: SxProps<Theme> = {
  ...semanticTypography.caption.medium,
  color: colorTokens.semantic.text.secondary,
  mt: 0.5,
};

/** Error text styling */
export const errorText: SxProps<Theme> = {
  ...semanticTypography.caption.medium,
  color: colorTokens.error[600],
  mt: 0.5,
};

/** Section label (uppercase) */
export const sectionLabel: SxProps<Theme> = {
  ...semanticTypography.label.small,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: colorTokens.semantic.text.secondary,
  mb: 1.5,
};

// ============================================================================
// Checkbox & Radio
// ============================================================================

/** Checkbox/Radio container */
export const checkboxContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  cursor: 'pointer',
  py: 0.5,
  '&:hover': {
    '& .MuiCheckbox-root, & .MuiRadio-root': {
      color: colorTokens.primary[600],
    },
  },
};

/** Checkbox/Radio label */
export const checkboxLabel: SxProps<Theme> = {
  ...semanticTypography.body.medium,
  color: colorTokens.semantic.text.primary,
  userSelect: 'none',
};

// ============================================================================
// Select Styles
// ============================================================================

/** Select dropdown styling */
export const selectDropdown: SxProps<Theme> = {
  '& .MuiSelect-select': {
    ...semanticTypography.body.medium,
    py: 1,
    px: 1.5,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: colorTokens.semantic.border.default,
    borderRadius: radiusTokens.md,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: colorTokens.semantic.border.medium,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: colorTokens.primary[500],
  },
};

/** Select menu paper */
export const selectMenuPaper: SxProps<Theme> = {
  mt: 0.5,
  borderRadius: radiusTokens.md,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${colorTokens.semantic.border.default}`,
  '& .MuiMenuItem-root': {
    ...semanticTypography.body.medium,
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
};

// ============================================================================
// Button Groups
// ============================================================================

/** Button group container */
export const buttonGroup: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  '& > *': {
    flex: 'none',
  },
};

/** Button group with primary action emphasized */
export const buttonGroupPrimary: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  justifyContent: 'flex-end',
  '& > *:last-child': {
    ml: 1,
  },
};

// ============================================================================
// Form Actions
// ============================================================================

/** Form action bar (bottom of form) */
export const formActions: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 1,
  pt: 2,
  mt: 2,
  borderTop: `1px solid ${colorTokens.semantic.border.default}`,
};

/** Form action bar - left aligned */
export const formActionsLeft: SxProps<Theme> = {
  ...formActions,
  justifyContent: 'flex-start',
};

/** Form action bar - space between */
export const formActionsBetween: SxProps<Theme> = {
  ...formActions,
  justifyContent: 'space-between',
};

