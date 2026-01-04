import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { chatwootService } from "@/services/frontdesk";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ChannelType, type ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { EmailAttachment, EmailSenderOption } from "@/widgets/frontdesk/providers/email/types/email.types";
import { DOCUMENT_TYPE } from "../enums";
import { getFileExtension, getMimeTypeFromExtension } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";

interface EmailData {
  tos: string[];
  ccs?: string[];
  bccs?: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  sender?: string;
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
  customerId?: string | number;
  customerName?: string;
}

interface UseFrontDeskEmailIntegrationProps {
  documentType: DOCUMENT_TYPE;
}

export const useFrontDeskEmailIntegration = ({
  documentType,
}: UseFrontDeskEmailIntegrationProps) => {
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [isLoadingEmailData, setIsLoadingEmailData] = useState(false);
  const [isFromPaymentPage, setIsFromPaymentPage] = useState(false);

  const normalizeRecipients = useCallback((value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    return [];
  }, []);


  const openEmailComposer = useCallback(
    async (
      documentId: string | number, 
      contactEmail?: string, 
      contactPhone?: string, 
      messageType?: number, 
      sendMailIfNotVerifiedAgent?: boolean, 
      sendWithInvoices?: boolean,
      customerId?: string | number,
      customerName?: string,
      contactName?: string,
      managerEmails?: string[],
      isFromPaymentPage?: boolean
    ) => {
      // Open modal immediately to improve UX
      setIsEmailComposerOpen(true);
      setIsLoadingEmailData(true);
      setEmailData(null); // Clear previous data
      setIsFromPaymentPage(isFromPaymentPage ?? false);
      
      try {
        await getDocumentMailDataApi(
          callApi,
          async (res) => {
            if (res?.success && res?.data) {
              const normalizedAttachments = Array.isArray(res.data.attachments)
                ? res.data.attachments.map((attachment: EmailAttachment) => {
                    // Extract extension from URL if filename doesn't have one
                    let filename = attachment.filename || "document";
                    const extension = getFileExtension(attachment.url || "", null);
                    
                    // Add extension to filename if missing
                    if (extension && !filename.includes(".")) {
                      filename = `${filename}.${extension}`;
                    }
                    
                    // Get MIME type from extension if not provided
                    const mimeType = attachment.mimeType || 
                                     attachment.contentType || 
                                     (extension ? getMimeTypeFromExtension(extension) : "application/octet-stream");
                    
                    return {
                      id: attachment.id,
                      filename,
                      mimeType,
                      contentType: mimeType,
                      size: attachment.size,
                      url: attachment.url,
                      content: attachment.content ?? attachment.data,
                    };
                  })
                : [];

              const sender = typeof res.data.sender === "string" ? res.data.sender : undefined;
              const primaryContactEmail =
                contactEmail ||
                res.data.contactEmail ||
                (Array.isArray(res.data.tos) ? res.data.tos[0] : undefined);

              // Get existing tos array from API response
              const existingTos = Array.isArray(res.data.tos) ? res.data.tos : [];
              
              // Merge manager emails into tos array, removing duplicates
              const managerEmailsArray = Array.isArray(managerEmails) 
                ? managerEmails.filter((email) => email && email.trim())
                : [];
              
              const combinedTos = Array.from(new Set([...managerEmailsArray, ...existingTos]));

              // Simplified: Just pass the document data, let the wrapper handle contact/inbox resolution
              const normalizedEmailData: EmailData = {
                tos: combinedTos,
                ccs: normalizeRecipients(res.data.cc || res.data.ccs),
                bccs: normalizeRecipients(res.data.bcc || res.data.bccs),
                subject: res.data.subject || "",
                body: res.data.body || "",
                attachments: normalizedAttachments,
                sender,
                contactEmail: primaryContactEmail || contactEmail,
                contactName: contactName || res.data.contactName,
                contactPhone: contactPhone || res.data.contactPhone,
                customerId: customerId || res.data.customerId || res.data.customer_id,
                customerName: customerName || res.data.customerName || res.data.customer_name,
              };

              setEmailData(normalizedEmailData);
            } else {
              alertFault("Failed to load email data");
              setIsEmailComposerOpen(false); // Close modal on error
            }
            setIsLoadingEmailData(false);
          },
          {
            documentType: isFromPaymentPage ? (18 as DOCUMENT_TYPE) : documentType,
            document: {
              // For board missions, use boardMissionId instead of documentId
              ...(documentType === DOCUMENT_TYPE.boardMission 
                ? { boardMissionId: documentId }
                : { documentId }
              ),
              ...(contactEmail && { contactEmail }),
              ...(contactPhone && { contactPhone }),
              messageType: messageType ?? 0,
              sendMailIfNotVerifiedAgent: sendMailIfNotVerifiedAgent ?? true,
              sendWithInvoices: sendWithInvoices ?? false,
              ...(customerId && { customerId }),
              ...(customerName && { customerName }),
              ...(contactName && { contactName }),
            },
          }
        );
      } catch (error) {
        console.error("Error fetching email data:", error);
        alertFault("Failed to load email data");
        setIsLoadingEmailData(false);
        setIsEmailComposerOpen(false); // Close modal on error
      }
    },
    [callApi, documentType, alertFault, normalizeRecipients]
  );

  const closeEmailComposer = useCallback(() => {
    setIsEmailComposerOpen(false);
    setEmailData(null);
    setIsFromPaymentPage(false);
  }, []);

  return {
    isEmailComposerOpen,
    emailData,
    isLoadingEmailData,
    openEmailComposer,
    closeEmailComposer,
    isFromPaymentPage,
  };
};
