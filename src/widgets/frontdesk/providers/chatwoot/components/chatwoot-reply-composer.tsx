import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import {
  ReplyComposerTabs,
  ReplyComposerEmailFields,
  ReplyComposerBottomToolbar,
} from "./reply-composer";
import { useChannelFeatures } from "../hooks/use-channel-features";
import { createLogger } from "@/services/frontdesk/utils/logger";
import { AttachmentPreviews } from "./compose/AttachmentPreview";
import { MessageEditor } from "./compose/MessageEditor";

const logger = createLogger("ChatwootReplyComposer");

interface ChatwootReplyComposerProps {
  conversation: ChatwootConversation | null;
  inbox?: ChatwootInbox | null;
  onSend: (
    content: string,
    isPrivate: boolean,
    recipientEmails?: { to?: string; cc?: string; bcc?: string },
    attachments?: File[]
  ) => Promise<void>;
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setAttachments([...attachments, ...selectedFiles]);
      logger.debug(`Added ${selectedFiles.length} file(s), total: ${attachments.length + selectedFiles.length}`);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileRemove = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    logger.debug(`Removed file at index ${index}, remaining: ${attachments.length - 1}`);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    if (!messageContent.trim() && attachments.length === 0) {
      logger.debug("Message content and attachments are empty, not sending");
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
          : undefined,
        attachments.length > 0 ? attachments : undefined
      );

      // Clear form after successful send
      setMessageContent("");
      setAttachments([]);
      logger.info(`Message sent successfully (private: ${isPrivate}, attachments: ${attachments.length})`);
    } catch (error) {
      logger.error("Failed to send message", error);
      // Error handling is done by parent component
    }
  };

  const canSend =
    (messageContent.trim().length > 0 || attachments.length > 0) &&
    !isSending &&
    messageContent.length <= channelFeatures.maxMessageLength;

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

      {/* Message Editor (Rich Text with built-in toolbar) */}
      <Box sx={{ px: 2, pt: 2 }}>
        <MessageEditor
          content={messageContent}
          onChange={setMessageContent}
          placeholder={activeTab === "private" ? "Write a private note..." : "Type your reply..."}
          disabled={isSending}
          minHeight={150}
        />
      </Box>

      {/* Attachment Previews (if any) */}
      {attachments.length > 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <AttachmentPreviews files={attachments} onRemove={handleFileRemove} />
        </Box>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={channelFeatures.supportsMultipleFileUpload}
        hidden
        onChange={handleFileSelect}
        disabled={isSending}
        aria-label="File input for attachments"
      />

      {/* Bottom Toolbar */}
      <ReplyComposerBottomToolbar
        channelFeatures={channelFeatures}
        messageContent={messageContent}
        canSend={canSend}
        isSending={isSending}
        onSend={handleSend}
        onAttachClick={handleAttachClick}
        attachmentCount={attachments.length}
        borderColor={borderColor}
        lightGrayText={lightGrayText}
        neutralColor={neutralColor}
        primaryColor={primaryColor}
      />
    </Box>
  );
};
