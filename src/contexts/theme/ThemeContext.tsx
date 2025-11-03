import { createContext } from "react";
import { ThemeContextValue } from "@/themes/types";

/**
 * Theme Context
 * Provides theme configuration and utilities to all components in the tree
 */
export const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: null,
  themeConfig: null,
  isLoading: false,
  getPageOverride: () => null,
  getComponentOverride: () => null,
  getIconOverride: () => null,
  setTheme: () => {},
});
