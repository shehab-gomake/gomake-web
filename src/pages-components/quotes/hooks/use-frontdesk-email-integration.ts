import { useState, useCallback } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { EmailAttachment } from "@/widgets/frontdesk/providers/email/types/email.types";
import { DOCUMENT_TYPE } from "../enums";

interface EmailData {
  tos: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

const MOCK_EMAIL_ATTACHMENTS: EmailAttachment[] = [
  {
    id: "mock-quote-pdf",
    filename: "GoMake-Quote-Q2046.pdf",
    contentType: "application/pdf",
    size: 692_590,
    url: "https://cdn.gomake.net/quotes/Q2046/GoMake-Quote-Q2046.pdf",
  },
  {
    id: "mock-spec-sheet",
    filename: "Product-Specifications.pdf",
    contentType: "application/pdf",
    size: 185_320,
    content: "BASE64_ENCODED_PDF_CONTENT",
  },
  {
    id: "mock-logo",
    filename: "GoMake-Logo.png",
    contentType: "image/png",
    size: 82_144,
    content: "BASE64_ENCODED_IMAGE_CONTENT",
  },
];

interface UseFrontDeskEmailIntegrationProps {
  documentType: DOCUMENT_TYPE;
}

export const useFrontDeskEmailIntegration = ({
  documentType,
}: UseFrontDeskEmailIntegrationProps) => {
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [isLoadingEmailData, setIsLoadingEmailData] = useState(false);

  console.log('emailData', emailData);

  const openEmailComposer = useCallback(
    async (documentId: string | number, contactEmail?: string, contactPhone?: string) => {
      setIsLoadingEmailData(true);
      
      try {
        await getDocumentMailDataApi(
          callApi,
          (res) => {
            if (res?.success && res?.data) {
              const normalizedAttachments = Array.isArray(res.data.attachments)
                ? res.data.attachments.map((attachment: EmailAttachment) => ({
                    id: attachment.id,
                    filename: attachment.filename,
                    mimeType: attachment.mimeType,
                    contentType: attachment.contentType,
                    size: attachment.size,
                    url: attachment.url,
                    content: attachment.content ?? attachment.data,
                  }))
                : [];

              const normalizedEmailData: EmailData = {
                tos: res.data.tos || [],
                subject: res.data.subject || "",
                body: res.data.body || "",
                attachments: normalizedAttachments.length > 0 ? normalizedAttachments : MOCK_EMAIL_ATTACHMENTS,
              };

              setEmailData(normalizedEmailData);
              setIsEmailComposerOpen(true);
            } else {
              alertFault("Failed to load email data");
            }
            setIsLoadingEmailData(false);
          },
          {
            documentType,
            document: {
              documentId,
              ...(contactEmail && { contactEmail }),
              ...(contactPhone && { contactPhone }),
            },
          }
        );
      } catch (error) {
        console.error("Error fetching email data:", error);
        alertFault("Failed to load email data");
        setIsLoadingEmailData(false);
      }
    },
    [callApi, documentType, alertFault]
  );

  const closeEmailComposer = useCallback(() => {
    setIsEmailComposerOpen(false);
    setEmailData(null);
  }, []);

  return {
    isEmailComposerOpen,
    emailData,
    isLoadingEmailData,
    openEmailComposer,
    closeEmailComposer,
  };
};

export const MOCK_DOCUMENT_MAIL_DATA_RESPONSE = {
  success: true,
  data: {
    tos: ["lama11121122@gomake.net"],
    subject: "GoMake | Quote -   ",
    body: `<p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">Dear <strong>customer</strong>,</p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;"><br></p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">Thank you very much for contacting us for a quote.</p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">Quote number: <span class="badgeVariable" data-marker="DocumentNumber" data-title="Document number" contenteditable="false">Q2046</span></p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">The proposal file and details are attached below.</p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">Notes: <span class="badgeVariable" data-marker="DocumentNotes" data-title="Document notes" contenteditable="false"></span></p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;"><span class="badgeVariable" data-marker="QuoteLink" data-title="Quote link" contenteditable="false">https://go.dev.gomake.net/quote-confirmation?Id=e8ec8575-c29e-4cbe-976d-7104df167332</span></p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;"><br></p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">Have a lovely day =)</p><p class="ql-direction-rtl ql-align-right" dir="rtl" style="text-align: right;">GoMake</p>`,
    attachments: MOCK_EMAIL_ATTACHMENTS,
  },
};

