import { ComponentType } from "react";

/**
 * Theme configuration interface
 * Defines the structure for theme overrides including styles, pages, and components
 */
export interface ThemeConfig {
  /** Unique theme identifier */
  name: string;

  /** Style configuration for the theme */
  styles: {
    /** CSS custom properties (variables) to inject */
    cssVariables: Record<string, string>;
    /** Optional path to external stylesheet */
    customStylesheet?: string;
  };

  /** Page-level component overrides */
  pages: Record<string, ComponentType<any>>;

  /** Component-level overrides */
  components: Record<string, ComponentType<any>>;

  /** Icon overrides for cards/widgets */
  icons?: Record<string, ComponentType<any>>;
}

/**
 * Theme context value interface
 * Available to all components via useTheme hook
 */
export interface ThemeContextValue {
  /** Currently active theme name (from localStorage) */
  currentTheme: string | null;

  /** Loaded theme configuration */
  themeConfig: ThemeConfig | null;

  /** Loading state */
  isLoading: boolean;

  /** Get page override component by name */
  getPageOverride: <T = any>(pageName: string) => ComponentType<T> | null;

  /** Get component override by name */
  getComponentOverride: <T = any>(
    componentName: string
  ) => ComponentType<T> | null;

  /** Get icon override by name */
  getIconOverride: <T = any>(iconName: string) => ComponentType<T> | null;

  /** Programmatically switch theme */
  setTheme: (themeName: string | null) => void;
}

/**
 * Theme loader function type
 * Dynamically imports theme configuration
 */
export type ThemeLoader = (themeName: string) => Promise<ThemeConfig | null>;
