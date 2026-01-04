/**
 * Add Channel Modal Component
 *
 * A robust modal for adding new channels to Chatwoot.
 * Features step-by-step wizard UI with channel selection cards.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Avatar,
} from "@mui/material";
import { useSetRecoilState } from "recoil";
import { Close as CloseIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Google as GoogleIcon } from "@mui/icons-material";
import { OutlookIcon } from "@/icons/outlook-icon";

import { useChatwootOAuth } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-oauth";
import { useWhatsAppOAuth } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-whatsapp-oauth";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { useChatwootAgents } from "@/widgets/frontdesk/providers/chatwoot/hooks/resources/use-chatwoot-agents";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { chatwootService } from "@/services/frontdesk";
import { chatwootInboxAgentsMapAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { colorTokens } from "@/widgets/frontdesk/design-system";

interface AddChannelModalProps {
  open: boolean;
  onClose: () => void;
  error?: string | null;
  preloadedInboxId?: number | null;
  preloadedAccountId?: number | null;
}

interface ChannelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  provider: string;
}

const getSteps = (currentStep: number, t: (key: string) => string) => [
  {
    number: 1,
    title: t("frontdesk.addChannel.step1.title"),
    description: t("frontdesk.addChannel.step1.description"),
    active: currentStep === 1,
  },
  {
    number: 2,
    title: t("frontdesk.addChannel.step2.title"),
    description: t("frontdesk.addChannel.step2.description"),
    active: currentStep === 2,
  },
  {
    number: 3,
    title: t("frontdesk.addChannel.step3.title"),
    description: t("frontdesk.addChannel.step3.description"),
    active: currentStep === 3,
  },
  {
    number: 4,
    title: t("frontdesk.addChannel.step4.title"),
    description: t("frontdesk.addChannel.step4.description"),
    active: currentStep === 4,
  },
];

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  open,
  onClose,
  error,
  preloadedInboxId = null,
  preloadedAccountId = null,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newInboxData, setNewInboxData] = useState<{ accountId: number; inboxId: number } | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [isAssigningAgents, setIsAssigningAgents] = useState(false);
  const [agentAssignmentError, setAgentAssignmentError] = useState<string | null>(null);

  const { authenticate, isAuthenticating, error: oauthError, clearError } = useChatwootOAuth();
  const {
    authenticate: authenticateWhatsApp,
    isAuthenticating: isWhatsAppAuthenticating,
    error: whatsAppError,
    clearError: clearWhatsAppError,
    checkConfiguration: checkWhatsAppConfiguration,
  } = useWhatsAppOAuth();

  // Debug: Log when component renders
  console.log("[AddChannelModal] Rendering with selectedChannel:", selectedChannel, "currentStep:", currentStep);
  const { refresh: refreshInboxes } = useChatwootInboxes();
  const { profile } = useChatwootProfile();
  const {
    agents,
    loading: agentsLoading,
    error: agentsError,
    refresh: refreshAgents,
  } = useChatwootAgents(newInboxData?.accountId ?? null, false);
  const setInboxAgentsMap = useSetRecoilState(chatwootInboxAgentsMapAtom);

  const channels: ChannelOption[] = [
    {
      id: "whatsapp",
      name: t("frontdesk.addChannel.channels.whatsapp.name"),
      description: t("frontdesk.addChannel.channels.whatsapp.description"),
      icon: <WhatsAppIcon sx={{ fontSize: 32, color: colorTokens.neutral[700] }} />,
      provider: "whatsapp",
    },
    {
      id: "gmail",
      name: t("frontdesk.addChannel.channels.gmail.name"),
      description: t("frontdesk.addChannel.channels.gmail.description"),
      icon: <GoogleIcon sx={{ fontSize: 32, color: colorTokens.neutral[700] }} />,
      provider: "google",
    },
    {
      id: "outlook",
      name: t("frontdesk.addChannel.channels.outlook.name"),
      description: t("frontdesk.addChannel.channels.outlook.description"),
      icon: <OutlookIcon size={32} color={colorTokens.neutral[700]} />,
      provider: "microsoft",
    },
  ];

  // Ref to track if we've already attempted to fetch agents (prevents infinite loop)
  const hasAttemptedFetchRef = React.useRef(false);
  const hasFetchedInboxAgentsRef = React.useRef(false);

  // Initialize with preloaded inbox data if provided
  useEffect(() => {
    if (open && preloadedInboxId && preloadedAccountId) {
      console.log("[AddChannelModal] Preloaded inbox data:", { preloadedInboxId, preloadedAccountId });
      setNewInboxData({ accountId: preloadedAccountId, inboxId: preloadedInboxId });
      setCurrentStep(3); // Jump to step 3 (Add Agents)
      setSelectedChannel("preloaded"); // Mark as preloaded to skip channel selection
      hasAttemptedFetchRef.current = false; // Reset fetch flag for new inbox
      hasFetchedInboxAgentsRef.current = false;
    } else if (open) {
      // Reset state when modal opens without preloaded data
      clearError();
      setSuccessMessage(null);
      setSelectedChannel(null);
      setCurrentStep(1);
      setNewInboxData(null);
      setSelectedAgents([]);
      setAgentAssignmentError(null);
      hasAttemptedFetchRef.current = false; // Reset fetch flag
      hasFetchedInboxAgentsRef.current = false;
    }
  }, [open, preloadedInboxId, preloadedAccountId, clearError]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      clearError();
      setSuccessMessage(null);
      setSelectedChannel(null);
      setCurrentStep(1);
      setNewInboxData(null);
      setSelectedAgents([]);
      setAgentAssignmentError(null);
      hasAttemptedFetchRef.current = false; // Reset fetch flag
      hasFetchedInboxAgentsRef.current = false;
    }
  }, [open, clearError]);

  // Fetch agents when we reach Step 3 (one-time fetch per inbox)
  useEffect(() => {
    if (currentStep === 3 && newInboxData?.accountId && !agentsLoading && !hasAttemptedFetchRef.current) {
      hasAttemptedFetchRef.current = true;
      console.log("[AddChannelModal] Fetching agents for step 3");
      refreshAgents();
    }

    // Reset the ref when step changes away from 3
    if (currentStep !== 3) {
      hasAttemptedFetchRef.current = false;
    }
  }, [currentStep, newInboxData?.accountId, agentsLoading]);

  // Fetch current inbox assignments when entering Step 3
  useEffect(() => {
    const fetchInboxAgents = async () => {
      if (currentStep === 3 && newInboxData?.accountId && newInboxData?.inboxId && !hasFetchedInboxAgentsRef.current) {
        hasFetchedInboxAgentsRef.current = true;
        console.log("[AddChannelModal] Fetching existing inbox agents");

        try {
          const response = await chatwootService.inboxes.getInboxAgents(newInboxData.accountId, newInboxData.inboxId);

          // Extract agent IDs from response
          const inboxAgents = response?.payload || response || [];
          const agentIds = inboxAgents.map((agent: any) => agent.id);

          console.log("[AddChannelModal] Found existing agents:", agentIds);
          if (agentIds.length > 0) {
            setSelectedAgents(agentIds);
          }
        } catch (error) {
          console.error("[AddChannelModal] Failed to fetch inbox agents:", error);
        }
      }
    };

    fetchInboxAgents();
  }, [currentStep, newInboxData]);

  // Auto-select current user when agents are loaded
  useEffect(() => {
    if (currentStep === 3 && agents.length > 0 && profile?.id && selectedAgents.length === 0) {
      // Auto-select current user if they're in the agents list
      const currentUserAgent = agents.find((agent) => agent.id === profile.id);
      if (currentUserAgent) {
        setSelectedAgents([profile.id]);
      }
    }
  }, [currentStep, agents, profile, selectedAgents.length]);

  // Combined authenticating state
  const isAnyAuthenticating = isAuthenticating || isWhatsAppAuthenticating;

  const handleClose = useCallback(() => {
    if (!isAnyAuthenticating) {
      onClose();
    }
  }, [isAnyAuthenticating, onClose]);

  const handleChannelSelect = (channelId: string) => {
    console.log("[AddChannelModal] Channel selected:", channelId);
    setSelectedChannel(channelId);
    clearError();
    clearWhatsAppError();
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
    clearWhatsAppError();
    setSuccessMessage(null);
    setAgentAssignmentError(null);

    try {
      if (provider === "google" || provider === "microsoft") {
        // Authenticate with OAuth
        const result = await authenticate(provider as "google" | "microsoft");

        // Check if we received accountId and inboxId from OAuth callback
        if (result.accountId && result.inboxId) {
          // Store inbox data for Step 3
          setNewInboxData({
            accountId: result.accountId,
            inboxId: result.inboxId,
          });

          // Move to Step 3 (Add Agents)
          setCurrentStep(3);
        } else {
          // Fallback: If no inbox data, skip to success (legacy flow)
          setCurrentStep(4);

          const providerName =
            provider === "google"
              ? t("frontdesk.addChannel.channels.gmail.name")
              : provider === "microsoft"
              ? t("frontdesk.addChannel.channels.outlook.name")
              : "Email";
          setSuccessMessage(t("frontdesk.addChannel.success.connected", { provider: providerName, count: result.accountsAdded }));

          // Refresh inboxes to show new channels
          await refreshInboxes();

          // Close modal after short delay
          setTimeout(() => {
            onClose();
            setSelectedChannel(null);
            setSuccessMessage(null);
            setCurrentStep(1);
          }, 2000);
        }
      } else if (provider === "whatsapp") {
        // WhatsApp Embedded Signup flow
        const result = await authenticateWhatsApp();

        if (result.success && result.accountId && result.inboxId) {
          // Store inbox data for Step 3
          setNewInboxData({
            accountId: result.accountId,
            inboxId: result.inboxId,
          });

          // Move to Step 3 (Add Agents)
          setCurrentStep(3);
        } else {
          // If we got a result but no inbox data, go to success
          setCurrentStep(4);
          setSuccessMessage(t("frontdesk.addChannel.success.whatsappConnected", { name: result.inboxName || "WhatsApp" }));

          await refreshInboxes();

          setTimeout(() => {
            onClose();
            setSelectedChannel(null);
            setSuccessMessage(null);
            setCurrentStep(1);
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error("Channel connection failed:", err);
      // Error is already set by the OAuth hooks
    }
  };

  const handleAgentToggle = (agentId: number) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const handleAddAgents = async () => {
    if (!newInboxData) {
      setAgentAssignmentError(t("frontdesk.addChannel.errors.invalidInboxData"));
      return;
    }

    // Current user should always be in the selected agents
    if (selectedAgents.length === 0) {
      setAgentAssignmentError(t("frontdesk.addChannel.errors.atLeastOneAgent"));
      return;
    }

    setIsAssigningAgents(true);
    setAgentAssignmentError(null);

    try {
      // Call agent assignment API
      await chatwootService.inboxes.addAgentsToInbox(newInboxData.accountId, newInboxData.inboxId, selectedAgents);

      // Fetch updated agents list and update Recoil state
      const response = await chatwootService.inboxes.getInboxAgents(newInboxData.accountId, newInboxData.inboxId);
      const updatedAgents = response?.payload || [];

      // Update the agents map in Recoil state
      setInboxAgentsMap((prev) => ({
        ...prev,
        [newInboxData.inboxId]: updatedAgents,
      }));

      // Move to Step 4 (Success)
      setCurrentStep(4);
      setSuccessMessage(t("frontdesk.addChannel.success.assignedAgents", { count: selectedAgents.length }));

      // Refresh inboxes to show new channels
      await refreshInboxes();

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setSelectedChannel(null);
        setSuccessMessage(null);
        setCurrentStep(1);
        setNewInboxData(null);
        setSelectedAgents([]);
      }, 2000);
    } catch (err: any) {
      console.error("Agent assignment failed:", err);
      setAgentAssignmentError(err.message || t("frontdesk.addChannel.errors.failedToAssignAgents"));
    } finally {
      setIsAssigningAgents(false);
    }
  };

  const selectedChannelData = channels.find((c) => c.id === selectedChannel);
  const displayError = error || oauthError || whatsAppError || agentAssignmentError;
  const steps = getSteps(currentStep, t);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${colorTokens.neutral[200]}`,
          boxShadow: `0 8px 32px ${alpha(colorTokens.neutral[900], 0.12)}`,
          backgroundColor: "#ffffff",
          minHeight: "600px",
          direction: dir,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          color: colorTokens.neutral[900],
          fontWeight: 600,
          fontSize: "1.25rem",
          py: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          direction: dir,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, direction: dir }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: colorTokens.primary[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                color: colorTokens.primary[600],
                fontWeight: 600,
              }}
            >
              +
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("frontdesk.addChannel.title")}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isAnyAuthenticating}
          size="small"
          sx={{
            color: colorTokens.neutral[600],
            "&:hover": {
              backgroundColor: alpha(colorTokens.neutral[100], 0.8),
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
      <DialogContent sx={{ p: 0, flex: 1, display: "flex", overflow: "hidden", direction: dir }}>
        <Box sx={{ display: "flex", width: "100%", height: "100%", direction: dir }}>
          {/* Left Column - Steps */}
          <Box
            sx={{
              width: 300,
              minWidth: 300,
              [dir === "rtl" ? "borderLeft" : "borderRight"]: `1px solid ${colorTokens.neutral[200]}`,
              backgroundColor: "#ffffff",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              direction: dir,
            }}
          >
            {steps.map((step) => (
              <Box
                key={step.number}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  direction: dir,
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
                    backgroundColor: step.active ? colorTokens.primary[500] : colorTokens.neutral[200],
                    color: step.active ? "#ffffff" : colorTokens.neutral[600],
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
                      color: step.active ? colorTokens.primary[500] : colorTokens.neutral[700],
                      fontSize: "0.938rem",
                      mb: 0.5,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.813rem",
                      color: colorTokens.neutral[600],
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
              direction: dir,
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
                onClose={() => {
                  clearError();
                  clearWhatsAppError();
                }}
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
                    color: colorTokens.neutral[900],
                    mb: 3,
                  }}
                >
                  {t("frontdesk.addChannel.step1.heading")}
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
                    const isDisabled = false; // All channels enabled
                    return (
                      <Paper
                        key={channel.id}
                        onClick={() => handleChannelSelect(channel.id)}
                        sx={{
                          p: 3,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          border: isSelected ? `2px solid ${colorTokens.primary[500]}` : `1px solid ${colorTokens.neutral[200]}`,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          textAlign: "center",
                          backgroundColor: isDisabled ? colorTokens.neutral[50] : "#ffffff",
                          opacity: isDisabled ? 0.6 : 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: isDisabled
                              ? colorTokens.neutral[200]
                              : isSelected
                              ? colorTokens.primary[600]
                              : colorTokens.neutral[300],
                            boxShadow: isDisabled ? "none" : `0 4px 12px ${alpha(colorTokens.neutral[900], 0.08)}`,
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
                            backgroundColor: colorTokens.neutral[50],
                          }}
                        >
                          {channel.icon}
                        </Box>
                        {/* Name */}
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: colorTokens.neutral[900],
                            fontSize: "1rem",
                          }}
                        >
                          {channel.name}
                        </Typography>
                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: "0.813rem",
                            color: colorTokens.neutral[600],
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
                      direction: dir,
                    }}
                  >
                    <Button
                      onClick={() => setSelectedChannel(null)}
                      variant="outlined"
                      sx={{
                        color: colorTokens.neutral[700],
                        borderColor: colorTokens.neutral[300],
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: colorTokens.neutral[50],
                          borderColor: colorTokens.neutral[400],
                        },
                      }}
                    >
                      {t("frontdesk.addChannel.buttons.cancel")}
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!selectedChannel}
                      variant="contained"
                      sx={{
                        backgroundColor: colorTokens.primary[500],
                        color: "#ffffff",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: colorTokens.primary[600],
                        },
                        "&:disabled": {
                          opacity: 0.5,
                        },
                      }}
                    >
                      {t("frontdesk.addChannel.buttons.next")}
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
                    color: colorTokens.neutral[900],
                    mb: 2,
                  }}
                >
                  {selectedChannelData.name === t("frontdesk.addChannel.channels.gmail.name")
                    ? t("frontdesk.addChannel.channels.googleEmail")
                    : selectedChannelData.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.938rem",
                    color: colorTokens.neutral[600],
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {t("frontdesk.addChannel.step2.signInDescription", { provider: selectedChannelData.name })}
                </Typography>

                {/* Sign In Button */}
                <Box>
                  <Button
                    onClick={() => handleSignIn(selectedChannelData.provider)}
                    disabled={isAnyAuthenticating}
                    variant="contained"
                    sx={{
                      backgroundColor: colorTokens.primary[500],
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
                        backgroundColor: colorTokens.primary[600],
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {isAnyAuthenticating ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                        {t("frontdesk.addChannel.step2.connecting")}
                      </>
                    ) : (
                      <>
                        {selectedChannelData.icon}
                        {t("frontdesk.addChannel.step2.signInWith", { provider: selectedChannelData.name })}
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
                    direction: dir,
                  }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={isAnyAuthenticating}
                    variant="outlined"
                    sx={{
                      color: colorTokens.neutral[700],
                      borderColor: colorTokens.neutral[300],
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colorTokens.neutral[50],
                        borderColor: colorTokens.neutral[400],
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {t("frontdesk.addChannel.buttons.back")}
                  </Button>
                </Box>
              </>
            )}

            {/* Step 3: Add Agents */}
            {currentStep === 3 && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.neutral[900],
                    mb: 2,
                  }}
                >
                  {t("frontdesk.addChannel.step3.heading")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.938rem",
                    color: colorTokens.neutral[600],
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {t("frontdesk.addChannel.step3.descriptionText")}
                </Typography>

                {/* Loading State */}
                {agentsLoading && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                )}

                {/* Error State */}
                {agentsError && !agentsLoading && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {t("frontdesk.addChannel.step3.failedToLoadAgents")}
                  </Alert>
                )}

                {/* Agents List - Compact Modern Design */}
                {!agentsLoading && !agentsError && agents.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${colorTokens.neutral[200]}`,
                    }}
                  >
                    <Box
                      sx={{
                        maxHeight: 400,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: colorTokens.neutral[50],
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: colorTokens.neutral[300],
                          borderRadius: "4px",
                          "&:hover": {
                            backgroundColor: colorTokens.neutral[400],
                          },
                        },
                      }}
                    >
                      {agents.map((agent, index) => {
                        const isSelected = selectedAgents.includes(agent.id!);
                        const isCurrentUser = agent.id === profile?.id;
                        const isAdministrator = agent.role === "administrator";

                        return (
                          <Box
                            key={agent.id}
                            onClick={() => handleAgentToggle(agent.id!)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              px: 2,
                              py: 1.5,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              backgroundColor: isSelected
                                ? alpha(colorTokens.primary[50], 0.5)
                                : index % 2 === 0
                                ? "#ffffff"
                                : colorTokens.neutral[25],
                              borderBottom: index < agents.length - 1 ? `1px solid ${colorTokens.neutral[100]}` : "none",
                              "&:hover": {
                                backgroundColor: isSelected
                                  ? alpha(colorTokens.primary[100], 0.5)
                                  : alpha(colorTokens.neutral[100], 0.8),
                              },
                            }}
                          >
                            {/* Checkbox */}
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleAgentToggle(agent.id!);
                              }}
                              size="small"
                              sx={{
                                p: 0.5,
                                color: colorTokens.neutral[400],
                                "&.Mui-checked": {
                                  color: colorTokens.primary[500],
                                },
                              }}
                            />

                            {/* Avatar */}
                            <Avatar
                              src={agent.thumbnail}
                              alt={agent.name || agent.email}
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: isSelected ? colorTokens.primary[500] : colorTokens.primary[100],
                                color: isSelected ? "#ffffff" : colorTokens.primary[700],
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {(agent.name || agent.email || "?").charAt(0).toUpperCase()}
                            </Avatar>

                            {/* Agent Info */}
                            <Box
                              sx={{
                                flex: 1,
                                minWidth: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    color: colorTokens.neutral[900],
                                    fontSize: "0.875rem",
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {agent.name || agent.available_name || t("frontdesk.addChannel.step3.unknown")}
                                </Typography>
                                {isCurrentUser && (
                                  <Box
                                    component="span"
                                    sx={{
                                      fontSize: "0.688rem",
                                      color: colorTokens.primary[700],
                                      fontWeight: 600,
                                      px: 0.75,
                                      py: 0.25,
                                      borderRadius: 0.75,
                                      backgroundColor: colorTokens.primary[100],
                                      lineHeight: 1,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {t("frontdesk.addChannel.step3.you")}
                                  </Box>
                                )}
                              </Box>
                              {isAdministrator && (
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: "0.688rem",
                                    color: colorTokens.neutral[700],
                                    fontWeight: 600,
                                    px: 0.75,
                                    py: 0.25,
                                    borderRadius: 0.75,
                                    backgroundColor: colorTokens.neutral[200],
                                    lineHeight: 1,
                                    textTransform: "uppercase",
                                    flexShrink: 0,
                                  }}
                                >
                                  {t("frontdesk.addChannel.step3.admin")}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                )}

                {/* No Agents State */}
                {!agentsLoading && !agentsError && agents.length === 0 && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    {t("frontdesk.addChannel.step3.noAgentsFound")}
                  </Alert>
                )}

                {/* Continue Button */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 4,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    direction: dir,
                  }}
                >
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={isAssigningAgents}
                    variant="outlined"
                    sx={{
                      color: colorTokens.neutral[700],
                      borderColor: colorTokens.neutral[300],
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colorTokens.neutral[50],
                        borderColor: colorTokens.neutral[400],
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {t("frontdesk.addChannel.buttons.back")}
                  </Button>
                  <Button
                    onClick={handleAddAgents}
                    disabled={isAssigningAgents || selectedAgents.length === 0}
                    variant="contained"
                    sx={{
                      backgroundColor: colorTokens.primary[500],
                      color: "#ffffff",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        backgroundColor: colorTokens.primary[600],
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {isAssigningAgents ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                        {t("frontdesk.addChannel.step3.addingAgents")}
                      </>
                    ) : (
                      t("frontdesk.addChannel.step3.continue", { count: selectedAgents.length })
                    )}
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
                    backgroundColor: colorTokens.primary[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      color: colorTokens.primary[600],
                    }}
                  >
                    ✓
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.neutral[900],
                    mb: 2,
                  }}
                >
                  {t("frontdesk.addChannel.step4.title")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.938rem",
                    color: colorTokens.neutral[600],
                  }}
                >
                  {t("frontdesk.addChannel.step4.description")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
