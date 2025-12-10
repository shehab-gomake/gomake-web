/**
 * UnifiedListDropdown Component
 *
 * Production-ready base component for all dropdown lists in FrontDesk Chatwoot.
 * Handles both single and multiple selection modes with consistent styling.
 *
 * Features:
 * - Single and multiple selection modes
 * - Optional search/filter
 * - Loading and error states
 * - Empty state handling
 * - Header and footer actions
 * - Keyboard navigation
 * - Accessibility support
 *
 * @module unified-list/UnifiedListDropdown
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Divider,
  Checkbox,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import type {
  BaseListItem,
  UnifiedListDropdownBaseProps,
  ActionItem,
} from './types';

// =============================================================================
// PROPS
// =============================================================================

export interface UnifiedListDropdownProps<T extends BaseListItem> extends UnifiedListDropdownBaseProps {
  /** Whether dropdown is open */
  open: boolean;
  /** Anchor element for positioning */
  anchorEl: HTMLElement | null;
  /** Close handler */
  onClose: () => void;
  /** List items */
  items: T[];
  /** Selection mode */
  selectionMode: 'single' | 'multiple';
  /** Selected value(s) */
  selectedValue?: string | number | null;
  selectedValues?: Array<string | number>;
  /** Change handlers */
  onSelect?: (value: string | number | null, item: T | null) => void;
  onMultiSelect?: (values: Array<string | number>, items: T[]) => void;
  /** Custom item renderer */
  renderItem?: (item: T, isSelected: boolean, onClick: () => void) => React.ReactNode;
  /** Show none/unassign option */
  showNoneOption?: boolean;
  noneOptionLabel?: string;
  /** Show clear all for multi-select */
  showClearAll?: boolean;
  /** Header actions (e.g., "Self Assign") */
  headerActions?: ActionItem[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function UnifiedListDropdown<T extends BaseListItem>({
  open,
  anchorEl,
  onClose,
  items,
  selectionMode,
  selectedValue,
  selectedValues = [],
  onSelect,
  onMultiSelect,
  renderItem,
  showNoneOption = false,
  noneOptionLabel = 'None',
  showClearAll = true,
  headerActions = [],
  // Base props
  anchorOrigin: providedAnchorOrigin,
  transformOrigin: providedTransformOrigin,
  menuSx,
  minWidth = 240,
  maxWidth = 320,
  maxHeight = 360,
  loading = false,
  error,
  emptyMessage = 'No items available',
  searchable = false,
  searchPlaceholder = 'Search...',
  headerText,
  footerActions = [],
  closeOnSelect,
  sx,
}: UnifiedListDropdownProps<T>) {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  
  // RTL-aware positioning
  const anchorOrigin = providedAnchorOrigin || {
    vertical: 'bottom',
    horizontal: isRTL ? 'left' : 'right',
  };
  const transformOrigin = providedTransformOrigin || {
    vertical: 'top',
    horizontal: isRTL ? 'left' : 'right',
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when menu opens
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open, searchable]);

  // Reset search when menu closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Check if item is selected
  const isItemSelected = useCallback(
    (item: T): boolean => {
      if (selectionMode === 'single') {
        return selectedValue === item.id;
      }
      return selectedValues.includes(item.id);
    },
    [selectionMode, selectedValue, selectedValues]
  );

  // Handle item click
  const handleItemClick = useCallback(
    (item: T) => {
      if (item.disabled) return;

      if (selectionMode === 'single') {
        onSelect?.(item.id, item);
        if (closeOnSelect !== false) {
          onClose();
        }
      } else {
        const currentValues = [...selectedValues];
        const index = currentValues.indexOf(item.id);
        if (index >= 0) {
          currentValues.splice(index, 1);
        } else {
          currentValues.push(item.id);
        }
        const selectedItems = items.filter((i) => currentValues.includes(i.id));
        onMultiSelect?.(currentValues, selectedItems);
        // Don't close on multi-select by default
        if (closeOnSelect === true) {
          onClose();
        }
      }
    },
    [selectionMode, selectedValues, items, onSelect, onMultiSelect, onClose, closeOnSelect]
  );

  // Handle "None" option click
  const handleNoneClick = useCallback(() => {
    if (selectionMode === 'single') {
      onSelect?.(null, null);
      if (closeOnSelect !== false) {
        onClose();
      }
    }
  }, [selectionMode, onSelect, onClose, closeOnSelect]);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    if (selectionMode === 'multiple') {
      onMultiSelect?.([], []);
    }
  }, [selectionMode, onMultiSelect]);

  // Has selected items (for multi-select header)
  const hasSelectedItems = selectionMode === 'multiple' && selectedValues.length > 0;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth,
          maxWidth,
          backgroundColor: colorTokens.neutral[0] || '#ffffff',
          border: `1px solid ${colorTokens.neutral[200]}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          direction: dir,
          ...menuSx,
        },
      }}
      MenuListProps={{
        sx: { py: 0 },
      }}
    >
      {/* Header Section */}
      {(headerText || headerActions.length > 0 || (searchable && items.length > 5)) && (
        <Box sx={{ flexShrink: 0 }}>
          {/* Header Text */}
          {headerText && (
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: colorTokens.neutral[500],
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {headerText}
              </Typography>
            </Box>
          )}

          {/* Header Actions (e.g., Self Assign) */}
          {headerActions.length > 0 && (
            <>
              {headerActions.map((action) => (
                <MenuItem
                  key={action.id}
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    gap: 1.5,
                    fontWeight: 600,
                    color: colorTokens.primary[600],
                    '&:hover': {
                      backgroundColor: alpha(colorTokens.primary[600], 0.08),
                    },
                  }}
                >
                  {action.icon && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                      {action.icon}
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                    {action.label}
                  </Typography>
                </MenuItem>
              ))}
              <Divider sx={{ my: 0.5 }} />
            </>
          )}

          {/* Search Input */}
          {searchable && items.length > 5 && (
            <Box sx={{ px: 1.5, py: 1, direction: dir }}>
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position={isRTL ? "end" : "start"}>
                      <SearchIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
                    </InputAdornment>
                  ),
                  sx: {
                    fontSize: 13,
                    direction: dir,
                    '& input': { py: 0.75 },
                  },
                }}
                sx={{
                  direction: dir,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    backgroundColor: colorTokens.neutral[50],
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Multi-select header with count and clear */}
      {hasSelectedItems && showClearAll && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: `1px solid ${colorTokens.neutral[200]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colorTokens.neutral[50],
            flexShrink: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: colorTokens.neutral[600], fontWeight: 600 }}
          >
            {selectedValues.length} selected
          </Typography>
          <Typography
            variant="caption"
            onClick={handleClearAll}
            sx={{
              color: colorTokens.primary[600],
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Clear all
          </Typography>
        </Box>
      )}

      {/* Scrollable Items Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight,
          py: 0.5,
        }}
      >
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ color: colorTokens.primary[600] }} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: colorTokens.error[600], fontSize: 13 }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: colorTokens.neutral[500], fontSize: 13 }}
            >
              {searchQuery ? 'No matching items' : emptyMessage}
            </Typography>
          </Box>
        )}

        {/* None Option (for single select) */}
        {!loading && !error && showNoneOption && selectionMode === 'single' && (
          <MenuItem
            onClick={handleNoneClick}
            sx={{
              px: 2,
              py: 1,
              gap: 1.5,
              backgroundColor: selectedValue === null ? alpha(colorTokens.primary[600], 0.08) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(colorTokens.primary[600], 0.12),
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: selectedValue === null ? 600 : 400,
                color: colorTokens.neutral[700],
              }}
            >
              {noneOptionLabel}
            </Typography>
            {selectedValue === null && (
              <CheckIcon
                sx={{
                  fontSize: 16,
                  color: colorTokens.primary[600],
                  ml: 'auto',
                }}
              />
            )}
          </MenuItem>
        )}

        {/* Items List */}
        {!loading &&
          !error &&
          filteredItems.map((item) => {
            const isSelected = isItemSelected(item);

            // Use custom renderer if provided
            if (renderItem) {
              return (
                <Box key={item.id} onClick={() => !item.disabled && handleItemClick(item)}>
                  {renderItem(item, isSelected, () => handleItemClick(item))}
                </Box>
              );
            }

            // Default rendering
            return (
              <MenuItem
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                sx={{
                  px: 2,
                  py: 1,
                  gap: 1.5,
                  backgroundColor: isSelected ? alpha(colorTokens.primary[600], 0.08) : 'transparent',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? alpha(colorTokens.primary[600], 0.12)
                      : colorTokens.neutral[50],
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                {/* Checkbox for multi-select */}
                {selectionMode === 'multiple' && (
                  <Checkbox
                    checked={isSelected}
                    size="small"
                    sx={{
                      p: 0,
                      color: colorTokens.neutral[400],
                      '&.Mui-checked': {
                        color: colorTokens.primary[600],
                      },
                    }}
                  />
                )}

                {/* Label */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      color: colorTokens.neutral[900],
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 11,
                        color: colorTokens.neutral[500],
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>

                {/* Check icon for single select */}
                {selectionMode === 'single' && isSelected && (
                  <CheckIcon
                    sx={{
                      fontSize: 16,
                      color: colorTokens.primary[600],
                      flexShrink: 0,
                    }}
                  />
                )}
              </MenuItem>
            );
          })}
      </Box>

      {/* Footer Actions */}
      {footerActions.length > 0 && !loading && (
        <Box sx={{ flexShrink: 0 }}>
          <Divider />
          {footerActions.map((action) => (
            <MenuItem
              key={action.id}
              onClick={() => {
                action.onClick();
                if (action.variant !== 'danger') {
                  // Don't close for danger actions (usually confirmation needed)
                }
              }}
              sx={{
                px: 2,
                py: 1.25,
                justifyContent: 'center',
                gap: 1,
                color:
                  action.variant === 'danger'
                    ? colorTokens.error[600]
                    : action.variant === 'primary'
                    ? colorTokens.primary[600]
                    : colorTokens.neutral[700],
                fontWeight: 600,
                '&:hover': {
                  backgroundColor:
                    action.variant === 'danger'
                      ? alpha(colorTokens.error[600], 0.08)
                      : action.variant === 'primary'
                      ? alpha(colorTokens.primary[600], 0.08)
                      : colorTokens.neutral[50],
                },
              }}
            >
              {action.icon}
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                {action.label}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      )}
    </Menu>
  );
}

export default UnifiedListDropdown;

