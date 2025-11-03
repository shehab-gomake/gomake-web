/**
 * Add Channel Modal Component
 *
 * A robust modal for adding new channels to Chatwoot.
 * Features step-by-step wizard UI with channel selection cards.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  alpha,
  IconButton,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Google as GoogleIcon } from "@mui/icons-material";
import { OutlookIcon } from "@/icons/outlook-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useEmailAuth } from "@/widgets/frontdesk/providers/email/hooks/use-email-auth";
import { useEmailAccounts } from "@/widgets/frontdesk/providers/email/hooks/use-email-accounts";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";

interface AddChannelModalProps {
  open: boolean;
  onClose: () => void;
  error?: string | null;
}

interface ChannelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  provider: string;
}

const steps = [
  {
    number: 1,
    title: "Choose Channel",
    description: "Choose the provider you want to integrate with Chatwoot.",
    active: true,
  },
  {
    number: 2,
    title: "Create Inbox",
    description: "Authenticate your account and create an inbox.",
    active: false,
  },
  {
    number: 3,
    title: "Add Agents",
    description: "Add agents to the created inbox.",
    active: false,
  },
  {
    number: 4,
    title: "Voilà!",
    description: "You are all set to go!",
    active: false,
  },
];

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ open, onClose, error }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const { primaryColor, neutralColor } = useGomakeTheme();
  const emailAuth = useEmailAuth();
  const { fetchAccounts } = useEmailAccounts();
  const { refresh: refreshInboxes } = useChatwootInboxes();

  const channels: ChannelOption[] = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Support your customers on WhatsApp.",
      icon: <WhatsAppIcon sx={{ fontSize: 32, color: neutralColor(700) }} />,
      provider: "whatsapp",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Connect with Gmail account.",
      icon: <GoogleIcon sx={{ fontSize: 32, color: neutralColor(700) }} />,
      provider: "gmail",
    },
    {
      id: "outlook",
      name: "Outlook",
      description: "Connect with Outlook account.",
      icon: <OutlookIcon size={32} color={neutralColor(700)} />,
      provider: "outlook",
    },
  ];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setInternalError(null);
      setIsLoading(false);
      setSelectedChannel(null);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setInternalError(null);
  };

  const handleConnect = async (provider: string) => {
    if (!selectedChannel) return;

    setIsLoading(true);
    setInternalError(null);
    try {
      if (provider === "gmail" || provider === "outlook") {
        await emailAuth.authenticate(provider);
        // Refresh email accounts after successful authentication
        await fetchAccounts();
        // Refresh Chatwoot inboxes to show new channel
        await refreshInboxes();
        onClose();
        setSelectedChannel(null);
      } else if (provider === "whatsapp") {
        // TODO: Implement WhatsApp authentication
        setInternalError("WhatsApp authentication is not yet implemented");
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setInternalError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChannelData = channels.find((c) => c.id === selectedChannel);
  const displayError = error || internalError;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${neutralColor(200)}`,
          boxShadow: `0 8px 32px ${alpha(neutralColor(900), 0.12)}`,
          backgroundColor: "#ffffff",
          minHeight: "600px",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${neutralColor(200)}`,
          color: neutralColor(900),
          fontWeight: 600,
          fontSize: "1.25rem",
          py: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: primaryColor(50),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                color: primaryColor(600),
                fontWeight: 600,
              }}
            >
              +
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Channel
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          size="small"
          sx={{
            color: neutralColor(600),
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.8),
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0, flex: 1, display: "flex", overflow: "hidden" }}>
        <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
          {/* Left Column - Steps */}
          <Box
            sx={{
              width: 300,
              minWidth: 300,
              borderRight: `1px solid ${neutralColor(200)}`,
              backgroundColor: "#ffffff",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {steps.map((step) => (
              <Box
                key={step.number}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                {/* Step Number */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: step.active ? primaryColor(500) : neutralColor(200),
                    color: step.active ? "#ffffff" : neutralColor(600),
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </Box>
                {/* Step Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: step.active ? 600 : 400,
                      color: step.active ? primaryColor(500) : neutralColor(700),
                      fontSize: "0.938rem",
                      mb: 0.5,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.813rem",
                      color: neutralColor(600),
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Right Column - Channel Cards */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              backgroundColor: "#ffffff",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: neutralColor(900),
                mb: 3,
              }}
            >
              Choose a channel to connect
            </Typography>

            {/* Error Display */}
            {displayError && (
              <Alert
                severity="error"
                onClose={() => setInternalError(null)}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {displayError}
              </Alert>
            )}

            {/* Channel Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                flex: 1,
              }}
            >
              {channels.map((channel) => {
                const isSelected = selectedChannel === channel.id;
                return (
                  <Paper
                    key={channel.id}
                    onClick={() => handleChannelSelect(channel.id)}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      border: isSelected ? `2px solid ${primaryColor(500)}` : `1px solid ${neutralColor(200)}`,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: isSelected ? primaryColor(600) : neutralColor(300),
                        boxShadow: `0 4px 12px ${alpha(neutralColor(900), 0.08)}`,
                      },
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        backgroundColor: neutralColor(50),
                      }}
                    >
                      {channel.icon}
                    </Box>
                    {/* Name */}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: neutralColor(900),
                        fontSize: "1rem",
                      }}
                    >
                      {channel.name}
                    </Typography>
                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: "0.813rem",
                        color: neutralColor(600),
                        lineHeight: 1.5,
                      }}
                    >
                      {channel.description}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>

            {/* Connect Button */}
            {selectedChannel && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  onClick={() => setSelectedChannel(null)}
                  disabled={isLoading}
                  variant="outlined"
                  sx={{
                    color: neutralColor(700),
                    borderColor: neutralColor(300),
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: neutralColor(50),
                      borderColor: neutralColor(400),
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedChannelData && handleConnect(selectedChannelData.provider)}
                  disabled={isLoading || !selectedChannel}
                  variant="contained"
                  sx={{
                    backgroundColor: primaryColor(500),
                    color: "#ffffff",
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: primaryColor(600),
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Actions - Only show Cancel if no channel selected */}
      {!selectedChannel && (
        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${neutralColor(200)}`,
            backgroundColor: "#ffffff",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant="outlined"
            sx={{
              color: neutralColor(700),
              borderColor: neutralColor(300),
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: alpha(neutralColor(100), 0.8),
                borderColor: neutralColor(400),
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

