import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon, AttachFile as AttachIcon, Add as AddIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailDraft, EmailRecipient } from "../types/email.types";

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  onSend: (draft: EmailDraft) => Promise<boolean>;
  draft?: EmailDraft;
  isSending?: boolean;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ open, onClose, onSend, draft, isSending = false }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const [to, setTo] = useState<EmailRecipient[]>(draft?.to || []);
  const [cc, setCc] = useState<EmailRecipient[]>(draft?.cc || []);
  const [bcc, setBcc] = useState<EmailRecipient[]>(draft?.bcc || []);
  const [subject, setSubject] = useState(draft?.subject || "");
  const [text, setText] = useState(draft?.text || "");
  const [html, setHtml] = useState(draft?.html || "");

  const [showCc, setShowCc] = useState(cc.length > 0);
  const [showBcc, setShowBcc] = useState(bcc.length > 0);

  const handleSend = useCallback(async () => {
    if (!to.length || !subject.trim() || !text.trim()) return;

    const emailDraft: EmailDraft = {
      to,
      cc,
      bcc,
      subject: subject.trim(),
      text: text.trim(),
      html,
      replyToMessageId: draft?.replyToMessageId,
      threadId: draft?.threadId,
    };

    const success = await onSend(emailDraft);
    if (success) {
      onClose();
    }
  }, [to, cc, bcc, subject, text, html, draft, onSend, onClose]);

  const addRecipient = useCallback((field: "to" | "cc" | "bcc", email: string) => {
    if (!email.trim()) return;

    const recipient: EmailRecipient = {
      email: email.trim(),
      name: "",
    };

    switch (field) {
      case "to":
        setTo((prev) => [...prev, recipient]);
        break;
      case "cc":
        setCc((prev) => [...prev, recipient]);
        break;
      case "bcc":
        setBcc((prev) => [...prev, recipient]);
        break;
    }
  }, []);

  const removeRecipient = useCallback((field: "to" | "cc" | "bcc", index: number) => {
    switch (field) {
      case "to":
        setTo((prev) => prev.filter((_, i) => i !== index));
        break;
      case "cc":
        setCc((prev) => prev.filter((_, i) => i !== index));
        break;
      case "bcc":
        setBcc((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  }, []);

  const RecipientField: React.FC<{
    label: string;
    recipients: EmailRecipient[];
    onAdd: (email: string) => void;
    onRemove: (index: number) => void;
    placeholder?: string;
  }> = ({ label, recipients, onAdd, onRemove, placeholder = "Enter email address" }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (inputValue.trim()) {
          onAdd(inputValue);
          setInputValue("");
        }
      }
    };

    return (
      <Box>
        <Typography variant="body2" sx={{ color: neutralColor(700), mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {recipients.map((recipient, index) => (
            <Chip
              key={index}
              label={recipient.email}
              onDelete={() => onRemove(index)}
              size="small"
              sx={{
                backgroundColor: alpha(primaryColor(100), 0.7),
                color: primaryColor(700),
                "& .MuiChip-deleteIcon": {
                  color: primaryColor(600),
                },
              }}
            />
          ))}
        </Box>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={() => {
            if (inputValue.trim()) {
              onAdd(inputValue);
              setInputValue("");
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: primaryColor(300),
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
              },
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: neutralColor(900) }}>
          {draft?.replyToMessageId ? "Reply" : "Compose Email"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Recipients */}
        <RecipientField
          label="To"
          recipients={to}
          onAdd={(email) => addRecipient("to", email)}
          onRemove={(index) => removeRecipient("to", index)}
        />

        {/* CC */}
        {showCc && (
          <RecipientField
            label="Cc"
            recipients={cc}
            onAdd={(email) => addRecipient("cc", email)}
            onRemove={(index) => removeRecipient("cc", index)}
          />
        )}

        {/* BCC */}
        {showBcc && (
          <RecipientField
            label="Bcc"
            recipients={bcc}
            onAdd={(email) => addRecipient("bcc", email)}
            onRemove={(index) => removeRecipient("bcc", index)}
          />
        )}

        {/* Show/Hide CC/BCC buttons */}
        <Stack direction="row" spacing={1}>
          {!showCc && (
            <Button size="small" onClick={() => setShowCc(true)} sx={{ color: primaryColor(600), textTransform: "none" }}>
              + Cc
            </Button>
          )}
          {!showBcc && (
            <Button size="small" onClick={() => setShowBcc(true)} sx={{ color: primaryColor(600), textTransform: "none" }}>
              + Bcc
            </Button>
          )}
        </Stack>

        <Divider />

        {/* Subject */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: primaryColor(300),
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
              },
            },
          }}
        />

        {/* Message Body */}
        <TextField
          fullWidth
          multiline
          rows={12}
          label="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: primaryColor(300),
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
          p: 2,
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSending}
          sx={{
            borderColor: neutralColor(300),
            color: neutralColor(700),
            "&:hover": {
              borderColor: primaryColor(300),
              backgroundColor: alpha(primaryColor(100), 0.5),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!to.length || !subject.trim() || !text.trim() || isSending}
          sx={{
            backgroundColor: primaryColor(500),
            "&:hover": {
              backgroundColor: primaryColor(600),
            },
            "&:disabled": {
              backgroundColor: neutralColor(300),
              color: neutralColor(500),
            },
          }}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
