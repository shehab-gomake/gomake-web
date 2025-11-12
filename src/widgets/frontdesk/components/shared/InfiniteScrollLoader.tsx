import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface InfiniteScrollLoaderProps {
  size?: number; // Size of the spinner (default: 24)
  padding?: number; // Vertical padding in pixels (default: 16)
}

/**
 * Loading indicator for infinite scroll
 * Shows a centered spinner at the bottom of a scrollable list
 */
export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({ size = 24, padding = 16 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: `${padding}px`,
        width: "100%",
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};
