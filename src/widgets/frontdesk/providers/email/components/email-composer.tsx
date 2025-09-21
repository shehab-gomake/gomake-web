import React, { useState, useCallback } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Collapse,
  Fade,
  InputBase,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  Remove as RemoveIcon,
  OpenInFull as MaximizeIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  AttachFile as AttachIcon,
  InsertEmoticon as EmojiIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailDraft, EmailRecipient, EmailMessage } from "../types/email.types";

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
  const { primaryColor, neutralColor } = useGomakeTheme();

  const [to, setTo] = useState(
    replyToMessage
      ? `${replyToMessage.from.name ? replyToMessage.from.name + " <" + replyToMessage.from.email + ">" : replyToMessage.from.email}`
      : draft?.to?.map(r => r.email).join(", ") || ""
  );
  const [cc, setCc] = useState(draft?.cc?.map(r => r.email).join(", ") || "");
  const [bcc, setBcc] = useState(draft?.bcc?.map(r => r.email).join(", ") || "");
  const [subject, setSubject] = useState(
    replyToMessage
      ? `Re: ${replyToMessage.subject.replace(/^Re:\s*/i, "")}`
      : draft?.subject || ""
  );
  const [message, setMessage] = useState(draft?.text || "");

  const [isMinimized, setIsMinimized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const parseEmails = (emailString: string): EmailRecipient[] => {
    if (!emailString.trim()) return [];
    return emailString
      .split(",")
      .map(email => ({ email: email.trim(), name: "" }))
      .filter(recipient => recipient.email);
  };

  const handleSend = useCallback(async () => {
    if (!to.trim() || !message.trim()) return;

    const emailDraft: EmailDraft = {
      to: parseEmails(to),
      cc: parseEmails(cc),
      bcc: parseEmails(bcc),
      subject: subject.trim() || "(no subject)",
      text: message.trim(),
      html: message.trim(),
      replyToMessageId: replyToMessage?.id || draft?.replyToMessageId,
      threadId: replyToMessage?.threadId || draft?.threadId,
    };

    const success = await onSend(emailDraft);
    if (success) {
      onClose();
    }
  }, [to, cc, bcc, subject, message, replyToMessage, draft, onSend, onClose]);

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

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
          {/* Header */}
          <Box
            sx={{
              height: 40,
              backgroundColor: "#404040",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              cursor: isMinimized ? "pointer" : "default",
            }}
            onClick={isMinimized ? handleMinimize : undefined}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {subject || "New Message"}
            </Typography>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMinimize();
                }}
                sx={{
                  p: 0.5,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {isMinimized ? <MaximizeIcon sx={{ fontSize: 18 }} /> : <RemoveIcon sx={{ fontSize: 18 }} />}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                sx={{
                  p: 0.5,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Collapse in={!isMinimized}>
            <Box sx={{ backgroundColor: "#fff" }}>
              {/* Recipients Section */}
              <Box sx={{ px: 2, pt: 1 }}>
                {/* To Field */}
                <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#777",
                      minWidth: 50,
                      fontSize: "14px",
                    }}
                  >
                    To
                  </Typography>
                  <InputBase
                    fullWidth
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    sx={{
                      fontSize: "14px",
                      ml: 1,
                      "& input": {
                        p: 0,
                      },
                    }}
                  />
                  <Stack direction="row" spacing={0.5}>
                    {!showCc && (
                      <Button
                        size="small"
                        onClick={() => setShowCc(true)}
                        sx={{
                          minWidth: "auto",
                          color: "#777",
                          fontSize: "13px",
                          p: "2px 8px",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#f1f3f4",
                          },
                        }}
                      >
                        Cc
                      </Button>
                    )}
                    {!showBcc && (
                      <Button
                        size="small"
                        onClick={() => setShowBcc(true)}
                        sx={{
                          minWidth: "auto",
                          color: "#777",
                          fontSize: "13px",
                          p: "2px 8px",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#f1f3f4",
                          },
                        }}
                      >
                        Bcc
                      </Button>
                    )}
                  </Stack>
                </Box>

                {/* CC Field */}
                <Collapse in={showCc}>
                  <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#777",
                        minWidth: 50,
                        fontSize: "14px",
                      }}
                    >
                      Cc
                    </Typography>
                    <InputBase
                      fullWidth
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="Cc recipients"
                      sx={{
                        fontSize: "14px",
                        ml: 1,
                        "& input": {
                          p: 0,
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowCc(false);
                        setCc("");
                      }}
                      sx={{
                        p: 0.5,
                        color: "#5f6368",
                        "&:hover": {
                          backgroundColor: "#f1f3f4",
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Collapse>

                {/* BCC Field */}
                <Collapse in={showBcc}>
                  <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#777",
                        minWidth: 50,
                        fontSize: "14px",
                      }}
                    >
                      Bcc
                    </Typography>
                    <InputBase
                      fullWidth
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="Bcc recipients"
                      sx={{
                        fontSize: "14px",
                        ml: 1,
                        "& input": {
                          p: 0,
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowBcc(false);
                        setBcc("");
                      }}
                      sx={{
                        p: 0.5,
                        color: "#5f6368",
                        "&:hover": {
                          backgroundColor: "#f1f3f4",
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Collapse>

                <Divider sx={{ my: 1 }} />

                {/* Subject Field */}
                <Box sx={{ display: "flex", alignItems: "center", minHeight: 36 }}>
                  <InputBase
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    sx={{
                      fontSize: "14px",
                      "& input": {
                        p: 0,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />
              </Box>

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

              {/* Bottom Toolbar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSend}
                    disabled={!to.trim() || !message.trim() || isSending}
                    sx={{
                      backgroundColor: "#1a73e8",
                      color: "white",
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "14px",
                      px: 3,
                      py: 0.75,
                      borderRadius: "4px",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1765cc",
                        boxShadow: "0 1px 2px 0 rgba(26,115,232,0.45)",
                      },
                      "&:disabled": {
                        backgroundColor: "#f8f9fa",
                        color: "#aaa",
                      },
                    }}
                  >
                    Send
                  </Button>

                  <Stack direction="row" spacing={0} divider={<Divider orientation="vertical" flexItem />}>
                    <Tooltip title="Bold">
                      <IconButton
                        size="small"
                        onClick={() => formatText("bold")}
                        sx={{
                          p: 1,
                          color: "#5f6368",
                          "&:hover": {
                            backgroundColor: "#e8eaed",
                          },
                        }}
                      >
                        <BoldIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                      <IconButton
                        size="small"
                        onClick={() => formatText("italic")}
                        sx={{
                          p: 1,
                          color: "#5f6368",
                          "&:hover": {
                            backgroundColor: "#e8eaed",
                          },
                        }}
                      >
                        <ItalicIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Underline">
                      <IconButton
                        size="small"
                        onClick={() => formatText("underline")}
                        sx={{
                          p: 1,
                          color: "#5f6368",
                          "&:hover": {
                            backgroundColor: "#e8eaed",
                          },
                        }}
                      >
                        <UnderlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Tooltip title="Attach files">
                    <IconButton
                      size="small"
                      sx={{
                        p: 1,
                        color: "#5f6368",
                        "&:hover": {
                          backgroundColor: "#e8eaed",
                        },
                      }}
                    >
                      <AttachIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Insert emoji">
                    <IconButton
                      size="small"
                      sx={{
                        p: 1,
                        color: "#5f6368",
                        "&:hover": {
                          backgroundColor: "#e8eaed",
                        },
                      }}
                    >
                      <EmojiIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Tooltip title="Discard draft">
                  <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                      p: 1,
                      color: "#5f6368",
                      "&:hover": {
                        backgroundColor: "#e8eaed",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      </Box>
    </Fade>
  );
};