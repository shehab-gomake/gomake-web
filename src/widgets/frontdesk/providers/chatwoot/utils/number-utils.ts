/**
 * Number formatting utilities for Chatwoot dashboard
 */

/**
 * Formats a number to display "99+" when it exceeds 99
 * @param value - The number to format
 * @returns The formatted string (number as string if <= 99, "99+" if > 99)
 */
export const formatStatValue = (value: number): string | number => {
  if (typeof value !== 'number' || isNaN(value)) {
    return value;
  }
  return value > 99 ? '99+' : value;
};

/**
 * Formats a number for use in descriptions or text
 * Uses the same 99+ logic as formatStatValue
 * @param value - The number to format
 * @returns The formatted string
 */
export const formatNumberInText = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return String(value);
  }
  return value > 99 ? '99+' : String(value);
};

/**
 * Formats response time in minutes to a human-readable string
 * @param minutes - Response time in minutes
 * @returns Formatted string like "30m", "2h", or "2h 30m"
 */
export const formatResponseTime = (minutes: number): string => {
  if (minutes === 0) return 'N/A';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Helper to determine card variant based on value
 * @param value - The numeric value to check
 * @param zeroVariant - Variant to use when value is 0
 * @param nonZeroVariant - Variant to use when value is not 0
 * @returns The appropriate variant
 */
export const getCardVariant = (
  value: number,
  zeroVariant: 'success' | 'primary' | 'warning' | 'error' | 'neutral',
  nonZeroVariant: 'success' | 'primary' | 'warning' | 'error' | 'neutral'
): 'success' | 'primary' | 'warning' | 'error' | 'neutral' => {
  return value === 0 ? zeroVariant : nonZeroVariant;
};

/**
 * Formats a stat card value with optional "All caught up!" message for zero values
 * @param value - The numeric value
 * @param zeroMessage - Message to show when value is 0 (default: "All caught up!")
 * @returns Formatted value or zero message
 */
export const formatStatCardValue = (
  value: number,
  zeroMessage: string = 'All caught up!'
): string | number => {
  if (value === 0) return zeroMessage;
  return formatStatValue(value);
};

