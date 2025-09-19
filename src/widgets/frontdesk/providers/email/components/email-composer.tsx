import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Stack,
  Typography,
  Chip,
  Collapse,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Fullscreen as FullscreenIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { EmailDraft } from "../types/email.types";

interface EmailComposerProps {
  draft?: EmailDraft;
  onSend: (draft: EmailDraft) => void;
  onSave?: (draft: EmailDraft) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  isSending?: boolean;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  draft: initialDraft,
  onSend,
  onSave,
  onClose,
  onMinimize,
  isMinimized = false,
  isSending = false,
}) => {
  const [draft, setDraft] = useState<EmailDraft>(
    initialDraft || {
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      html: "",
      text: "",
      attachments: [],
    }
  );

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-save draft every 10 seconds
    if (onSave) {
      autoSaveTimerRef.current = setInterval(() => {
        onSave(draft);
      }, 10000);

      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    }
  }, [draft, onSave]);

  const handleAddRecipient = (field: "to" | "cc" | "bcc", email: string) => {
    if (email && email.includes("@")) {
      setDraft((prev) => ({
        ...prev,
        [field]: [...prev[field], { email, name: "" }],
      }));

      // Clear the input
      if (field === "to") setToInput("");
      else if (field === "cc") setCcInput("");
      else if (field === "bcc") setBccInput("");
    }
  };

  const handleRemoveRecipient = (field: "to" | "cc" | "bcc", index: number) => {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSend = () => {
    if (draft.to.length === 0) {
      alert("Please add at least one recipient");
      return;
    }
    if (!draft.subject.trim()) {
      if (!confirm("Send this message without a subject?")) {
        return;
      }
    }
    onSend(draft);
  };

  const handleAttachment = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || []) as File[];
      // Here you would handle file upload
      console.log("Files selected:", files);
    };
    input.click();
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  if (isMinimized) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 300,
          cursor: "pointer",
          overflow: "hidden",
        }}
        onClick={() => onMinimize?.()}
      >
        <Box sx={{ p: 2, backgroundColor: "primary.main", color: "white" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" noWrap>
              {draft.subject || "New Message"}
            </Typography>
            <IconButton size="small" sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: 600,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">New Message</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: "white" }} onClick={onMinimize}>
              <MinimizeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "white" }}>
              <FullscreenIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Recipients */}
      <Box sx={{ p: 2 }}>
        {/* To Field */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ minWidth: 50 }}>
            To:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.5} flex={1}>
            {draft.to.map((recipient, index) => (
              <Chip
                key={index}
                label={recipient.email}
                size="small"
                onDelete={() => handleRemoveRecipient("to", index)}
              />
            ))}
            <TextField
              size="small"
              placeholder="Add recipients"
              variant="standard"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddRecipient("to", toInput);
                }
              }}
              onBlur={() => handleAddRecipient("to", toInput)}
              sx={{ flex: 1, minWidth: 100 }}
              InputProps={{ disableUnderline: true }}
            />
          </Stack>
          <Stack direction="row">
            <Button size="small" onClick={() => setShowCc(!showCc)}>
              Cc
            </Button>
            <Button size="small" onClick={() => setShowBcc(!showBcc)}>
              Bcc
            </Button>
          </Stack>
        </Stack>

        {/* CC Field */}
        <Collapse in={showCc}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 50 }}>
              Cc:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.5} flex={1}>
              {draft.cc.map((recipient, index) => (
                <Chip
                  key={index}
                  label={recipient.email}
                  size="small"
                  onDelete={() => handleRemoveRecipient("cc", index)}
                />
              ))}
              <TextField
                size="small"
                placeholder="Add Cc recipients"
                variant="standard"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRecipient("cc", ccInput);
                  }
                }}
                onBlur={() => handleAddRecipient("cc", ccInput)}
                sx={{ flex: 1, minWidth: 100 }}
                InputProps={{ disableUnderline: true }}
              />
            </Stack>
          </Stack>
        </Collapse>

        {/* BCC Field */}
        <Collapse in={showBcc}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 50 }}>
              Bcc:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.5} flex={1}>
              {draft.bcc.map((recipient, index) => (
                <Chip
                  key={index}
                  label={recipient.email}
                  size="small"
                  onDelete={() => handleRemoveRecipient("bcc", index)}
                />
              ))}
              <TextField
                size="small"
                placeholder="Add Bcc recipients"
                variant="standard"
                value={bccInput}
                onChange={(e) => setBccInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRecipient("bcc", bccInput);
                  }
                }}
                onBlur={() => handleAddRecipient("bcc", bccInput)}
                sx={{ flex: 1, minWidth: 100 }}
                InputProps={{ disableUnderline: true }}
              />
            </Stack>
          </Stack>
        </Collapse>

        {/* Subject */}
        <TextField
          fullWidth
          placeholder="Subject"
          variant="standard"
          value={draft.subject}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, subject: e.target.value }))
          }
        />
      </Box>

      <Divider />

      {/* Formatting Toolbar */}
      <Box sx={{ px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => formatText("bold")}>
            <BoldIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => formatText("italic")}>
            <ItalicIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => formatText("underline")}>
            <UnderlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => {
            const url = prompt("Enter URL:");
            if (url) formatText("createLink");
          }}>
            <LinkIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleAttachment}>
            <AttachIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Email Body */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        sx={{
          flex: 1,
          p: 2,
          overflow: "auto",
          minHeight: 200,
          outline: "none",
          "& *": { fontFamily: "inherit" },
        }}
        onInput={(e) => {
          const html = e.currentTarget.innerHTML;
          const text = e.currentTarget.innerText;
          setDraft((prev) => ({ ...prev, html, text }));
        }}
        dangerouslySetInnerHTML={{ __html: draft.html }}
      />

      {/* Attachments */}
      {draft.attachments && draft.attachments.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {draft.attachments.map((attachment, index) => (
              <Chip
                key={index}
                icon={<AttachIcon />}
                label={attachment.filename}
                size="small"
                onDelete={() => {
                  setDraft((prev) => ({
                    ...prev,
                    attachments: prev.attachments?.filter((_, i) => i !== index),
                  }));
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={isSending ? <CircularProgress size={16} /> : <SendIcon />}
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreIcon />
            </IconButton>
          </Stack>

          <IconButton onClick={onClose}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          onSave?.(draft);
          setAnchorEl(null);
        }}>
          Save draft
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          Schedule send
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          Add signature
        </MenuItem>
      </Menu>
    </Paper>
  );
};