/**
 * Email Composer Form Hook
 *
 * Manages form state for the email composer component.
 * Handles draft initialization, validation, and send preparation.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { EmailDraft, EmailMessage, EmailAttachment, EmailSenderOption } from "../types/email.types";
import { parseEmails, formatReplySubject, formatEmailDisplay } from "../utils/email-utils";

interface UseEmailComposerFormProps {
  draft?: EmailDraft;
  replyToMessage?: EmailMessage;
  onSend: (draft: EmailDraft) => Promise<boolean>;
  fromOptions?: EmailSenderOption[];
  initialSenderOption?: EmailSenderOption | null;
  contactId?: number | null;
}

export const useEmailComposerForm = ({
  draft,
  replyToMessage,
  onSend,
  fromOptions,
  initialSenderOption,
  contactId,
}: UseEmailComposerFormProps) => {
  // replyToMessage.from is now an array, take first sender
  const replyToSender = replyToMessage?.from?.[0];

  const [to, setTo] = useState(
    replyToSender
      ? formatEmailDisplay(replyToSender.email, replyToSender.name)
      : draft?.to?.map((r) => r.email).join(", ") || ""
  );
  const [cc, setCc] = useState(draft?.cc?.map((r) => r.email).join(", ") || "");
  const [bcc, setBcc] = useState(draft?.bcc?.map((r) => r.email).join(", ") || "");
  const [subject, setSubject] = useState(replyToMessage ? formatReplySubject(replyToMessage.subject) : draft?.subject || "");
  const [message, setMessage] = useState(draft?.text || draft?.body || draft?.message || "");
  const [attachments, setAttachments] = useState<EmailAttachment[]>(draft?.attachments || []);

  const [senderOption, setSenderOption] = useState<EmailSenderOption | null>(
    draft?.sender ?? initialSenderOption ?? fromOptions?.[0] ?? null
  );

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // Track if we've populated from draft to avoid overwriting user edits
  const hasPopulatedFromDraft = useRef(false);

  // Update form fields when draft changes (e.g., after async loading)
  useEffect(() => {
    // Skip if no draft or already populated
    if (!draft) {
      // Reset flag when draft becomes undefined (for re-opening)
      hasPopulatedFromDraft.current = false;
      return;
    }

    // Skip if already populated from this draft
    if (hasPopulatedFromDraft.current) return;

    // Update all fields from draft
    const newTo = draft.to?.map((r) => r.email).join(", ") || "";
    const newCc = draft.cc?.map((r) => r.email).join(", ") || "";
    const newBcc = draft.bcc?.map((r) => r.email).join(", ") || "";
    const newSubject = draft.subject || "";
    const newMessage = draft.text || draft.body || draft.message || "";
    const newAttachments = draft.attachments || [];

    // Set form fields from draft data
    setTo(newTo);
    setCc(newCc);
    setBcc(newBcc);
    setSubject(newSubject);
    setMessage(newMessage);
    setAttachments(newAttachments);

    // Show CC/BCC fields if they have values
    if (newCc) setShowCc(true);
    if (newBcc) setShowBcc(true);

    // Mark as populated
    hasPopulatedFromDraft.current = true;
    
    console.log("[useEmailComposerForm] Populated form from draft:", {
      to: newTo,
      subject: newSubject,
      messageLength: newMessage.length,
      attachments: newAttachments.length,
    });
  }, [draft]);

  // Update selected sender if options change
  useEffect(() => {
    if (!fromOptions || fromOptions.length === 0) {
      setSenderOption(null);
      return;
    }

    // Keep current selection if still available
    if (senderOption && fromOptions.some((option) => option.sourceId === senderOption.sourceId && option.inboxId === senderOption.inboxId)) {
      return;
    }

    // Prefer draft sender if provided
    if (draft?.sender) {
      const matchedFromDraft = fromOptions.find(
        (option) =>
          option.inboxId === draft.sender?.inboxId &&
          option.sourceId.toLowerCase() === (draft.sender?.sourceId || "").toLowerCase()
      );
      if (matchedFromDraft) {
        setSenderOption(matchedFromDraft);
        return;
      }
    }

    // Prefer initial sender option if provided
    if (initialSenderOption) {
      const matchedInitial = fromOptions.find(
        (option) =>
          option.inboxId === initialSenderOption.inboxId &&
          option.sourceId.toLowerCase() === initialSenderOption.sourceId.toLowerCase()
      );
      if (matchedInitial) {
        setSenderOption(matchedInitial);
        return;
      }
    }

    // Fallback to first option
    setSenderOption(fromOptions[0]);
  }, [fromOptions, draft?.sender, initialSenderOption, senderOption]);

  const handleSend = useCallback(async () => {
    if (!to.trim() || !message.trim()) return false;
    if (fromOptions?.length && !senderOption) return false;

    const emailDraft: EmailDraft = {
      to: parseEmails(to),
      cc: parseEmails(cc),
      bcc: parseEmails(bcc),
      subject: subject.trim() || "(no subject)",
      text: message.trim(),
      html: message.trim(),
      replyToMessageId: replyToMessage?.id || draft?.replyToMessageId,
      threadId: replyToMessage?.threadId || draft?.threadId,
      attachments: attachments.length > 0 ? attachments : undefined,
      sender: senderOption,
      contactId: contactId ?? draft?.contactId ?? null,
    };

    return await onSend(emailDraft);
  }, [to, cc, bcc, subject, message, attachments, replyToMessage, draft, onSend, senderOption, contactId, fromOptions]);

  /**
   * Format text handler
   *
   * Note: This is currently a no-op because the email body uses a controlled
   * InputBase component, not a contentEditable element. Rich text formatting
   * would require migrating to a proper rich text editor (e.g., Tiptap, Slate, Draft.js).
   *
   * The formatting buttons are kept in the UI for visual consistency with
   * standard email clients, but they don't affect the message content.
   *
   * @param _command - Formatting command (bold, italic, underline) - currently unused
   */
  const formatText = useCallback((_command: string) => {
    // Rich text formatting not supported with current InputBase implementation
    // To enable formatting, migrate to a contentEditable div or rich text editor
    console.debug(
      "[useEmailComposerForm] Text formatting not supported. " +
        "Consider using a rich text editor for formatting support."
    );
  }, []);

  const canSend = !!(to.trim() && message.trim() && (!fromOptions?.length || senderOption));

  return {
    // Form state
    to,
    cc,
    bcc,
    subject,
    message,
    attachments,
    showCc,
    showBcc,
    senderOption,

    // Form actions
    setTo,
    setCc,
    setBcc,
    setSubject,
    setMessage,
    setAttachments,
    setShowCc,
    setShowBcc,
    setSenderOption,

    // Form logic
    handleSend,
    formatText,
    canSend,
  };
};
