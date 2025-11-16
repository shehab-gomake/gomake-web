import { useState, useCallback, useEffect } from "react";
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

  const formatText = useCallback((command: string) => {
    document.execCommand(command, false);
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
