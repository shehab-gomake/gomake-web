import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton , useTheme, alpha } from "@mui/material";
import { colorTokens, radiusTokens } from "@/widgets/frontdesk/design-system";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useDebouncedValue } from "../../hooks/use-debounced-value";

interface ChatwootSearchFilterProps {
  /**
   * Current search value
   */
  value: string;

  /**
   * Callback when search value changes (debounced)
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   * @default "Search conversations..."
   */
  placeholder?: string;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceDelay?: number;

  /**
   * Whether the search is disabled
   */
  disabled?: boolean;
}

/**
 * Search filter component with debouncing for Chatwoot conversations
 *
 * Automatically debounces input to avoid excessive API calls.
 * Shows clear button when there's a search value.
 *
 * @example
 * ```tsx
 * <ChatwootSearchFilter
 *   value={searchQuery}
 *   onChange={(query) => handleFiltersChange({ q: query })}
 *   placeholder="Search messages..."
 * />
 * ```
 */
export const ChatwootSearchFilter: React.FC<ChatwootSearchFilterProps> = ({
  value,
  onChange,
  placeholder = "Search conversations...",
  debounceDelay = 300,
  disabled = false,
}) => {
  const theme = useTheme();
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState(value);

  // Debounced value for API calls
  const debouncedValue = useDebouncedValue(localValue, debounceDelay);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]); // Intentionally exclude 'value' to avoid loops

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <TextField
      size="small"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: colorTokens.neutral[400], fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                padding: 0.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        minWidth: 250,
        "& .MuiOutlinedInput-root": {
          backgroundColor: colorTokens.semantic.background.primary,
          "&:hover": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          },
        },
      }}
    />
  );
};
