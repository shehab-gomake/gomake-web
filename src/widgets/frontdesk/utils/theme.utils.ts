/**
 * Theme utilities for FrontDesk components
 *
 * Provides safe wrappers for theme color functions with proper fallbacks
 * and error handling. Ensures components work reliably even when theme
 * functions are undefined or return invalid values.
 */

import { Theme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

// ============================================================================
// Types
// ============================================================================

/**
 * Color degree mapping (50-900)
 */
export type ColorDegree = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Color function type from useGomakeTheme
 */
export type ColorFunction = ((degree: number) => string) | undefined;

/**
 * MUI Grey palette color map
 */
const GREY_COLOR_MAP: Record<ColorDegree, string> = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#EEEEEE",
  300: "#E0E0E0",
  400: "#BDBDBD",
  500: "#9E9E9E",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
} as const;

// ============================================================================
// Core Utilities
// ============================================================================

/**
 * Creates a safe wrapper for neutralColor with fallbacks
 *
 * @param neutralColor - The neutralColor function from useGomakeTheme (may be undefined)
 * @param theme - MUI Theme object for fallback colors
 * @returns A safe color function that always returns a valid color string
 *
 * @example
 * ```tsx
 * const { neutralColor } = useGomakeTheme();
 * const theme = useTheme();
 * const safeNeutralColor = createSafeNeutralColor(neutralColor, theme);
 *
 * // Use safely - will never throw
 * const bgColor = safeNeutralColor(100); // Returns valid color string
 * ```
 */
export function createSafeNeutralColor(
  neutralColor: ColorFunction,
  theme: Theme
): (degree: ColorDegree) => string {
  return (degree: ColorDegree): string => {
    // Try to use the provided neutralColor function
    if (typeof neutralColor === "function") {
      try {
        const color = neutralColor(degree);
        // Validate the returned color is a non-empty string
        if (color && typeof color === "string" && color.trim().length > 0) {
          return color;
        }
      } catch (error) {
        // Log error in development but don't break the UI
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[createSafeNeutralColor] Error calling neutralColor(${degree}):`,
            error
          );
        }
      }
    }

    // Fallback 1: Try MUI theme palette grey colors
    try {
      const themeGrey = theme.palette.grey?.[degree];
      if (themeGrey && typeof themeGrey === "string") {
        return themeGrey;
      }
    } catch (error) {
      // Theme palette access failed, continue to next fallback
    }

    // Fallback 2: Use static grey color map
    const staticColor = GREY_COLOR_MAP[degree];
    if (staticColor) {
      return staticColor;
    }

    // Fallback 3: Use theme text secondary or default grey
    try {
      const fallbackColor =
        theme.palette.text?.secondary || theme.palette.grey?.[500] || GREY_COLOR_MAP[500];
      return fallbackColor;
    } catch {
      // Ultimate fallback
      return GREY_COLOR_MAP[500];
    }
  };
}

/**
 * Creates a safe wrapper for primaryColor with fallbacks
 *
 * @param primaryColor - The primaryColor function from useGomakeTheme (may be undefined)
 * @param theme - MUI Theme object for fallback colors
 * @returns A safe color function that always returns a valid color string
 *
 * @example
 * ```tsx
 * const { primaryColor } = useGomakeTheme();
 * const theme = useTheme();
 * const safePrimaryColor = createSafePrimaryColor(primaryColor, theme);
 *
 * // Use safely - will never throw
 * const bgColor = safePrimaryColor(500); // Returns valid color string
 * ```
 */
export function createSafePrimaryColor(
  primaryColor: ColorFunction,
  theme: Theme
): (degree: ColorDegree) => string {
  return (degree: ColorDegree): string => {
    // Try to use the provided primaryColor function
    if (typeof primaryColor === "function") {
      try {
        const color = primaryColor(degree);
        // Validate the returned color is a non-empty string
        if (color && typeof color === "string" && color.trim().length > 0) {
          return color;
        }
      } catch (error) {
        // Log error in development but don't break the UI
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[createSafePrimaryColor] Error calling primaryColor(${degree}):`,
            error
          );
        }
      }
    }

    // Fallback: Use MUI theme primary colors
    try {
      const themePrimary = theme.palette.primary?.[
        degree === 50 ? "light" : degree === 900 ? "dark" : "main"
      ];
      if (themePrimary && typeof themePrimary === "string") {
        return themePrimary;
      }
    } catch (error) {
      // Theme palette access failed
    }

    // Ultimate fallback: Use theme primary main or default blue
    try {
      return theme.palette.primary?.main || "#1976D2";
    } catch {
      return "#1976D2"; // Default Material-UI blue
    }
  };
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook that provides a safe neutralColor function with automatic fallbacks
 *
 * This hook wraps useGomakeTheme and useTheme to provide a guaranteed-safe
 * color function that will never throw or return undefined.
 *
 * @returns A memoized safe neutralColor function
 *
 * @example
 * ```tsx
 * const safeNeutralColor = useSafeNeutralColor();
 *
 * // Use in sx prop or styles
 * <Box sx={{ bgcolor: safeNeutralColor(100) }} />
 * ```
 */
export function useSafeNeutralColor(): (degree: ColorDegree) => string {
  const { neutralColor } = useGomakeTheme();
  const theme = useTheme();

  return useMemo(
    () => createSafeNeutralColor(neutralColor, theme),
    [neutralColor, theme]
  );
}

/**
 * Hook that provides a safe primaryColor function with automatic fallbacks
 *
 * This hook wraps useGomakeTheme and useTheme to provide a guaranteed-safe
 * color function that will never throw or return undefined.
 *
 * @returns A memoized safe primaryColor function
 *
 * @example
 * ```tsx
 * const safePrimaryColor = useSafePrimaryColor();
 *
 * // Use in sx prop or styles
 * <Box sx={{ bgcolor: safePrimaryColor(500) }} />
 * ```
 */
export function useSafePrimaryColor(): (degree: ColorDegree) => string {
  const { primaryColor } = useGomakeTheme();
  const theme = useTheme();

  return useMemo(
    () => createSafePrimaryColor(primaryColor, theme),
    [primaryColor, theme]
  );
}

/**
 * Hook that provides both safe color functions
 *
 * Convenience hook that returns both safeNeutralColor and safePrimaryColor
 * in a single call.
 *
 * @returns Object with safeNeutralColor and safePrimaryColor functions
 *
 * @example
 * ```tsx
 * const { safeNeutralColor, safePrimaryColor } = useSafeColors();
 *
 * <Box sx={{
 *   bgcolor: safeNeutralColor(100),
 *   color: safePrimaryColor(700)
 * }} />
 * ```
 */
export function useSafeColors(): {
  safeNeutralColor: (degree: ColorDegree) => string;
  safePrimaryColor: (degree: ColorDegree) => string;
} {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const theme = useTheme();

  const safeNeutralColor = useMemo(
    () => createSafeNeutralColor(neutralColor, theme),
    [neutralColor, theme]
  );

  const safePrimaryColor = useMemo(
    () => createSafePrimaryColor(primaryColor, theme),
    [primaryColor, theme]
  );

  return {
    safeNeutralColor,
    safePrimaryColor,
  };
}

