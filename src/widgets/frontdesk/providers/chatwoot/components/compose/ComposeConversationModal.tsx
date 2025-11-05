/**
 * Compose Conversation Modal
 *
 * Modal for creating new conversations in Chatwoot.
 * Supports contact selection, inbox selection, and channel-specific message composition.
 */

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Stack, TextField, TextareaAutosize, Typography, IconButton, Box, CircularProgress, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ContactSelector } from "./ContactSelector";
import { InboxSelector } from "./InboxSelector";
import { CreateContactModal } from "./CreateContactModal";
import { useComposeConversation } from "../../hooks/use-compose-conversation";
import { getChannelRequirements } from "@/services/frontdesk/api/chatwoot/types/compose.types";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { WhatsAppTemplateSelector, convertToTemplateParams, generateMessageContent } from "../templates";
import type { WhatsAppTemplate, TemplateSelectorState } from "../templates";

interface ComposeConversationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (conversationId: number) => void;
}

export const ComposeConversationModal: React.FC<ComposeConversationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compose = useComposeConversation({
    onSuccess: (conversationId) => {
      setError(null);
      onSuccess?.(conversationId);
      handleClose();
    },
    onError: (err) => {
      setError(err.message || "Failed to create conversation");
    },
  });

  // Get channel requirements
  const channelType = compose.formState.selectedContactableInbox?.inbox.channel_type;
  const requirements = channelType ? getChannelRequirements(channelType) : null;

  const handleClose = () => {
    if (!compose.isSubmitting) {
      compose.resetForm();
      setError(null);
      setShowBcc(false);
      onClose();
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setShowBcc(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setError(null);
    const conversationId = await compose.submit();
    // Success is handled by onSuccess callback
  };

  const handleCreateContact = async (contactData: {
    name: string;
    email?: string;
    phone_number?: string;
  }) => {
    const newContact = await compose.createContact(contactData);
    if (newContact) {
      compose.selectContact(newContact);
      setShowCreateContact(false);
    }
  };

  // File upload handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    compose.updateField("attachments", [...compose.formState.attachments, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = compose.formState.attachments.filter((_, i) => i !== index);
    compose.updateField("attachments", newAttachments);
  };

  const canSubmit =
    !compose.isSubmitting &&
    compose.formState.contact &&
    compose.formState.selectedContactableInbox &&
    (compose.formState.message || (requirements && !requirements.messageRequired));

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            maxHeight: "90vh",
            backgroundColor: "#1e293b", // Dark slate background
            color: "#e2e8f0", // Light text
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid #334155`, // Subtle dark border
            pb: 2,
            pt: 2.5,
            px: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#f1f5f9", fontSize: "1.375rem" }}>
            New Ticket
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            disabled={compose.isSubmitting}
            sx={{
              color: "#94a3b8",
              "&:hover": {
                backgroundColor: "#334155",
                color: "#f1f5f9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ px: 0, py: 0 }}>
          <Stack spacing={0}>
            {/* Error Alert */}
            {error && (
              <Box sx={{ px: 3, pt: 2 }}>
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* To: Field (Contact Selection) - Inline Design */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 2,
                borderBottom: `1px solid #334155`,
              }}
            >
              <Typography sx={{ color: "#94a3b8", fontSize: "0.938rem", minWidth: 60, fontWeight: 500 }}>
                To:
              </Typography>
              <Box sx={{ flex: 1 }}>
                {compose.formState.contact ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                    }}
                    onClick={() => compose.selectContact(null as any)}
                  >
                    <Typography sx={{ color: "#ef4444", fontSize: "0.938rem" }}>
                      {compose.formState.contact.phone_number || compose.formState.contact.email || compose.formState.contact.name}
                    </Typography>
                    <IconButton size="small" sx={{ color: "#94a3b8", p: 0.5 }}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <ContactSelector
                    selectedContact={compose.formState.contact}
                    searchResults={compose.searchResults}
                    isSearching={compose.isSearching}
                    onSearch={compose.searchContacts}
                    onSelectContact={compose.selectContact}
                    onCreateContact={() => setShowCreateContact(true)}
                    error={compose.validationErrors.contact}
                  />
                )}
              </Box>
            </Box>

            {/* Via: Field (Inbox Selection) - Inline Design */}
            {compose.formState.contact && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid #334155`,
                }}
              >
                <Typography sx={{ color: "#94a3b8", fontSize: "0.938rem", minWidth: 60, fontWeight: 500 }}>
                  Via:
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <InboxSelector
                    contactableInboxes={compose.contactableInboxes}
                    selectedInbox={compose.formState.selectedContactableInbox}
                    isLoading={compose.isLoadingInboxes}
                    disabled={!compose.formState.contact}
                    onSelect={(inbox) => compose.updateField("selectedContactableInbox", inbox)}
                    error={compose.validationErrors.inbox}
                  />
                </Box>
              </Box>
            )}

            {/* Message Composition Section */}
            {compose.formState.selectedContactableInbox && (
              <Box>
                {/* Email-specific fields */}
                {requirements?.subjectRequired && (
                  <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 2, py: 1.5 }}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Subject *"
                      value={compose.formState.subject || ""}
                      onChange={(e) => compose.updateField("subject", e.target.value)}
                      error={!!compose.validationErrors.subject}
                      helperText={compose.validationErrors.subject}
                      InputProps={{ disableUnderline: true }}
                      sx={{ fontSize: "0.875rem" }}
                    />
                  </Box>
                )}

                {requirements?.ccBccSupported && (
                  <>
                    <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 2, py: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ minWidth: 40, fontSize: "0.8125rem", color: neutralColor(600) }}>
                          CC
                        </Typography>
                        <TextField
                          fullWidth
                          variant="standard"
                          placeholder="Optional"
                          value={compose.formState.ccEmails || ""}
                          onChange={(e) => compose.updateField("ccEmails", e.target.value)}
                          error={!!compose.validationErrors.ccEmails}
                          InputProps={{ disableUnderline: true }}
                          sx={{ fontSize: "0.875rem" }}
                        />
                        {!showBcc && (
                          <Button
                            size="small"
                            onClick={() => setShowBcc(true)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8125rem",
                              color: neutralColor(600),
                              minWidth: "auto",
                            }}
                          >
                            BCC
                          </Button>
                        )}
                      </Stack>
                    </Box>
                    {showBcc && (
                      <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 2, py: 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ minWidth: 40, fontSize: "0.8125rem", color: neutralColor(600) }}>
                            BCC
                          </Typography>
                          <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Optional"
                            value={compose.formState.bccEmails || ""}
                            onChange={(e) => compose.updateField("bccEmails", e.target.value)}
                            error={!!compose.validationErrors.bccEmails}
                            InputProps={{ disableUnderline: true }}
                            sx={{ fontSize: "0.875rem" }}
                          />
                        </Stack>
                      </Box>
                    )}
                  </>
                )}

                {/* WhatsApp Template Button - Only for WhatsApp channels */}
                {channelType === "Channel::WhatsApp" && (
                  <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #334155" }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setShowTemplateSelector(true)}
                      sx={{
                        textTransform: "none",
                        borderColor: "#334155",
                        color: "#94a3b8",
                        fontWeight: 500,
                        py: 1.5,
                        borderRadius: "8px",
                        "&:hover": {
                          borderColor: "#3b82f6",
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          color: "#3b82f6",
                        },
                      }}
                    >
                      {compose.formState.templateParams
                        ? `Template: ${compose.formState.templateParams.name.replace(/_/g, " ")}`
                        : "Use WhatsApp Template"}
                    </Button>
                    {compose.formState.templateParams && (
                      <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
                        Template selected. Message field is optional.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Message Field - Simple Dark Textarea */}
                <Box sx={{ px: 3, py: 3, minHeight: 300 }}>
                  <TextareaAutosize
                    minRows={12}
                    placeholder={
                      compose.formState.templateParams
                        ? "Optional: Add a custom message (or leave empty to use template only)"
                        : "Write your message here..."
                    }
                    value={compose.formState.message}
                    onChange={(e) => compose.updateField("message", e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "0.938rem",
                      lineHeight: "1.6",
                      resize: "none",
                      backgroundColor: "transparent",
                      color: "#94a3b8",
                    }}
                  />
                  {compose.validationErrors.message && (
                    <Typography color="error" sx={{ fontSize: "0.75rem", mt: 1 }}>
                      {compose.validationErrors.message}
                    </Typography>
                  )}
                </Box>

                {/* Attachments Section */}
                {requirements?.attachmentsSupported && (
                  <Box sx={{ borderTop: `1px solid ${neutralColor(200)}`, px: 2, py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Button
                        component="label"
                        startIcon={<AttachFileIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.8125rem",
                          color: neutralColor(700),
                        }}
                      >
                        Attach Files
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={handleFileSelect}
                        />
                      </Button>
                    </Stack>
                    {compose.formState.attachments.length > 0 && (
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        {compose.formState.attachments.map((file, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 1,
                              backgroundColor: neutralColor(50),
                              borderRadius: "4px",
                            }}
                          >
                            <Typography sx={{ fontSize: "0.8125rem", color: neutralColor(700) }}>
                              {file.name}
                            </Typography>
                            <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>

        {/* Footer - Matching Screenshot */}
        <DialogActions
          sx={{
            borderTop: `1px solid #334155`,
            px: 3,
            py: 2,
            justifyContent: "space-between",
            backgroundColor: "#1e293b",
          }}
        >
          {/* Left side - Refresh icon */}
          <IconButton
            size="small"
            sx={{
              color: "#94a3b8",
              "&:hover": {
                backgroundColor: "#334155",
              },
            }}
          >
            <SendIcon sx={{ fontSize: 20, transform: "rotate(180deg)" }} />
          </IconButton>

          {/* Right side - Discard and Send buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={handleClose}
              disabled={compose.isSubmitting}
              sx={{
                textTransform: "none",
                color: "#94a3b8",
                fontWeight: 500,
                fontSize: "0.938rem",
                px: 2,
                "&:hover": {
                  backgroundColor: "#334155",
                },
              }}
            >
              Discard
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: 600,
                fontSize: "0.938rem",
                px: 3,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                "&:disabled": {
                  backgroundColor: "#475569",
                  color: "#64748b",
                },
              }}
            >
              {compose.isSubmitting ? "Sending..." : "Send (⌘ + ↵)"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* WhatsApp Template Selector */}
      <WhatsAppTemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={(template: WhatsAppTemplate, state: TemplateSelectorState) => {
          // Convert template state to template params
          const templateParams = convertToTemplateParams(template, state);

          // Set template params in form
          compose.updateField("templateParams", templateParams);

          // Optionally pre-fill message content
          const content = generateMessageContent(template, state.bodyVariables);
          compose.updateField("message", content);

          console.log("[ComposeConversationModal] Template selected:", {
            template: template.name,
            params: templateParams,
          });
        }}
      />

      {/* Create Contact Modal */}
      <CreateContactModal
        open={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        onSubmit={handleCreateContact}
        isSubmitting={compose.isSubmitting}
      />
    </>
  );
};
