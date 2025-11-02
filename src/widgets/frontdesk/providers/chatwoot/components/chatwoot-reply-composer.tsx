import React, { useState, useRef, KeyboardEvent } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Divider,
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
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { ReplyComposerTabs, ReplyComposerEmailFields } from "./reply-composer";
import { useChannelFeatures } from "../hooks/use-channel-features";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("ChatwootReplyComposer");

interface ChatwootReplyComposerProps {
  conversation: ChatwootConversation | null;
  inbox?: ChatwootInbox | null;
  onSend: (content: string, isPrivate: boolean, recipientEmails?: { to?: string; cc?: string; bcc?: string }) => Promise<void>;
  isSending?: boolean;
  uiSettings?: {
    display_rich_content_editor?: boolean;
    quotedEmailReply?: boolean;
  };
}

type TabValue = "reply" | "private";

export const ChatwootReplyComposer: React.FC<ChatwootReplyComposerProps> = ({
  conversation,
  inbox = null,
  onSend,
  isSending = false,
  uiSettings = {},
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [activeTab, setActiveTab] = useState<TabValue>("reply");
  const [messageContent, setMessageContent] = useState("");
  const [toEmails, setToEmails] = useState("");
  const [ccEmails, setCcEmails] = useState("");
  const [showBcc, setShowBcc] = useState(false);
  const [bccEmails, setBccEmails] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use channel features hook (memoized)
  const channelFeatures = useChannelFeatures(inbox, activeTab === "private", uiSettings);

  // Extract recipient email from conversation
  const defaultRecipient = conversation?.meta?.sender?.email || "";

  React.useEffect(() => {
    if (conversation && !toEmails) {
      setToEmails(defaultRecipient);
    }
  }, [conversation, defaultRecipient, toEmails]);

  const handleTabChange = (newValue: TabValue) => {
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
    if (!messageContent.trim()) {
      logger.debug("Message content is empty, not sending");
      return;
    }

    // Check message length limit
    const maxLength = channelFeatures.maxMessageLength;
    if (messageContent.length > maxLength) {
      logger.warn(`Message exceeds maximum length of ${maxLength} characters`);
      // TODO: Show user-friendly error toast/snackbar
      return;
    }

    const isPrivate = activeTab === "private";

    try {
      await onSend(
        messageContent.trim(),
        isPrivate,
        !isPrivate && channelFeatures.shouldShowEmailHeader
          ? { to: toEmails, cc: ccEmails || undefined, bcc: bccEmails || undefined }
          : undefined
      );

      // Clear form after successful send
      setMessageContent("");
      logger.info(`Message sent successfully (private: ${isPrivate})`);
    } catch (error) {
      logger.error("Failed to send message", error);
      // Error handling is done by parent component
    }
  };

  const canSend = messageContent.trim().length > 0 && !isSending && messageContent.length <= channelFeatures.maxMessageLength;

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
      {/* Segmented Control (Chatwoot Style) */}
      <ReplyComposerTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        borderColor={borderColor}
        textColor={textColor}
        lightGrayText={lightGrayText}
        neutralColor={neutralColor}
      />

      {/* Email Header Fields (only for Email channels and Reply tab) */}
      {activeTab === "reply" && channelFeatures.shouldShowEmailHeader && (
        <ReplyComposerEmailFields
          toEmails={toEmails}
          ccEmails={ccEmails}
          bccEmails={bccEmails}
          showBcc={showBcc}
          onToChange={setToEmails}
          onCcChange={setCcEmails}
          onBccChange={setBccEmails}
          onToggleBcc={() => setShowBcc(!showBcc)}
          borderColor={borderColor}
          textColor={textColor}
          lightGrayText={lightGrayText}
        />
      )}

      {/* Formatting Toolbar (only for rich editor) */}
      {channelFeatures.shouldUseRichEditor && (
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
      )}

      {/* Text Input Area */}
      <Box sx={{ position: "relative", px: 2, py: 1.5, backgroundColor: "transparent" }}>
        <TextareaAutosize
          ref={textareaRef}
          value={messageContent}
          onChange={(e) => {
            const newValue = e.target.value;
            // Enforce max length
            if (newValue.length <= channelFeatures.maxMessageLength) {
              setMessageContent(newValue);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            channelFeatures.shouldUseRichEditor
              ? "Shift + enter for new line. Start with '/' to select a Canned Response."
              : "Type your message..."
          }
          minRows={channelFeatures.shouldUseRichEditor ? 4 : 3}
          maxLength={channelFeatures.maxMessageLength}
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

          {/* File upload - only if supported */}
          {channelFeatures.supportsFileUpload && (
            <Tooltip title={channelFeatures.supportsMultipleFileUpload ? "Attach files" : "Attach file"}>
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
          )}

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

          {/* WhatsApp Templates Button - only for WhatsApp Cloud */}
          {channelFeatures.shouldShowWhatsAppTemplates && (
            <Tooltip title="WhatsApp Templates">
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
          )}

          {/* Content Templates Button - only for Twilio WhatsApp */}
          {channelFeatures.shouldShowContentTemplates && (
            <Tooltip title="Content Templates">
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
          )}

          {/* Editor Toggle - only for API inbox */}
          {channelFeatures.shouldShowEditorToggle && (
            <Tooltip title="Toggle Rich Editor">
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
                <CodeIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Right Side: Send Button and Character Count */}
        <Stack direction="row" spacing={1} alignItems="center">
          {messageContent.length > 0 && (
            <Typography
              variant="caption"
              sx={{
                color:
                  messageContent.length > channelFeatures.maxMessageLength
                    ? "error.main"
                    : messageContent.length > channelFeatures.maxMessageLength * 0.9
                    ? "warning.main"
                    : lightGrayText,
                fontSize: "0.75rem",
              }}
            >
              {messageContent.length} / {channelFeatures.maxMessageLength}
            </Typography>
          )}
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
        </Stack>
      </Box>
    </Box>
  );
};
