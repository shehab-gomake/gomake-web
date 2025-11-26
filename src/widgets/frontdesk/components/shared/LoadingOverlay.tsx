import React from "react";
import { Box, Stack, CircularProgress, Typography, Fade } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface LoadingOverlayProps {
  /**
   * Whether to show the loading overlay
   */
  loading: boolean;
  /**
   * Loading message to display
   * @default "Loading..."
   */
  message?: string;
  /**
   * Size of the circular progress indicator
   * @default 24
   */
  spinnerSize?: number;
  /**
   * Background color opacity (0-1)
   * @default 0.95
   */
  backgroundColorOpacity?: number;
  /**
   * Whether to apply backdrop blur
   * @default true
   */
  blur?: boolean;
  /**
   * Custom z-index
   * @default 100
   */
  zIndex?: number;
}

/**
 * LoadingOverlay
 *
 * A beautiful loading overlay component with glassmorphism effect.
 * Perfect for showing loading states while data is being fetched.
 *
 * @example
 * ```tsx
 * <Box sx={{ position: "relative", height: "100%" }}>
 *   <LoadingOverlay loading={isLoading} message="Loading conversations..." />
 *   {/* Your content here *\/}
 * </Box>
 * ```
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message = "Loading...",
  spinnerSize = 24,
  backgroundColorOpacity = 0.95,
  blur = true,
  zIndex = 100,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();

  if (!loading) return null;

  return (
    <Fade in={loading}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(255, 255, 255, ${backgroundColorOpacity})`,
          backdropFilter: blur ? "blur(4px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex,
          borderRadius: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress
            size={spinnerSize}
            thickness={4}
            sx={{
              color: primaryColor(500),
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: neutralColor(700),
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {message}
          </Typography>
        </Stack>
      </Box>
    </Fade>
  );
};
