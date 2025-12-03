import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { colorTokens } from "@/widgets/frontdesk/design-system";
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

// Maximum file upload size in MB (matching Chatwoot's MAXIMUM_FILE_UPLOAD_SIZE)
const MAXIMUM_FILE_UPLOAD_SIZE_MB = 40;

// Convert MB to bytes
const fileSizeInMegaBytes = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

// Check if file size is within limit
const checkFileSizeLimit = (file: File, maximumUploadLimitMB: number): boolean => {
  const fileSizeInMB = fileSizeInMegaBytes(file.size);
  return fileSizeInMB <= maximumUploadLimitMB;
};

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
  const [activeTab, setActiveTab] = useState<TabValue>("reply");
  const [messageContent, setMessageContent] = useState("");
  const [toEmails, setToEmails] = useState("");
  const [ccEmails, setCcEmails] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [bccEmails, setBccEmails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use channel features hook (memoized)
  const channelFeatures = useChannelFeatures(inbox, activeTab === "private", uiSettings);

  // Extract recipient email from conversation
  const defaultRecipient = conversation?.meta?.sender?.email || "";

  // Reset form fields when conversation changes
  React.useEffect(() => {
    if (conversation) {
      setToEmails(defaultRecipient);
      // Clear CC and BCC fields when switching conversations
      setCcEmails("");
      setBccEmails("");
      setShowCc(false);
      setShowBcc(false);
      // Also clear message content and attachments
      setMessageContent("");
      setAttachments([]);
    }
  }, [conversation?.id, defaultRecipient]);

  // Show CC field if it has content
  React.useEffect(() => {
    if (ccEmails && !showCc) {
      setShowCc(true);
    }
  }, [ccEmails, showCc]);

  const handleTabChange = (newValue: TabValue) => {
    setActiveTab(newValue);
  };

  // Handle file selection with size validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      if (checkFileSizeLimit(file, MAXIMUM_FILE_UPLOAD_SIZE_MB)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
        logger.warn(`File ${file.name} exceeds size limit of ${MAXIMUM_FILE_UPLOAD_SIZE_MB}MB`);
      }
    });

    if (invalidFiles.length > 0) {
      // TODO: Show user-friendly error toast/snackbar
      console.warn(
        `The following files exceed the ${MAXIMUM_FILE_UPLOAD_SIZE_MB}MB limit: ${invalidFiles.join(", ")}`
      );
    }

    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
      logger.debug(`Added ${validFiles.length} file(s), total: ${attachments.length + validFiles.length}`);
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle clipboard paste for images (matching Chatwoot's behavior)
  useEffect(() => {
    const handleClipboardPaste = async (e: ClipboardEvent) => {
      // Only handle paste if file upload is supported and not in private note mode
      if (!channelFeatures.supportsFileUpload || activeTab === "private") {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            // Validate file size
            if (checkFileSizeLimit(file, MAXIMUM_FILE_UPLOAD_SIZE_MB)) {
              imageFiles.push(file);
            } else {
              logger.warn(`Pasted image exceeds size limit of ${MAXIMUM_FILE_UPLOAD_SIZE_MB}MB`);
              // TODO: Show user-friendly error toast/snackbar
            }
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault(); // Prevent default paste behavior
        setAttachments([...attachments, ...imageFiles]);
        logger.debug(`Pasted ${imageFiles.length} image(s) from clipboard`);
      }
    };

    document.addEventListener("paste", handleClipboardPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardPaste);
    };
  }, [attachments, channelFeatures.supportsFileUpload, activeTab]);

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
  const borderColor = colorTokens.neutral[200];
  const textColor = colorTokens.neutral[900];
  const lightGrayText = colorTokens.neutral[600];

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
        
      />

      {/* Email Header Fields (only for Email channels and Reply tab) */}
      {activeTab === "reply" && channelFeatures.shouldShowEmailHeader && (
        <ReplyComposerEmailFields
          toEmails={toEmails}
          ccEmails={ccEmails}
          bccEmails={bccEmails}
          showCc={showCc}
          showBcc={showBcc}
          onCcChange={setCcEmails}
          onBccChange={setBccEmails}
          onToggleCc={() => setShowCc(!showCc)}
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
          isPrivateNote={activeTab === "private"}
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
        
        
      />
    </Box>
  );
};
