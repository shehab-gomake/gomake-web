import { ThemeConfig } from '../types';
import ExampleHomePage from './pages/HomePage';
import ExampleHomePageComponent from './components/HomePageComponent';

/**
 * Example Theme Configuration
 * 
 * This demonstrates how to configure a complete theme with:
 * - CSS variables for styling
 * - Page-level overrides
 * - Component-level overrides
 */
const exampleThemeConfig: ThemeConfig = {
  name: 'example',
  
  styles: {
    // CSS custom properties to inject
    cssVariables: {
      // Primary Colors
      '--theme-primary-color': '#6366f1',
      '--theme-primary-hover': '#4f46e5',
      '--theme-primary-light': '#a5b4fc',
      
      // Secondary Colors
      '--theme-secondary-color': '#ec4899',
      '--theme-secondary-hover': '#db2777',
      
      // Background Colors
      '--theme-bg-primary': '#ffffff',
      '--theme-bg-secondary': '#f8fafc',
      '--theme-bg-tertiary': '#f1f5f9',
      
      // Text Colors
      '--theme-text-primary': '#0f172a',
      '--theme-text-secondary': '#475569',
      '--theme-text-muted': '#94a3b8',
      
      // Border Colors
      '--theme-border-color': '#e2e8f0',
      '--theme-border-hover': '#cbd5e1',
      
      // Spacing
      '--theme-spacing-xs': '4px',
      '--theme-spacing-sm': '8px',
      '--theme-spacing-md': '16px',
      '--theme-spacing-lg': '24px',
      '--theme-spacing-xl': '32px',
      
      // Border Radius
      '--theme-radius-sm': '4px',
      '--theme-radius-md': '8px',
      '--theme-radius-lg': '12px',
      '--theme-radius-xl': '16px',
      
      // Shadows
      '--theme-shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '--theme-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      '--theme-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    
    // Optional: external stylesheet (if you have one)
    // customStylesheet: '/themes/example/styles/theme.css',
  },
  
  // Page-level component overrides
  pages: {
    // When 'HomePage' is requested, use ExampleHomePage instead
    HomePage: ExampleHomePage,
  },
  
  // Component-level overrides
  components: {
    // When 'HomePageComponent' is requested, use ExampleHomePageComponent instead
    HomePageComponent: ExampleHomePageComponent,
  },
};

export default exampleThemeConfig;

