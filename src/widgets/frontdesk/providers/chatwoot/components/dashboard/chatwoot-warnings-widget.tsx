/**
 * Chatwoot Warnings Card - Modern Clean Design
 *
 * Single stat card showing total warnings count.
 * Uses the unified StatCard component for consistent styling.
 * Features:
 * - 16px rounded corners
 * - Soft shadow with hover elevation
 * - Consistent 22px padding
 * - Icon in small rounded container with subtle background
 * - Dynamic color: warning (amber) when warnings exist, success (green) when all clear
 * - Muted description label below main value
 */

import React from "react";
import { Warning as WarningIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useChatwootWarnings } from "../../hooks/use-chatwoot-warnings";
import { formatStatValue } from "../../utils";
import { StatCard } from "@/widgets/frontdesk/design-system";

interface ChatwootWarningsCardProps {
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
}

export const ChatwootWarningsCard: React.FC<ChatwootWarningsCardProps> = ({
  onClick,
  isLoading = false,
}) => {
  const warnings = useChatwootWarnings();

  // Use warning colors when there are warnings, success/green when all clear
  const hasWarnings = warnings.length > 0;
  const variant = hasWarnings ? "warning" : "success";
  const description = hasWarnings ? "Requires attention" : "All systems operational";
  const icon = hasWarnings ? <WarningIcon /> : <CheckCircleIcon />;

  return (
    <StatCard
      label="System Warnings"
      value={formatStatValue(warnings.length)}
      icon={icon}
      variant={variant}
      description={description}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
};
