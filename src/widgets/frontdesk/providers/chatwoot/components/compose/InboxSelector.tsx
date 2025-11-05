/**
 * InboxSelector Component
 *
 * Dropdown for selecting an inbox (channel) where the contact can be reached.
 * Shows available inboxes based on contact's communication channels.
 */

import React from "react";
import { Box, Typography, Button, Stack, CircularProgress, Radio } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

export interface InboxSelectorProps {
  /** Available inboxes for the selected contact */
  contactableInboxes: ContactableInbox[];

  /** Currently selected inbox */
  selectedInbox: ContactableInbox | null;

  /** Loading state */
  isLoading: boolean;

  /** Disabled state (e.g., no contact selected) */
  disabled?: boolean;

  /** Callback when inbox is selected */
  onSelect: (inbox: ContactableInbox) => void;

  /** Validation error message */
  error?: string;
}

/**
 * Get icon for channel type
 */
function getChannelIcon(channelType: string) {
  switch (channelType) {
    case "Channel::Email":
      return <MailIcon fontSize="small" />;
    case "Channel::WhatsApp":
      return <WhatsAppIcon fontSize="small" />;
    case "Channel::Sms":
    case "Channel::TwilioSms":
      return <PhoneIcon fontSize="small" />;
    case "Channel::WebWidget":
      return <PublicIcon fontSize="small" />;
    default:
      return <MessageIcon fontSize="small" />;
  }
}

/**
 * Get display name for channel type
 */
function getChannelTypeName(channelType: string): string {
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
}

export const InboxSelector: React.FC<InboxSelectorProps> = ({
  contactableInboxes,
  selectedInbox,
  isLoading,
  disabled,
  onSelect,
  error,
}) => {
  const { neutralColor, primaryColor } = useGomakeTheme();

  return (
    <Box>
      {/* Loading State */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            border: `1px solid ${neutralColor(200)}`,
            borderRadius: 1,
            backgroundColor: neutralColor(25),
          }}
        >
          <CircularProgress size={20} sx={{ color: primaryColor(600) }} />
          <Typography sx={{ ml: 2, fontSize: "0.875rem", color: neutralColor(600) }}>
            Loading inboxes...
          </Typography>
        </Box>
      ) : disabled || contactableInboxes.length === 0 ? (
        /* Disabled/Empty State */
        <Box
          sx={{
            p: 3,
            border: `1px solid ${neutralColor(200)}`,
            borderRadius: 1,
            backgroundColor: neutralColor(25),
            color: neutralColor(600),
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          {disabled ? "Select a contact first" : "No inboxes available"}
        </Box>
      ) : (
        /* Inbox Selection */
        <Stack spacing={1}>
          {contactableInboxes.map((contactableInbox) => {
            const isSelected = selectedInbox?.source_id === contactableInbox.source_id;
            const channelType = contactableInbox.inbox.channel_type;

            return (
              <Button
                key={`${contactableInbox.inbox.id}-${contactableInbox.source_id}`}
                onClick={() => onSelect(contactableInbox)}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  border: `1px solid ${isSelected ? primaryColor(400) : neutralColor(200)}`,
                  borderRadius: 1,
                  backgroundColor: isSelected ? primaryColor(25) : neutralColor(0),
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: isSelected ? primaryColor(50) : neutralColor(50),
                    borderColor: isSelected ? primaryColor(500) : neutralColor(300),
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  {/* Channel Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected ? primaryColor(100) : neutralColor(100),
                      color: isSelected ? primaryColor(700) : neutralColor(600),
                    }}
                  >
                    {getChannelIcon(channelType)}
                  </Box>

                  {/* Inbox Info */}
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: isSelected ? primaryColor(700) : neutralColor(900),
                      }}
                    >
                      {contactableInbox.inbox.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontSize: "0.75rem", color: neutralColor(600) }}>
                        {getChannelTypeName(channelType)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Selection Indicator */}
                {isSelected && (
                  <CheckCircleIcon sx={{ fontSize: 20, color: primaryColor(600) }} />
                )}
              </Button>
            );
          })}
        </Stack>
      )}

      {/* Error Message */}
      {error && (
        <Typography sx={{ mt: 1, fontSize: "0.75rem", color: "#ef4444" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
