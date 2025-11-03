/**
 * Typography Utility Functions
 *
 * Helper functions to quickly apply typography styles from theme variables
 * Use these instead of manually typing CSS variables everywhere
 *
 * All functions accept optional overrides for customization
 */

interface TypographyOverrides {
  color?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  [key: string]: any; // Allow any CSS property override
}

export function getTitleTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily:
      "var(--theme-typography-title-font-family, 'Lexend', sans-serif)",
    fontWeight: "var(--theme-typography-title-font-weight, 600)",
    fontSize: "var(--theme-typography-title-font-size, 25px)",
    lineHeight: "var(--theme-typography-title-line-height, 32px)",
    letterSpacing: "var(--theme-typography-title-letter-spacing, 0px)",
    color:
      "var(--theme-typography-title-color, var(--theme-primary-color, #2e3092))",
    ...overrides,
  };
}

export function getHeadingTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily:
      "var(--theme-typography-heading-font-family, 'Lexend', sans-serif)",
    fontWeight: "var(--theme-typography-heading-font-weight, 600)",
    fontSize: "var(--theme-typography-heading-font-size, 25px)",
    lineHeight: "var(--theme-typography-heading-line-height, 32px)",
    letterSpacing: "var(--theme-typography-heading-letter-spacing, 0px)",
    color: "var(--theme-typography-heading-color, #1a202c)",
    ...overrides,
  };
}

export function getLabelTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily:
      "var(--theme-typography-label-font-family, 'Heebo', sans-serif)",
    fontWeight: "var(--theme-typography-label-font-weight, 500)",
    fontSize: "var(--theme-typography-label-font-size, 14px)",
    lineHeight: "var(--theme-typography-label-line-height, 20px)",
    letterSpacing: "var(--theme-typography-label-letter-spacing, 0px)",
    color: "var(--theme-typography-label-color, #4a5568)",
    ...overrides,
  };
}

export function getSubLabelTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily:
      "var(--theme-typography-sublabel-font-family, 'Heebo', sans-serif)",
    fontWeight: "var(--theme-typography-sublabel-font-weight, 400)",
    fontSize: "var(--theme-typography-sublabel-font-size, 12px)",
    lineHeight: "var(--theme-typography-sublabel-line-height, 18px)",
    letterSpacing: "var(--theme-typography-sublabel-letter-spacing, 0px)",
    color: "var(--theme-typography-sublabel-color, #718096)",
    ...overrides,
  };
}

export function getButtonTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily:
      "var(--theme-typography-button-font-family, 'Lexend', sans-serif)",
    fontWeight: "var(--theme-typography-button-font-weight, 500)",
    fontSize: "var(--theme-typography-button-font-size, 16px)",
    lineHeight: "var(--theme-typography-button-line-height, 24px)",
    letterSpacing: "var(--theme-typography-button-letter-spacing, 0px)",
    ...overrides,
  };
}

export function getBodyTypography(
  overrides?: TypographyOverrides
): React.CSSProperties {
  return {
    fontFamily: "var(--theme-typography-body-font-family, 'Heebo', sans-serif)",
    fontWeight: "var(--theme-typography-body-font-weight, 400)",
    fontSize: "var(--theme-typography-body-font-size, 14px)",
    lineHeight: "var(--theme-typography-body-line-height, 21px)",
    letterSpacing: "var(--theme-typography-body-letter-spacing, 0px)",
    color: "var(--theme-typography-body-color, #1a202c)",
    ...overrides,
  };
}
