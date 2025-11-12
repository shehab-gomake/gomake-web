/**
 * Character Count Component
 *
 * Displays character count with smart color coding and warnings.
 */

import React from "react";
import { Typography, Tooltip } from "@mui/material";
import { getCharacterCountDisplay, getValidationColor } from "../../utils/message-validation.utils";

export interface CharacterCountProps {
  /** Current character count */
  current: number;
  /** Maximum allowed characters */
  max: number;
  /** Whether to show the count (default: show when > 0) */
  show?: boolean;
  /** Custom color getter */
  getColor?: (current: number, max: number) => string;
}

export const CharacterCount: React.FC<CharacterCountProps> = ({
  current,
  max,
  show = current > 0,
  getColor,
}) => {
  if (!show) return null;

  const displayText = getCharacterCountDisplay(current, max);
  const validationColor = getValidationColor(current, max);
  const percentage = (current / max) * 100;

  // Custom color or default based on validation status
  const color = getColor
    ? getColor(current, max)
    : validationColor === "error"
    ? "error.main"
    : validationColor === "warning"
    ? "warning.main"
    : "text.secondary";

  // Tooltip content
  const tooltipContent =
    percentage >= 100
      ? "Message exceeds maximum length"
      : percentage >= 90
      ? "Warning: Close to maximum length"
      : `${Math.round(percentage)}% of maximum length`;

  return (
    <Tooltip title={tooltipContent} arrow>
      <Typography
        variant="caption"
        sx={{
          color,
          fontSize: "0.75rem",
          fontWeight: validationColor !== "default" ? 600 : 400,
          transition: "all 0.2s ease",
          userSelect: "none",
        }}
      >
        {displayText}
      </Typography>
    </Tooltip>
  );
};
