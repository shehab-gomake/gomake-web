import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  position: 'relative'
}));

export const NavigationColumn = styled(Box)<{ width: number }>(({ theme, width }) => ({
  width,
  minWidth: width,
  height: '100%',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
  zIndex: 3,
  
  [theme.breakpoints.down('md')]: {
    width: 60,
    minWidth: 60
  }
}));

export const ListColumn = styled(Box)<{ width: number }>(({ theme, width }) => ({
  width,
  minWidth: width,
  height: '100%',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
  zIndex: 2,
  
  [theme.breakpoints.down('lg')]: {
    width: 320,
    minWidth: 320
  },
  
  [theme.breakpoints.down('md')]: {
    width: 280,
    minWidth: 280
  }
}));

export const ContentColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  zIndex: 1
}));

// Mobile overlay styles
export const MobileOverlay = styled(Box)<{ show: boolean }>(({ theme, show }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: show ? 'block' : 'none',
  zIndex: 4,
  
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));