import { useState, useCallback } from "react";
import { EmailDraft, EmailMessage, EmailAttachment } from "../types/email.types";
import { parseEmails, formatReplySubject, formatEmailDisplay } from "../utils/email-utils";

interface UseEmailComposerFormProps {
  draft?: EmailDraft;
  replyToMessage?: EmailMessage;
  onSend: (draft: EmailDraft) => Promise<boolean>;
}

export const useEmailComposerForm = ({ draft, replyToMessage, onSend }: UseEmailComposerFormProps) => {
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

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleSend = useCallback(async () => {
    if (!to.trim() || !message.trim()) return false;

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
    };

    return await onSend(emailDraft);
  }, [to, cc, bcc, subject, message, attachments, replyToMessage, draft, onSend]);

  const formatText = useCallback((command: string) => {
    document.execCommand(command, false);
  }, []);

  const canSend = !!(to.trim() && message.trim());

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

    // Form actions
    setTo,
    setCc,
    setBcc,
    setSubject,
    setMessage,
    setAttachments,
    setShowCc,
    setShowBcc,

    // Form logic
    handleSend,
    formatText,
    canSend,
  };
};
