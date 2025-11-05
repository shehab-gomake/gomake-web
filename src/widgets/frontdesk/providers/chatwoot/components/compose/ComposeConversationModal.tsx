/**
 * Compose Conversation Modal
 *
 * Modal for creating new conversations in Chatwoot.
 * Supports contact selection, inbox selection, and channel-specific message composition.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Stack, Typography, IconButton, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { ContactSelectionField } from "./ContactSelectionField";
import { CreateContactModal } from "./CreateContactModal";
import { MessageEditor } from "./MessageEditor";
import { EmailCompositionFields } from "./EmailCompositionFields";
import { AttachmentUploader } from "./AttachmentUploader";
import { InboxSelector } from "./InboxSelector";
import { ConfirmDialog } from "../settings/ConfirmDialog";
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
  accountId: number | null;
}

export const ComposeConversationModal: React.FC<ComposeConversationModalProps> = ({
  open,
  onClose,
  onSuccess,
  accountId,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const compose = useComposeConversation({
    accountId,
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
      setShowExitConfirm(false);
      onClose();
    }
  };

  // Handle backdrop click - show confirmation if user has entered data
  const handleBackdropClick = () => {
    // Check if user has entered any data
    const hasData =
      compose.formState.contact ||
      compose.formState.message ||
      compose.formState.subject ||
      compose.formState.attachments.length > 0;

    if (hasData && !compose.isSubmitting) {
      setShowExitConfirm(true);
    } else {
      handleClose();
    }
  };

  // Confirm exit and discard changes
  const handleConfirmExit = () => {
    handleClose();
  };

  // Cancel exit and stay in modal
  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
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

  const canSubmit = useMemo(
    () =>
      !compose.isSubmitting &&
      compose.formState.contact &&
      (compose.formState.message || (requirements && !requirements.messageRequired)),
    [compose.isSubmitting, compose.formState.contact, compose.formState.message, requirements]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close (only if not submitting)
      if (e.key === "Escape" && !compose.isSubmitting) {
        handleClose();
        return;
      }

      // Cmd/Ctrl + Enter to send
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (canSubmit) {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, canSubmit, compose.isSubmitting]);

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            handleBackdropClick();
          } else if (reason === "escapeKeyDown") {
            handleBackdropClick();
          }
        }}
        maxWidth="md"
        fullWidth
        aria-labelledby="compose-modal-title"
        aria-describedby="compose-modal-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
            backgroundColor: neutralColor(0),
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px solid ${neutralColor(200)}`,
            pb: 2.5,
            pt: 3,
            px: 4,
            backgroundColor: neutralColor(0),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: primaryColor(50),
                color: primaryColor(600),
              }}
            >
              <SendIcon />
            </Box>
            <Typography
              id="compose-modal-title"
              variant="h5"
              sx={{
                fontWeight: 600,
                color: neutralColor(900),
                fontSize: "1.375rem",
              }}
            >
              New Conversation
            </Typography>
          </Stack>
          <IconButton
            onClick={handleBackdropClick}
            size="small"
            disabled={compose.isSubmitting}
            aria-label="Close compose conversation modal"
            sx={{
              color: neutralColor(600),
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: neutralColor(900),
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

            {/* Contact Selection */}
            <ContactSelectionField
              selectedContact={compose.formState.contact}
              searchResults={compose.searchResults}
              isSearching={compose.isSearching}
              onSearch={compose.searchContacts}
              onSelectContact={compose.selectContact}
              onCreateContact={() => setShowCreateContact(true)}
              error={compose.validationErrors.contact}
            />

            {/* Inbox Selection - Show after contact is selected */}
            {compose.formState.contact && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  px: 4,
                  py: 3,
                  borderBottom: `1px solid ${neutralColor(200)}`,
                  backgroundColor: neutralColor(0),
                }}
              >
                <Typography
                  sx={{
                    color: neutralColor(700),
                    fontSize: "0.875rem",
                    minWidth: 100,
                    fontWeight: 600,
                    pt: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Inbox *
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
            {compose.formState.contact && compose.formState.selectedContactableInbox && (
              <Box>
                {/* Email-specific fields */}
                {requirements?.subjectRequired && requirements?.ccBccSupported && (
                  <EmailCompositionFields
                    subject={compose.formState.subject || ""}
                    ccEmails={compose.formState.ccEmails || ""}
                    bccEmails={compose.formState.bccEmails || ""}
                    errors={compose.validationErrors}
                    onSubjectChange={(value) => compose.updateField("subject", value)}
                    onCcChange={(value) => compose.updateField("ccEmails", value)}
                    onBccChange={(value) => compose.updateField("bccEmails", value)}
                  />
                )}

                {/* WhatsApp Template Button - Only for WhatsApp channels */}
                {channelType === "Channel::WhatsApp" && (
                  <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${neutralColor(200)}`, backgroundColor: neutralColor(0) }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setShowTemplateSelector(true)}
                      sx={{
                        textTransform: "none",
                        borderColor: neutralColor(300),
                        color: neutralColor(700),
                        fontWeight: 500,
                        py: 1.5,
                        borderRadius: 1,
                        backgroundColor: neutralColor(0),
                        "&:hover": {
                          borderColor: primaryColor(400),
                          backgroundColor: primaryColor(25),
                          color: primaryColor(700),
                        },
                      }}
                    >
                      {compose.formState.templateParams
                        ? `Template: ${compose.formState.templateParams.name.replace(/_/g, " ")}`
                        : "Select WhatsApp Template"}
                    </Button>
                    {compose.formState.templateParams && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: neutralColor(600),
                          mt: 1,
                          display: "block",
                          fontSize: "0.75rem",
                        }}
                      >
                        ✓ Template selected. Message field is now optional.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Message Field - Rich Text Editor */}
                <Box sx={{ px: 4, py: 3, backgroundColor: neutralColor(0) }}>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: neutralColor(700),
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 2,
                    }}
                  >
                    Message {!requirements?.messageRequired && "(Optional)"}
                  </Typography>
                  <MessageEditor
                    content={compose.formState.message}
                    onChange={(content) => compose.updateField("message", content)}
                    placeholder={
                      compose.formState.templateParams
                        ? "Optional: Add a custom message (or leave empty to use template only)"
                        : "Write your message here..."
                    }
                    error={compose.validationErrors.message}
                    disabled={compose.isSubmitting}
                    minHeight={280}
                  />
                </Box>

                {/* Attachments Section */}
                {requirements?.attachmentsSupported && (
                  <AttachmentUploader
                    files={compose.formState.attachments}
                    onFilesSelect={(files) => compose.updateField("attachments", files)}
                    onFileRemove={(index) => {
                      const newAttachments = compose.formState.attachments.filter((_, i) => i !== index);
                      compose.updateField("attachments", newAttachments);
                    }}
                    disabled={compose.isSubmitting}
                  />
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            borderTop: `2px solid ${neutralColor(200)}`,
            px: 4,
            py: 3,
            justifyContent: "flex-end",
            backgroundColor: neutralColor(0),
            gap: 2,
          }}
        >
          <Button
            onClick={handleBackdropClick}
            disabled={compose.isSubmitting}
            sx={{
              textTransform: "none",
              color: neutralColor(700),
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 3,
              py: 1.25,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: neutralColor(100),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="contained"
            startIcon={compose.isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            aria-label={compose.isSubmitting ? "Sending message" : "Send message"}
            sx={{
              textTransform: "none",
              backgroundColor: primaryColor(600),
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 4,
              py: 1.25,
              borderRadius: 1,
              boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1)`,
              "&:hover": {
                backgroundColor: primaryColor(700),
                boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
              },
              "&:disabled": {
                backgroundColor: neutralColor(300),
                color: neutralColor(500),
              },
            }}
          >
            <Box component="span" role={compose.isSubmitting ? "status" : undefined} aria-live="polite">
              {compose.isSubmitting ? "Sending..." : "Send Message"}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        open={showExitConfirm}
        onClose={handleCancelExit}
        onConfirm={handleConfirmExit}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to close this conversation? All your progress will be lost."
        confirmText="Discard"
        confirmColor="error"
      />

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
