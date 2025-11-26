import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  className,
  noPadding = false
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        position: 'relative',
        padding: noPadding ? 0 : '0 24px 16px 0', // No top/left padding, keep right/bottom padding
        // Add fade animation for content changes
        '& > *': {
          animation: 'fadeIn 0.2s ease-in-out',
        },
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}
    >
      {children}
    </Box>
  );
};

export default ContentArea;