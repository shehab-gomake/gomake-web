import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ThemeContext } from "./ThemeContext";
import { ThemeConfig } from "@/themes/types";
import {
  loadThemeConfig,
  injectCSSVariables,
  removeCSSVariables,
  loadStylesheet,
  removeStylesheet,
  getThemeStylesheetId,
} from "@/themes/theme-loader";
import { getItem, setItem } from "@/services/storage-data";

const THEME_STORAGE_KEY = "selectedTheme";

interface MultiThemeProviderProps {
  children: React.ReactNode;
}

/**
 * MultiThemeProvider
 * Manages theme loading, CSS injection, and provides theme context to the app
 */
export const MultiThemeProvider: React.FC<MultiThemeProviderProps> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Load theme configuration and apply styles
   */
  const loadAndApplyTheme = useCallback(
    async (themeName: string | null) => {
      // Clear previous theme
      if (themeConfig) {
        removeCSSVariables(themeConfig.styles.cssVariables);
        if (themeConfig.styles.customStylesheet) {
          removeStylesheet(getThemeStylesheetId(themeConfig.name));
        }
      }

      // If no theme, reset to base
      if (!themeName) {
        setThemeConfig(null);
        setCurrentTheme(null);
        return;
      }

      setIsLoading(true);

      try {
        // Load theme config
        const config = await loadThemeConfig(themeName);

        if (config) {
          // Apply CSS variables
          if (config.styles.cssVariables) {
            injectCSSVariables(config.styles.cssVariables);
          }

          // Load custom stylesheet if specified
          if (config.styles.customStylesheet) {
            loadStylesheet(
              config.styles.customStylesheet,
              getThemeStylesheetId(config.name)
            );
          }

          setThemeConfig(config);
          setCurrentTheme(themeName);
        } else {
          console.warn(`Theme "${themeName}" not found, using base theme`);
          setThemeConfig(null);
          setCurrentTheme(null);
        }
      } catch (error) {
        console.error(`Error loading theme "${themeName}":`, error);
        setThemeConfig(null);
        setCurrentTheme(null);
      } finally {
        setIsLoading(false);
      }
    },
    [themeConfig]
  );

  /**
   * Initialize theme from localStorage on mount
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = getItem(THEME_STORAGE_KEY);
      loadAndApplyTheme(savedTheme);
    }
  }, []);

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = useCallback(
    (themeName: string | null) => {
      if (themeName) {
        setItem(THEME_STORAGE_KEY, themeName);
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY);
      }
      loadAndApplyTheme(themeName);
    },
    [loadAndApplyTheme]
  );

  /**
   * Get page override component by name
   */
  const getPageOverride = useCallback(
    <T = any,>(pageName: string): React.ComponentType<T> | null => {
      if (!themeConfig || !themeConfig.pages) {
        return null;
      }
      return (themeConfig.pages[pageName] as React.ComponentType<T>) || null;
    },
    [themeConfig]
  );

  /**
   * Get component override by name
   */
  const getComponentOverride = useCallback(
    <T = any,>(componentName: string): React.ComponentType<T> | null => {
      if (!themeConfig || !themeConfig.components) {
        return null;
      }
      return (
        (themeConfig.components[componentName] as React.ComponentType<T>) ||
        null
      );
    },
    [themeConfig]
  );

  /**
   * Get icon override by name
   */
  const getIconOverride = useCallback(
    <T = any,>(iconName: string): React.ComponentType<T> | null => {
      if (!themeConfig || !themeConfig.icons) {
        return null;
      }
      return (themeConfig.icons[iconName] as React.ComponentType<T>) || null;
    },
    [themeConfig]
  );

  /**
   * Memoized context value
   */
  const contextValue = useMemo(
    () => ({
      currentTheme,
      themeConfig,
      isLoading,
      getPageOverride,
      getComponentOverride,
      getIconOverride,
      setTheme,
    }),
    [
      currentTheme,
      themeConfig,
      isLoading,
      getPageOverride,
      getComponentOverride,
      getIconOverride,
      setTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
