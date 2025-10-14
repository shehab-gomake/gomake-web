import React from "react";
import { Box, Typography } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailLabel } from "../../types/email.types";

interface ConversationListEmptyProps {
  selectedLabel?: EmailLabel | null;
}

export const ConversationListEmpty: React.FC<ConversationListEmptyProps> = ({ selectedLabel }) => {
  const { neutralColor } = useGomakeTheme();

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <EmailIcon sx={{ fontSize: 48, color: neutralColor(400), mb: 2 }} />
      <Typography variant="h6" sx={{ color: neutralColor(600), mb: 1 }}>
        {selectedLabel ? `No messages in ${selectedLabel.name}` : "No conversations"}
      </Typography>
      <Typography variant="body2" sx={{ color: neutralColor(500) }}>
        {selectedLabel ? `No messages found in ${selectedLabel.name}` : "No messages found for this account"}
      </Typography>
    </Box>
  );
};
