import React from "react";
import { EmailComposer } from "@/widgets/frontdesk/providers/email/components/email-composer";
import { EmailDraft } from "@/widgets/frontdesk/providers/email/types/email.types";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { sendDocumentToClientApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../enums";
import { MessageType } from "@/pages-components/quote-new/use-quote";

// Helper function to convert HTML to plain text
const htmlToPlainText = (html: string): string => {
    if (!html) return "";

    // Create a temporary div element
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Get text content (automatically strips HTML tags)
    return temp.textContent || temp.innerText || "";
};

interface FrontDeskEmailComposerWrapperProps {
    open: boolean;
    onClose: () => void;
    emailData: {
        tos: string[];
        subject: string;
        body: string;
    } | null;
    documentId: string | number;
    documentType: DOCUMENT_TYPE;
}

export const FrontDeskEmailComposerWrapper: React.FC<FrontDeskEmailComposerWrapperProps> = ({
    open,
    onClose,
    emailData,
    documentId,
    documentType,
}) => {
    const { callApi } = useGomakeAxios();
    const { alertSuccessSend, alertFaultSend } = useSnackBar();
    const [isSending, setIsSending] = React.useState(false);

    const handleSend = async (draft: EmailDraft): Promise<boolean> => {
        setIsSending(true);

        try {
            const response = await sendDocumentToClientApi(
                callApi,
                (res) => {
                    if (res?.success) {
                        alertSuccessSend();
                        setIsSending(false);
                        return true;
                    } else {
                        alertFaultSend();
                        setIsSending(false);
                        return false;
                    }
                },
                {
                    documentType,
                    document: {
                        documentId,
                        messageType: MessageType.Email,
                        contactEmail: draft.to?.map(email => email.email).join(","),
                        emailSubject: draft.subject,
                        emailBody: draft.text || draft.body || draft.message || "",
                    },
                }
            );

            return response?.success || false;
        } catch (error) {
            console.error("Error sending email:", error);
            alertFaultSend();
            setIsSending(false);
            return false;
        }
    };

    // Convert emailData to EmailDraft format
    const draft: EmailDraft | undefined = emailData
        ? {
            to: (emailData.tos || []).map(email => ({ email })),
            cc: [],
            bcc: [],
            subject: emailData.subject || "",
            message: htmlToPlainText(emailData.body || ""),
            attachments: [],
        }
        : undefined;

    return (
        <EmailComposer
            open={open}
            onClose={onClose}
            onSend={handleSend}
            draft={draft}
            isSending={isSending}
        />
    );
};

