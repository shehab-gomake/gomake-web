import React, { useState, useRef, KeyboardEvent } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Link,
  InputAdornment,
  TextareaAutosize,
} from "@mui/material";
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Link as LinkIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Code as CodeIcon,
  InsertEmoticon as EmojiIcon,
  AttachFile as AttachIcon,
  Mic as MicIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AIAssistIcon,
  Send as SendIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation, ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ChatwootReplyComposerProps {
  conversation: ChatwootConversation | null;
  onSend: (content: string, isPrivate: boolean, recipientEmails?: { to?: string; cc?: string; bcc?: string }) => Promise<void>;
  isSending?: boolean;
}

type TabValue = "reply" | "private";

export const ChatwootReplyComposer: React.FC<ChatwootReplyComposerProps> = ({
  conversation,
  onSend,
  isSending = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [activeTab, setActiveTab] = useState<TabValue>("reply");
  const [messageContent, setMessageContent] = useState("");
  const [toEmails, setToEmails] = useState("");
  const [ccEmails, setCcEmails] = useState("");
  const [showBcc, setShowBcc] = useState(false);
  const [bccEmails, setBccEmails] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract recipient email from conversation
  const defaultRecipient = conversation?.meta?.sender?.email || "";

  React.useEffect(() => {
    if (conversation && !toEmails) {
      setToEmails(defaultRecipient);
    }
  }, [conversation, defaultRecipient, toEmails]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleFormatText = (command: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = messageContent.substring(start, end);
    const before = messageContent.substring(0, start);
    const after = messageContent.substring(end);

    let formattedText = "";
    switch (command) {
      case "bold":
        formattedText = `${before}**${selectedText}**${after}`;
        break;
      case "italic":
        formattedText = `${before}*${selectedText}*${after}`;
        break;
      case "underline":
        formattedText = `${before}<u>${selectedText}</u>${after}`;
        break;
      case "code":
        formattedText = `${before}\`${selectedText}\`${after}`;
        break;
      default:
        return;
    }

    setMessageContent(formattedText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Shift+Enter for new line
    if (e.key === "Enter" && e.shiftKey) {
      return; // Allow default behavior (new line)
    }
    // Handle Cmd/Ctrl+Enter to send
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!messageContent.trim()) return;

    const isPrivate = activeTab === "private";
    await onSend(
      messageContent.trim(),
      isPrivate,
      !isPrivate ? { to: toEmails, cc: ccEmails || undefined, bcc: bccEmails || undefined } : undefined
    );

    // Clear form after successful send
    setMessageContent("");
  };

  const canSend = messageContent.trim().length > 0 && !isSending;

  // Theme colors - transparent/no background
  const borderColor = neutralColor(200);
  const textColor = neutralColor(900);
  const lightGrayText = neutralColor(600);

  return (
    <Box
      sx={{
        borderTop: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
      }}
    >
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: `1px solid ${borderColor}`,
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: lightGrayText,
            backgroundColor: "transparent",
            "&.Mui-selected": {
              color: textColor,
              backgroundColor: "transparent",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: primaryColor(600),
          },
        }}
      >
        <Tab label="Reply" value="reply" />
        <Tab label="Private Note" value="private" />
      </Tabs>

      {/* Recipient Fields (only for Reply tab) */}
      {activeTab === "reply" && (
        <Stack spacing={0.5} sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${borderColor}`, backgroundColor: "transparent" }}>
          {/* TO Field */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
            <Typography
              variant="body2"
              sx={{
                color: lightGrayText,
                fontSize: "0.8125rem",
                fontWeight: 500,
                minWidth: 40,
              }}
            >
              TO
            </Typography>
            <TextField
              size="small"
              value={toEmails}
              onChange={(e) => setToEmails(e.target.value)}
              fullWidth
              variant="standard"
              placeholder="recipient@email.com"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                "& .MuiInput-root": {
                  backgroundColor: "transparent",
                  color: textColor,
                  fontSize: "0.875rem",
                  "&::placeholder": {
                    color: lightGrayText,
                    opacity: 1,
                  },
                },
                "& .MuiInputBase-input": {
                  py: 0.5,
                  px: 0,
                },
              }}
            />
          </Stack>
          
          {/* CC Field */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
            <Typography
              variant="body2"
              sx={{
                color: lightGrayText,
                fontSize: "0.8125rem",
                fontWeight: 500,
                minWidth: 40,
              }}
            >
              CC
            </Typography>
            <TextField
              size="small"
              placeholder="Emails separated by commas"
              value={ccEmails}
              onChange={(e) => setCcEmails(e.target.value)}
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                endAdornment: !showBcc ? (
                  <InputAdornment position="end">
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setShowBcc(true)}
                      sx={{
                        textDecoration: "none",
                        color: primaryColor(400),
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        ml: 1,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Add bcc
                    </Link>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& .MuiInput-root": {
                  backgroundColor: "transparent",
                  color: textColor,
                  fontSize: "0.875rem",
                  "&::placeholder": {
                    color: lightGrayText,
                    opacity: 1,
                  },
                },
                "& .MuiInputBase-input": {
                  py: 0.5,
                  px: 0,
                },
              }}
            />
          </Stack>

          {/* BCC Field */}
          {showBcc && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 32 }}>
              <Typography
                variant="body2"
                sx={{
                  color: lightGrayText,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  minWidth: 40,
                }}
              >
                BCC
              </Typography>
              <TextField
                size="small"
                placeholder="Emails separated by commas"
                value={bccEmails}
                onChange={(e) => setBccEmails(e.target.value)}
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  "& .MuiInput-root": {
                    backgroundColor: "transparent",
                    color: textColor,
                    fontSize: "0.875rem",
                    "&::placeholder": {
                      color: lightGrayText,
                      opacity: 1,
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 0.5,
                    px: 0,
                  },
                }}
              />
            </Stack>
          )}
        </Stack>
      )}

      {/* Formatting Toolbar */}
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          backgroundColor: "transparent",
        }}
      >
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => handleFormatText("bold")}
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <BoldIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() => handleFormatText("italic")}
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <ItalicIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() => handleFormatText("underline")}
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <UnderlineIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Link">
          <IconButton
            size="small"
            onClick={() => handleFormatText("link")}
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <LinkIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: borderColor }} />

        <Tooltip title="Undo">
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <UndoIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <RedoIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <BulletListIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <NumberedListIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Block">
          <IconButton
            size="small"
            onClick={() => handleFormatText("code")}
            sx={{
              p: 0.5,
              color: lightGrayText,
              "&:hover": {
                backgroundColor: neutralColor(100),
                color: primaryColor(600),
              },
            }}
          >
            <CodeIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Text Input Area */}
      <Box sx={{ position: "relative", px: 2, py: 1.5, backgroundColor: "transparent" }}>
        <TextareaAutosize
          ref={textareaRef}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Shift + enter for new line. Start with '/' to select a Canned Response."
          minRows={4}
          disabled={isSending}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            backgroundColor: "transparent",
            color: textColor,
          }}
          className="textarea-placeholder"
        />
        <style>{`
          .textarea-placeholder::placeholder {
            color: ${lightGrayText};
            opacity: 1;
          }
        `}</style>

        {/* Fullscreen Icon */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            color: lightGrayText,
            p: 0.5,
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: primaryColor(600),
            },
          }}
        >
          <FullscreenIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Bottom Toolbar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
        }}
      >
        {/* Left Side Icons */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Emoji">
            <IconButton
              size="small"
              sx={{
                color: lightGrayText,
                p: 0.75,
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: primaryColor(600),
            },
              }}
            >
              <EmojiIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Attach file">
            <IconButton
              size="small"
              sx={{
                color: lightGrayText,
                p: 0.75,
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: primaryColor(600),
            },
              }}
            >
              <AttachIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Voice input">
            <IconButton
              size="small"
              sx={{
                color: lightGrayText,
                p: 0.75,
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: primaryColor(600),
            },
              }}
            >
              <MicIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Schedule">
            <IconButton
              size="small"
              sx={{
                color: lightGrayText,
                p: 0.75,
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: primaryColor(600),
            },
              }}
            >
              <CalendarIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="AI Assist">
            <IconButton
              size="small"
              sx={{
                background: "linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)",
                color: "white",
                p: 0.75,
                "&:hover": {
                  background: "linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)",
                },
              }}
            >
              <AIAssistIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Right Side: Send Button */}
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!canSend}
          startIcon={<SendIcon sx={{ fontSize: 16 }} />}
          sx={{
            backgroundColor: primaryColor(600),
            color: "white",
            textTransform: "none",
            fontSize: "0.8125rem",
            px: 1.5,
            py: 0.5,
            minHeight: 32,
            "&:hover": {
              backgroundColor: primaryColor(700),
            },
            "&:disabled": {
              backgroundColor: neutralColor(200),
              color: neutralColor(500),
            },
          }}
        >
          Send (⌘ + ←)
        </Button>
      </Box>
    </Box>
  );
};

