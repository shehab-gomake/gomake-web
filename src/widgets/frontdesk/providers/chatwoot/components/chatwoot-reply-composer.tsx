import React, { useState, useRef, KeyboardEvent } from "react";
import { Box } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  ReplyComposerTabs,
  ReplyComposerEmailFields,
  ReplyComposerFormattingToolbar,
  ReplyComposerTextArea,
  ReplyComposerBottomToolbar,
} from "./reply-composer";
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
    if (conversation) {
      setToEmails(defaultRecipient);
    }
  }, [conversation, defaultRecipient]);

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
        <ReplyComposerFormattingToolbar
          onFormat={handleFormatText}
          borderColor={borderColor}
          lightGrayText={lightGrayText}
          neutralColor={neutralColor}
          primaryColor={primaryColor}
        />
      )}

      {/* Text Input Area */}
      <ReplyComposerTextArea
        messageContent={messageContent}
        onContentChange={setMessageContent}
        onKeyDown={handleKeyDown}
        textareaRef={textareaRef}
        maxLength={channelFeatures.maxMessageLength}
        isSending={isSending}
        shouldUseRichEditor={channelFeatures.shouldUseRichEditor}
        textColor={textColor}
        lightGrayText={lightGrayText}
        neutralColor={neutralColor}
        primaryColor={primaryColor}
        isPrivateNote={activeTab === "private"}
      />

      {/* Bottom Toolbar */}
      <ReplyComposerBottomToolbar
        channelFeatures={channelFeatures}
        messageContent={messageContent}
        canSend={canSend}
        isSending={isSending}
        onSend={handleSend}
        borderColor={borderColor}
        lightGrayText={lightGrayText}
        neutralColor={neutralColor}
        primaryColor={primaryColor}
      />
    </Box>
  );
};
