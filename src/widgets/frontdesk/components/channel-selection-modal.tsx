import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Typography, IconButton, Paper, alpha, CircularProgress, Alert } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Google as GoogleIcon } from "@mui/icons-material";
import { OutlookIcon } from "@/icons/outlook-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useEmailAuth } from "@/widgets/frontdesk/providers/email/hooks/use-email-auth";
import { useEmailAccounts } from "@/widgets/frontdesk/providers/email/hooks/use-email-accounts";

interface ChannelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  provider: string;
}

interface ChannelSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const steps = [
  {
    number: 1,
    title: "Choose Channel",
    description: "Choose the provider you want to integrate with FrontDesk.",
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

export const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({ open, onClose, onSuccess }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailAuth = useEmailAuth();
  const { fetchAccounts } = useEmailAccounts();

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

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setError(null);
  };

  const handleConnect = async (provider: string) => {
    if (!selectedChannel) return;

    setIsAuthenticating(true);
    setError(null);
    try {
      if (provider === "gmail" || provider === "outlook") {
        await emailAuth.authenticate(provider);
        // Refresh email accounts after successful authentication
        await fetchAccounts();
        onSuccess?.();
        onClose();
        setSelectedChannel(null);
      } else if (provider === "whatsapp") {
        // TODO: Implement WhatsApp authentication
        setError("WhatsApp authentication is not yet implemented");
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const selectedChannelData = channels.find((c) => c.id === selectedChannel);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedChannel(null);
      setError(null);
      setIsAuthenticating(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${neutralColor(200)}`,
          boxShadow: `0 8px 32px ${alpha(neutralColor(900), 0.12)}`,
          backgroundColor: "#ffffff", // White background instead of gray
          minHeight: "600px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: `1px solid ${neutralColor(200)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
            }}
          >
            Connect Channel
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={isAuthenticating}
            sx={{
              color: neutralColor(600),
              "&:hover": {
                backgroundColor: alpha(neutralColor(100), 0.8),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

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
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError(null)}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
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
                  <Box
                    component="button"
                    onClick={() => setSelectedChannel(null)}
                    disabled={isAuthenticating}
                    sx={{
                      px: 3,
                      py: 1.5,
                      border: `1px solid ${neutralColor(300)}`,
                      borderRadius: 2,
                      backgroundColor: "transparent",
                      color: neutralColor(700),
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: neutralColor(50),
                      },
                      "&:disabled": {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      },
                    }}
                  >
                    Cancel
                  </Box>
                  <Box
                    component="button"
                    onClick={() => selectedChannelData && handleConnect(selectedChannelData.provider)}
                    disabled={isAuthenticating || !selectedChannel}
                    sx={{
                      px: 4,
                      py: 1.5,
                      border: "none",
                      borderRadius: 2,
                      backgroundColor: primaryColor(500),
                      color: "#ffffff",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        backgroundColor: primaryColor(600),
                      },
                      "&:disabled": {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      },
                    }}
                  >
                    {isAuthenticating ? (
                      <>
                        <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
