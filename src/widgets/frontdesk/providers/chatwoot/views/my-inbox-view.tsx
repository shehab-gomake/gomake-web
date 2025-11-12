/**
 * Chatwoot My Inbox View
 *
 * Displays notifications and unread messages for the current user.
 * This is the default landing view for Chatwoot.
 */

import React from "react";
import { Box } from "@mui/material";
import { ChatwootNotificationsView } from "../components/chatwoot-notifications-view";

export const MyInboxView: React.FC = () => {
  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <ChatwootNotificationsView />
    </Box>
  );
};
