import { ThemeConfig } from './types';

/**
 * Dynamically loads a theme configuration by name
 * Uses dynamic import to load theme config only when needed
 * 
 * @param themeName - Name of the theme to load (must match folder name in src/themes/)
 * @returns Promise resolving to ThemeConfig or null if theme not found
 */
export async function loadThemeConfig(themeName: string): Promise<ThemeConfig | null> {
  if (!themeName) {
    return null;
  }

  try {
    // Dynamic import of theme configuration
    // Path: src/themes/[themeName]/theme.config.ts
    const themeModule = await import(`./${themeName}/theme.config`);
    
    // Theme config should be default export
    const config: ThemeConfig = themeModule.default || themeModule.themeConfig;
    
    if (!config || !config.name) {
      console.warn(`Invalid theme config for "${themeName}"`);
      return null;
    }
    
    return config;
  } catch (error) {
    console.warn(`Failed to load theme "${themeName}":`, error);
    return null;
  }
}

/**
 * Injects CSS variables into the document root
 * 
 * @param variables - Object containing CSS custom property key-value pairs
 */
export function injectCSSVariables(variables: Record<string, string>): void {
  if (typeof window === 'undefined') {
    return;
  }

  const root = document.documentElement;
  
  Object.entries(variables).forEach(([key, value]) => {
    // Ensure CSS variable names start with --
    const varName = key.startsWith('--') ? key : `--${key}`;
    root.style.setProperty(varName, value);
  });
}

/**
 * Removes previously injected CSS variables
 * 
 * @param variables - Object containing CSS custom property keys to remove
 */
export function removeCSSVariables(variables: Record<string, string>): void {
  if (typeof window === 'undefined') {
    return;
  }

  const root = document.documentElement;
  
  Object.keys(variables).forEach((key) => {
    const varName = key.startsWith('--') ? key : `--${key}`;
    root.style.removeProperty(varName);
  });
}

/**
 * Loads and injects an external stylesheet
 * 
 * @param href - URL or path to the stylesheet
 * @param id - Unique identifier for the link element
 */
export function loadStylesheet(href: string, id: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if stylesheet already exists
  const existing = document.getElementById(id);
  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Removes a previously loaded stylesheet
 * 
 * @param id - Unique identifier of the link element to remove
 */
export function removeStylesheet(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const link = document.getElementById(id);
  if (link) {
    link.remove();
  }
}

/**
 * Gets the stylesheet ID for a theme
 * 
 * @param themeName - Name of the theme
 * @returns Unique stylesheet ID
 */
export function getThemeStylesheetId(themeName: string): string {
  return `theme-stylesheet-${themeName}`;
}

