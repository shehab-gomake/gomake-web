import { useState, useCallback } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "../enums";

interface EmailData {
  tos: string[];
  subject: string;
  body: string;
}

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

  const openEmailComposer = useCallback(
    async (documentId: string | number, contactEmail?: string, contactPhone?: string) => {
      setIsLoadingEmailData(true);
      
      try {
        await getDocumentMailDataApi(
          callApi,
          (res) => {
            if (res?.success && res?.data) {
              setEmailData(res.data);
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

