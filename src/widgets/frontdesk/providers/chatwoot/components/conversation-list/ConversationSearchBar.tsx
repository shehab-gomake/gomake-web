/**
 * ConversationSearchBar Component
 * Search input with debouncing
 */

import React, { useState, useEffect } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

interface ConversationSearchBarProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  neutralColor?: (shade: number) => string;
  placeholder?: string;
}

export const ConversationSearchBar: React.FC<ConversationSearchBarProps> = React.memo(({
  filters,
  onFiltersChange,
  neutralColor,
  placeholder = "Search tickets...",
}) => {
  // Local search state for immediate UI updates
  const [searchValue, setSearchValue] = useState(filters.q || "");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  // Apply debounced search to filters
  useEffect(() => {
    if (debouncedSearch !== filters.q) {
      onFiltersChange({ ...filters, q: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
      }}
    >
      <TextField
        size="small"
        fullWidth
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: colorTokens.neutral[400] }} />
            </InputAdornment>
          ),
          endAdornment: searchValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} sx={{ padding: 0.5 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.875rem",
            backgroundColor: colorTokens.semantic.background.primary,
          },
        }}
      />
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if search query or callbacks changed
  return (
    prevProps.filters.q === nextProps.filters.q &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.neutralColor === nextProps.neutralColor &&
    prevProps.placeholder === nextProps.placeholder
  );
});
