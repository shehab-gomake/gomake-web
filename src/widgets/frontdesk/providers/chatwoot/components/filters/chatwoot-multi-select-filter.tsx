import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
  color?: string;
}

interface ChatwootMultiSelectFilterProps {
  /**
   * Label for the filter button
   */
  label: string;

  /**
   * Available options to select from
   */
  options: MultiSelectOption[];

  /**
   * Currently selected values
   */
  selectedValues: string[];

  /**
   * Callback when selection changes
   */
  onChange: (selected: string[]) => void;

  /**
   * Optional placeholder when nothing is selected
   */
  placeholder?: string;

  /**
   * Maximum number of chips to display before showing "+N more"
   * @default 2
   */
  maxChips?: number;

  /**
   * Whether the filter is disabled
   */
  disabled?: boolean;
}

/**
 * Reusable multi-select filter component for Chatwoot
 *
 * Displays a button that opens a dropdown menu with checkboxes.
 * Selected items are shown as chips next to the button.
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
  const { neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelected);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    handleClose();
  };

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
          borderColor: neutralColor(300),
          color: selectedValues.length > 0 ? theme.palette.primary.main : neutralColor(700),
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

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            maxWidth: 300,
            maxHeight: 400,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
          },
        }}
      >
        {/* Header with Clear All */}
        {selectedValues.length > 0 && (
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: `1px solid ${neutralColor(200)}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: neutralColor(600), fontWeight: 600 }}>
              {selectedValues.length} selected
            </Typography>
            <Button
              size="small"
              onClick={handleClearAll}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                minWidth: "auto",
                padding: "2px 8px",
              }}
            >
              Clear all
            </Button>
          </Box>
        )}

        {/* Options */}
        {options.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No options available
            </Typography>
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleToggle(option.value)}
              sx={{
                py: 0.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    size="small"
                    sx={{
                      color: neutralColor(400),
                      "&.Mui-checked": {
                        color: option.color || theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {option.label}
                    </Typography>
                    {option.count !== undefined && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: neutralColor(500),
                          backgroundColor: neutralColor(100),
                          px: 0.75,
                          py: 0.25,
                          borderRadius: "4px",
                        }}
                      >
                        {option.count}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ m: 0, flex: 1 }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};
