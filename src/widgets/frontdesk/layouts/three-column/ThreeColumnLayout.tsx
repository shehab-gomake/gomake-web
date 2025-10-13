import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ThreeColumnLayoutProps {
  navigationContent: React.ReactNode;  // Column 1 - Navigation sidebar
  listContent?: React.ReactNode;       // Column 2 - List panel (optional for backward compatibility)
  mainContent: React.ReactNode;        // Column 3 - Main content area
  navigationWidth?: number;            // Default: 220px
  listWidth?: number;                  // Default: 280px
  hideMiddleColumn?: boolean;          // Hide list column for certain views
  className?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  navigationContent,
  listContent,
  mainContent,
  navigationWidth = 220,
  listWidth = 280,
  hideMiddleColumn = false,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Responsive width adjustments
  const finalNavWidth = isMobile ? 60 : navigationWidth;
  const finalListWidth = isMobile ? 200 : listWidth;

  // Determine if we should show the list column
  const showListColumn = !hideMiddleColumn && listContent;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
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

      {/* Column 2: List Panel (conditionally rendered) */}
      {showListColumn && (
        <Box
          sx={{
            width: finalListWidth,
            minWidth: finalListWidth,
            height: '100%',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {listContent}
        </Box>
      )}

      {/* Column 3: Main Content Area */}
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