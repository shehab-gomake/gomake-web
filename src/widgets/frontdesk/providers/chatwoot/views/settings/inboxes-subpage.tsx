/**
 * Inboxes Subpage
 *
 * Displays and manages Chatwoot inboxes (channels) including
 * Email, WhatsApp, SMS, API, Web, and Twilio channels.
 */

import React, { useState } from "react";
import { Box, Typography, Alert, IconButton, Button, Paper, Chip, Divider } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import WebIcon from "@mui/icons-material/Web";
import ApiIcon from "@mui/icons-material/Api";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootInboxes } from "../../hooks/use-chatwoot-inboxes";
import { AddChannelModal } from "../../components/add-channel-modal";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

// Helper function to get icon for channel type
const getChannelIcon = (channelType: string) => {
  if (channelType?.includes("Email")) return <EmailIcon />;
  if (channelType?.includes("WhatsApp")) return <WhatsAppIcon />;
  if (channelType?.includes("Sms") || channelType?.includes("Twilio")) return <PhoneIcon />;
  if (channelType?.includes("WebWidget")) return <WebIcon />;
  if (channelType?.includes("Api")) return <ApiIcon />;
  return <InboxIcon />;
};

// Helper function to get readable channel type
const getChannelTypeLabel = (channelType: string) => {
  if (!channelType) return "Unknown";
  return channelType.replace("Channel::", "").replace(/([A-Z])/g, " $1").trim();
};

export const InboxesSubpage: React.FC = () => {
  const { inboxes, loading, error, refresh } = useChatwootInboxes();
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);

  return (
    <>
    <BaseSettingsSubpage
      title="Inboxes"
      description="Manage communication channels and their settings"
      isLoading={loading}
      headerActions={
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddChannelModal(true)}
            size="small"
            disabled={loading}
          >
            Add Channel
          </Button>
          <IconButton onClick={refresh} size="small" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      }
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Failed to load inboxes"}
        </Alert>
      ) : inboxes.length === 0 ? (
        /* Empty State */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            textAlign: "center",
            gap: 2,
          }}
        >
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            No Inboxes Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Set up your first communication channel to start receiving messages.
            Supported channels include Email, WhatsApp, SMS, Web Chat, and more.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setShowAddChannelModal(true)}
            sx={{ mt: 3 }}
          >
            Add Your First Channel
          </Button>
        </Box>
      ) : (
        /* Inboxes List */
        <SettingsSection
          title={`Inboxes (${inboxes.length})`}
          description="Communication channels configured for this account"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {inboxes.map((inbox) => (
              <Paper
                key={inbox.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getChannelIcon(inbox.channel_type)}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                        {inbox.name}
                      </Typography>
                      <Chip
                        label={getChannelTypeLabel(inbox.channel_type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </Box>

                    {/* Details */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
                      {inbox.provider && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Provider:</strong> {inbox.provider}
                        </Typography>
                      )}
                      {inbox.phone_number && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Phone:</strong> {inbox.phone_number}
                        </Typography>
                      )}
                      {inbox.website_url && (
                        <Typography variant="body2" color="text.secondary" sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          <strong>Website:</strong> {inbox.website_url}
                        </Typography>
                      )}
                      {inbox.timezone && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Timezone:</strong> {inbox.timezone}
                        </Typography>
                      )}
                    </Box>

                    {/* Features */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {inbox.enable_auto_assignment && (
                        <Chip
                          label="Auto-assign"
                          size="small"
                          variant="filled"
                          sx={{
                            bgcolor: "success.main",
                            color: "success.contrastText",
                            fontSize: "0.688rem",
                            height: 22
                          }}
                        />
                      )}
                      {inbox.working_hours_enabled && (
                        <Chip
                          label="Working Hours"
                          size="small"
                          variant="filled"
                          sx={{
                            bgcolor: "info.main",
                            color: "info.contrastText",
                            fontSize: "0.688rem",
                            height: 22
                          }}
                        />
                      )}
                      <Chip
                        label={`ID: ${inbox.id}`}
                        size="small"
                        sx={{
                          bgcolor: "grey.200",
                          fontSize: "0.688rem",
                          height: 22
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </SettingsSection>
      )}
    </BaseSettingsSubpage>

    {/* Add Channel Modal */}
    <AddChannelModal open={showAddChannelModal} onClose={() => setShowAddChannelModal(false)} />
    </>
  );
};

