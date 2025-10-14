import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const PanelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.default
}));

export const PanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0
}));

export const PanelContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
  padding: theme.spacing(1, 2),
  
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

export const SearchField = styled(Box)(({ theme }) => ({
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.default,
      
      '& fieldset': {
        borderColor: theme.palette.divider
      },
      
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
      
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main
      }
    }
  }
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  padding: theme.spacing(3)
}));

export const ErrorState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: `${theme.palette.error.light}10`,
  borderLeft: `3px solid ${theme.palette.error.main}`
}));

export const LoadingState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
}));