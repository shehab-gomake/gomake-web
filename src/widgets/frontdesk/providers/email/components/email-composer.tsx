import React, { useState, useCallback } from "react";
import { Box, Paper, Collapse, Fade, InputBase } from "@mui/material";
import { EmailDraft, EmailMessage } from "../types/email.types";
import { useEmailComposerForm } from "../hooks/use-email-composer-form";
//import { EmailComposerHeader } from "./composer/email-composer-header";
//import { EmailRecipientsSection } from "./composer/email-recipients-section";
//import { EmailComposerToolbar } from "./composer/email-composer-toolbar";

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  onSend: (draft: EmailDraft) => Promise<boolean>;
  draft?: EmailDraft;
  isSending?: boolean;
  replyToMessage?: EmailMessage;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  open,
  onClose,
  onSend,
  draft,
  isSending = false,
  replyToMessage,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    to,
    cc,
    bcc,
    subject,
    message,
    showCc,
    showBcc,
    setTo,
    setCc,
    setBcc,
    setSubject,
    setMessage,
    setShowCc,
    setShowBcc,
    handleSend,
    formatText,
    canSend,
  } = useEmailComposerForm({ draft, replyToMessage, onSend });

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const handleSendAndClose = useCallback(async () => {
    const success = await handleSend();
    if (success) {
      onClose();
    }
  }, [handleSend, onClose]);

  if (!open) return null;

  return (
    <Fade in={open} timeout={200}>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 16,
          zIndex: 1400,
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
          {/*          <EmailComposerHeader subject={subject} isMinimized={isMinimized} onMinimize={handleMinimize} onClose={onClose} />
*/}
          {/* Content */}
          <Collapse in={!isMinimized}>
            <Box sx={{ backgroundColor: "#fff" }}>
              {
                /*
                <EmailRecipientsSection
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
                 */
              }

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

              {
                /*<EmailComposerToolbar
                onSend={handleSendAndClose}
                onClose={onClose}
                onFormatText={formatText}
                canSend={canSend}
                isSending={isSending}
              />*/
              }
            </Box>
          </Collapse>
        </Paper>
      </Box>
    </Fade>
  );
};
