/**
 * Compose Conversation Modal
 *
 * Modal for creating new conversations in Chatwoot.
 * Supports contact selection, inbox selection, and channel-specific message composition.
 */

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Stack, TextField, TextareaAutosize, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ContactSelector } from "./ContactSelector";
import { InboxSelector } from "./InboxSelector";
import { CreateContactModal } from "./CreateContactModal";
import { useComposeConversation } from "../../hooks/use-compose-conversation";
import { getChannelRequirements } from "@/services/frontdesk/api/chatwoot/types/compose.types";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";

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
    compose.resetForm();
    setError(null);
    setShowBcc(false);
    onClose();
  };

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
            borderRadius: "12px",
            maxHeight: "90vh",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${neutralColor(200)}`,
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: neutralColor(900) }}>
            New Conversation
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={compose.isSubmitting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Contact Selection */}
            <ContactSelector
              selectedContact={compose.formState.contact}
              searchResults={compose.searchResults}
              isSearching={compose.isSearching}
              onSearch={compose.searchContacts}
              onSelectContact={compose.selectContact}
              onCreateContact={() => setShowCreateContact(true)}
              error={compose.validationErrors.contact}
            />

            {/* Inbox Selection */}
            <InboxSelector
              contactableInboxes={compose.contactableInboxes}
              selectedInbox={compose.formState.selectedContactableInbox}
              isLoading={compose.isLoadingInboxes}
              disabled={!compose.formState.contact}
              onSelect={(inbox) => compose.updateField("selectedContactableInbox", inbox)}
              error={compose.validationErrors.inbox}
            />

            {/* Message Composition Section */}
            {compose.formState.selectedContactableInbox && (
              <Box
                sx={{
                  border: `1px solid ${neutralColor(300)}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
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

                {/* Message Field */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <TextareaAutosize
                    minRows={4}
                    maxRows={8}
                    placeholder={
                      requirements?.messageRequired
                        ? "Type your message... *"
                        : "Type your message..."
                    }
                    value={compose.formState.message}
                    onChange={(e) => compose.updateField("message", e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      resize: "none",
                      backgroundColor: "transparent",
                    }}
                  />
                  {compose.validationErrors.message && (
                    <Typography color="error" sx={{ fontSize: "0.75rem", mt: 0.5 }}>
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

        {/* Footer */}
        <DialogActions sx={{ borderTop: `1px solid ${neutralColor(200)}`, px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={compose.isSubmitting}
            sx={{ textTransform: "none", color: neutralColor(700) }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="contained"
            startIcon={compose.isSubmitting ? null : <SendIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              backgroundColor: primaryColor(600),
              "&:hover": { backgroundColor: primaryColor(700) },
              "&:disabled": { backgroundColor: neutralColor(300) },
            }}
          >
            {compose.isSubmitting ? "Creating..." : "Create Conversation"}
          </Button>
        </DialogActions>
      </Dialog>

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
