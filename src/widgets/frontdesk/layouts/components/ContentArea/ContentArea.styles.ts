import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  position: 'relative'
}));

export const ContentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0
}));

export const ContentBody = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
  
  '&::-webkit-scrollbar': {
    width: 8
  },
  
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default
  },
  
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 4,
    
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

export const ContentFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0
}));