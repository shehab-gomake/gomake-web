import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  userSelect: 'none'
}));

export const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 64,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

export const NavSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  '& + &': {
    borderTop: `1px solid ${theme.palette.divider}`
  }
}));

export const NavButton = styled(IconButton)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: '100%',
  height: 56,
  borderRadius: 0,
  position: 'relative',
  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: isSelected ? `${theme.palette.primary.main}10` : 'transparent',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    backgroundColor: isSelected 
      ? `${theme.palette.primary.main}20` 
      : theme.palette.action.hover
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 24,
    backgroundColor: theme.palette.primary.main,
    opacity: isSelected ? 1 : 0,
    transition: 'opacity 0.2s ease',
    borderRadius: '0 2px 2px 0'
  },
  
  [theme.breakpoints.down('md')]: {
    height: 48
  }
}));

export const SectionLabel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.625rem',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  opacity: 0.7,
  
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

export const FooterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.disabled
}));