import { useState, useCallback } from "react";
import { EmailDraft } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";

interface UseEmailComposerProps {
  selectedAccountId?: string;
  onRefresh: () => void;
}

export const useEmailComposer = ({ selectedAccountId, onRefresh }: UseEmailComposerProps) => {
  const [showComposer, setShowComposer] = useState(false);
  const [composerDraft, setComposerDraft] = useState<EmailDraft | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleCompose = useCallback(() => {
    setComposerDraft(null);
    setShowComposer(true);
  }, []);

  const handleCloseComposer = useCallback(() => {
    setShowComposer(false);
    setComposerDraft(null);
  }, []);

  const handleSendEmail = useCallback(
    async (draft: EmailDraft) => {
      if (!selectedAccountId) {
        console.error("No account selected");
        return false;
      }

      setIsSending(true);
      try {
        const response = await emailApiClient.sendEmail(selectedAccountId, {
          to: draft.to.map((t) => t.email),
          cc: draft.cc?.map((c) => c.email),
          bcc: draft.bcc?.map((b) => b.email),
          subject: draft.subject,
          text: draft.text,
          html: draft.html,
          replyToMessageId: draft.replyToMessageId,
          threadId: draft.threadId,
        });

        if (response.success) {
          setShowComposer(false);
          setComposerDraft(null);
          onRefresh();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to send email:", error);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [selectedAccountId, onRefresh]
  );

  const openComposerWithDraft = useCallback((draft: EmailDraft) => {
    setComposerDraft(draft);
    setShowComposer(true);
  }, []);

  return {
    showComposer,
    composerDraft,
    isSending,
    handleCompose,
    handleCloseComposer,
    handleSendEmail,
    openComposerWithDraft,
  };
};
