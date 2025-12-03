/**
 * Reusable multi-select filter component for Chatwoot
 *
 * Displays a button that opens a dropdown menu with checkboxes.
 * Selected items are shown as chips next to the button.
 * Uses the unified list system internally.
 *
 * @deprecated Consider using UnifiedListDropdown or LabelSelect directly.
 *
 * @example
 * ```tsx
 * <ChatwootMultiSelectFilter
 *   label="Team"
 *   options={[
 *     { value: '1', label: 'Sales', count: 12 },
 *     { value: '2', label: 'Support', count: 45 }
 *   ]}
 *   selectedValues={['1']}
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { UnifiedListDropdown } from "../unified-list";
import type { GenericListItem } from "../unified-list";

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
  color?: string;
}

interface ChatwootMultiSelectFilterProps {
  /** Label for the filter button */
  label: string;
  /** Available options to select from */
  options: MultiSelectOption[];
  /** Currently selected values */
  selectedValues: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Optional placeholder when nothing is selected */
  placeholder?: string;
  /** Maximum number of chips to display before showing "+N more" */
  maxChips?: number;
  /** Whether the filter is disabled */
  disabled?: boolean;
}

export const ChatwootMultiSelectFilter: React.FC<ChatwootMultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "All",
  maxChips = 2,
  disabled = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Convert options to GenericListItem format
  const listItems = useMemo<GenericListItem[]>(
    () =>
      options.map((opt) => ({
        type: 'generic' as const,
        id: opt.value,
        label: opt.label,
        description: opt.count !== undefined ? `${opt.count}` : undefined,
        color: opt.color,
      })),
    [options]
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMultiSelect = useCallback(
    (values: Array<string | number>) => {
      onChange(values.map(String));
    },
    [onChange]
  );

  const handleRemoveChip = (value: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  // Get labels for selected values
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => ({ value: opt.value, label: opt.label, color: opt.color }));

  // Determine what to show in the button
  const displayText = selectedValues.length === 0 ? placeholder : `${label} (${selectedValues.length})`;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Filter Button */}
      <Button
        variant="outlined"
        size="small"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick}
        disabled={disabled}
        sx={{
          borderColor: colorTokens.neutral[300],
          color: selectedValues.length > 0 ? theme.palette.primary.main : colorTokens.neutral[700],
          fontWeight: selectedValues.length > 0 ? 600 : 400,
          textTransform: "none",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {displayText}
      </Button>

      {/* Selected Value Chips */}
      {selectedLabels.length > 0 && (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
          {selectedLabels.slice(0, maxChips).map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              size="small"
              onDelete={handleRemoveChip(item.value)}
              deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor: item.color ? alpha(item.color, 0.1) : alpha(theme.palette.primary.main, 0.08),
                color: item.color || theme.palette.primary.main,
                "& .MuiChip-deleteIcon": {
                  color: item.color ? alpha(item.color, 0.7) : alpha(theme.palette.primary.main, 0.7),
                  "&:hover": {
                    color: item.color || theme.palette.primary.main,
                  },
                },
              }}
            />
          ))}
          {selectedLabels.length > maxChips && (
            <Chip
              label={`+${selectedLabels.length - maxChips} more`}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              }}
            />
          )}
        </Stack>
      )}

      {/* Dropdown Menu - Using Unified List */}
      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={listItems}
        selectionMode="multiple"
        selectedValues={selectedValues}
        onMultiSelect={handleMultiSelect}
        showClearAll
        emptyMessage="No options available"
        minWidth={200}
        maxWidth={300}
        maxHeight={400}
      />
    </Box>
  );
};
