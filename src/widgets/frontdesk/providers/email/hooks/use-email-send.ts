import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { selectedEmailAccountIdState } from "../store/email-store";
import { emailApiClient } from "../utils/email-api-client";
import { EmailSendRequest, EmailDraft } from "../types/email.types";
import { useSnackBar } from "@/hooks/use-snack-bar";

export const useEmailSend = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedAccountId = useRecoilValue(selectedEmailAccountIdState);
  const { alertSuccess, alertFault } = useSnackBar();

  const sendEmail = useCallback(async (draft: EmailDraft) => {
    if (!selectedAccountId) {
      setError("No email account selected");
      return false;
    }

    setIsSending(true);
    setError(null);

    try {
      const request: EmailSendRequest = {
        to: draft.to.map((r) => r.email),
        cc: draft.cc?.map((r) => r.email),
        bcc: draft.bcc?.map((r) => r.email),
        subject: draft.subject,
        html: draft.html,
        text: draft.text,
        replyToMessageId: draft.replyToMessageId,
        threadId: draft.threadId,
      };

      await emailApiClient.sendEmail(selectedAccountId, request);

      alertSuccess("Email sent successfully");

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send email";
      setError(errorMessage);
      alertFault(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [selectedAccountId, alertSuccess, alertFault]);

  const replyToEmail = useCallback(async (
    messageId: string,
    threadId: string,
    draft: EmailDraft
  ) => {
    return sendEmail({
      ...draft,
      replyToMessageId: messageId,
      threadId,
    });
  }, [sendEmail]);

  return {
    sendEmail,
    replyToEmail,
    isSending,
    error,
  };
};