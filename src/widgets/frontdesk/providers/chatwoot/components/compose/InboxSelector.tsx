/**
 * InboxSelector Component
 *
 * A visually enhanced component for selecting an inbox (channel).
 * Displays available inboxes in a card-based grid layout.
 */

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Radio,
  useTheme,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

export interface InboxSelectorProps {
  contactableInboxes: ContactableInbox[];
  selectedInbox: ContactableInbox | null;
  isLoading: boolean;
  disabled?: boolean;
  onSelect: (inbox: ContactableInbox) => void;
  error?: string;
}

const channelIcons: Record<string, React.ReactElement> = {
  "Channel::Email": <MailIcon />,
  "Channel::WhatsApp": <WhatsAppIcon />,
  "Channel::Sms": <PhoneIcon />,
  "Channel::TwilioSms": <PhoneIcon />,
  "Channel::WebWidget": <PublicIcon />,
  default: <MessageIcon />,
};

const getChannelIcon = (channelType: string) =>
  channelIcons[channelType] || channelIcons.default;

const getChannelTypeName = (channelType: string): string => {
  switch (channelType) {
    case "Channel::Email":
      return "Email";
    case "Channel::WhatsApp":
      return "WhatsApp";
    case "Channel::Sms":
      return "SMS";
    case "Channel::TwilioSms":
      return "Twilio SMS";
    case "Channel::WebWidget":
      return "Web Widget";
    case "Channel::Api":
      return "API";
    default:
      return "Channel";
  }
};

export const InboxSelector: React.FC<InboxSelectorProps> = ({
  contactableInboxes,
  selectedInbox,
  isLoading,
  disabled,
  onSelect,
  error,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          border: `1px solid ${neutralColor(200)}`,
          borderRadius: 2,
          backgroundColor: neutralColor(25),
        }}
      >
        <CircularProgress size={24} sx={{ color: primaryColor(600) }} />
        <Typography sx={{ ml: 2, color: neutralColor(600) }}>
          Loading inboxes...
        </Typography>
      </Box>
    );
  }

  if (disabled || contactableInboxes.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          border: `1px solid ${neutralColor(200)}`,
          borderRadius: 2,
          backgroundColor: neutralColor(25),
          color: neutralColor(600),
          textAlign: "center",
        }}
      >
        {disabled ? "Select a contact to see available inboxes" : "No inboxes available for this contact"}
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {contactableInboxes.map((inbox) => {
          const isSelected = selectedInbox?.inbox.id === inbox.inbox.id;
          return (
            <Grid item xs={12} sm={6} key={inbox.inbox.id}>
              <Paper
                variant="outlined"
                onClick={() => onSelect(inbox)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: isSelected ? primaryColor(25) : neutralColor(0),
                  border: `1px solid ${
                    isSelected ? primaryColor(400) : neutralColor(200)
                  }`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: primaryColor(500),
                    boxShadow: `0 0 0 2px ${primaryColor(100)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? primaryColor(100) : neutralColor(100),
                    color: isSelected ? primaryColor(700) : neutralColor(600),
                    mr: 2,
                  }}
                >
                  {getChannelIcon(inbox.inbox.channel_type)}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: isSelected ? primaryColor(800) : neutralColor(900),
                    }}
                  >
                    {inbox.inbox.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: neutralColor(600) }}>
                    {getChannelTypeName(inbox.inbox.channel_type)}
                  </Typography>
                </Box>
                <Radio checked={isSelected} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {error && (
        <Typography
          sx={{ mt: 2, fontSize: "0.75rem", color: theme.palette.error.main }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};