import React, { useState, useCallback } from "react";
import { Box, TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { parseSearchInput } from "../../utils/query-utils";

interface EmailSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const EmailSearch: React.FC<EmailSearchProps> = ({ onSearch, placeholder = "Search emails...", disabled = false }) => {
  const { neutralColor } = useGomakeTheme();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(() => {
    const query = parseSearchInput(searchValue);
    onSearch(query);
  }, [searchValue, onSearch]);

  const handleClear = useCallback(() => {
    setSearchValue("");
    onSearch("");
  }, [onSearch]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, []);

  return (
    <Box sx={{ p: 1, borderBottom: `1px solid ${neutralColor(200)}` }}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton size="small" onClick={handleClear} sx={{ p: 0.5 }}>
                  <ClearIcon sx={{ fontSize: 16, color: neutralColor(500) }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: neutralColor(25),
            "& fieldset": {
              borderColor: neutralColor(200),
            },
            "&:hover fieldset": {
              borderColor: neutralColor(300),
            },
            "&.Mui-focused fieldset": {
              borderColor: neutralColor(400),
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "0.875rem",
            py: 1,
          },
        }}
      />
    </Box>
  );
};
