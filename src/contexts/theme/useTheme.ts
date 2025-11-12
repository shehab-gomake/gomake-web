import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextValue } from '@/themes/types';

/**
 * Hook to access theme context
 * Provides access to current theme configuration and utilities
 * 
 * @returns ThemeContextValue
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a MultiThemeProvider');
  }
  
  return context;
}

