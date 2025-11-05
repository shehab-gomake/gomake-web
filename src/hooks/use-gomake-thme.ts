import { setItem } from "@/services/storage-data";
import { ITheme, themeState } from "@/store";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

const useGomakeTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const changedTheme = (theme: ITheme) => {
    setTheme(theme);
  };

  const changeThemeMode = useCallback(() => {
    const selectedTheme: any = theme.themeMode;
    setItem("themeMode", selectedTheme === "dark" ? "light" : "dark");
  }, []);

  const getColor = useCallback(
    (pattern: string, degree: number) => {
      if (degree >= 500) {
        // @ts-ignore
        return theme[pattern].dark[degree];
      }
      const selectedTheme: any = theme.themeMode;
      if (selectedTheme === "dark") {
        let darkDegree: number;
        switch (degree) {
          case 500:
            darkDegree = 500;
            break;
          case 400:
            darkDegree = 600;
            break;
          case 300:
            darkDegree = 700;
            break;
          case 200:
            darkDegree = 800;
            break;
          case 100:
            darkDegree = 900;
            break;

          default:
            break;
        }
        // @ts-ignore
        return theme[pattern].dark[darkDegree];
      } else {
        // @ts-ignore
        return theme[pattern].light[degree];
      }
    },
    [theme]
  );

  const primaryColor = useCallback(
    (degree: number) => {
      // Check for CSS variable first (for theme-based colors) //!here important
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Map degree to CSS variable names

        const cssVarMap: { [key: number]: string } = {
          100: "--theme-primary-light",
          200: "--theme-primary-disabled",
          500: "--theme-primary-color",
          600: "--theme-primary-dark",
          700: "--theme-primary-text",
        };

        const cssVar = cssVarMap[degree];
        if (cssVar) {
          const cssValue = computedStyle.getPropertyValue(cssVar).trim();
          if (cssValue) {
            return cssValue;
          }
        }
      }

      // Fallback to existing behavior
      return getColor("primary", degree);
    },
    [theme]
  );

  const secondColor = useCallback(
    (degree: number) => {
      // Check for CSS variable first (for theme-based colors) //!here important
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Map degree to CSS variable names
        const cssVarMap: { [key: number]: string } = {
          500: "--theme-secondary-color",
          100: "--theme-secondary-light",
        };

        const cssVar = cssVarMap[degree];
        if (cssVar) {
          const cssValue = computedStyle.getPropertyValue(cssVar).trim();
          if (cssValue) {
            return cssValue;
          }
        }
      }

      // Fallback to existing behavior
      return getColor("second", degree);
    },
    [theme]
  );

  const successColor = useCallback(
    (degree: number) => {
      // Check for CSS variable first (for theme-based colors)
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Map degree to CSS variable names
        const cssVarMap: { [key: number]: string } = {
          100: "--theme-success-light",
          500: "--theme-success-color",
          700: "--theme-success-dark",
        };

        const cssVar = cssVarMap[degree];
        if (cssVar) {
          const cssValue = computedStyle.getPropertyValue(cssVar).trim();
          if (cssValue) {
            return cssValue;
          }
        }
      }

      // Fallback to existing behavior
      return getColor("success", degree);
    },
    [theme]
  );

  const warningColor = useCallback(
    (degree: number) => {
      return getColor("warning", degree);
    },
    [theme]
  );

  const errorColor = useCallback(
    (degree: number) => {
      // Check for CSS variable first (for theme-based colors)
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Map degree to CSS variable names
        const cssVarMap: { [key: number]: string } = {
          100: "--theme-error-light",
          500: "--theme-error-color",
          700: "--theme-error-dark",
        };

        const cssVar = cssVarMap[degree];
        if (cssVar) {
          const cssValue = computedStyle.getPropertyValue(cssVar).trim();
          if (cssValue) {
            return cssValue;
          }
        }
      }

      // Fallback to existing behavior
      return getColor("error", degree);
    },
    [theme]
  );

  const neutralColor = useCallback(
    (degree: number) => {
      return getColor("neutral", degree);
    },
    [theme]
  );

  const grayColor = useCallback(
    (degree: number) => {
      return getColor("gray", degree);
    },
    [theme]
  );

  const primaryLavender = useCallback((degree: number = 500) => {
    // Check for CSS variable first (for theme-based colors)
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      // Map degree to CSS variable names
      const cssVarMap: { [key: number]: string } = {
        100: "--theme-primary-lavender-light",
        500: "--theme-primary-lavender-color",
        700: "--theme-primary-lavender-dark",
      };

      const cssVar = cssVarMap[degree];
      if (cssVar) {
        const cssValue = computedStyle.getPropertyValue(cssVar).trim();
        if (cssValue) {
          return cssValue;
        }
      }
    }

    // Default fallbacks based on degree
    const defaultMap: { [key: number]: string } = {
      100: "#E8E8F2", // Light variant
      500: "#CBCBE4", // Medium/base variant
      700: "#504fa1", // Dark variant
    };

    return defaultMap[degree] || defaultMap[500];
  }, []);

  return {
    theme,
    changedTheme,
    changeThemeMode,
    successColor,
    secondColor,
    primaryColor,
    neutralColor,
    errorColor,
    warningColor,
    grayColor,
    primaryLavender,
  };
};

export { useGomakeTheme };
