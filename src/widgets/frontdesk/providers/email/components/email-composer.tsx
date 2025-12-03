import React, { useState, useCallback, useRef } from "react";
import { Box, Paper, Collapse, Fade, InputBase, Skeleton, Stack, CircularProgress, Typography } from "@mui/material";
import { EmailDraft, EmailMessage, EmailSenderOption } from "../types/email.types";
import { useEmailComposerForm } from "../hooks/use-email-composer-form";
import { EmailComposerHeader } from "./email-composer-header";
import { EmailRecipientsSection } from "./email-recipients-section";
import { EmailComposerToolbar } from "./email-composer-toolbar";
import { EmailAttachmentPicker, EmailAttachmentPickerHandle } from "./email-attachment-picker";

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  onSend: (draft: EmailDraft) => Promise<boolean>;
  draft?: EmailDraft;
  isSending?: boolean;
  isLoading?: boolean;
  replyToMessage?: EmailMessage;
  fromOptions?: EmailSenderOption[];
  defaultSenderOption?: EmailSenderOption | null;
  contactId?: number | null;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  open,
  onClose,
  onSend,
  draft,
  isSending = false,
  isLoading = false,
  replyToMessage,
  fromOptions,
  defaultSenderOption,
  contactId,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const attachmentPickerRef = useRef<EmailAttachmentPickerHandle>(null);

  const {
    to,
    cc,
    bcc,
    subject,
    message,
    showCc,
    showBcc,
    attachments,
    senderOption,
    setTo,
    setCc,
    setBcc,
    setSubject,
    setMessage,
    setShowCc,
    setShowBcc,
    setAttachments,
    setSenderOption,
    handleSend,
    formatText,
    canSend,
  } = useEmailComposerForm({
    draft,
    replyToMessage,
    onSend,
    fromOptions,
    initialSenderOption: defaultSenderOption,
    contactId,
  });

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const handleSendAndClose = useCallback(async () => {
    const success = await handleSend();
    if (success) {
      onClose();
    }
  }, [handleSend, onClose]);

  const handleAttach = useCallback(() => {
    attachmentPickerRef.current?.openFilePicker();
  }, []);

  if (!open) return null;

  return (
    <Fade in={open} timeout={200}>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 16,
          zIndex: 2,
          width: isMinimized ? 260 : 450,
          transition: "all 0.2s ease",
        }}
      >
        <Paper
          elevation={20}
          sx={{
            borderRadius: isMinimized ? "8px 8px 0 0" : "8px 8px 0 0",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 -2px 10px 0 rgba(0,0,0,0.2)",
          }}
        >
          <EmailComposerHeader subject={subject} isMinimized={isMinimized} onMinimize={handleMinimize} onClose={onClose} />

          {/* Content */}
          <Collapse in={!isMinimized}>
            <Box sx={{ backgroundColor: "#fff" }}>
              {isLoading ? (
                /* Loading State */
                <Box sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    {/* From skeleton */}
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                    {/* To skeleton */}
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                    {/* Subject skeleton */}
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                    {/* Body skeleton */}
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                    {/* Loading indicator */}
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ py: 2 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Loading email data...
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              ) : (
                /* Loaded Content */
                <>
                  <EmailRecipientsSection
                    fromOptions={fromOptions}
                    selectedFromOption={senderOption}
                    onFromChange={setSenderOption}
                    to={to}
                    cc={cc}
                    bcc={bcc}
                    subject={subject}
                    showCc={showCc}
                    showBcc={showBcc}
                    onToChange={setTo}
                    onCcChange={setCc}
                    onBccChange={setBcc}
                    onSubjectChange={setSubject}
                    onShowCc={setShowCc}
                    onShowBcc={setShowBcc}
                  />

                  {/* Message Body */}
                  <Box sx={{ px: 2 }}>
                    <InputBase
                      multiline
                      fullWidth
                      rows={12}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Compose email"
                      sx={{
                        fontSize: "14px",
                        "& textarea": {
                          p: 0,
                          "&::-webkit-scrollbar": {
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#888",
                            borderRadius: "4px",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Attachments */}
                  <Box sx={{ px: 2, pb: 1 }}>
                    <EmailAttachmentPicker
                      ref={attachmentPickerRef}
                      attachments={attachments}
                      onAttachmentsChange={setAttachments}
                    />
                  </Box>

                  <EmailComposerToolbar
                    onSend={handleSendAndClose}
                    onClose={onClose}
                    onFormatText={formatText}
                    onAttach={handleAttach}
                    canSend={canSend}
                    isSending={isSending}
                  />
                </>
              )}
            </Box>
          </Collapse>
        </Paper>
      </Box>
    </Fade>
  );
};
