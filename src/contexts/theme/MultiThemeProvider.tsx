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

/**
 * Check if current domain should use HP Client theme
 * @returns true if domain matches HP Client domains
 */
export const shouldUseHpClientTheme = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const origin = window.location.origin;
  const hostname = window.location.hostname;
  const port = window.location.port;

  // Check for localhost:3004
  // if (hostname === "localhost" && port === "3004") {
  //   return true;
  // }

  // Check for hp.gomake.net
  if (hostname === "hp.gomake.net" || hostname === "hp.staging.gomake.net") {
    return true;
  }

  // Also check origin strings for exact matches
  if (
    // origin === "http://localhost:3004" ||
    origin === "https://hp.gomake.net" || origin === "https://hp.staging.gomake.net"
  ) {
    return true;
  }

  return false;
};

/**
 * Auto-set HP Client theme based on domain if no theme is saved
 * This can be called from anywhere to ensure theme is set correctly
 */
export const autoSetThemeFromDomain = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  const savedTheme = getItem(THEME_STORAGE_KEY);

  // Only auto-set if no theme is saved and domain matches
  if (!savedTheme && shouldUseHpClientTheme()) {
    setItem(THEME_STORAGE_KEY, "hp-client");
  }
};

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
        // Remove data-theme attribute when clearing theme
        if (typeof window !== "undefined") {
          document.documentElement.removeAttribute("data-theme");
        }
      }

      // If no theme, reset to base
      if (!themeName) {
        setThemeConfig(null);
        setCurrentTheme(null);
        // Remove data-theme attribute
        if (typeof window !== "undefined") {
          document.documentElement.removeAttribute("data-theme");
        }
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

          // Set data-theme attribute on HTML element
          if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", themeName);
          }

          setThemeConfig(config);
          setCurrentTheme(themeName);
        } else {
          console.warn(`Theme "${themeName}" not found, using base theme`);
          setThemeConfig(null);
          setCurrentTheme(null);
          // Remove data-theme attribute
          if (typeof window !== "undefined") {
            document.documentElement.removeAttribute("data-theme");
          }
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
   * If no saved theme and domain matches HP Client domains, auto-set to hp-client
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Auto-set theme from domain if needed
      autoSetThemeFromDomain();

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
