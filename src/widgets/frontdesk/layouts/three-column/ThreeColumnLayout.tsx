import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ThreeColumnLayoutProps {
  navigationContent: React.ReactNode;  // Column 1 - Navigation
  listContent: React.ReactNode;        // Column 2 - Dynamic List
  mainContent: React.ReactNode;        // Column 3 - Main Content
  navigationWidth?: number;            // Default: 100px
  listWidth?: number;                   // Default: 380px
  className?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  navigationContent,
  listContent,
  mainContent,
  navigationWidth = 100,
  listWidth = 380,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Responsive width adjustments
  const finalNavWidth = isMobile ? 60 : navigationWidth;
  const finalListWidth = isMobile ? 280 : (isTablet ? 320 : listWidth);

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

      {/* Column 2: Dynamic List Panel */}
      <Box
        sx={{
          width: finalListWidth,
          minWidth: finalListWidth,
          height: '100%',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          overflow: 'hidden',
          display: isMobile && mainContent ? 'none' : 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease'
        }}
      >
        {listContent}
      </Box>

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