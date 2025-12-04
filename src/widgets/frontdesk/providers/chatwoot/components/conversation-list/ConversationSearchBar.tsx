/**
 * ConversationSearchBar Component
 * 
 * Modern pill-style search input with clean design.
 * Features subtle border, internal icon placement, and soft placeholder.
 */

import React, { useState, useEffect } from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

// =============================================================================
// Types
// =============================================================================

interface ConversationSearchBarProps {
  filters: Partial<ConversationListParams>;
  onFiltersChange: (filters: Partial<ConversationListParams>) => void;
  /** @deprecated No longer used - colors are now from design tokens */
  neutralColor?: (shade: number) => string;
  placeholder?: string;
}

// =============================================================================
// Constants
// =============================================================================

const SEARCH_HEIGHT = 36;
const SEARCH_RADIUS = 10;
const ICON_SIZE = 18;
const CLEAR_ICON_SIZE = 16;

// =============================================================================
// Component
// =============================================================================

export const ConversationSearchBar: React.FC<ConversationSearchBarProps> = React.memo(({
  filters,
  onFiltersChange,
  placeholder = "Search tickets...",
}) => {
  // Local search state for immediate UI updates
  const [searchValue, setSearchValue] = useState(filters.q || "");
  const [isFocused, setIsFocused] = useState(false);
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
        px: 1.5,
        py: 1.25,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: SEARCH_HEIGHT,
          px: 1.5,
          backgroundColor: colorTokens.semantic.background.primary,
          border: `1px solid ${isFocused ? colorTokens.primary[300] : colorTokens.neutral[200]}`,
          borderRadius: `${SEARCH_RADIUS}px`,
          transition: "all 0.15s ease",
          boxShadow: isFocused 
            ? `0 0 0 3px ${colorTokens.primary[100]}` 
            : "0 1px 2px rgba(0, 0, 0, 0.02)",
          "&:hover": {
            borderColor: isFocused ? colorTokens.primary[300] : colorTokens.neutral[300],
          },
        }}
      >
        {/* Search Icon - Left aligned inside input */}
        <SearchIcon 
          sx={{ 
            fontSize: ICON_SIZE, 
            color: isFocused ? colorTokens.primary[500] : colorTokens.neutral[400],
            flexShrink: 0,
            mr: 1,
            transition: "color 0.15s ease",
          }} 
        />
        
        {/* Input Field */}
        <InputBase
          fullWidth
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 400,
            color: colorTokens.neutral[800],
            "& .MuiInputBase-input": {
              p: 0,
              "&::placeholder": {
                color: colorTokens.neutral[400],
                opacity: 1,
              },
            },
          }}
        />
        
        {/* Clear Button - Only visible when there's input */}
        {searchValue && (
          <IconButton 
            size="small" 
            onClick={handleClear}
            sx={{ 
              p: 0.5,
              ml: 0.5,
              color: colorTokens.neutral[400],
              "&:hover": {
                backgroundColor: colorTokens.neutral[100],
                color: colorTokens.neutral[600],
              },
            }}
            aria-label="Clear search"
          >
            <CloseIcon sx={{ fontSize: CLEAR_ICON_SIZE }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filters.q === nextProps.filters.q &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.placeholder === nextProps.placeholder
  );
});
