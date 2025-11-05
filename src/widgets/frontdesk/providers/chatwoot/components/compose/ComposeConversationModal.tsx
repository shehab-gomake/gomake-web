/**
 * Compose Conversation Modal
 *
 * Modal for creating new conversations in Chatwoot.
 * Supports contact selection, inbox selection, and channel-specific message composition.
 */

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Stack, TextField, Typography, IconButton, Box, CircularProgress, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ContactSelector } from "./ContactSelector";
import { CreateContactModal } from "./CreateContactModal";
import { MessageEditor } from "./MessageEditor";
import { AttachmentPreviews } from "./AttachmentPreview";
import { InboxSelector } from "./InboxSelector";
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
    (compose.formState.message || (requirements && !requirements.messageRequired));

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

            {/* To: Field (Contact Selection) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                px: 4,
                py: 3,
                borderBottom: `1px solid ${neutralColor(200)}`,
                backgroundColor: neutralColor(25),
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
                Contact *
              </Typography>
              <Box sx={{ flex: 1 }}>
                {compose.formState.contact ? (
                  <Chip
                    label={
                      compose.formState.contact.name ||
                      compose.formState.contact.email ||
                      compose.formState.contact.phone_number
                    }
                    onDelete={() => compose.selectContact(null as any)}
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(700),
                      border: `1px solid ${primaryColor(200)}`,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      "& .MuiChip-deleteIcon": {
                        color: primaryColor(600),
                        "&:hover": {
                          color: primaryColor(800),
                        },
                      },
                    }}
                  />
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
                {requirements?.subjectRequired && (
                  <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 4, py: 3, backgroundColor: neutralColor(25) }}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label="SUBJECT"
                      placeholder="Enter subject"
                      value={compose.formState.subject || ""}
                      onChange={(e) => compose.updateField("subject", e.target.value)}
                      error={!!compose.validationErrors.subject}
                      helperText={compose.validationErrors.subject}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontSize: "0.875rem",
                          color: neutralColor(900),
                          mt: 0.5,
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          fontSize: "0.75rem",
                          color: neutralColor(700),
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        },
                      }}
                    />
                  </Box>
                )}

                {requirements?.ccBccSupported && (
                  <>
                    <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 4, py: 2.5, backgroundColor: neutralColor(0) }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography
                          sx={{
                            minWidth: 50,
                            fontSize: "0.75rem",
                            color: neutralColor(700),
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          CC
                        </Typography>
                        <TextField
                          fullWidth
                          variant="standard"
                          placeholder="email@example.com (optional)"
                          value={compose.formState.ccEmails || ""}
                          onChange={(e) => compose.updateField("ccEmails", e.target.value)}
                          error={!!compose.validationErrors.ccEmails}
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "0.875rem", color: neutralColor(900) },
                          }}
                        />
                        {!showBcc && (
                          <Button
                            size="small"
                            onClick={() => setShowBcc(true)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8125rem",
                              color: primaryColor(600),
                              fontWeight: 500,
                              minWidth: "auto",
                              "&:hover": {
                                backgroundColor: primaryColor(50),
                              },
                            }}
                          >
                            + BCC
                          </Button>
                        )}
                      </Stack>
                    </Box>
                    {showBcc && (
                      <Box sx={{ borderBottom: `1px solid ${neutralColor(200)}`, px: 4, py: 2.5, backgroundColor: neutralColor(0) }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography
                            sx={{
                              minWidth: 50,
                              fontSize: "0.75rem",
                              color: neutralColor(700),
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            BCC
                          </Typography>
                          <TextField
                            fullWidth
                            variant="standard"
                            placeholder="email@example.com (optional)"
                            value={compose.formState.bccEmails || ""}
                            onChange={(e) => compose.updateField("bccEmails", e.target.value)}
                            error={!!compose.validationErrors.bccEmails}
                            InputProps={{
                              disableUnderline: true,
                              sx: { fontSize: "0.875rem", color: neutralColor(900) },
                            }}
                          />
                        </Stack>
                      </Box>
                    )}
                  </>
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
                  <Box sx={{ borderTop: `1px solid ${neutralColor(200)}`, px: 4, py: 3, backgroundColor: neutralColor(25) }}>
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
                      Attachments
                    </Typography>
                    <Button
                      component="label"
                      startIcon={<AttachFileIcon sx={{ fontSize: 18 }} />}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        fontSize: "0.875rem",
                        color: neutralColor(700),
                        fontWeight: 500,
                        borderColor: neutralColor(300),
                        "&:hover": {
                          backgroundColor: neutralColor(50),
                          borderColor: neutralColor(400),
                        },
                      }}
                    >
                      Choose Files
                      <input type="file" multiple hidden onChange={handleFileSelect} />
                    </Button>
                    <AttachmentPreviews files={compose.formState.attachments} onRemove={handleRemoveFile} />
                  </Box>
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
            {compose.isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitConfirm}
        onClose={handleCancelExit}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
            Discard Changes?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.875rem", color: neutralColor(700), lineHeight: 1.6 }}>
            You have unsaved changes. Are you sure you want to close this conversation? All your progress will be
            lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button
            onClick={handleCancelExit}
            sx={{
              textTransform: "none",
              color: neutralColor(700),
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              "&:hover": {
                backgroundColor: neutralColor(100),
              },
            }}
          >
            Keep Editing
          </Button>
          <Button
            onClick={handleConfirmExit}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 2.5,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#dc2626",
                boxShadow: "none",
              },
            }}
          >
            Discard
          </Button>
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
