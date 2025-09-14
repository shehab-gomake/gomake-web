import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { gmailSendState } from "@/store/gmail";
import { sendGmailMessage } from "@/services/api-service/gmail/gmail-endpoints";
import { useSnackBar } from "@/hooks/use-snack-bar";

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  replyToMessageId?: string;
}

export const useGmailSend = () => {
  const [sendState, setSendState] = useRecoilState(gmailSendState);
  const { alertSuccess, alertFault } = useSnackBar();

  const sendEmail = useCallback(async (params: SendEmailParams) => {
    const { to, subject, text, replyToMessageId } = params;

    if (!to || !text) {
      const error = "Email recipient and message text are required";
      setSendState(prev => ({ ...prev, error }));
      alertFault(error);
      return false;
    }

    setSendState(prev => ({ ...prev, sending: true, error: undefined }));

    try {
      const response = await sendGmailMessage({
        to,
        subject: subject || "No Subject",
        text,
        replyToMessageId
      });

      console.log("Gmail send response:", response);

      if (response.success) {
        setSendState(prev => ({
          ...prev,
          sending: false,
          lastSent: {
            to,
            subject,
            timestamp: Date.now(),
          },
          error: undefined,
        }));

        const message = replyToMessageId ? "Reply sent successfully" : "Email sent successfully";
        alertSuccess(message);
        return true;
      } else {
        const errorMessage = response.error || response.message || "Failed to send email";
        setSendState(prev => ({
          ...prev,
          sending: false,
          error: errorMessage,
        }));
        alertFault(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error("Error sending email:", err);
      const errorMessage = err.message || "Failed to send email";
      setSendState(prev => ({
        ...prev,
        sending: false,
        error: errorMessage,
      }));
      alertFault(errorMessage);
      return false;
    }
  }, [setSendState, alertSuccess, alertFault]);

  const sendReply = useCallback(async (params: {
    to: string;
    subject: string;
    text: string;
    replyToMessageId: string;
  }) => {
    // Ensure subject has "Re:" prefix if not already present
    const replySubject = params.subject.startsWith("Re:")
      ? params.subject
      : `Re: ${params.subject}`;

    return await sendEmail({
      ...params,
      subject: replySubject,
    });
  }, [sendEmail]);

  const sendNewEmail = useCallback(async (params: {
    to: string;
    subject: string;
    text: string;
  }) => {
    return await sendEmail(params);
  }, [sendEmail]);

  const clearSendState = useCallback(() => {
    setSendState({
      sending: false,
      lastSent: undefined,
      error: undefined,
    });
  }, [setSendState]);

  return {
    sendState,
    sendEmail,
    sendReply,
    sendNewEmail,
    clearSendState,
    isSending: sendState.sending,
  };
};