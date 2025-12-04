/**
 * Conversation List Title Component
 *
 * Displays the "Conversations" title with optional status chip.
 */

import React from "react";
import { Stack, Typography, Chip } from "@mui/material";
import { ConversationStatus } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

export interface ConversationListTitleProps {
  /** Current conversation status */
  status?: ConversationStatus;
  /** Get label for status */
  getStatusLabel: (status?: ConversationStatus) => string;
  /** Neutral color function */
  neutralColor?: (shade: number) => string;
}

export const ConversationListTitle: React.FC<ConversationListTitleProps> = ({
  status,
  getStatusLabel,
  neutralColor,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: "1rem",
          color: colorTokens.neutral[900],
        }}
      >
        Tickets
      </Typography>
      {status && status !== ConversationStatus.ALL && (
        <Chip
          label={getStatusLabel(status)}
          size="small"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: colorTokens.neutral[100],
            color: colorTokens.neutral[700],
            border: `1px solid ${colorTokens.neutral[300]}`,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      )}
    </Stack>
  );
};
