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
import { useChatwootOAuth } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-oauth";
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

const getSteps = (currentStep: number) => [
  {
    number: 1,
    title: "Choose Channel",
    description: "Choose the provider you want to integrate with Chatwoot.",
    active: currentStep === 1,
  },
  {
    number: 2,
    title: "Create Inbox",
    description: "Authenticate your account and create an inbox.",
    active: currentStep === 2,
  },
  {
    number: 3,
    title: "Add Agents",
    description: "Add agents to the created inbox.",
    active: currentStep === 3,
  },
  {
    number: 4,
    title: "Voilà!",
    description: "You are all set to go!",
    active: currentStep === 4,
  },
];

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ open, onClose, error }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { authenticate, isAuthenticating, error: oauthError, clearError } = useChatwootOAuth();
  const { refresh: refreshInboxes } = useChatwootInboxes();

  const channels: ChannelOption[] = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Support your customers on WhatsApp. (Coming Soon)",
      icon: <WhatsAppIcon sx={{ fontSize: 32, color: neutralColor(700) }} />,
      provider: "whatsapp",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Connect with Gmail account.",
      icon: <GoogleIcon sx={{ fontSize: 32, color: neutralColor(700) }} />,
      provider: "google",
    },
    {
      id: "outlook",
      name: "Outlook",
      description: "Connect with Outlook account.",
      icon: <OutlookIcon size={32} color={neutralColor(700)} />,
      provider: "microsoft",
    },
  ];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      clearError();
      setSuccessMessage(null);
      setSelectedChannel(null);
      setCurrentStep(1);
    }
  }, [open, clearError]);

  const handleClose = useCallback(() => {
    if (!isAuthenticating) {
      onClose();
    }
  }, [isAuthenticating, onClose]);

  const handleChannelSelect = (channelId: string) => {
    // Don't allow WhatsApp selection yet
    if (channelId === "whatsapp") {
      return;
    }
    setSelectedChannel(channelId);
    clearError();
    setSuccessMessage(null);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedChannel) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSignIn = async (provider: string) => {
    if (!selectedChannel) return;

    clearError();
    setSuccessMessage(null);

    try {
      if (provider === "google" || provider === "microsoft") {
        // Authenticate with OAuth
        const result = await authenticate(provider as "google" | "microsoft");

        // Move to step 3 (Add Agents) - but we'll skip it and go to step 4
        setCurrentStep(4);

        // Show success message
        const providerName = provider === "google" ? "Gmail" : provider === "microsoft" ? "Outlook" : "Email";
        setSuccessMessage(
          `Successfully connected ${providerName}! ${result.accountsAdded} account(s) added.`
        );

        // Refresh inboxes to show new channels
        await refreshInboxes();

        // Close modal after short delay to show success message
        setTimeout(() => {
          onClose();
          setSelectedChannel(null);
          setSuccessMessage(null);
          setCurrentStep(1);
        }, 2000);
      } else if (provider === "whatsapp") {
        // WhatsApp not implemented
        throw new Error("WhatsApp integration is coming soon!");
      }
    } catch (err: any) {
      console.error("Channel connection failed:", err);
      // Error is already set by useChatwootOAuth hook
    }
  };

  const selectedChannelData = channels.find((c) => c.id === selectedChannel);
  const displayError = error || oauthError;
  const steps = getSteps(currentStep);

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
          disabled={isAuthenticating}
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

          {/* Right Column - Dynamic Content Based on Step */}
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
            {/* Success Message */}
            {successMessage && (
              <Alert
                severity="success"
                onClose={() => setSuccessMessage(null)}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {successMessage}
              </Alert>
            )}

            {/* Error Display */}
            {displayError && (
              <Alert
                severity="error"
                onClose={clearError}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {displayError}
              </Alert>
            )}

            {/* Step 1: Choose Channel */}
            {currentStep === 1 && (
              <>
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
                    const isDisabled = channel.id === "whatsapp";
                    return (
                      <Paper
                        key={channel.id}
                        onClick={() => handleChannelSelect(channel.id)}
                        sx={{
                          p: 3,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          border: isSelected ? `2px solid ${primaryColor(500)}` : `1px solid ${neutralColor(200)}`,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          textAlign: "center",
                          backgroundColor: isDisabled ? neutralColor(50) : "#ffffff",
                          opacity: isDisabled ? 0.6 : 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: isDisabled
                              ? neutralColor(200)
                              : isSelected
                              ? primaryColor(600)
                              : neutralColor(300),
                            boxShadow: isDisabled ? "none" : `0 4px 12px ${alpha(neutralColor(900), 0.08)}`,
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

                {/* Next Button */}
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
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!selectedChannel}
                      variant="contained"
                      sx={{
                        backgroundColor: primaryColor(500),
                        color: "#ffffff",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: primaryColor(600),
                        },
                        "&:disabled": {
                          opacity: 0.5,
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Step 2: Create Inbox - Sign In */}
            {currentStep === 2 && selectedChannelData && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: neutralColor(900),
                    mb: 2,
                  }}
                >
                  {selectedChannelData.name === "Gmail" ? "Google Email" : selectedChannelData.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.938rem",
                    color: neutralColor(600),
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Click on the Sign in with {selectedChannelData.name} button to get started. You will be redirected to
                  the email sign in page. Once you accept the requested permissions, you would be redirected back to
                  the inbox creation step.
                </Typography>

                {/* Sign In Button */}
                <Box>
                  <Button
                    onClick={() => handleSignIn(selectedChannelData.provider)}
                    disabled={isAuthenticating}
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
                      gap: 1.5,
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: primaryColor(600),
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {isAuthenticating ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                        Connecting...
                      </>
                    ) : (
                      <>
                        {selectedChannelData.icon}
                        Sign in with {selectedChannelData.name}
                      </>
                    )}
                  </Button>
                </Box>

                {/* Back Button */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 4,
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={isAuthenticating}
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
                    Back
                  </Button>
                </Box>
              </>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: primaryColor(50),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      color: primaryColor(600),
                    }}
                  >
                    ✓
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: neutralColor(900),
                    mb: 2,
                  }}
                >
                  Voilà!
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.938rem",
                    color: neutralColor(600),
                  }}
                >
                  You are all set to go!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

    </Dialog>
  );
};

