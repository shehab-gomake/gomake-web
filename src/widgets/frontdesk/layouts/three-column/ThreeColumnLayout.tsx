import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ThreeColumnLayoutProps {
  navigationContent: React.ReactNode;  // Column 1 - Navigation
  listContent: React.ReactNode;        // Column 2 - Dynamic List (kept for compatibility but not used)
  mainContent: React.ReactNode;        // Column 3 - Main Content (now Column 2)
  navigationWidth?: number;            // Default: 100px
  listWidth?: number;                   // Default: 380px (kept for compatibility but not used)
  hideMiddleColumn?: boolean;          // Kept for compatibility but not used
  className?: string;
}

// Now actually a two-column layout, but keeping the name for compatibility
export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  navigationContent,
  listContent, // Accepting but not using
  mainContent,
  navigationWidth = 100,
  listWidth = 380, // Accepting but not using
  hideMiddleColumn = false, // Accepting but not using
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Responsive width adjustments
  const finalNavWidth = isMobile ? 60 : navigationWidth;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        // Add smooth transitions for layout changes
        '& > *': {
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      {/* Column 1: Navigation Sidebar */}
      <Box
        sx={{
          width: finalNavWidth,
          minWidth: finalNavWidth,
          height: '100%',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease'
        }}
      >
        {navigationContent}
      </Box>

      {/* Column 2: Main Content Area (previously Column 3) */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0 // Allow content to shrink
        }}
      >
        {mainContent}
      </Box>
    </Box>
  );
};

export default ThreeColumnLayout;