/**
 * Inbox Bot Configuration Tab
 *
 * Configure automated bot responses for this inbox.
 */

import React from "react";
import { Box, Alert, Typography } from "@mui/material";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

interface InboxBotConfigurationTabProps {
  inbox: ChatwootInbox;
  accountId: number;
}

export const InboxBotConfigurationTab: React.FC<InboxBotConfigurationTabProps> = ({
  inbox,
  accountId,
}) => {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <Alert severity="info">
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Bot Configuration
        </Typography>
        <Typography variant="body2">
          Bot configuration features are coming soon. You'll be able to configure
          automated responses, handoff rules, and bot behavior for this inbox.
        </Typography>
      </Alert>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Features in development:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Automated greeting messages
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Smart reply suggestions
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Business hours automation
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Agent handoff rules
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
